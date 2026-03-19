"use client";

import Image from "next/image";

import { useInViewOnce } from "./useInViewOnce";

type ServiceSpreadSectionProps = {
  onOpenQuote: () => void;
};

type ServiceItem = {
  anchor: string;
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
    titleLines: ["Post-", "Construction", "Clean"],
    packageLabel: "Builder Turnover Package",
    description: "Rough and final clean for new construction projects. We handle debris, dust, and detail so spaces are move-in ready.",
    responsePromise: "Call-back target: under 1 hour during business hours",
    proofLine: "Licensed, insured, and built for GC timelines.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2662&auto=format&fit=crop",
    bullets: ["Multifamily buildings", "Commercial offices", "Schools & institutional"],
  },
  {
    anchor: "service-final-clean",
    titleLines: ["Final", "Clean"],
    packageLabel: "First + Second Final Package",
    description: "Detail-level cleaning for move-in readiness with first and second final workflows.",
    responsePromise: "Quote delivery target: same day after scope confirmation",
    proofLine: "Designed around punch-list closeout quality.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2670&auto=format&fit=crop",
    bullets: ["Hardwood floors & tiling", "Fixtures & appliances", "Complete dust removal"],
    reverse: true,
  },
  {
    anchor: "service-commercial",
    titleLines: ["Commercial", "Cleaning"],
    packageLabel: "Recurring Site Care",
    description: "Ongoing and one-time cleaning for offices, retail spaces, and commercial facilities.",
    responsePromise: "Flexible scheduling for active business hours",
    proofLine: "Operational continuity with clean-ready standards.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2669&auto=format&fit=crop",
    bullets: ["Office complexes", "Retail environments", "Regular maintenance"],
  },
  {
    anchor: "service-move",
    titleLines: ["Move-In", "Move-Out"],
    packageLabel: "Vacant Unit Turnover",
    description: "Vacant unit turnover cleaning for property managers with fast turnaround.",
    responsePromise: "Emergency same-day support available by request",
    proofLine: "Built for leasing velocity and inspection readiness.",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=2670&auto=format&fit=crop",
    bullets: ["Apartment turns", "Deep sanitation", "Property management support"],
    reverse: true,
  },
  {
    anchor: "service-windows",
    titleLines: ["Windows &", "Power Wash"],
    packageLabel: "Exterior Detail Upgrade",
    description: "Interior/exterior window cleaning and power washing for polished final delivery.",
    responsePromise: "Scope + equipment quote sent after initial call",
    proofLine: "High-visibility finish work for handoff quality.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop",
    bullets: ["Exterior facades", "High-reach windows", "Concrete & walkways"],
  },
];

function ServiceSpreadItem({ onOpenQuote, service }: { onOpenQuote: () => void; service: ServiceItem }) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });

  return (
    <article
      ref={ref}
      id={service.anchor}
      className={`group flex min-h-[60vh] flex-col overflow-hidden ${service.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <div
        className={`relative h-[40vh] w-full overflow-hidden transition duration-1000 md:h-auto md:w-[56%] lg:w-[58%] ${
          isVisible ? "translate-x-0 opacity-100" : service.reverse ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0"
        }`}
      >
        <Image
          src={service.image}
          alt={service.titleLines.join(" ")}
          fill
          sizes="(max-width: 768px) 100vw, 58vw"
          className="object-cover transition duration-[1400ms] group-hover:scale-[1.03]"
        />
      </div>
      <div
        className={`flex w-full items-center ${service.reverse ? "bg-[#FAFAF8]" : "bg-white"} transition duration-1000 md:w-[44%] lg:w-[42%] ${
          isVisible ? "translate-x-0 opacity-100" : service.reverse ? "-translate-x-10 opacity-0" : "translate-x-10 opacity-0"
        }`}
      >
        <div className="max-w-xl p-10 md:p-12 lg:p-14 xl:p-20">
          <p
            className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2563EB] transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            {service.packageLabel}
          </p>
          <h2
            className={`mb-6 font-serif text-4xl uppercase leading-[1.05] tracking-tight text-[#0A1628] transition duration-700 md:text-5xl lg:text-6xl ${
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
            className={`mb-8 rounded-sm border border-slate-200 bg-[#FAFAF8] px-4 py-4 transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "320ms" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{service.responsePromise}</p>
            <p className="mt-2 text-xs text-slate-600">{service.proofLine}</p>
          </div>

          <button
            type="button"
            onClick={onOpenQuote}
            className={`inline-flex items-center gap-3 border-b border-[#0A1628] pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#0A1628] transition duration-300 hover:gap-4 hover:text-[#2563EB] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Get a Quote
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function ServiceSpreadSection({ onOpenQuote }: ServiceSpreadSectionProps) {
  return (
    <section id="services" className="scroll-mt-32 border-b border-slate-200 bg-white md:scroll-mt-36">
      {services.map((service) => (
        <ServiceSpreadItem key={service.anchor} onOpenQuote={onOpenQuote} service={service} />
      ))}
    </section>
  );
}
