import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ReportableQaStatus = "approved" | "completed";

type CompletionReportBody = {
  jobId?: string;
  recipientEmail?: string;
  autoTriggered?: boolean;
  ccEmails?: string[];
};

type ReportTelemetry = {
  jobId: string;
  reportId: string | null;
  emailed: boolean;
  emailRecipients: string[];
  autoTriggered: boolean;
  qaStatus: string | null;
  checklistTotal: number;
  checklistCompleted: number;
  issueCount: number;
  photoCount: number;
  generatedAt: string;
  durationMs: number;
  errors: string[];
};

type ChecklistItem = {
  item_text: string;
  is_completed: boolean;
  completed_at: string | null;
};

type IssueRow = {
  description: string;
  status: string;
  created_at: string;
};

type PhotoRow = {
  storage_path: string;
  photo_type: string | null;
  created_at: string;
};

const REPORTABLE_QA_STATUSES: readonly ReportableQaStatus[] = ["approved", "completed"];
const MAX_REPORT_PHOTOS = 24;
const MAX_REPORT_ISSUES = 50;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function sendReportEmail(params: {
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
        const responseBody = await response.text().catch(() => "");
        return {
          ok: false,
          error: `Resend ${response.status}: ${responseBody.slice(0, 200)}`,
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

function buildReportHtml(params: {
  job: Record<string, unknown>;
  assignmentNames: string;
  reviewerName: string;
  checklist: ChecklistItem[];
  issues: IssueRow[];
  photos: PhotoRow[];
  generatedAt: string;
}): string {
  const { job, assignmentNames, reviewerName, checklist, issues, photos, generatedAt } = params;

  const checklistRows = checklist.length
    ? checklist
        .map(
          (item) =>
            `<li style="margin-bottom:4px;">${item.is_completed ? "✅" : "⬜"} ${escapeHtml(item.item_text)}${
              item.completed_at
                ? ` <small style="color:#666;">(${formatDate(item.completed_at)})</small>`
                : ""
            }</li>`,
        )
        .join("")
    : `<li style="color:#999;">No checklist items.</li>`;

  const issueRows = issues.length
    ? issues
        .map(
          (issue) =>
            `<li style="margin-bottom:4px;"><strong>${escapeHtml(issue.status.toUpperCase())}</strong> — ${escapeHtml(
              issue.description,
            )} <small style="color:#666;">(${formatDate(issue.created_at)})</small></li>`,
        )
        .join("")
    : `<li style="color:#999;">No issues reported.</li>`;

  const photoRows = photos.length
    ? photos
        .map(
          (photo) =>
            `<li style="margin-bottom:2px;">${escapeHtml(photo.photo_type ?? "completion")}: ${escapeHtml(
              photo.storage_path,
            )}</li>`,
        )
        .join("")
    : `<li style="color:#999;">No photos uploaded.</li>`;

  const completedCount = checklist.filter((item) => item.is_completed).length;
  const completionPct = checklist.length ? Math.round((completedCount / checklist.length) * 100) : 0;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:680px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="border-bottom:3px solid #2563eb;padding-bottom:12px;margin-bottom:20px;">
    <h2 style="margin:0 0 4px 0;">A&amp;A Cleaning — Completion Report</h2>
    <p style="margin:0;color:#666;font-size:0.9em;">Generated ${formatDate(generatedAt)}</p>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <tr><td style="padding:6px 12px 6px 0;font-weight:600;width:120px;">Job</td><td style="padding:6px 0;">${escapeHtml(String(job.title ?? ""))}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Address</td><td style="padding:6px 0;">${escapeHtml(String(job.address ?? ""))}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Status</td><td style="padding:6px 0;">${escapeHtml(String(job.status ?? ""))} / QA: ${escapeHtml(String(job.qa_status ?? ""))}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Crew</td><td style="padding:6px 0;">${escapeHtml(assignmentNames || "Unassigned")}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Reviewed By</td><td style="padding:6px 0;">${escapeHtml(reviewerName)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Scope</td><td style="padding:6px 0;">${escapeHtml(String(job.scope ?? "No scope notes"))}</td></tr>
  </table>

  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Checklist <span style="font-weight:400;font-size:0.85em;color:#666;">(${completedCount}/${checklist.length} — ${completionPct}%)</span></h3>
  <ul style="list-style:none;padding-left:0;">${checklistRows}</ul>

  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Issue Reports <span style="font-weight:400;font-size:0.85em;color:#666;">(${issues.length})</span></h3>
  <ul style="padding-left:18px;">${issueRows}</ul>

  <h3 style="border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Photo Records <span style="font-weight:400;font-size:0.85em;color:#666;">(${photos.length})</span></h3>
  <ul style="padding-left:18px;font-size:0.9em;">${photoRows}</ul>

  <div style="margin-top:20px;padding:12px;background:#f9fafb;border-radius:6px;"><strong>QA Notes:</strong> ${escapeHtml(String(job.qa_notes ?? "None"))}</div>

  <p style="margin-top:24px;font-size:0.8em;color:#999;border-top:1px solid #e5e7eb;padding-top:12px;">
    This report was auto-generated by the A&amp;A Cleaning operations platform.
  </p>
</body>
</html>`;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  const errors: string[] = [];

  let body: CompletionReportBody;
  try {
    body = (await request.json()) as CompletionReportBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const jobId = body.jobId?.trim();
  if (!jobId) {
    return NextResponse.json({ error: "jobId is required." }, { status: 400 });
  }

  const autoTriggered = body.autoTriggered === true;

  const allRecipients: string[] = [];
  if (body.recipientEmail && isValidEmail(body.recipientEmail)) {
    allRecipients.push(body.recipientEmail);
  }

  if (body.ccEmails?.length) {
    for (const ccEmail of body.ccEmails) {
      if (isValidEmail(ccEmail) && !allRecipients.includes(ccEmail)) {
        allRecipients.push(ccEmail);
      }
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin role required." }, { status: 403 });
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select(
      "id, title, address, scope, status, qa_status, qa_notes, qa_reviewed_at, qa_reviewed_by, created_at, completed_at",
    )
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: jobError?.message ?? "Job not found." }, { status: 404 });
  }

  const qaApproved = REPORTABLE_QA_STATUSES.includes(job.qa_status as ReportableQaStatus);
  if (!qaApproved && autoTriggered) {
    return NextResponse.json(
      {
        error: `Auto-triggered report blocked: QA status is "${job.qa_status ?? "null"}", expected one of [${REPORTABLE_QA_STATUSES.join(
          ", ",
        )}].`,
      },
      { status: 409 },
    );
  }

  if (!qaApproved) {
    errors.push(`Warning: QA status is "${job.qa_status ?? "null"}". Report generated as admin override.`);
  }

  const { data: recentReport } = await supabase
    .from("completion_reports")
    .select("id, created_at")
    .eq("job_id", jobId)
    .gte("created_at", new Date(Date.now() - 60_000).toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recentReport) {
    return NextResponse.json(
      {
        success: true,
        reportId: recentReport.id,
        emailed: false,
        deduplicated: true,
        message: "A completion report was already generated within the last 60 seconds.",
      },
      { status: 200 },
    );
  }

  const [assignmentsResult, issueResult, photosResult, checklistResult] = await Promise.all([
    supabase
      .from("job_assignments")
      .select("employee_id, role, status, profiles:employee_id(full_name)")
      .eq("job_id", jobId),
    supabase
      .from("issue_reports")
      .select("description, status, created_at")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(MAX_REPORT_ISSUES),
    supabase
      .from("job_photos")
      .select("storage_path, photo_type, created_at")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(MAX_REPORT_PHOTOS),
    supabase
      .from("job_checklist_items")
      .select("item_text, is_completed, completed_at")
      .eq("job_id", jobId)
      .order("sort_order", { ascending: true }),
  ]);

  const queryErrors = [assignmentsResult.error, issueResult.error, photosResult.error, checklistResult.error].filter(Boolean);
  if (queryErrors.length > 0) {
    for (const queryError of queryErrors) {
      errors.push(`Data query warning: ${queryError?.message}`);
    }
  }

  if (queryErrors.length === 4) {
    return NextResponse.json({ error: "Failed to load any report data.", details: errors }, { status: 500 });
  }

  const assignments = assignmentsResult.data ?? [];
  const assignmentNames = assignments
    .map((assignment) => {
      const profileData = assignment.profiles as unknown as { full_name: string | null } | null;
      return profileData?.full_name ?? assignment.employee_id;
    })
    .join(", ");

  const checklist = (checklistResult.data ?? []) as ChecklistItem[];
  const issues = (issueResult.data ?? []) as IssueRow[];
  const photos = (photosResult.data ?? []) as PhotoRow[];
  const generatedAt = new Date().toISOString();
  const reviewerName = profile.full_name ?? user.email ?? "Admin";

  const reportPayload = {
    job,
    qaReviewedBy: reviewerName,
    generatedAt,
    autoTriggered,
    assignments,
    checklist,
    issues,
    photos,
    checklistCompletion: {
      total: checklist.length,
      completed: checklist.filter((item) => item.is_completed).length,
    },
  };

  const html = buildReportHtml({
    job,
    assignmentNames,
    reviewerName,
    checklist,
    issues,
    photos,
    generatedAt,
  });

  let emailSent = false;
  let emailError: string | undefined;

  if (allRecipients.length > 0) {
    const emailResult = await sendReportEmail({
      to: allRecipients,
      subject: `Completion Report — ${job.title}`,
      html,
    });

    emailSent = emailResult.ok;
    if (!emailResult.ok && emailResult.error) {
      emailError = emailResult.error;
      errors.push(`Email delivery failed: ${emailResult.error}`);
    }
  }

  const { data: reportInsert, error: reportError } = await supabase
    .from("completion_reports")
    .insert({
      job_id: jobId,
      created_by: user.id,
      recipient_email: body.recipientEmail || null,
      cc_emails: body.ccEmails?.length ? body.ccEmails : null,
      auto_triggered: autoTriggered,
      status: emailSent ? "sent" : allRecipients.length > 0 ? "email_failed" : "generated",
      report_payload: reportPayload,
      report_html: html,
      sent_at: emailSent ? generatedAt : null,
      email_error: emailError ?? null,
    })
    .select("id")
    .single();

  if (reportError || !reportInsert) {
    return NextResponse.json(
      {
        success: false,
        error: reportError?.message ?? "Failed to persist completion report.",
        reportPayload,
        emailed: emailSent,
      },
      { status: 500 },
    );
  }

  const { error: updateJobError } = await supabase
    .from("jobs")
    .update({
      last_completion_report_id: reportInsert.id,
      last_completion_report_at: generatedAt,
    })
    .eq("id", jobId);

  if (updateJobError) {
    errors.push(`Job update warning: ${updateJobError.message}`);
  }

  const telemetry: ReportTelemetry = {
    jobId,
    reportId: reportInsert.id,
    emailed: emailSent,
    emailRecipients: allRecipients,
    autoTriggered,
    qaStatus: job.qa_status,
    checklistTotal: checklist.length,
    checklistCompleted: checklist.filter((item) => item.is_completed).length,
    issueCount: issues.length,
    photoCount: photos.length,
    generatedAt,
    durationMs: Date.now() - startTime,
    errors,
  };

  if (errors.length > 0) {
    console.warn("[completion-report] Completed with warnings:", JSON.stringify(telemetry));
  } else {
    console.info("[completion-report] Success:", JSON.stringify(telemetry));
  }

  return NextResponse.json({
    success: true,
    reportId: reportInsert.id,
    emailed: emailSent,
    emailRecipients: allRecipients,
    autoTriggered,
    deduplicated: false,
    warnings: errors.length > 0 ? errors : undefined,
    telemetry,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId")?.trim();

  if (!jobId) {
    return NextResponse.json({ error: "jobId query param is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin role required." }, { status: 403 });
  }

  const { data: reports, error: reportsError } = await supabase
    .from("completion_reports")
    .select("id, status, auto_triggered, recipient_email, cc_emails, created_at, sent_at, email_error")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })
    .limit(25);

  if (reportsError) {
    return NextResponse.json({ error: reportsError.message }, { status: 500 });
  }

  return NextResponse.json({ reports: reports ?? [] });
}
