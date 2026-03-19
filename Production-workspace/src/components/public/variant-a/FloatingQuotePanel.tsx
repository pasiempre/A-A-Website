"use client";

import { useEffect, useId, useRef, useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";

type FloatingQuotePanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function FloatingQuotePanel({ isOpen, onClose }: FloatingQuotePanelProps) {
  const fieldPrefix = useId().replace(/:/g, "");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleTabTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabTrap);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabTrap);
    };
  }, [isOpen, onClose]);

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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${fieldPrefix}-title`}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-8 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h3 id={`${fieldPrefix}-title`} className="font-serif text-3xl text-[#0A1628]">
            Detailed Scope Request
          </h3>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="rounded p-2 text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <form className="space-y-5" aria-busy={isSubmitting} onSubmit={(event) => void submitLead(event)}>
          <div>
            <label htmlFor={`${fieldPrefix}-name`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Name *
            </label>
            <input
              id={`${fieldPrefix}-name`}
              name="name"
              autoComplete="name"
              className="w-full border-b border-slate-300 px-1 py-2 text-sm"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-company`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Company Name
            </label>
            <input
              id={`${fieldPrefix}-company`}
              name="companyName"
              className="w-full border-b border-slate-300 px-1 py-2 text-sm"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-phone`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Phone *
            </label>
            <input
              id={`${fieldPrefix}-phone`}
              name="phone"
              autoComplete="tel"
              className="w-full border-b border-slate-300 px-1 py-2 text-sm"
              required
              value={phone}
              onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
            />
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-email`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Email
            </label>
            <input
              id={`${fieldPrefix}-email`}
              name="email"
              autoComplete="email"
              className="w-full border-b border-slate-300 px-1 py-2 text-sm"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-service`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Service Type
            </label>
            <select
              id={`${fieldPrefix}-service`}
              name="serviceType"
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
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-timeline`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Timeline
            </label>
            <select
              id={`${fieldPrefix}-timeline`}
              name="timeline"
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
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-description`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Project Description
            </label>
            <textarea
              id={`${fieldPrefix}-description`}
              name="description"
              className="w-full border-b border-slate-300 px-1 py-2 text-sm"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          {feedback ? (
            <p id={`${fieldPrefix}-feedback`} aria-live="polite" className="text-sm text-slate-600">
              {feedback}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-describedby={feedback ? `${fieldPrefix}-feedback` : undefined}
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
