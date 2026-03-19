"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { normalizeNotificationPreferences, type NotificationPreferences } from "@/lib/notifications";

type QueueRow = {
  id: string;
  to_phone: string;
  body: string;
  status: string;
  queued_reason: string | null;
  send_after: string;
  sent_at: string | null;
  error_text: string | null;
  context: Record<string, unknown>;
};

type AssignmentNotificationRow = {
  id: string;
  notification_status: string;
  notification_error: string | null;
  notified_at: string | null;
  profiles: { full_name: string | null }[] | null;
  jobs: { title: string; address: string }[] | null;
};

export function NotificationCenterClient() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [assignments, setAssignments] = useState<AssignmentNotificationRow[]>([]);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(userError?.message ?? "Unable to load user session.");
      }

      const [profileResult, queueResult, assignmentResult] = await Promise.all([
        supabase.from("profiles").select("id, notification_preferences").eq("id", user.id).single(),
        supabase
          .from("notification_dispatch_queue")
          .select("id, to_phone, body, status, queued_reason, send_after, sent_at, error_text, context")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("job_assignments")
          .select("id, notification_status, notification_error, notified_at, profiles:employee_id(full_name), jobs(title, address)")
          .order("assigned_at", { ascending: false })
          .limit(25),
      ]);

      if (profileResult.error || queueResult.error || assignmentResult.error) {
        throw new Error(profileResult.error?.message || queueResult.error?.message || assignmentResult.error?.message || "Unable to load notifications.");
      }

      setProfileId(profileResult.data.id);
      setPreferences(normalizeNotificationPreferences(profileResult.data.notification_preferences as Partial<NotificationPreferences> | null));
      setQueue((queueResult.data as QueueRow[]) ?? []);
      setAssignments((assignmentResult.data as AssignmentNotificationRow[]) ?? []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to load notification center.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const savePreferences = async () => {
    if (!profileId || !preferences) {
      return;
    }

    setIsSaving(true);
    setStatusText(null);
    setErrorText(null);

    try {
      const { error } = await createClient()
        .from("profiles")
        .update({ notification_preferences: preferences })
        .eq("id", profileId);

      if (error) {
        throw new Error(error.message);
      }

      setStatusText("Notification preferences saved.");
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  const retryQueueRow = async (rowId: string) => {
    setStatusText(null);
    setErrorText(null);
    const { error } = await createClient()
      .from("notification_dispatch_queue")
      .update({
        status: "queued",
        send_after: new Date().toISOString(),
        error_text: null,
        sent_at: null,
      })
      .eq("id", rowId);

    if (error) {
      setErrorText(error.message);
      return;
    }

    setStatusText("Notification re-queued.");
    await loadData();
  };

  const retryAssignment = async (assignmentId: string) => {
    setStatusText(null);
    setErrorText(null);

    const response = await fetch("/api/assignment-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setErrorText(payload?.error ?? "Unable to retry assignment notification.");
      return;
    }

    setStatusText("Assignment notification re-sent.");
    await loadData();
  };

  const runDispatch = async () => {
    setIsDispatching(true);
    setStatusText(null);
    setErrorText(null);

    try {
      const response = await fetch("/api/notification-dispatch", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; queuedCount?: number; sent?: number; failed?: number; error?: string }
        | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Dispatch request failed.");
      }

      setStatusText(`Dispatch complete. Processed ${payload.queuedCount ?? 0}, sent ${payload.sent ?? 0}, failed ${payload.failed ?? 0}.`);
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to run dispatch.");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <section className="mb-8 grid gap-8 lg:grid-cols-[0.95fr_1.25fr]">
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Notification Preferences</h2>
        <p className="mt-1 text-sm text-slate-600">Control quiet hours and dispatch behavior without touching SQL.</p>

        {statusText ? <p className="mt-3 text-sm text-emerald-700">{statusText}</p> : null}
        {errorText ? <p className="mt-3 text-sm text-rose-600">{errorText}</p> : null}

        {!preferences ? (
          <p className="mt-4 text-sm text-slate-500">{isLoading ? "Loading preferences..." : "Preferences unavailable."}</p>
        ) : (
          <div className="mt-5 space-y-4">
            <label className="block text-sm text-slate-700">
              Timezone
              <input
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                value={preferences.timezone}
                onChange={(event) => setPreferences((prev) => (prev ? { ...prev, timezone: event.target.value } : prev))}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-slate-700">
                Quiet hours start
                <input
                  type="time"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  value={preferences.quiet_hours_start}
                  onChange={(event) =>
                    setPreferences((prev) => (prev ? { ...prev, quiet_hours_start: event.target.value } : prev))
                  }
                />
              </label>
              <label className="text-sm text-slate-700">
                Quiet hours end
                <input
                  type="time"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  value={preferences.quiet_hours_end}
                  onChange={(event) =>
                    setPreferences((prev) => (prev ? { ...prev, quiet_hours_end: event.target.value } : prev))
                  }
                />
              </label>
            </div>

            <label className="text-sm text-slate-700">
              Summary time
              <input
                type="time"
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                value={preferences.notification_summary_time}
                onChange={(event) =>
                  setPreferences((prev) => (prev ? { ...prev, notification_summary_time: event.target.value } : prev))
                }
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={preferences.sms_enabled}
                onChange={(event) => setPreferences((prev) => (prev ? { ...prev, sms_enabled: event.target.checked } : prev))}
              />
              SMS enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={preferences.email_enabled}
                onChange={(event) => setPreferences((prev) => (prev ? { ...prev, email_enabled: event.target.checked } : prev))}
              />
              Email enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={preferences.batch_job_notifications}
                onChange={(event) =>
                  setPreferences((prev) => (prev ? { ...prev, batch_job_notifications: event.target.checked } : prev))
                }
              />
              Batch job notifications
            </label>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => void savePreferences()}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        )}
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Notification Queue</h2>
            <p className="mt-1 text-sm text-slate-600">Queued, sent, and failed dispatch visibility with retry actions.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void loadData()} className="text-sm font-medium text-slate-700 underline">
              Refresh
            </button>
            <button
              type="button"
              disabled={isDispatching}
              onClick={() => void runDispatch()}
              className="rounded bg-slate-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-60"
            >
              {isDispatching ? "Dispatching..." : "Run Dispatch"}
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Dispatch queue</h3>
            <div className="mt-3 space-y-3">
              {queue.map((row) => (
                <div key={row.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{row.to_phone}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{row.body}</p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Send after {new Date(row.send_after).toLocaleString()}
                    {row.queued_reason ? ` • ${row.queued_reason}` : ""}
                  </p>
                  {row.error_text ? <p className="mt-1 text-[11px] text-rose-600">{row.error_text}</p> : null}
                  {row.status !== "sent" ? (
                    <button
                      type="button"
                      onClick={() => void retryQueueRow(row.id)}
                      className="mt-3 rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      Retry
                    </button>
                  ) : null}
                </div>
              ))}
              {!isLoading && queue.length === 0 ? <p className="text-sm text-slate-500">No queued notifications.</p> : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Assignment SMS</h3>
            <div className="mt-3 space-y-3">
              {assignments.map((assignment) => {
                const employeeName = assignment.profiles?.[0]?.full_name || "Employee";
                const jobTitle = assignment.jobs?.[0]?.title || "Job";
                const jobAddress = assignment.jobs?.[0]?.address || "";

                return (
                  <div key={assignment.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{employeeName}</p>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                        {assignment.notification_status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{jobTitle}</p>
                    <p className="text-[11px] text-slate-500">{jobAddress}</p>
                    {assignment.notification_error ? <p className="mt-1 text-[11px] text-rose-600">{assignment.notification_error}</p> : null}
                    {assignment.notification_status !== "sent" ? (
                      <button
                        type="button"
                        onClick={() => void retryAssignment(assignment.id)}
                        className="mt-3 rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        Retry Assignment SMS
                      </button>
                    ) : null}
                  </div>
                );
              })}
              {!isLoading && assignments.length === 0 ? <p className="text-sm text-slate-500">No assignment notifications yet.</p> : null}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
