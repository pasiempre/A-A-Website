"use client";

import { useId, useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";

import { useInViewOnce } from "./useInViewOnce";

type QuoteSectionProps = {
  onOpenQuote: () => void;
};

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
      <label htmlFor={id} className="absolute left-0 -top-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {label}
        {required ? " *" : ""}
      </label>
    </div>
  );
}

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

export function QuoteSection({ onOpenQuote }: QuoteSectionProps) {
  const fieldPrefix = useId().replace(/:/g, "");
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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
        setFeedback("Unable to submit right now. Please call us directly.");
        await trackConversionEvent({
          eventName: "quote_submit_failed",
          source: "quote_section",
          metadata: { status: response.status.toString() },
        });
        return;
      }

      await trackConversionEvent({
        eventName: "quote_submit_success",
        source: "quote_section",
        metadata: { serviceType },
      });

      setFeedback("Submitted. We’ll call you within the hour.");
      setName("");
      setCompanyName("");
      setPhone("");
      setEmail("");
      setServiceType("");
      setTimeline("");
      setDescription("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="quote" className="scroll-mt-32 overflow-hidden border-b border-slate-200 bg-white md:scroll-mt-36">
      <div className="flex min-h-[92vh] flex-col md:flex-row">
        <div className="relative h-[42vh] w-full overflow-hidden md:h-auto md:w-[50%]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(10,22,40,0.82), rgba(10,22,40,0.22)), url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2700&auto=format&fit=crop')",
            }}
          />
          <div className={`absolute bottom-12 left-8 right-8 transition duration-1000 md:left-12 md:right-12 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <h2 className="font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">Let&apos;s Talk About Your Project</h2>
            <a
              href={`tel:${COMPANY_PHONE_E164}`}
              className="mt-5 inline-flex items-center gap-3 text-lg font-medium text-white transition hover:text-slate-200"
              onClick={() => {
                void trackConversionEvent({ eventName: "call_click", source: "quote_section" });
              }}
            >
              <span className="rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                Call
              </span>
              <span>Or call now: {COMPANY_PHONE}</span>
            </a>
          </div>
        </div>

        <div className={`flex w-full items-center justify-center bg-[#F8F7F4] p-8 transition duration-1000 md:w-[50%] md:p-16 lg:p-24 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="w-full max-w-lg">
            <h3 className="font-serif text-3xl tracking-tight text-[#0A1628]">Request a Quote</h3>
            <p className="mt-2 font-light text-slate-600">Tell us about your project. We call back within the hour.</p>

            <form className="mt-10 space-y-6" aria-busy={isSubmitting} onSubmit={(event) => void submitLead(event)}>
              <FloatingLabel id={`${fieldPrefix}-name`} label="Name" required>
                <input
                  id={`${fieldPrefix}-name`}
                  name="name"
                  autoComplete="name"
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                  placeholder=" "
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FloatingLabel>

              <FloatingLabel id={`${fieldPrefix}-company`} label="Company Name">
                <input
                  id={`${fieldPrefix}-company`}
                  name="companyName"
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                  placeholder=" "
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </FloatingLabel>

              <div className="grid gap-6 md:grid-cols-2">
                <FloatingLabel id={`${fieldPrefix}-phone`} label="Phone" required>
                  <input
                    id={`${fieldPrefix}-phone`}
                    name="phone"
                    autoComplete="tel"
                    className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    placeholder=" "
                    required
                    value={phone}
                    onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
                  />
                </FloatingLabel>

                <FloatingLabel id={`${fieldPrefix}-email`} label="Email">
                  <input
                    id={`${fieldPrefix}-email`}
                    name="email"
                    autoComplete="email"
                    className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    placeholder=" "
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </FloatingLabel>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FloatingLabel id={`${fieldPrefix}-service`} label="Service Type">
                  <select
                    id={`${fieldPrefix}-service`}
                    name="serviceType"
                    className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    value={serviceType}
                    onChange={(event) => setServiceType(event.target.value)}
                  >
                    <option value="" />
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
                    className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                    value={timeline}
                    onChange={(event) => setTimeline(event.target.value)}
                  >
                    <option value="" />
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
                  className="min-h-[110px] w-full resize-none border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
                  placeholder=" "
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </FloatingLabel>

              {feedback ? (
                <p id={`${fieldPrefix}-feedback`} aria-live="polite" className="text-sm text-slate-600">
                  {feedback}
                </p>
              ) : null}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-describedby={feedback ? `${fieldPrefix}-feedback` : undefined}
                  className="w-full rounded-md bg-[#0A1628] py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#1e293b] disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Request a Quote"}
                </button>
                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-slate-400">We never share your information.</p>
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  <span className="text-[#C9A94E]">✦</span>
                  <span>Avg. response: under 1 hour</span>
                </div>
              </div>
            </form>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Need To Share More Scope?
              </button>
              <a
                href={`tel:${COMPANY_PHONE_E164}`}
                className="inline-flex items-center justify-center rounded-sm text-xs font-medium uppercase tracking-[0.18em] text-slate-600 transition hover:text-[#0A1628]"
              >
                Prefer to call? {COMPANY_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
