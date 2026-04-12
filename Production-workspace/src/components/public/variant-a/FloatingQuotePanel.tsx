"use client";

import { useEffect, useId, useRef } from "react";

import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";
import { useQuoteForm } from "./useQuoteForm";

type FloatingQuotePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: string;
};

export function FloatingQuotePanel({ isOpen, onClose, initialServiceType }: FloatingQuotePanelProps) {
  const fieldPrefix = useId().replace(/:/g, "");
  const { fields, setters, isSubmitting, feedback, submitLead, markFormStarted, currentStep, canRetry, setCurrentStep } = useQuoteForm({
    source: "floating_quote_panel",
    enableTwoStep: true,
  });
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);
  const previousInitialServiceTypeRef = useRef<string | undefined>(initialServiceType);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    const isOpening = !wasOpen && isOpen;
    const didContextServiceTypeChange =
      previousInitialServiceTypeRef.current !== initialServiceType;

    if (isOpen && initialServiceType && (isOpening || didContextServiceTypeChange)) {
      setters.setServiceType(initialServiceType);
    }

    previousInitialServiceTypeRef.current = initialServiceType;
  }, [initialServiceType, isOpen, setters]);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;

    if (wasOpen && !isOpen) {
      const hasAnyInput =
        fields.name.trim().length > 0 ||
        fields.companyName.trim().length > 0 ||
        fields.phone.trim().length > 0 ||
        fields.email.trim().length > 0 ||
        fields.serviceType.trim().length > 0 ||
        fields.timeline.trim().length > 0 ||
        fields.description.trim().length > 0;

      if (hasAnyInput && feedback?.type !== "success") {
        void trackConversionEvent({
          eventName: "quote_form_abandoned",
          source: "floating_quote_panel",
          metadata: {
            step: currentStep,
            has_name: Boolean(fields.name.trim()),
            has_phone: Boolean(fields.phone.trim()),
            has_service_type: Boolean(fields.serviceType.trim()),
          },
        });
      } else if (!hasAnyInput && feedback?.type !== "success") {
        void trackConversionEvent({
          eventName: "quote_panel_bounced",
          source: "floating_quote_panel",
          metadata: {
            step: currentStep,
            had_initial_service_type: Boolean(initialServiceType),
          },
        });
      }
    }

    wasOpenRef.current = isOpen;
  }, [currentStep, feedback, fields, initialServiceType, isOpen]);

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

  const handleFieldFocus = (event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;
    const isFocusableField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement;

    if (!isFocusableField || typeof window === "undefined" || window.innerWidth >= 768) {
      return;
    }

    // Keep active field comfortably above the mobile keyboard.
    window.setTimeout(() => {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 120);
  };

  return (
    <div
      className={`fixed inset-0 z-[55] bg-[#0A1628]/45 backdrop-blur-sm transition ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${fieldPrefix}-title`}
        /* MOBILE-HARDENING: Safe-area handling and refined mobile padding */
        className={`absolute right-0 top-0 w-full max-w-md min-h-[50svh] max-h-full overflow-y-auto bg-white px-6 pb-10 pt-14 transition-transform duration-300 md:h-full md:p-8 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          paddingTop: "calc(3.5rem + env(safe-area-inset-top))",
          paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))",
          paddingLeft: "calc(1.5rem + env(safe-area-inset-left))",
          paddingRight: "calc(1.5rem + env(safe-area-inset-right))",
        }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h3 id={`${fieldPrefix}-title`} className="font-serif text-2xl text-[#0A1628] md:text-3xl">
            {currentStep === 1 ? "Get a Free Quote" : "Add Project Details"}
          </h3>
          <button ref={closeButtonRef} type="button" aria-label="Close quote request panel" onClick={onClose} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <form
          className="space-y-5"
          aria-busy={isSubmitting}
          onFocusCapture={(event) => {
            markFormStarted();
            handleFieldFocus(event);
          }}
          onSubmit={(event) => void submitLead(event)}
        >
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {currentStep === 1
              ? "Step 1 of 2: Just three fields to get started."
              : "Step 2 of 2: Optional details to speed up your quote."}
          </p>

          <div aria-hidden="true" className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none">
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={fields.website}
              onChange={(event) => setters.setWebsite(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor={`${fieldPrefix}-name`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-600">
              Name *
            </label>
            <input
              id={`${fieldPrefix}-name`}
              name="name"
              autoComplete="name"
              enterKeyHint="next"
              /* MOBILE-HARDENING: py-4 for 44px+ touch target */
              className="w-full border-b border-slate-300 px-1 py-4 text-sm"
              required
              value={fields.name}
              onChange={(event) => setters.setName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor={`${fieldPrefix}-phone`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-600">
              Phone *
            </label>
            <input
              id={`${fieldPrefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              enterKeyHint="next"
              pattern="[0-9()\s-]+"
              /* MOBILE-HARDENING: py-4 for 44px+ touch target */
              className="w-full border-b border-slate-300 px-1 py-4 text-sm"
              required
              value={fields.phone}
              onChange={(event) => setters.setPhone(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor={`${fieldPrefix}-service`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-600">
              Service Type *
            </label>
            <select
              id={`${fieldPrefix}-service`}
              name="serviceType"
              /* MOBILE-HARDENING: py-4 for 44px+ touch target */
              className="w-full border-b border-slate-300 px-1 py-4 text-sm text-slate-600"
              required
              value={fields.serviceType}
              onChange={(event) => setters.setServiceType(event.target.value)}
            >
              <option value="">Service Type</option>
              <option value="post_construction">Post-Construction</option>
              <option value="final_clean">Final Clean</option>
              <option value="commercial">Commercial</option>
              <option value="move_in_out">Move-In / Move-Out</option>
              <option value="window">Windows & Power Wash</option>
            </select>
          </div>

          {currentStep === 2 ? (
            <>
              <div>
            <label htmlFor={`${fieldPrefix}-company`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-600">
              Company Name
            </label>
            <input
              id={`${fieldPrefix}-company`}
              name="companyName"
              autoComplete="organization"
              enterKeyHint="next"
              /* MOBILE-HARDENING: py-4 for 44px+ touch target */
              className="w-full border-b border-slate-300 px-1 py-4 text-sm"
              value={fields.companyName}
              onChange={(event) => setters.setCompanyName(event.target.value)}
            />
              </div>
              <div>
                <label htmlFor={`${fieldPrefix}-email`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Email
                </label>
                <input
                  id={`${fieldPrefix}-email`}
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="next"
                  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b border-slate-300 px-1 py-4 text-sm"
                  type="email"
                  value={fields.email}
                  onChange={(event) => setters.setEmail(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`${fieldPrefix}-timeline`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Timeline
                </label>
                <select
                  id={`${fieldPrefix}-timeline`}
                  name="timeline"
                  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b border-slate-300 px-1 py-4 text-sm text-slate-600"
                  value={fields.timeline}
                  onChange={(event) => setters.setTimeline(event.target.value)}
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
                <label htmlFor={`${fieldPrefix}-description`} className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Project Description
                </label>
                <textarea
                  id={`${fieldPrefix}-description`}
                  name="description"
                  enterKeyHint="done"
                  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b border-slate-300 px-1 py-4 text-sm"
                  rows={3}
                  value={fields.description}
                  onChange={(event) => setters.setDescription(event.target.value)}
                />
              </div>
            </>
          ) : null}
          {feedback ? (
            <p
              id={`${fieldPrefix}-feedback`}
              aria-live="polite"
              className={`text-sm ${feedback.type === "error" ? "text-red-600" : "text-emerald-700"}`}
            >
              {feedback.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-describedby={feedback ? `${fieldPrefix}-feedback` : undefined}
            className="w-full rounded-sm bg-[#0A1628] py-3 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-[#2563EB] disabled:opacity-70 min-h-[48px]"
          >
            {isSubmitting
              ? "Submitting..."
              : canRetry
                ? "Try Again"
                : currentStep === 1
                  ? "Continue"
                  : "Send My Quote Request"}
          </button>
          {currentStep === 2 ? (
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                void trackConversionEvent({
                  eventName: "quote_step2_back_clicked",
                  source: "floating_quote_panel",
                  metadata: {
                    has_name: Boolean(fields.name.trim()),
                    has_phone: Boolean(fields.phone.trim()),
                    has_service_type: Boolean(fields.serviceType.trim()),
                  },
                });
              }}
              className="w-full rounded-sm border border-slate-300 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 min-h-[48px]"
            >
              Back to Step 1
            </button>
          ) : null}
          <p className="text-center text-[11px] text-slate-600">
            Prefer Spanish support? {" "}
            <a
              href={`tel:${COMPANY_PHONE_E164}`}
              onClick={() => {
                void trackConversionEvent({
                  eventName: "quote_spanish_handoff_clicked",
                  source: "floating_quote_panel",
                  metadata: {
                    step: currentStep,
                  },
                });
              }}
              className="font-semibold text-[#0A1628] underline underline-offset-2 hover:text-[#2563EB]"
            >
              Habla con nosotros en Español
            </a>
            .
          </p>
          <p className="text-center text-[10px] uppercase tracking-[0.16em] text-slate-600">Avg. response: under 1 hour</p>
        </form>
      </aside>
    </div>
  );
}
