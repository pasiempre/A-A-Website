"use client";

import { useState } from "react";

import { QuoteCTA } from "./QuoteCTA";
import { useInViewOnce } from "./useInViewOnce";

type IndustryBlock = {
  title: string;
  eyebrow: string;
  painPoint: string;
  outcome: string;
  fit: string[];
  stat: string;
  statLabel: string;
  accent: string;
  accentIcon: string;
  accentBorder: string;
  accentGlow: string;
  icon: "contractor" | "property" | "office";
};

const industries: IndustryBlock[] = [
  {
    title: "General Contractors",
    eyebrow: "Walkthrough-Ready Closeouts",
    painPoint:
      "Punch-list pressure and inconsistent final-clean quality across trades can slow handoff.",
    outcome:
      "A&A helps tighten the final presentation with detail-focused cleaning and proof-of-completion support.",
    fit: ["Final Walkthroughs", "Multi-Trade Closeouts", "Schedule-Sensitive Turnovers"],
    stat: "200+",
    statLabel: "closeouts completed on schedule",
    accent: "from-blue-50/80 via-blue-100/40 to-transparent",
    accentIcon: "bg-blue-100 text-blue-600 ring-blue-200/60",
    accentBorder: "border-blue-200/60",
    accentGlow: "group-hover:shadow-blue-100/50",
    icon: "contractor",
  },
  {
    title: "Property Managers",
    eyebrow: "Faster Turnover Flow",
    painPoint:
      "Slow turns and inconsistent unit-ready standards make leasing and inspections harder than they should be.",
    outcome:
      "Projects move faster when units, common areas, and touchpoints are cleaned to a predictable standard.",
    fit: ["Vacant Unit Turns", "Common Areas", "Leasing-Ready Presentation"],
    stat: "48hr",
    statLabel: "average turnaround time",
    accent: "from-amber-50/80 via-amber-100/40 to-transparent",
    accentIcon: "bg-amber-100 text-amber-600 ring-amber-200/60",
    accentBorder: "border-amber-200/60",
    accentGlow: "group-hover:shadow-amber-100/50",
    icon: "property",
  },
  {
    title: "Commercial Spaces",
    eyebrow: "Clean Without Disruption",
    painPoint:
      "Office and operational teams need reliable cleaning that fits active business environments and deadlines.",
    outcome:
      "Flexible scheduling and standards-driven work help maintain a clean impression without unnecessary friction.",
    fit: ["Off-Hours Service", "Active Facilities", "Polished Daily Environments"],
    stat: "15+",
    statLabel: "active facilities served weekly",
    accent: "from-emerald-50/80 via-emerald-100/40 to-transparent",
    accentIcon: "bg-emerald-100 text-emerald-600 ring-emerald-200/60",
    accentBorder: "border-emerald-200/60",
    accentGlow: "group-hover:shadow-emerald-100/50",
    icon: "office",
  },
];

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
      className="relative scroll-mt-32 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-white px-6 py-24 md:scroll-mt-36 md:px-10 md:py-32 lg:px-16"
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
          className={`mb-16 transition-all duration-700 ease-out md:mb-20 ${
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
                className="mt-4 font-serif text-4xl tracking-tight text-[#0A1628] sm:text-5xl lg:text-[3.25rem]"
              >
                Built for Demanding Spaces
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
                The work changes by project type. The standard does&nbsp;not. A&A supports closeout schedules, turnover pace, and polished day&#8209;to&#8209;day environments.
              </p>
            </div>

            <QuoteCTA className="cta-primary group/btn flex w-fit items-center gap-2.5 whitespace-nowrap">
              Talk Through Your Scope
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </QuoteCTA>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {industries.map((industry, index) => (
            <article
              key={industry.title}
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
                className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-b ${industry.accent} transition-opacity duration-500 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-70"
                }`}
                aria-hidden="true"
              />

              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${industry.accent.replace("to-transparent", "to-transparent")} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
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

              <div className="relative flex flex-1 flex-col p-8 lg:p-9">
                <div className="mb-8 flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 transition-all duration-300 ${industry.accentIcon} group-hover:scale-110 group-hover:shadow-md`}
                  >
                    <IndustryIcon icon={industry.icon} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors duration-300 group-hover:text-[#2563EB]">
                    {industry.eyebrow}
                  </p>
                </div>

                <h3 className="font-serif text-[1.75rem] leading-[1.15] tracking-tight text-[#0A1628] lg:text-[2rem]">
                  {industry.title}
                </h3>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-[#0A1628]">
                    {industry.stat}
                  </span>
                  <span className="text-sm text-slate-600">
                    {industry.statLabel}
                  </span>
                </div>

                <p className="mt-5 text-[0.925rem] leading-relaxed text-slate-500">
                  {industry.painPoint}
                </p>

                <div className="mt-7 border-t border-slate-100 pt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Best suited for
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${industry.title} best fit`}>
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

                <div className="mt-7 flex gap-3 rounded-2xl bg-slate-50/80 p-5 transition-colors duration-300 group-hover:bg-slate-50">
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

                <div className="mt-auto pt-8">
                  <QuoteCTA className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] transition-all duration-300 group-hover:gap-3 group-hover:text-[#2563EB]">
                    Discuss Your Project
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </QuoteCTA>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
