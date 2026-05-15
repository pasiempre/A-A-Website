"use client";

import { useState } from "react";
import Link from "next/link";

import { SERVICE_FAQS } from "@/lib/service-faqs";
import { SERVICE_PRICING } from "@/lib/service-pricing";
import { HOMEPAGE_SERVICE_AREA_LINKS } from "@/lib/service-areas";

type ServicePageHardeningProps = {
  serviceType: "construction" | "commercial" | "turnover" | "specialty";
  startingPrice?: string;
  sla?: string;
};

const CONTENT = {
  construction: {
    objectionTitle: "Why GCs Trust A&A",
    objections: [
      {
        title: "OSHA Compliant",
        desc: "Safety-first culture with full PPE and site-specific hazard awareness.",
      },
      {
        title: "Pass-First Walkthrough",
        desc: "Our triple-check process ensures you don't fail final inspections due to cleaning.",
      },
      {
        title: "Scale Ready",
        desc: "From single build-outs to massive multifamily complexes, we have the crew capacity.",
      },
    ],
    pricingLabel: "Project Based",
    slaLabel: "Walkthrough Ready Guarantee",
  },
  commercial: {
    objectionTitle: "Zero-Disruption Commercial Care",
    objections: [
      {
        title: "After-Hours Service",
        desc: "Your team arrives to a pristine office without ever seeing our crew.",
      },
      {
        title: "Uniformed & Vetted",
        desc: "Every technician is background-checked and professionally uniformed for security.",
      },
      {
        title: "Custom Frequency",
        desc: "Daily, weekly, or bi-weekly plans tailored to your facility's traffic.",
      },
    ],
    pricingLabel: "Monthly Plans",
    slaLabel: "Consistency Guarantee",
  },
  turnover: {
    objectionTitle: "Fast Turnovers, No Vacancy",
    objections: [
      {
        title: "24h Rapid Response",
        desc: "We prioritize vacant units to get them back on the market immediately.",
      },
      {
        title: "Inventory Tracking",
        desc: "We log unit conditions and report maintenance issues before we leave.",
      },
      {
        title: "Move-In Standards",
        desc: "White-glove detail that makes every new tenant feel like the first.",
      },
    ],
    pricingLabel: "Per Unit Pricing",
    slaLabel: "24h Turnover Guarantee",
  },
  specialty: {
    objectionTitle: "Precision Specialty Cleaning",
    objections: [
      {
        title: "Advanced Equipment",
        desc: "HEPA filtration and industrial power-washing for superior results.",
      },
      {
        title: "Streak-Free Finish",
        desc: "Specialized techniques for glass and high-end surfaces.",
      },
      {
        title: "Full Coverage",
        desc: "Interior and exterior polishing that protects your asset's value.",
      },
    ],
    pricingLabel: "Starting at $199",
    slaLabel: "Total Satisfaction Guarantee",
  },
};

export function ServicePageHardening({
  serviceType,
  startingPrice,
  sla,
}: ServicePageHardeningProps) {
  const content = CONTENT[serviceType];
  const faqs = SERVICE_FAQS[serviceType];
  const pricing = SERVICE_PRICING[serviceType];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-16 py-16 md:py-24">
      {/* Pricing & SLA Block */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C9A94E]">How Pricing Works</p>
            <h2 className="mt-2 text-2xl font-serif tracking-tight text-[#0A1628] md:text-3xl">
              {pricing.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              Clear guidance first, then a final scope-confirmed quote.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Price Guidance</p>
              <p className="mt-2 text-2xl font-bold text-[#0A1628] md:text-3xl">{startingPrice || pricing.pricingRange}</p>
              <p className="mt-3 text-xs italic text-slate-500">{pricing.quoteBasis}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Our Commitments</p>
              <p className="mt-2 text-lg font-bold text-[#0A1628]">{sla || content.slaLabel}</p>
              <ul className="mt-4 space-y-2">
                {pricing.commitments.map((commitment) => (
                  <li key={commitment} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9A94E]/15 text-[#8B6E25]">
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m4 10 3.2 3.2L16 4.8" />
                      </svg>
                    </span>
                    <span>{commitment}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#0A1628]">Includes</h3>
              <ul className="mt-3 space-y-2">
                {pricing.includes.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#0A1628]">Common Add-Ons</h3>
              <ul className="mt-3 space-y-2">
                {pricing.addOns.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Objection Modules */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">
            {content.objectionTitle}
          </h2>
          <div className="mx-auto mt-4 h-1 w-12 bg-[#C9A94E]" />
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {content.objections.map((obj) => (
            <div key={obj.title} className="flex gap-5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A94E]/10 text-[#C9A94E]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0A1628]">{obj.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {obj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">
            Common Questions About This Service
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            Quick answers to the top concerns customers ask before booking.
          </p>

          <div className="mt-6 space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div key={item.question} className="overflow-hidden rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`service-faq-answer-${serviceType}-${index}`}
                    className="flex min-h-[48px] w-full items-center justify-between gap-4 bg-white px-4 py-3 text-left transition-colors hover:bg-slate-50 md:px-5"
                  >
                    <span className="text-sm font-semibold leading-relaxed text-[#0A1628] md:text-base">
                      {item.question}
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5.5 7.5 4.5 5 4.5-5" />
                    </svg>
                  </button>

                  <div
                    id={`service-faq-answer-${serviceType}-${index}`}
                    className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600 md:px-5 md:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-[#FAFAF8] p-6 md:p-8">
          <h2 className="font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">
            Popular Service Areas for This Scope
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            Explore city-specific pages with local project context, service availability, and nearby coverage details.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {HOMEPAGE_SERVICE_AREA_LINKS.map((city) => (
              <Link
                key={city.href}
                href={city.href}
                className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-[#0A1628] transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                {city.label}
              </Link>
            ))}
            <Link
              href="/service-area"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#0A1628] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#13213A]"
            >
              View all cities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
