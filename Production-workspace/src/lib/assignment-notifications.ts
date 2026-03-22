import { dispatchSmsWithQuietHours } from "@/lib/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

type JobRow = {
  title: string;
  address: string;
  scheduled_start: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  notification_preferences: Record<string, unknown> | null;
};

type AssignmentRow = {
  id: string;
  employee_id: string;
  job_id: string;
  jobs: JobRow[] | JobRow | null;
  profiles: ProfileRow[] | ProfileRow | null;
};

type DispatchResult = {
  sent: boolean;
  queued: boolean;
  sid?: string;
  error?: string;
  attempts?: number;
};

type NotificationEvent = "assigned" | "rescheduled" | "substituted" | "cancelled";

type AssignmentNotificationInput = {
  assignmentId: string;
  event: NotificationEvent;
  previousEmployeeId?: string;
  previousScheduledStart?: string | null;
  cancellationReason?: string;
};

function normalizeRelation<T>(relation: T[] | T | null | undefined): T | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

function getEventMessage(params: {
  event: NotificationEvent;
  jobTitle: string;
  address: string;
  nextScheduledStart: string | null;
  previousScheduledStart?: string | null;
  employeeName?: string | null;
  cancellationReason?: string;
}): string {
  const nextStartText = params.nextScheduledStart
    ? new Date(params.nextScheduledStart).toLocaleString()
    : null;
  const previousStartText = params.previousScheduledStart
    ? new Date(params.previousScheduledStart).toLocaleString()
    : null;

  if (params.event === "assigned") {
    return `Nuevo trabajo asignado: ${params.jobTitle}. Dirección: ${params.address}.${nextStartText ? ` Inicio: ${nextStartText}.` : ""}`;
  }

  if (params.event === "rescheduled") {
    const previous = previousStartText ? ` antes ${previousStartText}` : "";
    return `Trabajo reprogramado: ${params.jobTitle}. Dirección: ${params.address}.${nextStartText ? ` Nuevo inicio: ${nextStartText}` : ""}${previous}.`;
  }

  if (params.event === "substituted") {
    return `Actualización de asignación: ahora estás asignado a ${params.jobTitle} en ${params.address}.${nextStartText ? ` Inicio: ${nextStartText}.` : ""}`;
  }

  const reasonText = params.cancellationReason ? ` Motivo: ${params.cancellationReason}.` : "";
  return `Asignación cancelada: ${params.jobTitle} en ${params.address}.${reasonText}`;
}

async function loadAssignment(assignmentId: string): Promise<{
  assignment: AssignmentRow;
  profile: ProfileRow | null;
  job: JobRow | null;
}> {
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
  const profile = normalizeRelation(assignment.profiles);
  const job = normalizeRelation(assignment.jobs);

  return {
    assignment,
    profile,
    job,
  };
}

async function writeNotificationStatus(args: {
  assignmentId: string;
  result: DispatchResult;
  errorOverride?: string | null;
}) {
  const supabase = createAdminClient();

  await supabase
    .from("job_assignments")
    .update({
      notification_status: args.result.sent ? "sent" : args.result.queued ? "queued" : "failed",
      notification_error:
        args.result.sent || args.result.queued
          ? null
          : args.errorOverride ?? args.result.error ?? "Unknown assignment notification failure.",
      notified_at: args.result.sent || args.result.queued ? new Date().toISOString() : null,
    })
    .eq("id", args.assignmentId);
}

async function appendNotificationLog(args: {
  assignmentId: string;
  employeeId: string;
  jobId: string;
  eventType: NotificationEvent;
  result: DispatchResult;
  details?: Record<string, unknown>;
}) {
  const supabase = createAdminClient();

  await supabase.from("assignment_notification_log").insert({
    assignment_id: args.assignmentId,
    employee_id: args.employeeId,
    job_id: args.jobId,
    event_type: args.eventType,
    delivery_status: args.result.sent ? "sent" : args.result.queued ? "queued" : "failed",
    delivery_error: args.result.sent || args.result.queued ? null : args.result.error ?? null,
    provider_sid: args.result.sid ?? null,
    details: args.details ?? null,
    sent_at: args.result.sent || args.result.queued ? new Date().toISOString() : null,
  });
}

async function dispatchAssignmentEventNotification(input: AssignmentNotificationInput): Promise<DispatchResult> {
  const { assignment, profile, job } = await loadAssignment(input.assignmentId);

  if (!profile?.phone || !job) {
    const error = !job ? "Job details missing." : "Employee phone is missing.";
    const failureResult: DispatchResult = { sent: false, queued: false, error };

    await writeNotificationStatus({
      assignmentId: input.assignmentId,
      result: failureResult,
      errorOverride: error,
    });

    await appendNotificationLog({
      assignmentId: input.assignmentId,
      employeeId: assignment.employee_id,
      jobId: assignment.job_id,
      eventType: input.event,
      result: failureResult,
      details: {
        reason: error,
      },
    });

    return failureResult;
  }

  const message = getEventMessage({
    event: input.event,
    jobTitle: job.title,
    address: job.address,
    nextScheduledStart: job.scheduled_start,
    previousScheduledStart: input.previousScheduledStart,
    employeeName: profile.full_name,
    cancellationReason: input.cancellationReason,
  });

  const supabase = createAdminClient();
  const result = await dispatchSmsWithQuietHours({
    supabase,
    to: profile.phone,
    body: message,
    profileId: profile.id,
    preferences: profile.notification_preferences,
    queuedReason: `job_assignment_${input.event}_quiet_hours`,
    context: {
      type: `job_assignment_${input.event}`,
      assignmentId: input.assignmentId,
      jobId: assignment.job_id,
      previousEmployeeId: input.previousEmployeeId,
      previousScheduledStart: input.previousScheduledStart,
      cancellationReason: input.cancellationReason,
    },
  });

  await writeNotificationStatus({
    assignmentId: input.assignmentId,
    result,
  });

  await appendNotificationLog({
    assignmentId: input.assignmentId,
    employeeId: assignment.employee_id,
    jobId: assignment.job_id,
    eventType: input.event,
    result,
    details: {
      previousEmployeeId: input.previousEmployeeId,
      previousScheduledStart: input.previousScheduledStart,
      cancellationReason: input.cancellationReason,
    },
  });

  return result;
}

export async function dispatchAssignmentNotification(assignmentId: string) {
  return await dispatchAssignmentEventNotification({
    assignmentId,
    event: "assigned",
  });
}

export async function dispatchRescheduledAssignmentNotification(args: {
  assignmentId: string;
  previousScheduledStart?: string | null;
}) {
  return await dispatchAssignmentEventNotification({
    assignmentId: args.assignmentId,
    event: "rescheduled",
    previousScheduledStart: args.previousScheduledStart,
  });
}

export async function dispatchSubstitutionAssignmentNotification(args: {
  assignmentId: string;
  previousEmployeeId: string;
}) {
  return await dispatchAssignmentEventNotification({
    assignmentId: args.assignmentId,
    event: "substituted",
    previousEmployeeId: args.previousEmployeeId,
  });
}

export async function dispatchCancelledAssignmentNotification(args: {
  assignmentId: string;
  cancellationReason?: string;
}) {
  return await dispatchAssignmentEventNotification({
    assignmentId: args.assignmentId,
    event: "cancelled",
    cancellationReason: args.cancellationReason,
  });
}

export async function dispatchBulkRescheduledNotifications(assignments: Array<{
  assignmentId: string;
  previousScheduledStart?: string | null;
}>) {
  const results = await Promise.allSettled(
    assignments.map((entry) =>
      dispatchRescheduledAssignmentNotification({
        assignmentId: entry.assignmentId,
        previousScheduledStart: entry.previousScheduledStart,
      }),
    ),
  );

  const sent = results.filter((result) => result.status === "fulfilled" && result.value.sent).length;
  const queued = results.filter((result) => result.status === "fulfilled" && result.value.queued).length;
  const failed = results.length - sent - queued;

  return {
    total: results.length,
    sent,
    queued,
    failed,
    results,
  };
}
