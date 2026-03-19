"use client";

import { useState } from "react";

type QuoteResponseClientProps = {
  token: string;
  initialStatus: string;
};

export function QuoteResponseClient({ token, initialStatus }: QuoteResponseClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const submitResponse = async (response: "accept" | "decline") => {
    setIsSubmitting(true);
    setErrorText(null);

    try {
      const result = await fetch("/api/quote-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          response,
          contactName,
          contactEmail,
          notes,
        }),
      });

      if (!result.ok) {
        const payload = (await result.json().catch(() => null)) as { error?: string } | null;
        setErrorText(payload?.error ?? `Unable to submit quote response (${result.status}).`);
        return;
      }

      const payload = (await result.json()) as { status: string };
      setStatus(payload.status);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "accepted" || status === "declined") {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Response recorded</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {status === "accepted" ? "Quote accepted" : "Quote declined"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {status === "accepted"
            ? "A&A Cleaning has been notified and will follow up with scheduling."
            : "Thanks for the update. A&A Cleaning has been notified."}
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Respond to This Quote</h2>
      <p className="mt-2 text-sm text-slate-600">Accept or decline online. Optional contact details help A&A confirm next steps.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          Contact name
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
          />
        </label>
        <label className="text-sm text-slate-700">
          Contact email
          <input
            type="email"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 block text-sm text-slate-700">
        Notes
        <textarea
          rows={3}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>

      {errorText ? <p className="mt-3 text-sm text-rose-600">{errorText}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => void submitResponse("accept")}
          className="rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Accept Quote"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => void submitResponse("decline")}
          className="rounded border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-60"
        >
          Decline Quote
        </button>
      </div>
    </section>
  );
}
