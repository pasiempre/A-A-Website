import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

import { dispatchSmsWithQuietHours } from "@/lib/notifications";
import { getPostJobSettings } from "@/lib/post-job-settings";
import { createAdminClient } from "@/lib/supabase/admin";

type InboundPayload = {
  Body?: string;
  From?: string;
  To?: string;
  MessageSid?: string;
};

type SequenceCandidate = {
  id: string;
  job_id: string;
  next_step: string;
  rating_requested_at: string | null;
  rating_received_at: string | null;
};

type JobRow = {
  id: string;
  title: string;
  customer_phone: string | null;
};

type AdminRow = {
  id: string;
  phone: string | null;
  notification_preferences: Record<string, unknown> | null;
};

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

function addHours(isoString: string, hours: number): string {
  return new Date(new Date(isoString).getTime() + hours * 60 * 60 * 1000).toISOString();
}

function parseIsoForSort(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseRating(body: string): number | null {
  const trimmed = body.trim().toLowerCase();

  const mappedWords: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };

  if (mappedWords[trimmed]) {
    return mappedWords[trimmed];
  }

  const digit = trimmed.match(/\b([1-5])\b/);
  if (!digit) {
    return null;
  }

  const parsed = Number(digit[1]);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5 ? parsed : null;
}

function buildExternalUrl(request: Request): string {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestUrl = new URL(request.url);

  if (forwardedProto && forwardedHost) {
    requestUrl.protocol = `${forwardedProto}:`;
    requestUrl.host = forwardedHost;
  }

  return requestUrl.toString();
}

function isValidTwilioSignature(args: {
  authToken: string;
  expectedSignature: string;
  url: string;
  payload: InboundPayload;
}): boolean {
  const fields: Record<string, string> = {
    Body: args.payload.Body ?? "",
    From: args.payload.From ?? "",
    MessageSid: args.payload.MessageSid ?? "",
    To: args.payload.To ?? "",
  };

  const sortedKeys = Object.keys(fields).sort((a, b) => a.localeCompare(b));
  const data = sortedKeys.reduce((acc, key) => `${acc}${key}${fields[key]}`, args.url);

  const digest = createHmac("sha1", args.authToken).update(data, "utf8").digest("base64");

  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(args.expectedSignature, "utf8");
  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let inbound: InboundPayload = {};
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    inbound = {
      Body: String(form.get("Body") ?? ""),
      From: String(form.get("From") ?? ""),
      To: String(form.get("To") ?? ""),
      MessageSid: String(form.get("MessageSid") ?? ""),
    };
  } else {
    inbound = (await request.json().catch(() => ({}))) as InboundPayload;
  }

  const signature = request.headers.get("x-twilio-signature");
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const allowUnsignedWebhook = process.env.TWILIO_ALLOW_UNSIGNED_WEBHOOK === "true";

  if (!allowUnsignedWebhook) {
    if (!twilioAuthToken) {
      return NextResponse.json(
        { ok: false, error: "Webhook verification is enabled but TWILIO_AUTH_TOKEN is missing." },
        { status: 500 },
      );
    }

    if (!signature) {
      return NextResponse.json(
        { ok: false, error: "Missing Twilio signature header." },
        { status: 401 },
      );
    }

    const isValid = isValidTwilioSignature({
      authToken: twilioAuthToken,
      expectedSignature: signature,
      url: buildExternalUrl(request),
      payload: inbound,
    });

    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Invalid Twilio signature." }, { status: 401 });
    }
  } else if (signature && twilioAuthToken) {
    const isValid = isValidTwilioSignature({
      authToken: twilioAuthToken,
      expectedSignature: signature,
      url: buildExternalUrl(request),
      payload: inbound,
    });

    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Invalid Twilio signature." }, { status: 401 });
    }
  }

  const rawBody = inbound.Body ?? "";
  const from = normalizePhone(inbound.From ?? "");

  if (!from) {
    return NextResponse.json({ ok: true, ignored: true, reason: "Missing From phone." });
  }

  const rating = parseRating(rawBody);
  const supabase = createAdminClient();
  const settings = await getPostJobSettings();

  if (inbound.MessageSid) {
    const { data: duplicateRows, error: duplicateError } = await supabase
      .from("post_job_sequence")
      .select("id")
      .contains("context", { messageSid: inbound.MessageSid })
      .limit(1);

    if (duplicateError) {
      return NextResponse.json({ error: duplicateError.message }, { status: 500 });
    }

    if ((duplicateRows?.length ?? 0) > 0) {
      return NextResponse.json({ ok: true, ignored: true, reason: "Duplicate MessageSid." });
    }
  }

  const { data: sequenceRows, error: sequenceError } = await supabase
    .from("post_job_sequence")
    .select("id, job_id, next_step, rating_requested_at, rating_received_at")
    .eq("status", "active")
    .is("rating_received_at", null)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (sequenceError) {
    return NextResponse.json({ error: sequenceError.message }, { status: 500 });
  }

  const candidates = (sequenceRows ?? []) as SequenceCandidate[];
  if (candidates.length === 0) {
    return NextResponse.json({ ok: true, ignored: true, reason: "No active post-job sequence." });
  }

  const jobIds = [...new Set(candidates.map((row) => row.job_id))];
  const { data: jobRows, error: jobError } = await supabase
    .from("jobs")
    .select("id, title, customer_phone")
    .in("id", jobIds);

  if (jobError) {
    return NextResponse.json({ error: jobError.message }, { status: 500 });
  }

  const jobsById = new Map((jobRows ?? []).map((job) => [job.id, job as JobRow]));

  const matching = candidates
    .filter((sequence) => {
      const job = jobsById.get(sequence.job_id);
      if (!job?.customer_phone) {
        return false;
      }

      const customerPhone = normalizePhone(job.customer_phone);
      return customerPhone === from;
    })
    .sort(
      (a, b) =>
        parseIsoForSort(b.rating_requested_at) - parseIsoForSort(a.rating_requested_at),
    )[0];

  if (!matching) {
    return NextResponse.json({ ok: true, ignored: true, reason: "No matching customer phone." });
  }

  const job = jobsById.get(matching.job_id) as JobRow;

  if (rating === null) {
    await dispatchSmsWithQuietHours({
      supabase,
      to: from,
      body: "Thanks for your message. Please reply with a number from 1 to 5 so we can log your rating.",
      queuedReason: "post_job_rating_clarification",
      context: {
        type: "post_job_rating_clarification",
        sequenceId: matching.id,
        jobId: matching.job_id,
      },
    });

    return NextResponse.json({ ok: true, parsed: false, reason: "No valid 1-5 rating found." });
  }

  const nowIso = new Date().toISOString();
  const baseUpdate: Record<string, unknown> = {
    rating_value: rating,
    rating_received_at: nowIso,
    context: {
      source: "post_job_rating_webhook",
      from,
      messageSid: inbound.MessageSid ?? null,
      rawBody,
    },
  };

  if (rating <= settings.lowRatingThreshold) {
    const { data: admins } = await supabase
      .from("profiles")
      .select("id, phone, notification_preferences")
      .eq("role", "admin")
      .order("created_at", { ascending: true })
      .limit(1);

    const admin = ((admins ?? [])[0] ?? null) as AdminRow | null;

    if (admin?.phone) {
      await dispatchSmsWithQuietHours({
        supabase,
        to: admin.phone,
        profileId: admin.id,
        preferences: admin.notification_preferences,
        body: `Low rating alert (${rating}/5): ${job.title}. Reach out to the customer immediately.`,
        queuedReason: "post_job_low_rating_alert",
        context: {
          type: "post_job_low_rating_alert",
          sequenceId: matching.id,
          jobId: matching.job_id,
          rating,
        },
      });
    }

    const { error: updateError } = await supabase
      .from("post_job_sequence")
      .update({
        ...baseUpdate,
        low_rating_alerted_at: nowIso,
        next_step: "payment_reminder",
        payment_reminder_due_at: addHours(nowIso, settings.paymentReminderDelayHours),
      })
      .eq("id", matching.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await dispatchSmsWithQuietHours({
      supabase,
      to: from,
      body: "Thank you for the feedback. We are sorry your experience was not great. A manager will contact you shortly.",
      queuedReason: "post_job_low_rating_ack",
      context: {
        type: "post_job_low_rating_ack",
        sequenceId: matching.id,
        jobId: matching.job_id,
        rating,
      },
    });

    return NextResponse.json({ ok: true, parsed: true, rating, routed: "low_rating_alert" });
  }

  const reviewUrl = settings.reviewUrl;

  await dispatchSmsWithQuietHours({
    supabase,
    to: from,
    body: `Thank you for the ${rating}/5 rating on ${job.title}. If you have 30 seconds, we'd really value your review: ${reviewUrl}`,
    queuedReason: "post_job_review_invite",
    context: {
      type: "post_job_review_invite",
      sequenceId: matching.id,
      jobId: matching.job_id,
      rating,
    },
  });

  const { error: updateError } = await supabase
    .from("post_job_sequence")
    .update({
      ...baseUpdate,
      review_invite_sent_at: nowIso,
      review_reminder_due_at: addHours(nowIso, settings.reviewReminderDelayHours),
      next_step: "review_reminder",
    })
    .eq("id", matching.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, parsed: true, rating, routed: "review_invite" });
}
