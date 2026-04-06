"use client";

import { useState } from "react";

import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  FAQ_ITEMS,
  type FAQCategory,
} from "./faq-items";
import { useInViewOnce } from "./useInViewOnce";

export function FAQSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.15);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<FAQCategory | "all">("all");

  const filteredFaqs = filter === "all" ? FAQ_ITEMS : FAQ_ITEMS.filter((faq) => faq.category === filter);

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-32 border-b border-slate-200 bg-[#FAFAF8] py-24 md:scroll-mt-36 md:py-32"
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
              aria-pressed={filter === category}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                filter === category
                  ? "bg-[#0A1628] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-[#0A1628]"
              } min-h-[44px]`}
            >
              {category === "all" ? "All" : CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const globalIndex = FAQ_ITEMS.indexOf(faq);
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
