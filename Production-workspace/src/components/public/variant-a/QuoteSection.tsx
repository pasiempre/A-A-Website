"use client";

import Image from "next/image";
import { useId } from "react";

import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { CTAButton } from "./CTAButton";

import { useInViewOnce } from "./useInViewOnce";
import { useQuoteForm } from "./useQuoteForm";

const EXPECTATION_CHIPS = ["Direct contact", "Scope review"] as const;

const EXPECTATION_ITEMS = [
  { title: "What to expect", body: "Direct scope follow-up", icon: "response" as const },
  { title: "Best fit", body: "Commercial + turnover work", icon: "scope" as const },
  { title: "Approach", body: "Clear scope before scheduling", icon: "coverage" as const },
] as const;

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

function QuoteSignalIcon({ kind }: { kind: "response" | "scope" | "coverage" }) {
  if (kind === "response") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7.5v5l3 1.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (kind === "scope") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
        <path d="M6 5.5h12v13H6zM9 9h6M9 12.5h6M9 16h4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path d="M12 4.5 5.5 7.5v4.6c0 4.2 2.8 7.4 6.5 8.9 3.7-1.5 6.5-4.7 6.5-8.9V7.5L12 4.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="m9.6 12.2 1.7 1.7 3.2-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function QuoteSection() {
  const fieldPrefix = useId().replace(/:/g, "");
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.2);
  const { fields, setters, isSubmitting, feedback, submitLead } = useQuoteForm({
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/82 to-[#0A1628]/22" aria-hidden="true" />
          <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
          <div className={`absolute bottom-8 left-6 right-6 transition duration-700 md:bottom-12 md:left-12 md:right-12 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <ul className="mb-4 flex flex-wrap gap-2 md:mb-5" aria-label="Quote process highlights">
              {EXPECTATION_CHIPS.map((chip) => (
                <li key={chip} className="info-chip-dark">
                  {chip}
                </li>
              ))}
            </ul>
            <h2 id="quote-heading" className="font-serif text-3xl tracking-tight text-white md:text-5xl lg:text-5xl">Let&apos;s Talk About Your Project</h2>
            <CTAButton
              ctaId="quote_section_call_now"
              actionType="call"
              href={`tel:${COMPANY_PHONE_E164}`}
              className="mt-4 gap-3 text-base font-medium text-white transition hover:text-slate-200 md:mt-5 md:text-lg"
            >
              <span className="rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                Call
              </span>
              <span>Or call now: {COMPANY_PHONE}</span>
            </CTAButton>
          </div>
        </div>

        <div className={`flex w-full items-center justify-center bg-[#FAFAF8] px-6 py-6 transition duration-700 md:w-[50%] md:p-14 lg:p-20 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="w-full max-w-lg">
            <div className="surface-panel mb-6 grid gap-3 p-4 md:mb-8 md:grid-cols-3">
              {EXPECTATION_ITEMS.map((item, index) => (
                <div key={item.title} className={index === 0 ? "" : "border-slate-200 md:border-l md:pl-4"}>
                  <div className="flex items-center gap-3">
                    <span className="icon-tile h-10 w-10 rounded-xl text-sm">
                      <QuoteSignalIcon kind={item.icon} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-700">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">Request a Quote</h3>
            {/* MOBILE-ELEVATION: M-5 — font-normal on mobile for legibility, font-light on md+ */}
            <p className="mt-3 max-w-md font-normal leading-relaxed text-slate-600 md:font-light">
              Tell us about your project. We review the scope, confirm the right next step, and keep the intake simple.
            </p>

            <form className="surface-panel mt-6 space-y-4 p-6 md:mt-10 md:space-y-6 md:p-7" aria-busy={isSubmitting} onSubmit={(event) => void submitLead(event)}>
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
                    pattern="[0-9()\-\s]+"
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
                  {isSubmitting ? "Submitting..." : "Submit Quote Request"}
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
