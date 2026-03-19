"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type QueueRow = {
  id: string;
  to_phone: string;
  body: string;
  send_after: string;
  status: "queued" | "sent" | "failed";
  queued_reason: string | null;
  provider_sid: string | null;
  error_text: string | null;
  created_at: string;
  sent_at: string | null;
};

export function NotificationDispatchClient() {
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notification_dispatch_queue")
        .select("id, to_phone, body, send_after, status, queued_reason, provider_sid, error_text, created_at, sent_at")
        .order("created_at", { ascending: false })
        .limit(150);

      if (error) {
        throw new Error(error.message);
      }

      setRows((data as QueueRow[] | null) ?? []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to load notification queue.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const runDispatch = async () => {
    setStatusText(null);
    setErrorText(null);
    setIsDispatching(true);

    try {
      const response = await fetch("/api/notification-dispatch", {
        method: "POST",
      });

      const payload = (await response.json()) as { success?: boolean; queuedCount?: number; sent?: number; failed?: number; error?: string };
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Dispatch request failed.");
      }

      setStatusText(`Dispatch complete. Processed ${payload.queuedCount ?? 0}, sent ${payload.sent ?? 0}, failed ${payload.failed ?? 0}.`);
      await loadQueue();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to run dispatch.");
    } finally {
      setIsDispatching(false);
    }
  };

  const retryRow = async (rowId: string) => {
    setStatusText(null);
    setErrorText(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("notification_dispatch_queue")
        .update({
          status: "queued",
          send_after: new Date().toISOString(),
          error_text: null,
        })
        .eq("id", rowId);

      if (error) {
        throw new Error(error.message);
      }

      setStatusText("Notification marked for retry.");
      await loadQueue();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to retry notification.");
    }
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Notification Queue</h2>
          <p className="text-sm text-slate-600">Monitor queued, sent, and failed SMS notifications with retry controls.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadQueue()}
            className="rounded border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => void runDispatch()}
            disabled={isDispatching}
            className="rounded bg-slate-900 px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDispatching ? "Dispatching..." : "Run Dispatch"}
          </button>
        </div>
      </div>

      {statusText ? <p className="mb-3 text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mb-3 text-sm text-rose-600">{errorText}</p> : null}

      <div className="overflow-hidden rounded border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="border-b border-slate-200 px-3 py-2">To</th>
              <th className="border-b border-slate-200 px-3 py-2">Status</th>
              <th className="border-b border-slate-200 px-3 py-2">Send After</th>
              <th className="border-b border-slate-200 px-3 py-2">Reason/Error</th>
              <th className="border-b border-slate-200 px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  Loading queue...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  No notification records yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-3 py-2">
                    <p className="text-xs font-medium text-slate-800">{row.to_phone}</p>
                    <p className="line-clamp-2 text-xs text-slate-500">{row.body}</p>
                  </td>
                  <td className="px-3 py-2 capitalize">{row.status}</td>
                  <td className="px-3 py-2 text-xs text-slate-700">{new Date(row.send_after).toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{row.error_text || row.queued_reason || "—"}</td>
                  <td className="px-3 py-2">
                    {row.status === "failed" ? (
                      <button
                        type="button"
                        onClick={() => void retryRow(row.id)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                      >
                        Retry
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}