"use client";

import { useState } from "react";

import { useInViewOnce } from "./useInViewOnce";

type FAQItem = {
  question: string;
  answer: string;
  category: "general" | "process" | "pricing";
};

const faqs: FAQItem[] = [
  {
    question: "What areas do you serve?",
    answer:
      "We serve the greater Austin metro area including Round Rock, Pflugerville, Georgetown, Hutto, Buda, Kyle, and San Marcos. If you're outside that range, reach out — we may still be able to help depending on project size.",
    category: "general",
  },
  {
    question: "What's the difference between a rough clean and a final clean?",
    answer:
      "A rough clean happens while construction is still active — it focuses on debris removal, bulk dust, and clearing the workspace for trades. A final clean is the detail-level pass that prepares the space for walkthrough and move-in, including fixtures, surfaces, floors, and touch points.",
    category: "process",
  },
  {
    question: "How quickly can you start a project?",
    answer:
      "We respond to quote requests within one hour during business hours. Depending on crew availability, we can often begin within 24–48 hours. Emergency same-day starts are available by request for turnover and move-out situations.",
    category: "process",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. A&A Cleaning is fully licensed and insured for commercial and construction site work across the Austin metro area. We can provide certificates of insurance on request.",
    category: "general",
  },
  {
    question: "Do you work with general contractors directly?",
    answer:
      "Yes — general contractors are one of our primary client segments. We coordinate with project managers and site superintendents to align our cleaning schedule with walkthrough deadlines and trade sequencing.",
    category: "general",
  },
  {
    question: "How do you price projects?",
    answer:
      "Pricing is based on square footage, scope of work, site conditions, and timeline. We provide a clear written estimate after reviewing the scope — either over the phone or through a site visit. There are no hidden fees.",
    category: "pricing",
  },
  {
    question: "Can you handle recurring commercial cleaning?",
    answer:
      "Yes. We offer ongoing cleaning contracts for offices, retail spaces, and commercial facilities. Scheduling is flexible — we can work during off-hours, weekends, or around active business operations.",
    category: "process",
  },
  {
    question: "What if we're not satisfied with the results?",
    answer:
      "We don't leave until it's right. If anything doesn't meet the standard during your walkthrough, we'll address it on-site. Our goal is zero punch-list items related to cleaning.",
    category: "general",
  },
  {
    question: "What services are included in a final clean?",
    answer:
      "Final cleans include detailed surface cleaning, floor cleaning and sealing prep, window and glass cleaning, fixture polishing, fixture installation cleanup, drywall touch-up dust removal, and trash and debris removal. We tailor the scope to your project specifications.",
    category: "process",
  },
  {
    question: "Do you provide move-in/move-out cleaning?",
    answer:
      "Yes. We specialize in move-in/move-out cleaning for residential and commercial units. This includes deep cleaning of all surfaces, appliances, fixtures, flooring, and vacant spaces — getting units ready for immediate re-leasing.",
    category: "general",
  },
  {
    question: "Can you handle high-rise or multi-story projects?",
    answer:
      "Absolutely. We have experience with high-rise residential projects, commercial towers, and multi-story developments. We coordinate logistics, manage crew movement, and comply with building requirements for access and safety.",
    category: "general",
  },
  {
    question: "What payment terms do you offer?",
    answer:
      "We typically invoice upon completion of work. Payment terms are negotiable depending on project size and client relationship. We accept check, ACH, and credit card payments.",
    category: "pricing",
  },
  {
    question: "Do you offer warranty or follow-up services?",
    answer:
      "Yes. We stand behind our work with a quality guarantee. If punch-list items emerge within 48 hours of completion, we'll return to address them at no charge.",
    category: "general",
  },
  {
    question: "Can we get a quote without a site visit?",
    answer:
      "Yes. If you have detailed specs, square footage, and photos, we can provide an estimate over the phone or via email. For complex projects, an on-site visit helps us nail the scope and timeline.",
    category: "pricing",
  },
  {
    question: "What's your crew size and responsiveness?",
    answer:
      "Crew size scales with project scope — from 2–3 person teams for smaller jobs to larger crews for major construction sites. We maintain 24/7 responsiveness for urgent requests and aim to answer all quotes within one business hour.",
    category: "process",
  },
];

const CATEGORY_LABELS: Record<FAQItem["category"], string> = {
  general: "General",
  process: "Process",
  pricing: "Pricing",
};

const CATEGORY_STYLES: Record<FAQItem["category"], string> = {
  general: "border-[#2563EB]/30 bg-[#2563EB]/10 text-[#1D4ED8]",
  process: "border-[#C9A94E]/40 bg-[#C9A94E]/10 text-[#8A6B22]",
  pricing: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
};

export function FAQSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.15);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<FAQItem["category"] | "all">("all");

  const filteredFaqs = filter === "all" ? faqs : faqs.filter((faq) => faq.category === filter);

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-32 border-b border-slate-200 bg-[#F1F0EE] py-24 md:scroll-mt-36 md:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div
          className={`mb-14 text-center transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
            <span className="section-kicker">Common Questions</span>
            <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
          </div>

          <h2 id="faq-heading" className="mt-4 font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-slate-600">
            Quick answers about our process, coverage, and what to expect when working with A&amp;A Cleaning.
          </p>
        </div>

        <div
          className={`mb-10 flex flex-wrap items-center justify-center gap-2 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {(["all", "general", "process", "pricing"] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                filter === category
                  ? "bg-[#0A1628] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-[#0A1628]"
              }`}
            >
              {category === "all" ? "All" : CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const globalIndex = faqs.indexOf(faq);
            const isOpen = openIndex === globalIndex;

            return (
              <div
                key={faq.question}
                className={`surface-panel overflow-hidden transition-all duration-500 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${isOpen ? "ring-1 ring-slate-300" : ""}`}
                style={{ transitionDelay: isVisible ? `${200 + index * 60}ms` : "0ms" }}
              >
                <button
                  id={`faq-question-${globalIndex}`}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${globalIndex}`}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/50"
                >
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                      CATEGORY_STYLES[faq.category]
                    }`}
                  >
                    {CATEGORY_LABELS[faq.category]}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-[#0A1628] md:text-base">{faq.question}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5.5 7.5 4.5 5 4.5-5" />
                  </svg>
                </button>

                <div
                  id={`faq-answer-${globalIndex}`}
                  role="region"
                  aria-labelledby={`faq-question-${globalIndex}`}
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
