import { NextResponse } from "next/server";

import { authorizeCronRequest } from "@/lib/cron-auth";
import { dispatchSmsWithQuietHours } from "@/lib/notifications";
import { getPostJobSettings } from "@/lib/post-job-settings";
import { createAdminClient } from "@/lib/supabase/admin";

type SchedulerBody = {
  dryRun?: boolean;
  forceRun?: boolean;
  limit?: number;
};

type SequenceRow = {
  id: string;
  job_id: string;
  next_step: string;
  status: string;
  rating_request_due_at: string | null;
  review_reminder_due_at: string | null;
  payment_reminder_due_at: string | null;
  rating_requested_at: string | null;
  rating_value: number | null;
  review_invite_sent_at: string | null;
  review_reminder_sent_at: string | null;
  payment_reminder_sent_at: string | null;
};

type JobRow = {
  id: string;
  title: string;
  customer_phone: string | null;
  payment_status: string | null;
};

type AdminRow = {
  id: string;
  phone: string | null;
  notification_preferences: Record<string, unknown> | null;
};

function addHours(isoString: string, hours: number): string {
  return new Date(new Date(isoString).getTime() + hours * 60 * 60 * 1000).toISOString();
}

export async function POST(request: Request) {
  const auth = authorizeCronRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error ?? "Unauthorized." }, { status: 401 });
  }

  let body: SchedulerBody = {};
  try {
    const text = await request.text();
    if (text.trim()) {
      body = JSON.parse(text) as SchedulerBody;
    }
  } catch {
    // Empty or invalid JSON body defaults to safe behavior.
  }

  const dryRun = body.dryRun === true;
  const forceRun = body.forceRun === true;
  const limit = Math.max(1, Math.min(200, body.limit ?? 50));

  const nowIso = new Date().toISOString();
  const supabase = createAdminClient();
  const settings = await getPostJobSettings();

  const { data: sequenceRows, error: sequenceError } = await supabase
    .from("post_job_sequence")
    .select(
      "id, job_id, next_step, status, rating_request_due_at, review_reminder_due_at, payment_reminder_due_at, rating_requested_at, rating_value, review_invite_sent_at, review_reminder_sent_at, payment_reminder_sent_at",
    )
    .eq("status", "active")
    .order("updated_at", { ascending: true })
    .limit(limit * 3);

  if (sequenceError) {
    return NextResponse.json({ error: sequenceError.message }, { status: 500 });
  }

  const due = ((sequenceRows ?? []) as SequenceRow[]).filter((sequence) => {
    if (sequence.next_step === "rating_request") {
      return !!sequence.rating_request_due_at && sequence.rating_request_due_at <= nowIso;
    }
    if (sequence.next_step === "review_reminder") {
      return !!sequence.review_reminder_due_at && sequence.review_reminder_due_at <= nowIso;
    }
    if (sequence.next_step === "payment_reminder") {
      return !!sequence.payment_reminder_due_at && sequence.payment_reminder_due_at <= nowIso;
    }

    return forceRun;
  }).slice(0, limit);

  const jobIds = [...new Set(due.map((item) => item.job_id))];
  let jobsById = new Map<string, JobRow>();
  if (jobIds.length > 0) {
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("id, title, customer_phone, payment_status")
      .in("id", jobIds);

    if (jobsError) {
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

    jobsById = new Map(((jobs ?? []) as JobRow[]).map((job) => [job.id, job]));
  }

  const { data: adminRows } = await supabase
    .from("profiles")
    .select("id, phone, notification_preferences")
    .eq("role", "admin")
    .order("created_at", { ascending: true })
    .limit(1);

  const admin = ((adminRows ?? [])[0] ?? null) as AdminRow | null;

  let processed = 0;
  let sent = 0;
  let queued = 0;
  const failures: Array<{ sequenceId: string; error: string }> = [];

  for (const sequence of due) {
    processed += 1;

    const job = jobsById.get(sequence.job_id);
    if (!job) {
      failures.push({ sequenceId: sequence.id, error: "Missing job record." });
      continue;
    }

    if (dryRun) {
      continue;
    }

    if (sequence.next_step === "rating_request") {
      if (!job.customer_phone) {
        failures.push({ sequenceId: sequence.id, error: "Missing customer phone." });
        continue;
      }

      const ratingResult = await dispatchSmsWithQuietHours({
        supabase,
        to: job.customer_phone,
        body: `Hi! Thanks for choosing A&A Cleaning for ${job.title}. Please reply with a rating from 1-5 (5 = excellent).`,
        queuedReason: "post_job_rating_request",
        context: {
          type: "post_job_rating_request",
          sequenceId: sequence.id,
          jobId: sequence.job_id,
        },
      });

      if (ratingResult.sent || ratingResult.queued) {
        sent += ratingResult.sent ? 1 : 0;
        queued += ratingResult.queued ? 1 : 0;

        const updatePayload: Record<string, unknown> = {
          rating_requested_at: nowIso,
          next_step: "awaiting_rating",
          context: {
            dryRun: false,
            source: "post_job_scheduler",
          },
        };

        const { error: updateError } = await supabase
          .from("post_job_sequence")
          .update(updatePayload)
          .eq("id", sequence.id);

        if (updateError) {
          failures.push({ sequenceId: sequence.id, error: updateError.message });
        }
      } else {
        failures.push({ sequenceId: sequence.id, error: ratingResult.error ?? "Rating SMS failed." });
      }

      continue;
    }

    if (sequence.next_step === "review_reminder") {
      if (!job.customer_phone) {
        failures.push({ sequenceId: sequence.id, error: "Missing customer phone." });
        continue;
      }

      if ((sequence.rating_value ?? 0) < 4) {
        const { error: skipUpdateError } = await supabase
          .from("post_job_sequence")
          .update({
            next_step: "payment_reminder",
            payment_reminder_due_at: addHours(nowIso, settings.paymentReminderDelayHours),
          })
          .eq("id", sequence.id);

        if (skipUpdateError) {
          failures.push({ sequenceId: sequence.id, error: skipUpdateError.message });
        }

        continue;
      }

      const reviewReminder = await dispatchSmsWithQuietHours({
        supabase,
        to: job.customer_phone,
        body: `Friendly reminder: if you were happy with ${job.title}, we'd appreciate a quick review: ${settings.reviewUrl}`,
        queuedReason: "post_job_review_reminder",
        context: {
          type: "post_job_review_reminder",
          sequenceId: sequence.id,
          jobId: sequence.job_id,
        },
      });

      if (reviewReminder.sent || reviewReminder.queued) {
        sent += reviewReminder.sent ? 1 : 0;
        queued += reviewReminder.queued ? 1 : 0;

        const { error: updateError } = await supabase
          .from("post_job_sequence")
          .update({
            review_reminder_sent_at: nowIso,
            next_step: "payment_reminder",
            payment_reminder_due_at: addHours(nowIso, settings.paymentReminderDelayHours),
          })
          .eq("id", sequence.id);

        if (updateError) {
          failures.push({ sequenceId: sequence.id, error: updateError.message });
        }
      } else {
        failures.push({
          sequenceId: sequence.id,
          error: reviewReminder.error ?? "Review reminder failed.",
        });
      }

      continue;
    }

    if (sequence.next_step === "payment_reminder") {
      if (job.payment_status === "paid") {
        const { error: doneUpdateError } = await supabase
          .from("post_job_sequence")
          .update({ status: "completed", next_step: "done" })
          .eq("id", sequence.id);

        if (doneUpdateError) {
          failures.push({ sequenceId: sequence.id, error: doneUpdateError.message });
        }

        continue;
      }

      if (!admin?.phone) {
        failures.push({ sequenceId: sequence.id, error: "Missing admin phone for payment reminder." });
        continue;
      }

      const paymentReminder = await dispatchSmsWithQuietHours({
        supabase,
        to: admin.phone,
        profileId: admin.id,
        preferences: admin.notification_preferences,
        body: `Payment reminder: ${job.title} is still marked unpaid. Please update payment status once received.`,
        queuedReason: "post_job_payment_reminder",
        context: {
          type: "post_job_payment_reminder",
          sequenceId: sequence.id,
          jobId: sequence.job_id,
        },
      });

      if (paymentReminder.sent || paymentReminder.queued) {
        sent += paymentReminder.sent ? 1 : 0;
        queued += paymentReminder.queued ? 1 : 0;

        const { error: updateError } = await supabase
          .from("post_job_sequence")
          .update({
            payment_reminder_sent_at: nowIso,
            next_step: "awaiting_payment_record",
          })
          .eq("id", sequence.id);

        if (updateError) {
          failures.push({ sequenceId: sequence.id, error: updateError.message });
        }
      } else {
        failures.push({
          sequenceId: sequence.id,
          error: paymentReminder.error ?? "Payment reminder failed.",
        });
      }

      continue;
    }

    if (forceRun && admin?.phone) {
      await dispatchSmsWithQuietHours({
        supabase,
        to: admin.phone,
        profileId: admin.id,
        preferences: admin.notification_preferences,
        body: `Post-job scheduler found unhandled next_step '${sequence.next_step}' for job ${job.title}.`,
        queuedReason: "post_job_unknown_step",
        context: {
          type: "post_job_unknown_step",
          sequenceId: sequence.id,
          jobId: sequence.job_id,
          nextStep: sequence.next_step,
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    forceRun,
    limit,
    dueCount: due.length,
    processed,
    sent,
    queued,
    failures,
  });
}
