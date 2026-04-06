"use client";

import Link from "next/link";
import { useState } from "react";

import { INDUSTRIES, type IndustryData } from "@/data/industries";
import { INDUSTRY_TO_SERVICE_TYPE } from "@/lib/service-type-map";
import { QuoteCTA } from "./QuoteCTA";
import { useInViewOnce } from "./useInViewOnce";

type IndustryBlock = IndustryData;

const industries: IndustryBlock[] = INDUSTRIES;

function ContractorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h16" />
      <path d="M5 14v-1a7 7 0 0 1 14 0v1" />
      <path d="M12 3v4" />
      <path d="M7.5 14v1.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V14" />
      <path d="M9 20l2-2.5L13 20" />
    </svg>
  );
}

function PropertyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="10" r="3" />
      <path d="M11 10h8" />
      <path d="M16 10v3" />
      <path d="M19 10v3" />
      <path d="M5 18h14" />
    </svg>
  );
}

function OfficeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 8h2m4 0h-2" />
      <path d="M9 12h2m4 0h-2" />
      <path d="M10 16h4v4h-4z" />
    </svg>
  );
}

function IndustryIcon({ icon }: { icon: IndustryBlock["icon"] }) {
  switch (icon) {
    case "contractor":
      return <ContractorIcon />;
    case "property":
      return <PropertyIcon />;
    case "office":
      return <OfficeIcon />;
  }
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M12 6l4 4-4 4" />
    </svg>
  );
}

export function OfferAndIndustrySection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.15);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      id="industries"
      aria-labelledby="industries-heading"
      /* MOBILE-HARDENING: py-14→py-10 for tighter section padding. md:py-32 preserved. */
      className="relative scroll-mt-32 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-white px-6 py-10 md:scroll-mt-36 md:px-10 md:py-32 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div
          /* MOBILE-HARDENING: mb-10→mb-8 for tighter heading block. md:mb-20 preserved. */
          className={`mb-8 transition-all duration-700 ease-out md:mb-20 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker inline-flex items-center gap-2">
                <span className="inline-block h-px w-6 bg-[#2563EB]" aria-hidden="true" />
                Who We Serve
              </p>

              <h2
                id="industries-heading"
                className="mt-4 font-serif text-3xl tracking-tight text-[#0A1628] sm:text-4xl md:text-5xl lg:text-[3.25rem]"
              >
                Built for Demanding Spaces
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
                The work changes by project type. The standard does&nbsp;not. A&A supports closeout schedules, turnover pace, and polished day&#8209;to&#8209;day environments.
              </p>
            </div>

            <QuoteCTA ctaId="industry_scope_cta_desktop" className="cta-primary group/btn hidden w-fit items-center gap-2.5 whitespace-nowrap md:flex">
              Talk Through Your Scope
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </QuoteCTA>
          </div>
        </div>

        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:hidden">
          {industries.map((industry) => {
            const industrySlug = industry.slug;
            return (
              <article
                key={`mobile-${industry.title}`}
                className="min-w-[86%] snap-center rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${industry.accentIcon}`}>
                    <IndustryIcon icon={industry.icon} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{industry.eyebrow}</p>
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-[1.15] tracking-tight text-[#0A1628]">{industry.title}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-bold tracking-tight text-[#0A1628]">{industry.stat}</span>
                  <span className="text-xs text-slate-600">{industry.statLabel}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{industry.painPoint}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{industry.outcome}</p>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">Best suited for</p>
                  <p className="mt-2 text-xs font-medium text-slate-600">{industry.fit.join(", ")}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <QuoteCTA
                    ctaId={`industry_${industrySlug}_discuss_project_mobile`}
                    serviceType={INDUSTRY_TO_SERVICE_TYPE[industrySlug]}
                    className="cta-primary inline-flex w-full items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em]"
                  >
                    Discuss Your Project
                    <ArrowRight className="h-4 w-4" />
                  </QuoteCTA>
                  <Link
                    href={`/industries/${industrySlug}`}
                    className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                  >
                    View Industry Page
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:hidden">
          Swipe to view all industries
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-3 lg:gap-8">
          {industries.map((industry, index) => {
            const industrySlug = industry.slug;
            return (
            <article
              key={industry.title}
              id={`industry-${industrySlug}`}
              role="article"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                group relative flex flex-col overflow-hidden rounded-3xl border bg-white
                transition-all duration-500 ease-out
                ${hoveredIndex === index ? `-translate-y-2 shadow-2xl ${industry.accentGlow} ${industry.accentBorder}` : "border-slate-200/80 shadow-sm"}
                ${hoveredIndex !== null && hoveredIndex !== index ? "opacity-80 scale-[0.98]" : "opacity-100 scale-100"}
                ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}
              `}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              <div
                className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-b ${industry.accent} transition-opacity duration-500 hidden md:block ${
                  hoveredIndex === index ? "opacity-100" : "opacity-70"
                }`}
                aria-hidden="true"
              />

              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${industry.accent.replace("to-transparent", "to-transparent")} opacity-0 transition-opacity duration-300 hidden md:block group-hover:opacity-100`}
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(90deg, #3b82f6, #93c5fd)"
                      : index === 1
                      ? "linear-gradient(90deg, #f59e0b, #fcd34d)"
                      : "linear-gradient(90deg, #10b981, #6ee7b7)",
                }}
                aria-hidden="true"
              />

              <div className="relative flex flex-1 flex-col p-5 md:p-8 lg:p-9">
                {/* MOBILE-HARDENING: mb-4→mb-3 for tighter icon/eyebrow row. md:mb-8 preserved. */}
                <div className="mb-3 flex items-center gap-4 md:mb-8">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 md:h-14 md:w-14 md:rounded-2xl ${industry.accentIcon} group-hover:scale-110 group-hover:shadow-md`}
                  >
                    <IndustryIcon icon={industry.icon} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors duration-300 group-hover:text-[#2563EB] md:text-[11px]">
                    {industry.eyebrow}
                  </p>
                </div>

                <h3 className="font-serif text-2xl leading-[1.15] tracking-tight text-[#0A1628] md:text-[1.75rem] lg:text-[2rem]">
                  {industry.title}
                </h3>

                {/* MOBILE-HARDENING: mt-4→mt-3 for tighter stat row. md:mt-5 preserved. */}
                <div className="mt-3 flex items-baseline gap-2 md:mt-5">
                  <span className="text-xl font-bold tracking-tight text-[#0A1628] md:text-2xl">
                    {industry.stat}
                  </span>
                  <span className="text-xs text-slate-600 md:text-sm">
                    {industry.statLabel}
                  </span>
                </div>

                {/* MOBILE-HARDENING: mt-4→mt-3 for tighter pain point spacing. md:mt-5 preserved. */}
                <p className="mt-3 text-sm leading-relaxed text-slate-500 md:mt-5 md:text-[0.925rem]">
                  {industry.painPoint}
                </p>

                <div className="mt-4 border-t border-slate-100 pt-4 md:mt-7 md:pt-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 md:text-[10px]">
                    Best suited for
                  </p>
                  <div className="mt-2 text-xs font-medium text-slate-600 md:hidden">
                    {industry.fit.join(", ")}
                  </div>
                  <ul className="mt-3 hidden flex-wrap gap-2 md:flex" aria-label={`${industry.title} best fit`}>
                    {industry.fit.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors duration-200 group-hover:border-slate-300 group-hover:bg-white"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 hidden gap-3 rounded-2xl bg-slate-50/80 p-4 transition-colors duration-300 group-hover:bg-slate-50 md:flex md:mt-7 md:p-5">
                  <div
                    className="mt-0.5 h-full w-[3px] shrink-0 rounded-full"
                    style={{
                      background:
                        index === 0
                          ? "#3b82f6"
                          : index === 1
                          ? "#f59e0b"
                          : "#10b981",
                    }}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium leading-relaxed text-slate-700">
                    {industry.outcome}
                  </p>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-700 md:hidden">
                  {industry.outcome}
                </p>

                {/* MOBILE-HARDENING: pt-5→pt-4 for tighter CTA spacing. md:pt-8 preserved. */}
                <div className="mt-auto pt-4 md:pt-8">
                  <QuoteCTA
                    ctaId={`industry_${industrySlug}_discuss_project`}
                    serviceType={INDUSTRY_TO_SERVICE_TYPE[industrySlug]}
                    className="cta-primary inline-flex w-full items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] md:w-auto md:justify-start md:bg-transparent md:px-0 md:py-0 md:text-sm md:normal-case md:tracking-normal md:text-[#0A1628] md:shadow-none md:ring-0 md:hover:bg-transparent md:group-hover:gap-3 md:group-hover:text-[#2563EB]"
                  >
                    Discuss Your Project
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </QuoteCTA>
                  <div className="mt-3">
                    <Link href={`/industries/${industrySlug}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 hover:text-[#0A1628]">
                      View Industry Page
                    </Link>
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
