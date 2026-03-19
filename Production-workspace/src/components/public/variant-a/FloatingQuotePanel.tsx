"use client";

import { useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";

type FloatingQuotePanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function FloatingQuotePanel({ isOpen, onClose }: FloatingQuotePanelProps) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
    setServiceType("");
    setTimeline("");
    setDescription("");
  };

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          companyName,
          phone,
          email,
          serviceType,
          timeline,
          description,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback("Unable to submit right now. Please call us directly.");
        await trackConversionEvent({
          eventName: "quote_submit_failed",
          source: "floating_quote_panel",
          metadata: { message: body?.error || `HTTP ${response.status}` },
        });
        return;
      }

      await trackConversionEvent({
        eventName: "quote_submit_success",
        source: "floating_quote_panel",
        metadata: { serviceType },
      });

      setFeedback("Submitted. We’ll call you within the hour.");
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0A1628]/45 backdrop-blur-sm transition ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-8 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h3 className="font-serif text-3xl text-[#0A1628]">Request a Quote</h3>
          <button type="button" onClick={onClose} className="rounded p-2 text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <form className="space-y-5" onSubmit={(event) => void submitLead(event)}>
          <input
            className="w-full border-b border-slate-300 px-1 py-2 text-sm"
            placeholder="Name *"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="w-full border-b border-slate-300 px-1 py-2 text-sm"
            placeholder="Company Name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
          <input
            className="w-full border-b border-slate-300 px-1 py-2 text-sm"
            placeholder="Phone *"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <input
            className="w-full border-b border-slate-300 px-1 py-2 text-sm"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <select
            className="w-full border-b border-slate-300 px-1 py-2 text-sm text-slate-600"
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
          >
            <option value="">Service Type</option>
            <option value="post_construction">Post-Construction</option>
            <option value="final_clean">Final Clean</option>
            <option value="commercial">Commercial</option>
            <option value="move_in_out">Move-In / Move-Out</option>
            <option value="window">Windows & Power Wash</option>
          </select>
          <select
            className="w-full border-b border-slate-300 px-1 py-2 text-sm text-slate-600"
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
          >
            <option value="">Timeline</option>
            <option value="asap">ASAP</option>
            <option value="this_week">This Week</option>
            <option value="next_2_weeks">Next 2 Weeks</option>
            <option value="next_month">Next Month</option>
            <option value="just_getting_quotes">Just Getting Quotes</option>
          </select>
          <textarea
            className="w-full border-b border-slate-300 px-1 py-2 text-sm"
            placeholder="Project Description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-[#0A1628] py-3 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-[#2563EB] disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
          <p className="text-center text-[10px] uppercase tracking-[0.16em] text-slate-500">Avg. response: under 1 hour</p>
        </form>
      </aside>
    </div>
  );
}
