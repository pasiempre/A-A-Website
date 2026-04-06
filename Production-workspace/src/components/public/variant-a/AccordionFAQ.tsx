"use client";

import { useState } from "react";

type AccordionFAQProps = {
  items: Array<{ question: string; answer: string }>;
};

export function AccordionFAQ({ items }: AccordionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`accordion-answer-${index}`}
              className="flex min-h-[48px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/50"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] md:text-base">
                <span className="text-[#2563EB]" aria-hidden="true">
                  {isOpen ? "-" : "+"}
                </span>
                {item.question}
              </span>
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
              id={`accordion-answer-${index}`}
              role="region"
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
