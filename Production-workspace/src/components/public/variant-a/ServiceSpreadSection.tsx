"use client";

import Image from "next/image";

import { QuoteCTA } from "./QuoteCTA";
import { useInViewOnce } from "./useInViewOnce";

type ServiceItem = {
  anchor: string;
  index: string;
  icon: "build" | "detail" | "office" | "turn" | "wash";
  titleLines: string[];
  packageLabel: string;
  description: string;
  responsePromise: string;
  proofLine: string;
  image: string;
  bullets: string[];
  reverse?: boolean;
};

const services: ServiceItem[] = [
  {
    anchor: "service-post-construction",
    index: "01",
    icon: "build",
    titleLines: ["Post-", "Construction", "Clean"],
    packageLabel: "Builder Turnover Package",
    description: "Rough and final clean for new construction projects. We handle debris, dust, and detail so spaces are move-in ready.",
    responsePromise: "Call-back target: under 1 hour during business hours",
    proofLine: "Licensed and insured, with schedules that match contractor timelines.",
    image: "/images/variant-a/service-spread-01.jpg",
    bullets: ["Multifamily buildings", "Commercial offices", "Schools & institutional"],
  },
  {
    anchor: "service-final-clean",
    index: "02",
    icon: "detail",
    titleLines: ["Final", "Clean"],
    packageLabel: "First + Second Final Package",
    description: "Detail-level cleaning for move-in readiness with first and second final workflows.",
    responsePromise: "Quote delivery target: same day after scope confirmation",
    proofLine: "Built for punch-list closeouts and final walkthroughs.",
    image: "/images/variant-a/service-spread-02.jpg",
    bullets: ["Hardwood floors & tiling", "Fixtures & appliances", "Complete dust removal"],
    reverse: true,
  },
  {
    anchor: "service-commercial",
    index: "03",
    icon: "office",
    titleLines: ["Commercial", "Cleaning"],
    packageLabel: "Recurring Site Care",
    description: "Ongoing and one-time cleaning for offices, retail spaces, and commercial facilities.",
    responsePromise: "Flexible scheduling for active business hours",
    proofLine: "Keeps active spaces clean without interrupting daily operations.",
    image: "/images/variant-a/service-spread-03.jpg",
    bullets: ["Office complexes", "Retail environments", "Regular maintenance"],
  },
  {
    anchor: "service-move",
    index: "04",
    icon: "turn",
    titleLines: ["Move-In", "Move-Out"],
    packageLabel: "Vacant Unit Turnover",
    description: "Vacant unit turnover cleaning for property managers with fast turnaround.",
    responsePromise: "Emergency same-day support available by request",
    proofLine: "Fast turnover support to help units pass inspection and lease quickly.",
    image: "/images/variant-a/service-spread-04.jpg",
    bullets: ["Apartment turns", "Deep sanitation", "Property management support"],
    reverse: true,
  },
  {
    anchor: "service-windows",
    index: "05",
    icon: "wash",
    titleLines: ["Windows &", "Power Wash"],
    packageLabel: "Exterior Detail Upgrade",
    description: "Interior/exterior window cleaning and power washing for polished final delivery.",
    responsePromise: "Scope + equipment quote sent after initial call",
    proofLine: "High-visibility exterior finish work for cleaner handoffs.",
    image: "/images/variant-a/service-spread-05.jpg",
    bullets: ["Exterior facades", "High-reach windows", "Concrete & walkways"],
  },
];

function ServiceIcon({ icon }: { icon: ServiceItem["icon"] }) {
  if (icon === "build") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M4 18h16M6.5 18V9.5L12 6l5.5 3.5V18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M10 18v-4h4v4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "detail") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="m6 16 3.5-9 1.6 4.2L15 13l3 7-4.2-1.3L11 22l-1.1-4-4.5-2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "office") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M5 20V5.5L12 4l7 1.5V20M9 8.5h.01M9 12h.01M9 15.5h.01M15 8.5h.01M15 12h.01M15 15.5h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "turn") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M7 10.5 12 6l5 4.5M8.5 9.5V18h7V9.5M4.5 13.5c0 3 2.6 5.5 5.8 5.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="m4.5 18 1.8 1.6L8 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M6 5h10l2 3v3H6V5Zm0 6h13l-2 8H8L6 11Zm4-6 2 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ServiceSpreadItem({ service }: { service: ServiceItem }) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.2);

  return (
    <article
      ref={ref}
      id={service.anchor}
      className={`group flex min-h-[60vh] flex-col overflow-hidden ${service.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <div
        className={`relative h-[40vh] w-full overflow-hidden transition duration-700 md:h-auto md:w-[56%] lg:w-[58%] ${
          isVisible ? "translate-x-0 opacity-100" : service.reverse ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0"
        }`}
      >
        <Image
          src={service.image}
          alt={`${service.titleLines.join(" ")} service example for ${service.packageLabel}`}
          fill
          quality={68}
          sizes="(max-width: 768px) 100vw, 58vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081120]/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-8 top-8 flex items-start justify-between">
          <ul className="flex gap-2" aria-label={`${service.titleLines.join(" ")} badges`}>
            <li className="info-chip-dark">{service.packageLabel}</li>
          </ul>
          <span className="rounded-full border border-white/20 bg-[#081120]/28 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {service.index}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-8 bottom-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-[#081120]/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#C9A94E]" aria-hidden="true" />
            {service.responsePromise}
          </div>
        </div>
      </div>
      <div
        className={`flex w-full items-center ${service.reverse ? "bg-[#FAFAF8]" : "bg-white"} transition duration-700 md:w-[44%] lg:w-[42%] ${
          isVisible ? "translate-x-0 opacity-100" : service.reverse ? "-translate-x-10 opacity-0" : "translate-x-10 opacity-0"
        }`}
      >
        <div className="relative max-w-xl p-10 md:p-12 lg:p-14 xl:p-20">
          <p
            className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2563EB] transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            {service.packageLabel}
          </p>
          <div
            className={`mb-5 flex items-center gap-4 transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
            style={{ transitionDelay: "40ms" }}
          >
            <span className="icon-tile">
              <ServiceIcon icon={service.icon} />
            </span>
            <span className="signal-line">{service.proofLine}</span>
          </div>
          <h2
            className={`mb-6 font-serif text-4xl uppercase leading-[1.05] tracking-tight text-[#0A1628] transition duration-700 md:text-5xl lg:text-5xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            {service.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p
            className={`mb-8 text-lg font-light leading-relaxed text-slate-600 transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            {service.description}
          </p>
          <ul
            className={`mb-8 space-y-3 text-slate-700 transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "240ms" }}
          >
            {service.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div
            className={`surface-panel-soft mb-8 overflow-hidden px-4 py-4 transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "320ms" }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{service.responsePromise}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {service.bullets.slice(0, 2).map((bullet) => (
                <span key={bullet} className="info-chip">
                  {bullet}
                </span>
              ))}
            </div>
          </div>

          <QuoteCTA
            className={`cta-outline-dark gap-3 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Quote This Service
            <span aria-hidden="true">→</span>
          </QuoteCTA>
        </div>
      </div>
    </article>
  );
}

export function ServiceSpreadSection() {
  return (
    <section id="services" aria-label="Services" className="scroll-mt-32 border-b border-slate-200 bg-white md:scroll-mt-36">
      {services.map((service) => (
        <ServiceSpreadItem key={service.anchor} service={service} />
      ))}
    </section>
  );
}
