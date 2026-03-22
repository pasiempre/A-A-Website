"use client";

import { useId } from "react";

import { useQuoteForm } from "@/components/public/variant-a/useQuoteForm";

type ContactPageClientProps = {
  serviceTypes: string[];
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
      <label
        htmlFor={id}
        className="absolute -top-2 left-0 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500"
      >
        {label}
        {required ? " *" : ""}
      </label>
    </div>
  );
}

export function ContactPageClient({ serviceTypes }: ContactPageClientProps) {
  const fieldPrefix = useId().replace(/:/g, "");
  const { fields, setters, isSubmitting, feedback, submitLead } = useQuoteForm({
    source: "contact_page",
  });

  return (
    <form
      className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      aria-busy={isSubmitting}
      onSubmit={(event) => void submitLead(event)}
    >
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={(event) => setters.setWebsite(event.target.value)}
        />
      </div>

      <div className="space-y-7">
        <div className="grid gap-7 md:grid-cols-2">
          <FloatingLabel id={`${fieldPrefix}-name`} label="Full Name" required>
            <input
              id={`${fieldPrefix}-name`}
              name="name"
              autoComplete="name"
              required
              placeholder=" "
              className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
              value={fields.name}
              onChange={(event) => setters.setName(event.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel id={`${fieldPrefix}-company`} label="Company Name">
            <input
              id={`${fieldPrefix}-company`}
              name="companyName"
              placeholder=" "
              className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
              value={fields.companyName}
              onChange={(event) => setters.setCompanyName(event.target.value)}
            />
          </FloatingLabel>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <FloatingLabel id={`${fieldPrefix}-phone`} label="Phone" required>
            <input
              id={`${fieldPrefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              placeholder=" "
              className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
              value={fields.phone}
              onChange={(event) => setters.setPhone(event.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel id={`${fieldPrefix}-email`} label="Email">
            <input
              id={`${fieldPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder=" "
              className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
              value={fields.email}
              onChange={(event) => setters.setEmail(event.target.value)}
            />
          </FloatingLabel>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <FloatingLabel id={`${fieldPrefix}-service`} label="Service Type">
            <select
              id={`${fieldPrefix}-service`}
              name="serviceType"
              className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
              value={fields.serviceType}
              onChange={(event) => setters.setServiceType(event.target.value)}
            >
              <option value="">Select a service</option>
              {serviceTypes.map((serviceType) => (
                <option key={serviceType} value={serviceType.toLowerCase().replace(/[\s/&]+/g, "_")}>
                  {serviceType}
                </option>
              ))}
            </select>
          </FloatingLabel>

          <FloatingLabel id={`${fieldPrefix}-timeline`} label="Timeline">
            <select
              id={`${fieldPrefix}-timeline`}
              name="timeline"
              className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
              value={fields.timeline}
              onChange={(event) => setters.setTimeline(event.target.value)}
            >
              <option value="">Select timeline</option>
              <option value="asap">Immediate / ASAP</option>
              <option value="this_week">This Week</option>
              <option value="next_2_weeks">Next 2 Weeks</option>
              <option value="next_month">This Month</option>
              <option value="just_getting_quotes">Just Getting Quotes</option>
            </select>
          </FloatingLabel>
        </div>

        <FloatingLabel id={`${fieldPrefix}-description`} label="Project Details">
          <textarea
            id={`${fieldPrefix}-description`}
            name="description"
            placeholder=" "
            rows={4}
            className="min-h-[120px] w-full resize-none border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#0A1628]"
            value={fields.description}
            onChange={(event) => setters.setDescription(event.target.value)}
          />
        </FloatingLabel>

        {feedback ? (
          <div
            aria-live="polite"
            className={`rounded-xl p-4 text-sm ${
              feedback.type === "error"
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {feedback.type === "success" && (
              <div className="mb-1 flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="10" r="7" />
                  <path d="m7 10 2 2 4-4" />
                </svg>
                <span className="font-semibold">Request received</span>
              </div>
            )}
            {feedback.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={isSubmitting} className="cta-primary px-8 py-4 sm:w-auto">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            We respond within 1 hour during business hours
          </p>
        </div>
      </div>
    </form>
  );
}
