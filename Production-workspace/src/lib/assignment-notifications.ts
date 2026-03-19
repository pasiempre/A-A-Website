import { dispatchSmsWithQuietHours } from "@/lib/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

type AssignmentRow = {
  id: string;
  employee_id: string;
  job_id: string;
  jobs: {
    title: string;
    address: string;
    scheduled_start: string | null;
  }[] | null;
  profiles: {
    id: string;
    full_name: string | null;
    phone: string | null;
    notification_preferences: Record<string, unknown> | null;
  }[] | null;
};

export async function dispatchAssignmentNotification(assignmentId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("job_assignments")
    .select(
      "id, employee_id, job_id, jobs(title, address, scheduled_start), profiles:employee_id(id, full_name, phone, notification_preferences)",
    )
    .eq("id", assignmentId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Assignment not found.");
  }

  const assignment = data as AssignmentRow;
  const profile = assignment.profiles?.[0] ?? null;
  const job = assignment.jobs?.[0] ?? null;

  if (!profile?.phone || !job) {
    await supabase
      .from("job_assignments")
      .update({
        notification_status: "failed",
        notification_error: !job ? "Job details missing." : "Employee phone is missing.",
      })
      .eq("id", assignmentId);

    return {
      sent: false,
      queued: false,
      error: !job ? "Job details missing." : "Employee phone is missing.",
    };
  }

  const scheduledText = job.scheduled_start
    ? ` Start: ${new Date(job.scheduled_start).toLocaleString()}.`
    : "";
  const message = `Nuevo trabajo asignado: ${job.title}. Dirección: ${job.address}.${scheduledText}`;

  const result = await dispatchSmsWithQuietHours({
    supabase,
    to: profile.phone,
    body: message,
    profileId: profile.id,
    preferences: profile.notification_preferences,
    queuedReason: "job_assignment_quiet_hours",
    context: {
      type: "job_assignment",
      assignmentId,
      jobId: assignment.job_id,
    },
  });

  await supabase
    .from("job_assignments")
    .update({
      notification_status: result.sent ? "sent" : result.queued ? "queued" : "failed",
      notification_error: result.sent || result.queued ? null : result.error ?? "Unknown assignment notification failure.",
      notified_at: result.sent || result.queued ? new Date().toISOString() : null,
    })
    .eq("id", assignmentId);

  return result;
}
