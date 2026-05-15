"use client";

import Image from "next/image";
import { useId } from "react";

import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { CTAButton } from "./CTAButton";

import { useInViewOnce } from "./useInViewOnce";
import { useQuoteForm } from "./useQuoteForm";

const EXPECTATION_CHIPS = ["Fast response", "Quality work"] as const;

function FloatingLabel({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <label htmlFor={id} className="absolute left-0 -top-2 text-[10px] uppercase tracking-[0.18em] text-slate-600">
        {label}
        {required ? " *" : ""}
      </label>
    </div>
  );
}

export function QuoteSection() {
  const fieldPrefix = useId().replace(/:/g, "");
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.2);
  const { fields, setters, isSubmitting, feedback, submitLead, markFormStarted, canRetry } = useQuoteForm({
    source: "quote_section",
  });

  return (
    <section ref={ref} id="quote" aria-labelledby="quote-heading" className="scroll-mt-32 overflow-hidden border-b border-slate-200 bg-white md:scroll-mt-36">
      <div className="flex min-h-0 flex-col md:flex-row">
        <div className="relative h-[28vh] w-full overflow-hidden md:h-auto md:w-[50%]">
          <Image
            src="/images/variant-a/quote-panel.jpg"
            alt=""
            fill
            quality={68}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061120]/92 via-[#0A1628]/58 to-[#0A1628]/24" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061120]/52 via-[#061120]/18 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
          <div className={`absolute bottom-8 left-6 right-6 transition duration-700 md:bottom-12 md:left-12 md:right-12 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <ul className="mb-4 flex flex-wrap gap-2 md:mb-5" aria-label="Quote process highlights">
              {EXPECTATION_CHIPS.map((chip) => (
                <li key={chip} className="info-chip-dark">
                  {chip}
                </li>
              ))}
            </ul>
            <h2 id="quote-heading" className="max-w-2xl font-serif text-3xl tracking-tight text-white drop-shadow-[0_3px_18px_rgba(2,6,23,0.72)] md:text-5xl lg:text-5xl">Let&apos;s Talk About Your Project</h2>
          </div>
        </div>

        <div className={`flex w-full items-center justify-center bg-[#FAFAF8] px-6 py-6 transition duration-700 md:w-[50%] md:p-14 lg:p-20 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="w-full max-w-lg">
            <h3 className="font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">Request a Quote</h3>
            {/* MOBILE-ELEVATION: M-5 — font-normal on mobile for legibility, font-light on md+ */}
            <p className="mt-3 max-w-md font-normal leading-relaxed text-slate-600 md:font-light">
              Tell us about your project. We review the scope, confirm the right next step, and keep the intake simple.
            </p>

            <form className="surface-panel mt-6 space-y-4 p-6 md:mt-10 md:space-y-6 md:p-7" aria-busy={isSubmitting} onFocusCapture={markFormStarted} onSubmit={(event) => void submitLead(event)}>
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

              <FloatingLabel id={`${fieldPrefix}-name`} label="Name" required>
                <input
                  id={`${fieldPrefix}-name`}
                  name="name"
                  autoComplete="name"
                  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                  placeholder=" "
                  required
                  value={fields.name}
                  onChange={(event) => setters.setName(event.target.value)}
                />
              </FloatingLabel>

              <FloatingLabel id={`${fieldPrefix}-company`} label="Company Name">
                <input
                  id={`${fieldPrefix}-company`}
                  name="companyName"
                  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                  placeholder=" "
                  value={fields.companyName}
                  onChange={(event) => setters.setCompanyName(event.target.value)}
                />
              </FloatingLabel>

              <div className="grid gap-6 md:grid-cols-2">
                <FloatingLabel id={`${fieldPrefix}-phone`} label="Phone" required>
                  <input
                    id={`${fieldPrefix}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9()\s-]+"
                    /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    placeholder=" "
                    required
                    value={fields.phone}
                    onChange={(event) => setters.setPhone(event.target.value)}
                  />
                </FloatingLabel>

                <FloatingLabel id={`${fieldPrefix}-email`} label="Email">
                  <input
                    id={`${fieldPrefix}-email`}
                    name="email"
                    autoComplete="email"
                    /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    placeholder=" "
                    type="email"
                    value={fields.email}
                    onChange={(event) => setters.setEmail(event.target.value)}
                  />
                </FloatingLabel>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FloatingLabel id={`${fieldPrefix}-service`} label="Service Type">
                  <select
                    id={`${fieldPrefix}-service`}
                    name="serviceType"
                    /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    value={fields.serviceType}
                    onChange={(event) => setters.setServiceType(event.target.value)}
                  >
                    <option value="">Select service</option>
                    <option value="post_construction">Post-Construction</option>
                    <option value="final_clean">Final Clean</option>
                    <option value="commercial">Commercial</option>
                    <option value="move_in_out">Move-In / Move-Out</option>
                    <option value="window">Windows & Power Wash</option>
                  </select>
                </FloatingLabel>

                <FloatingLabel id={`${fieldPrefix}-timeline`} label="Timeline">
                  <select
                    id={`${fieldPrefix}-timeline`}
                    name="timeline"
                    /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    value={fields.timeline}
                    onChange={(event) => setters.setTimeline(event.target.value)}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">Immediate</option>
                    <option value="this_week">This Week</option>
                    <option value="next_2_weeks">Next 2 Weeks</option>
                    <option value="next_month">This Month</option>
                    <option value="just_getting_quotes">Planning</option>
                  </select>
                </FloatingLabel>
              </div>

              <FloatingLabel id={`${fieldPrefix}-description`} label="Project Description">
                <textarea
                  id={`${fieldPrefix}-description`}
                  name="description"
                  enterKeyHint="done"
                  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
                  className="min-h-[110px] w-full resize-none border-b-2 border-slate-200 bg-transparent px-0 py-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                  placeholder=" "
                  value={fields.description}
                  onChange={(event) => setters.setDescription(event.target.value)}
                />
              </FloatingLabel>

              {feedback ? (
                <p
                  id={`${fieldPrefix}-feedback`}
                  aria-live="polite"
                  className={`text-sm ${feedback.type === "error" ? "text-red-600" : "text-emerald-700"}`}
                >
                  {feedback.message}
                </p>
              ) : null}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-describedby={feedback ? `${fieldPrefix}-feedback` : undefined}
                  className="cta-primary min-h-[48px] w-full"
                >
                  {isSubmitting ? "Submitting..." : canRetry ? "Try Again" : "Submit Quote Request"}
                </button>
                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-slate-600">We never share your information.</p>
              </div>
            </form>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
              <CTAButton
                ctaId="quote_section_secondary_call"
                actionType="call"
                href={`tel:${COMPANY_PHONE_E164}`}
                className="cta-outline-dark min-h-[48px] gap-3"
              >
                <span className="h-2 w-2 rounded-full bg-[#C9A94E]" />
                Prefer to call? {COMPANY_PHONE}
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
