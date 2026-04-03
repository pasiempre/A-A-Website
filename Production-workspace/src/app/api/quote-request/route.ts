import { NextResponse } from "next/server";

import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import { dispatchSmsWithQuietHours, sendSms } from "@/lib/notifications";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
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
    const { data: insertedLead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name,
        company_name: body.companyName?.trim() || null,
        phone,
        email: body.email?.trim() || null,
        service_type: body.serviceType?.trim() || null,
        timeline: body.timeline?.trim() || null,
        description: body.description?.trim() || null,
        source: "website_form",
      })
      .select("id, name, company_name, phone, service_type")
      .single();

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

    // --- Lead acknowledgment SMS (F-02: Lead auto-acknowledgment) ---
    const leadAckText = `Hi ${safeName}! Thanks for reaching out to A&A Cleaning. We received your request and will call you within 1 hour. If you need us sooner: ${COMPANY_PHONE}. — The A&A Team`;
    const leadAckSms = await sendSms(phone, leadAckText);
    if (!leadAckSms.sent) {
      console.warn("Lead acknowledgment SMS failed:", leadAckSms.error);
    }

    // --- Lead acknowledgment email (with timeout) ---
    const recipientEmail = body.email?.trim();
    if (
      recipientEmail &&
      process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL
    ) {
      try {
        const emailResponse = await fetchWithTimeout(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL,
              to: [recipientEmail],
              subject: "A&A Cleaning: We Got Your Quote Request",
              html: `
                <p>Hi ${safeName},</p>
                <p>Thanks for reaching out to A&amp;A Cleaning. We received your request and will call you within 1 hour.</p>
                <p><strong>Service requested:</strong> ${safeServiceType}</p>
                <p>If you need us sooner: ${COMPANY_PHONE}</p>
                <p>&mdash; The A&amp;A Team</p>
              `,
            }),
            timeoutMs: 8_000,
          },
        );

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.warn("Lead acknowledgment email failed:", errorText);
        }
      } catch (emailError) {
        // Timeout or network failure — log but don't fail the lead creation
        console.warn(
          "Lead acknowledgment email error:",
          emailError instanceof Error ? emailError.message : emailError,
        );
      }
    }

    return NextResponse.json(
      { success: true, leadId: insertedLead.id },
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
