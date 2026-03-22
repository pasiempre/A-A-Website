import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type EmploymentApplicationBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  isAuthorizedToWork?: boolean;
  hasTransportation?: boolean;
  hasDriversLicense?: boolean;
  yearsExperience?: number;
  experienceDescription?: string;
  specialties?: string[];
  availableDays?: string[];
  preferredStartDate?: string;
  isFullTime?: boolean;
  references?: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  howDidYouHear?: string;
  additionalNotes?: string;
  consentToBackgroundCheck?: boolean;
};

type ValidationError = {
  field: string;
  message: string;
};

type ApplicationTelemetry = {
  applicationId: string | null;
  applicantEmail: string;
  emailSentToAdmin: boolean;
  emailSentToApplicant: boolean;
  durationMs: number;
  errors: string[];
};

const REQUIRED_FIELDS: Array<{
  key: keyof EmploymentApplicationBody;
  label: string;
}> = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email address" },
  { key: "phone", label: "Phone number" },
];

const MAX_REFERENCES = 5;
const MAX_SPECIALTIES = 10;
const MAX_FIELD_LENGTH = 1000;
const MAX_EXPERIENCE_YEARS = 50;

const VALID_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const submissionTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000 * 15;
const RATE_LIMIT_MAX = 3;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function sanitizeString(value: unknown, maxLength = MAX_FIELD_LENGTH): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function validateApplication(body: EmploymentApplicationBody): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const { key, label } of REQUIRED_FIELDS) {
    const value = body[key];
    if (!value || (typeof value === "string" && value.trim().length === 0)) {
      errors.push({ field: key, message: `${label} is required.` });
    }
  }

  if (body.email && !isValidEmail(body.email.trim())) {
    errors.push({ field: "email", message: "Invalid email address format." });
  }

  if (body.phone && !isValidPhone(body.phone)) {
    errors.push({
      field: "phone",
      message: "Phone number must be 10-15 digits.",
    });
  }

  if (
    body.yearsExperience !== undefined &&
    (body.yearsExperience < 0 || body.yearsExperience > MAX_EXPERIENCE_YEARS)
  ) {
    errors.push({
      field: "yearsExperience",
      message: `Years of experience must be between 0 and ${MAX_EXPERIENCE_YEARS}.`,
    });
  }

  if (body.availableDays?.length) {
    const invalid = body.availableDays.filter(
      (day) =>
        !VALID_DAYS.includes(
          day.toLowerCase() as (typeof VALID_DAYS)[number],
        ),
    );
    if (invalid.length > 0) {
      errors.push({
        field: "availableDays",
        message: `Invalid day(s): ${invalid.join(", ")}`,
      });
    }
  }

  if (body.references && body.references.length > MAX_REFERENCES) {
    errors.push({
      field: "references",
      message: `Maximum ${MAX_REFERENCES} references allowed.`,
    });
  }

  if (body.references?.length) {
    for (
      let index = 0;
      index < Math.min(body.references.length, MAX_REFERENCES);
      index += 1
    ) {
      const reference = body.references[index];
      if (!reference.name?.trim()) {
        errors.push({
          field: `references[${index}].name`,
          message: "Reference name is required.",
        });
      }
      if (!reference.phone?.trim() || !isValidPhone(reference.phone)) {
        errors.push({
          field: `references[${index}].phone`,
          message: "Reference phone must be valid.",
        });
      }
    }
  }

  if (body.specialties && body.specialties.length > MAX_SPECIALTIES) {
    errors.push({
      field: "specialties",
      message: `Maximum ${MAX_SPECIALTIES} specialties allowed.`,
    });
  }

  if (body.preferredStartDate) {
    const parsedDate = new Date(body.preferredStartDate);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push({
        field: "preferredStartDate",
        message: "Invalid date format.",
      });
    } else if (parsedDate < new Date()) {
      errors.push({
        field: "preferredStartDate",
        message: "Preferred start date must be in the future.",
      });
    }
  }

  return errors;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildAdminNotificationHtml(application: Record<string, unknown>): string {
  const refs =
    (application.references as Array<{
      name: string;
      phone: string;
      relationship: string;
    }>) ?? [];
  const specialties = (application.specialties as string[]) ?? [];
  const availableDays = (application.available_days as string[]) ?? [];

  const refRows = refs.length
    ? refs
        .map(
          (reference) =>
            `<li>${escapeHtml(reference.name)} — ${escapeHtml(formatPhone(reference.phone))} (${escapeHtml(reference.relationship)})</li>`,
        )
        .join("")
    : "<li>None provided</li>";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="border-bottom:3px solid #2563eb;padding-bottom:12px;margin-bottom:20px;">
    <h2 style="margin:0 0 4px 0;">🧹 New Employment Application</h2>
    <p style="margin:0;color:#666;font-size:0.9em;">Received ${new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })}</p>
  </div>

  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Applicant Info</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;width:160px;">Name</td><td>${escapeHtml(String(application.full_name ?? ""))}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Email</td><td><a href="mailto:${escapeHtml(String(application.email ?? ""))}">${escapeHtml(String(application.email ?? ""))}</a></td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Phone</td><td>${escapeHtml(formatPhone(String(application.phone ?? "")))}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Address</td><td>${escapeHtml(String(application.address ?? ""))}${
      application.city ? `, ${escapeHtml(String(application.city))}` : ""
    }${application.state ? `, ${escapeHtml(String(application.state))}` : ""} ${escapeHtml(String(application.zip ?? ""))}</td></tr>
  </table>

  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Eligibility</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;width:200px;">Authorized to Work</td><td>${application.is_authorized_to_work ? "✅ Yes" : "❌ No"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Has Transportation</td><td>${application.has_transportation ? "✅ Yes" : "❌ No"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Has Driver's License</td><td>${application.has_drivers_license ? "✅ Yes" : "❌ No"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Consent to Background Check</td><td>${application.consent_to_background_check ? "✅ Yes" : "❌ No"}</td></tr>
  </table>

  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Experience</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;width:160px;">Years Experience</td><td>${application.years_experience ?? "Not specified"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Specialties</td><td>${specialties.length ? specialties.map(escapeHtml).join(", ") : "None listed"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Full/Part Time</td><td>${application.is_full_time ? "Full-time" : "Part-time"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Available Days</td><td>${availableDays.length ? availableDays.map((day: string) => escapeHtml(day.charAt(0).toUpperCase() + day.slice(1))).join(", ") : "Not specified"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Preferred Start</td><td>${application.preferred_start_date ? new Date(String(application.preferred_start_date)).toLocaleDateString("en-US", { dateStyle: "medium" }) : "Flexible"}</td></tr>
  </table>

  ${String(application.experience_description ?? "").trim() ? `
  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Experience Details</h3>
  <p style="background:#f9fafb;padding:12px;border-radius:6px;white-space:pre-wrap;">${escapeHtml(String(application.experience_description))}</p>
  ` : ""}

  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">References</h3>
  <ul style="padding-left:18px;">${refRows}</ul>

  ${String(application.how_did_you_hear ?? "").trim() ? `<p><strong>How did they hear about us:</strong> ${escapeHtml(String(application.how_did_you_hear))}</p>` : ""}
  ${String(application.additional_notes ?? "").trim() ? `<p><strong>Additional notes:</strong> ${escapeHtml(String(application.additional_notes))}</p>` : ""}

  <div style="margin-top:20px;padding:12px;background:#eff6ff;border-radius:6px;border:1px solid #bfdbfe;">
    <strong>Action needed:</strong> Review this application in the
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? ""}/admin/hiring" style="color:#2563eb;">Hiring Inbox</a>.
  </div>
</body>
</html>`;
}

function buildApplicantConfirmationHtml(fullName: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="border-bottom:3px solid #2563eb;padding-bottom:12px;margin-bottom:20px;">
    <h2 style="margin:0;">Thanks for applying, ${escapeHtml(fullName)}!</h2>
  </div>
  <p>We've received your employment application at <strong>A&amp;A Cleaning</strong> and will review it shortly.</p>
  <p>Here's what happens next:</p>
  <ol>
    <li>Our hiring team reviews your application (typically within 2-3 business days).</li>
    <li>If you're a good fit, we'll reach out by phone or email to schedule an interview.</li>
    <li>We'll notify you either way so you're not left waiting.</li>
  </ol>
  <p>If you have any questions in the meantime, feel free to reply to this email or call us.</p>
  <p style="margin-top:24px;">— The A&amp;A Cleaning Team</p>
</body>
</html>`;
}

async function sendEmail(params: {
  to: string[];
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return {
      ok: false,
      error: "Email not configured (missing RESEND_API_KEY or RESEND_FROM_EMAIL).",
    };
  }

  const validRecipients = params.to.filter(isValidEmail);
  if (validRecipients.length === 0) {
    return { ok: false, error: "No valid recipient email addresses." };
  }

  const payload = JSON.stringify({
    from: fromEmail,
    to: validRecipients,
    subject: params.subject,
    html: params.html,
  });

  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (response.ok) {
        return { ok: true };
      }

      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const text = await response.text().catch(() => "");
        return {
          ok: false,
          error: `Resend ${response.status}: ${text.slice(0, 200)}`,
        };
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1500);
        });
        continue;
      }

      return {
        ok: false,
        error: `Resend ${response.status} after ${maxAttempts} attempts.`,
      };
    } catch (error) {
      if (attempt < maxAttempts) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1500);
        });
        continue;
      }

      return {
        ok: false,
        error: `Network error: ${error instanceof Error ? error.message : "Unknown"}`,
      };
    }
  }

  return { ok: false, error: "Exhausted retry attempts." };
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submissionTimestamps.get(ip) ?? [];
  const recent = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recent.push(now);
  submissionTimestamps.set(ip, recent);

  if (submissionTimestamps.size > 1000) {
    for (const [key, values] of submissionTimestamps) {
      const filtered = values.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
      );
      if (filtered.length === 0) {
        submissionTimestamps.delete(key);
      } else {
        submissionTimestamps.set(key, filtered);
      }
    }
  }

  return false;
}

async function isDuplicateApplication(
  supabase: ReturnType<typeof createAdminClient>,
  email: string,
): Promise<{ isDuplicate: boolean; existingId?: string }> {
  try {
    const { data } = await supabase
      .from("employment_applications")
      .select("id, created_at")
      .eq("email", email.toLowerCase().trim())
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      return { isDuplicate: true, existingId: data.id };
    }

    return { isDuplicate: false };
  } catch {
    return { isDuplicate: false };
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  const errors: string[] = [];

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "Too many applications submitted. Please try again later.",
      },
      { status: 429 },
    );
  }

  let body: EmploymentApplicationBody;
  try {
    body = (await request.json()) as EmploymentApplicationBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationErrors = validateApplication(body);
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed.", validationErrors },
      { status: 400 },
    );
  }

  const sanitized = {
    full_name: sanitizeString(body.fullName, 200),
    email: body.email?.toLowerCase().trim() ?? "",
    phone: body.phone?.replace(/\D/g, "").slice(0, 15) ?? "",
    address: sanitizeString(body.address, 500),
    city: sanitizeString(body.city, 100),
    state: sanitizeString(body.state, 50),
    zip: sanitizeString(body.zip, 20),
    is_authorized_to_work: body.isAuthorizedToWork === true,
    has_transportation: body.hasTransportation === true,
    has_drivers_license: body.hasDriversLicense === true,
    years_experience: Math.max(
      0,
      Math.min(body.yearsExperience ?? 0, MAX_EXPERIENCE_YEARS),
    ),
    experience_description: sanitizeString(body.experienceDescription, 2000),
    specialties: (body.specialties ?? [])
      .slice(0, MAX_SPECIALTIES)
      .map((specialty) => sanitizeString(specialty, 100))
      .filter(Boolean),
    available_days: (body.availableDays ?? [])
      .map((day) => day.toLowerCase().trim())
      .filter((day) =>
        VALID_DAYS.includes(day as (typeof VALID_DAYS)[number]),
      ),
    preferred_start_date: body.preferredStartDate
      ? new Date(body.preferredStartDate).toISOString()
      : null,
    is_full_time: body.isFullTime === true,
    references: (body.references ?? []).slice(0, MAX_REFERENCES).map((ref) => ({
      name: sanitizeString(ref.name, 200),
      phone: ref.phone?.replace(/\D/g, "").slice(0, 15) ?? "",
      relationship: sanitizeString(ref.relationship, 100),
    })),
    how_did_you_hear: sanitizeString(body.howDidYouHear, 500),
    additional_notes: sanitizeString(body.additionalNotes, 2000),
    consent_to_background_check: body.consentToBackgroundCheck === true,
  };

  const supabase = createAdminClient();
  const dedup = await isDuplicateApplication(supabase, sanitized.email);
  if (dedup.isDuplicate) {
    return NextResponse.json(
      {
        success: true,
        applicationId: dedup.existingId,
        deduplicated: true,
        message:
          "We already received your application. Our team will be in touch soon!",
      },
      { status: 200 },
    );
  }

  const { data: application, error: insertError } = await supabase
    .from("employment_applications")
    .insert({
      ...sanitized,
      status: "new",
      source_ip: ip !== "unknown" ? ip : null,
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !application) {
    console.error("[employment-application] Insert failed:", insertError?.message);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 },
    );
  }

  let adminEmailSent = false;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (adminEmail) {
    const dbRow = { ...sanitized, id: application.id };
    const result = await sendEmail({
      to: [adminEmail],
      subject: `📋 New Application: ${sanitized.full_name}`,
      html: buildAdminNotificationHtml(dbRow),
    });

    adminEmailSent = result.ok;
    if (!result.ok && result.error) {
      errors.push(`Admin email failed: ${result.error}`);
    }
  } else {
    errors.push(
      "ADMIN_NOTIFICATION_EMAIL not configured — admin alert skipped.",
    );
  }

  let applicantEmailSent = false;
  const confirmationResult = await sendEmail({
    to: [sanitized.email],
    subject: "We received your application — A&A Cleaning",
    html: buildApplicantConfirmationHtml(sanitized.full_name),
  });

  applicantEmailSent = confirmationResult.ok;
  if (!confirmationResult.ok && confirmationResult.error) {
    errors.push(`Applicant confirmation email failed: ${confirmationResult.error}`);
  }

  await supabase
    .from("employment_applications")
    .update({
      admin_notified: adminEmailSent,
      confirmation_sent: applicantEmailSent,
      admin_email_error: adminEmailSent
        ? null
        : errors.find((item) => item.startsWith("Admin")) ?? null,
      confirmation_email_error: applicantEmailSent
        ? null
        : errors.find((item) => item.startsWith("Applicant")) ?? null,
    })
    .eq("id", application.id);

  const telemetry: ApplicationTelemetry = {
    applicationId: application.id,
    applicantEmail: sanitized.email,
    emailSentToAdmin: adminEmailSent,
    emailSentToApplicant: applicantEmailSent,
    durationMs: Date.now() - startTime,
    errors,
  };

  if (errors.length > 0) {
    console.warn(
      "[employment-application] Completed with warnings:",
      JSON.stringify(telemetry),
    );
  } else {
    console.info("[employment-application] Success:", JSON.stringify(telemetry));
  }

  return NextResponse.json(
    {
      success: true,
      applicationId: application.id,
      deduplicated: false,
      message:
        "Your application has been submitted successfully! We'll be in touch soon.",
    },
    { status: 201 },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim();
  const limit = Math.min(
    Number.parseInt(searchParams.get("limit") ?? "50", 10) || 50,
    100,
  );
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin role required." }, { status: 403 });
  }

  const adminClient = createAdminClient();

  let query = adminClient
    .from("employment_applications")
    .select(
      "id, full_name, email, phone, status, specialties, available_days, is_full_time, years_experience, submitted_at, admin_notified, confirmation_sent, created_at",
      { count: "exact" },
    )
    .order("submitted_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: applications, error: queryError, count } = await query;
  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  return NextResponse.json({
    applications: applications ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin role required." }, { status: 403 });
  }

  let body: {
    applicationId?: string;
    status?: string;
    adminNotes?: string;
  };

  try {
    body = (await request.json()) as {
      applicationId?: string;
      status?: string;
      adminNotes?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const applicationId = body.applicationId?.trim();
  if (!applicationId) {
    return NextResponse.json(
      { error: "applicationId is required." },
      { status: 400 },
    );
  }

  const VALID_STATUSES = [
    "new",
    "reviewed",
    "interview_scheduled",
    "interviewed",
    "hired",
    "rejected",
    "withdrawn",
  ] as const;

  const newStatus = body.status?.trim();
  if (!newStatus || !VALID_STATUSES.includes(newStatus as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json(
      {
        error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const adminClient = createAdminClient();
  const { data: existing, error: lookupError } = await adminClient
    .from("employment_applications")
    .select("id, status, full_name, email")
    .eq("id", applicationId)
    .single();

  if (lookupError || !existing) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const updatePayload: Record<string, unknown> = {
    status: newStatus,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
  };

  if (body.adminNotes !== undefined) {
    updatePayload.admin_notes = sanitizeString(body.adminNotes, 2000);
  }

  const { error: updateError } = await adminClient
    .from("employment_applications")
    .update(updatePayload)
    .eq("id", applicationId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  console.info(
    `[employment-application] Status updated: ${existing.status} → ${newStatus} for ${existing.full_name} by ${profile.full_name}`,
  );

  return NextResponse.json({
    success: true,
    applicationId,
    previousStatus: existing.status,
    newStatus,
  });
}
