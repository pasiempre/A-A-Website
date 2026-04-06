import { NextResponse } from "next/server";

import { optionalServerEnv } from "@/lib/env";
import { dispatchSmsWithQuietHours, sendSmsWithRetry } from "@/lib/notifications";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmailResilient } from "@/lib/resilient-email";
import { createAdminClient } from "@/lib/supabase/admin";
import { COMPANY_PHONE } from "@/lib/company";

// ============================================================
// Types
// ============================================================

type QuoteRequestBody = {
  name?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  description?: string;
  timeline?: string;
  website?: string;
  leadId?: string;
  enrichmentToken?: string;
  flowStep?: "step1" | "step2";
};

// ============================================================
// Dedup guard (prevents double-click / rapid resubmission)
//
// In-memory, ephemeral. Same limitations as rate-limit store:
// resets on cold start, not shared across instances.
// Sufficient for double-click prevention at MVP scale.
// ============================================================

const recentSubmissions = new Map<string, number>();
const DEDUP_WINDOW_MS = 60_000;
const DEDUP_MAX_ENTRIES = 1_000;

// Step 2 enrichment token store (short-lived, in-memory).
// Prevents blind leadId updates from unauthenticated clients.
const enrichmentTokens = new Map<string, { token: string; expiresAt: number }>();
const ENRICHMENT_TOKEN_TTL_MS = 15 * 60_000;
const UUID_V4_LIKE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function extractMissingColumnFromSchemaCacheError(message?: string): string | null {
  if (!message) {
    return null;
  }

  const match = message.match(/could not find the '([^']+)' column of/i);
  return match?.[1] ?? null;
}

function issueEnrichmentToken(leadId: string): string {
  const token = crypto.randomUUID();
  enrichmentTokens.set(leadId, {
    token,
    expiresAt: Date.now() + ENRICHMENT_TOKEN_TTL_MS,
  });
  return token;
}

function validateEnrichmentToken(leadId: string, token: string): boolean {
  const record = enrichmentTokens.get(leadId);
  if (!record) {
    return false;
  }

  if (record.expiresAt < Date.now()) {
    enrichmentTokens.delete(leadId);
    return false;
  }

  if (record.token !== token) {
    return false;
  }

  return true;
}

function consumeEnrichmentToken(leadId: string): void {
  enrichmentTokens.delete(leadId);
}

function buildDedupKey(name: string, phone: string): string {
  return `${name.toLowerCase().trim()}::${phone.replace(/\D/g, "")}`;
}

function isDuplicateSubmission(key: string): boolean {
  const now = Date.now();
  const lastSubmission = recentSubmissions.get(key);

  if (lastSubmission && now - lastSubmission < DEDUP_WINDOW_MS) {
    return true;
  }

  recentSubmissions.set(key, now);

  // Prevent unbounded memory growth
  if (recentSubmissions.size > DEDUP_MAX_ENTRIES) {
    for (const [k, timestamp] of recentSubmissions) {
      if (now - timestamp > DEDUP_WINDOW_MS) {
        recentSubmissions.delete(k);
      }
    }
  }

  return false;
}

// ============================================================
// Route handler
// ============================================================

export async function POST(request: Request) {
  // --- Rate limiting (using centralized policy) ---
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  const rateLimitResult = await rateLimit(`quote-request:${ip}`, "strict");
  if (!rateLimitResult.allowed) {
    return rateLimitResponse(rateLimitResult);
  }

  // --- Parse body ---
  let body: QuoteRequestBody;
  try {
    body = (await request.json()) as QuoteRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // --- Honeypot ---
  if (body.website) {
    return NextResponse.json({ success: true, leadId: "ok" }, { status: 201 });
  }

  const flowStep = body.flowStep ?? "step1";

  // --- Step 2 enrichment path (update existing lead) ---
  if (flowStep === "step2") {
    const leadId = body.leadId?.trim() ?? "";
    const enrichmentToken = body.enrichmentToken?.trim() ?? "";
    if (!leadId) {
      return NextResponse.json(
        { error: "leadId is required for step2." },
        { status: 400 },
      );
    }

    if (!enrichmentToken || !validateEnrichmentToken(leadId, enrichmentToken)) {
      return NextResponse.json(
        { error: "Invalid or expired enrichment token." },
        { status: 403 },
      );
    }

    if (!UUID_V4_LIKE.test(leadId) || !UUID_V4_LIKE.test(enrichmentToken)) {
      return NextResponse.json(
        { error: "Invalid enrichment payload format." },
        { status: 400 },
      );
    }

    const updatePayload: Record<string, string> = {};

    if (body.companyName?.trim()) {
      updatePayload.company_name = body.companyName.trim();
    }
    if (body.email?.trim()) {
      updatePayload.email = body.email.trim();
    }
    if (body.timeline?.trim()) {
      updatePayload.timeline = body.timeline.trim();
    }
    if (body.description?.trim()) {
      updatePayload.description = body.description.trim();
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: "At least one enrichment field is required for step2." },
        { status: 400 },
      );
    }

    try {
      const supabase = createAdminClient();
      const performUpdate = async (payload: Record<string, string>) =>
        supabase
          .from("leads")
          .update(payload)
          .eq("id", leadId)
          .select("id")
          .single();

      let { data: updatedLead, error: updateError } = await performUpdate(updatePayload);

      for (let attempt = 0; updateError && attempt < 5; attempt += 1) {
        const missingColumn = extractMissingColumnFromSchemaCacheError(updateError.message);
        if (!missingColumn || !(missingColumn in updatePayload)) {
          break;
        }

        delete updatePayload[missingColumn];

        if (Object.keys(updatePayload).length === 0) {
          return NextResponse.json(
            { error: "No compatible enrichment fields are available in this environment." },
            { status: 400 },
          );
        }

        const fallbackUpdate = await performUpdate(updatePayload);
        updatedLead = fallbackUpdate.data;
        updateError = fallbackUpdate.error;
      }

      if (updateError || !updatedLead) {
        return NextResponse.json(
          { error: updateError?.message ?? "Unable to update lead." },
          { status: 500 },
        );
      }

      consumeEnrichmentToken(leadId);

      return NextResponse.json(
        { success: true, leadId: updatedLead.id, updated: true },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unexpected server error.",
        },
        { status: 500 },
      );
    }
  }

  // --- Validate required fields ---
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 },
    );
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return NextResponse.json(
      { error: "Please provide a valid 10-digit phone number." },
      { status: 400 },
    );
  }

  // --- Dedup guard ---
  const dedupKey = buildDedupKey(name, phone);
  if (isDuplicateSubmission(dedupKey)) {
    // Return success without creating a duplicate lead.
    // The client cannot distinguish this from a real success,
    // which is the desired UX for double-click prevention.
    return NextResponse.json(
      { success: true, leadId: "deduped" },
      { status: 201 },
    );
  }

  // --- Sanitize for SMS/email output ---
  const sanitize = (value: string) => value.replace(/[<>&"']/g, "");
  const safeName = sanitize(name);
  const safeCompany = sanitize(body.companyName?.trim() || "Unknown company");
  const safeServiceType = sanitize(
    body.serviceType?.trim() || "General inquiry",
  );

  try {
    const supabase = createAdminClient();

    // --- Insert lead ---
    const insertPayload: Record<string, string | null> = {
      name,
      company_name: body.companyName?.trim() || null,
      phone,
      email: body.email?.trim() || null,
      service_type: body.serviceType?.trim() || null,
      timeline: body.timeline?.trim() || null,
      description: body.description?.trim() || null,
      source: "website_form",
    };

    const attemptInsert = async (payload: Record<string, string | null>) =>
      supabase
        .from("leads")
        .insert(payload)
        .select("id, name, phone, service_type")
        .single();

    let { data: insertedLead, error: insertError } = await attemptInsert(insertPayload);

    for (let attempt = 0; insertError && attempt < 7; attempt += 1) {
      const missingColumn = extractMissingColumnFromSchemaCacheError(insertError.message);
      if (!missingColumn || !(missingColumn in insertPayload)) {
        break;
      }

      delete insertPayload[missingColumn];
      const fallbackInsert = await attemptInsert(insertPayload);
      insertedLead = fallbackInsert.data;
      insertError = fallbackInsert.error;
    }

    if (insertError || !insertedLead) {
      return NextResponse.json(
        { error: insertError?.message ?? "Unable to create lead." },
        { status: 500 },
      );
    }

    // --- Admin SMS alert ---
    const { data: adminProfiles } = await supabase
      .from("profiles")
      .select("id, phone, notification_preferences")
      .eq("role", "admin")
      .order("created_at", { ascending: true })
      .limit(1);

    const adminProfile = adminProfiles?.[0] ?? null;
    const adminAlertPhone =
      process.env.ADMIN_ALERT_PHONE || adminProfile?.phone;

    if (adminAlertPhone) {
      const safeTimeline = sanitize(body.timeline?.trim() || "Not specified");
      const message = `🔔 New lead: ${safeName} from ${safeCompany} needs ${safeServiceType}. Timeline: ${safeTimeline}. Reply CALL to see details.`;

      const smsResult = await dispatchSmsWithQuietHours({
        supabase,
        to: adminAlertPhone,
        body: message,
        profileId: adminProfile?.id,
        preferences:
          (adminProfile?.notification_preferences as Record<
            string,
            unknown
          > | null) ?? null,
        queuedReason: "lead_alert_quiet_hours",
        context: {
          type: "lead_alert",
          leadId: insertedLead.id,
        },
      });

      if (!smsResult.sent && !smsResult.queued) {
        console.warn("Lead created, but SMS alert failed:", smsResult.error);
      }
    }

    // --- Lead acknowledgment SMS + email with resilience/dead-letter telemetry ---
    const deliveryFailures: string[] = [];
    const leadAckText = `Hi ${safeName}! Thanks for reaching out to A&A Cleaning. We received your request and will call you within 1 hour. If you need us sooner: ${COMPANY_PHONE}. — The A&A Team`;
    const leadAckSms = await sendSmsWithRetry(phone, leadAckText, {
      maxAttempts: 3,
      baseDelayMs: 800,
      backoffMultiplier: 2,
    });
    if (!leadAckSms.sent) {
      const smsFailure = `sms_ack_failed (${leadAckSms.error ?? "unknown"})`;
      deliveryFailures.push(smsFailure);
      console.warn("Lead acknowledgment SMS failed:", smsFailure);
    }

    // --- Lead acknowledgment email ---
    const recipientEmail = body.email?.trim();
    if (recipientEmail) {
      const emailResult = await sendEmailResilient(
        {
          to: recipientEmail,
          subject: "A&A Cleaning: We Got Your Quote Request",
          html: `
            <p>Hi ${safeName},</p>
            <p>Thanks for reaching out to A&amp;A Cleaning. We received your request and will call you within 1 hour.</p>
            <p><strong>Service requested:</strong> ${safeServiceType}</p>
            <p>If you need us sooner: ${COMPANY_PHONE}</p>
            <p>&mdash; The A&amp;A Team</p>
          `,
          tag: "lead_ack_email",
        },
        { maxAttempts: 2, timeoutMs: 8_000, baseDelayMs: 1_000 },
      );

      if (!emailResult.success) {
        const emailFailure = `email_ack_failed (${emailResult.error ?? "unknown"})`;
        deliveryFailures.push(emailFailure);
        console.warn("Lead acknowledgment email failed:", emailFailure);
      }
    }

    if (deliveryFailures.length > 0) {
      const adminAlertEmail = optionalServerEnv("ADMIN_ALERT_EMAIL");
      if (adminAlertEmail) {
        await sendEmailResilient(
          {
            to: adminAlertEmail,
            subject: "Lead delivery dead-letter alert",
            html: `
              <p>A lead was created but one or more acknowledgments failed.</p>
              <p><strong>Lead ID:</strong> ${insertedLead.id}</p>
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Failures:</strong> ${deliveryFailures.join(", ")}</p>
            `,
            tag: "lead_ack_dead_letter",
          },
          { maxAttempts: 2, timeoutMs: 8_000, baseDelayMs: 1_000 },
        );
      } else {
        console.error("Lead acknowledgment dead-letter (ADMIN_ALERT_EMAIL missing)", {
          leadId: insertedLead.id,
          failures: deliveryFailures,
        });
      }
    }

    const enrichmentToken = issueEnrichmentToken(insertedLead.id);

    return NextResponse.json(
      { success: true, leadId: insertedLead.id, enrichmentToken },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}
