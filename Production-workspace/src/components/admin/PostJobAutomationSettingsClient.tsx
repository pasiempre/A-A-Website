"use client";

import { useEffect, useState } from "react";

type PostJobSettings = {
  reviewUrl: string;
  ratingRequestDelayHours: number;
  reviewReminderDelayHours: number;
  paymentReminderDelayHours: number;
  lowRatingThreshold: number;
};

const INITIAL_SETTINGS: PostJobSettings = {
  reviewUrl: "",
  ratingRequestDelayHours: 24,
  reviewReminderDelayHours: 48,
  paymentReminderDelayHours: 72,
  lowRatingThreshold: 3,
};

function toPositiveIntString(value: string): string {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "";
}

export function PostJobAutomationSettingsClient() {
  const [settings, setSettings] = useState<PostJobSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorText(null);

      const response = await fetch("/api/post-job-settings", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        settings?: PostJobSettings;
      };

      if (!response.ok || !payload.settings) {
        setErrorText(payload.error ?? "Unable to load post-job settings.");
        setIsLoading(false);
        return;
      }

      setSettings(payload.settings);
      setIsLoading(false);
    };

    void load();
  }, []);

  const save = async () => {
    setIsSaving(true);
    setErrorText(null);
    setStatusText(null);

    const response = await fetch("/api/post-job-settings", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        review_url: settings.reviewUrl,
        rating_request_delay_hours: settings.ratingRequestDelayHours,
        review_reminder_delay_hours: settings.reviewReminderDelayHours,
        payment_reminder_delay_hours: settings.paymentReminderDelayHours,
        low_rating_threshold: settings.lowRatingThreshold,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      settings?: PostJobSettings;
    };

    if (!response.ok || !payload.settings) {
      setErrorText(payload.error ?? "Unable to save settings.");
      setIsSaving(false);
      return;
    }

    setSettings(payload.settings);
    setStatusText("Post-job automation settings updated.");
    setIsSaving(false);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Post-Job Automation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Control rating and reminder timing, low-rating threshold, and review destination link.
          </p>
        </div>
      </div>

      {statusText ? <p className="mt-3 text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mt-3 text-sm text-rose-600">{errorText}</p> : null}

      {isLoading ? (
        <p className="mt-4 text-sm text-slate-600">Loading settings...</p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-xs text-slate-700 md:col-span-2">
            Public Review URL
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
              value={settings.reviewUrl}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  reviewUrl: event.target.value,
                }))
              }
              placeholder="https://g.page/r/..."
            />
          </label>

          <label className="text-xs text-slate-700">
            Rating Request Delay (hours)
            <input
              type="number"
              min={1}
              max={168}
              className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
              value={settings.ratingRequestDelayHours}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  ratingRequestDelayHours: Number(toPositiveIntString(event.target.value) || prev.ratingRequestDelayHours),
                }))
              }
            />
          </label>

          <label className="text-xs text-slate-700">
            Review Reminder Delay (hours)
            <input
              type="number"
              min={1}
              max={336}
              className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
              value={settings.reviewReminderDelayHours}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  reviewReminderDelayHours: Number(
                    toPositiveIntString(event.target.value) || prev.reviewReminderDelayHours,
                  ),
                }))
              }
            />
          </label>

          <label className="text-xs text-slate-700">
            Payment Reminder Delay (hours)
            <input
              type="number"
              min={1}
              max={336}
              className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
              value={settings.paymentReminderDelayHours}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  paymentReminderDelayHours: Number(
                    toPositiveIntString(event.target.value) || prev.paymentReminderDelayHours,
                  ),
                }))
              }
            />
          </label>

          <label className="text-xs text-slate-700">
            Low Rating Threshold
            <input
              type="number"
              min={2}
              max={5}
              className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
              value={settings.lowRatingThreshold}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  lowRatingThreshold: Math.max(2, Math.min(5, Number(event.target.value || prev.lowRatingThreshold))),
                }))
              }
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="button"
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void save()}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Automation Settings"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
