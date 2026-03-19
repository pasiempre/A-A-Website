import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type CompletionReportBody = {
  jobId?: string;
  recipientEmail?: string;
};

export async function POST(request: Request) {
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
    .select("id, title, address, scope, status, qa_status, qa_notes, created_at")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: jobError?.message ?? "Job not found." }, { status: 404 });
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
      .limit(20),
    supabase
      .from("job_photos")
      .select("storage_path, photo_type, created_at")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("job_checklist_items")
      .select("item_text, is_completed, completed_at")
      .eq("job_id", jobId)
      .order("sort_order", { ascending: true }),
  ]);

  if (assignmentsResult.error || issueResult.error || photosResult.error || checklistResult.error) {
    return NextResponse.json(
      {
        error:
          assignmentsResult.error?.message ||
          issueResult.error?.message ||
          photosResult.error?.message ||
          checklistResult.error?.message ||
          "Failed building report data.",
      },
      { status: 500 },
    );
  }

  const assignmentNames = (assignmentsResult.data ?? [])
    .map((assignment) => assignment.profiles?.[0]?.full_name ?? assignment.employee_id)
    .join(", ");

  const checklist = checklistResult.data ?? [];
  const issues = issueResult.data ?? [];
  const photos = photosResult.data ?? [];

  const reportPayload = {
    job,
    qaReviewedBy: profile.full_name ?? user.email,
    generatedAt: new Date().toISOString(),
    assignments: assignmentsResult.data ?? [],
    checklist,
    issues,
    photos,
  };

  const checklistRows = checklist
    .map(
      (item) =>
        `<li>${item.is_completed ? "✅" : "⬜"} ${item.item_text}${item.completed_at ? ` <small>(${new Date(item.completed_at).toLocaleString()})</small>` : ""}</li>`,
    )
    .join("");
  const issueRows = issues
    .map(
      (issue) =>
        `<li><strong>${issue.status.toUpperCase()}</strong> — ${issue.description} <small>(${new Date(issue.created_at).toLocaleString()})</small></li>`,
    )
    .join("");
  const photoRows = photos
    .map((photo) => `<li>${photo.photo_type ?? "completion"}: ${photo.storage_path}</li>`)
    .join("");

  const html = `
    <h2>A&A Cleaning — Completion Report</h2>
    <p><strong>Job:</strong> ${job.title}</p>
    <p><strong>Address:</strong> ${job.address}</p>
    <p><strong>Status:</strong> ${job.status} / QA: ${job.qa_status}</p>
    <p><strong>Crew:</strong> ${assignmentNames || "Unassigned"}</p>
    <p><strong>Reviewed By:</strong> ${profile.full_name ?? "Admin"}</p>
    <p><strong>Scope:</strong> ${job.scope ?? "No scope notes"}</p>
    <h3>Checklist</h3>
    <ul>${checklistRows || "<li>No checklist items.</li>"}</ul>
    <h3>Issue Reports</h3>
    <ul>${issueRows || "<li>No issues reported.</li>"}</ul>
    <h3>Photo Records</h3>
    <ul>${photoRows || "<li>No photos uploaded.</li>"}</ul>
    <p><strong>QA Notes:</strong> ${job.qa_notes ?? "None"}</p>
  `;

  let emailSent = false;
  if (body.recipientEmail && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [body.recipientEmail],
        subject: `Completion Report — ${job.title}`,
        html,
      }),
    });

    emailSent = resendResponse.ok;
  }

  const { data: reportInsert, error: reportError } = await supabase
    .from("completion_reports")
    .insert({
      job_id: jobId,
      created_by: user.id,
      recipient_email: body.recipientEmail || null,
      status: emailSent ? "sent" : "generated",
      report_payload: reportPayload,
      sent_at: emailSent ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (reportError || !reportInsert) {
    return NextResponse.json({ error: reportError?.message ?? "Failed to persist completion report." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    reportId: reportInsert.id,
    emailed: emailSent,
  });
}
