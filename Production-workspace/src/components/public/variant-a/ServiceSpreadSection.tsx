import Image from "next/image";

type ServiceSpreadSectionProps = {
  onOpenQuote: () => void;
};

type ServiceItem = {
  anchor: string;
  title: string;
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
    title: "Post-Construction Clean",
    packageLabel: "Builder Turnover Package",
    description: "Rough and final clean for new construction projects. We handle debris, dust, and detail so spaces are move-in ready.",
    responsePromise: "Call-back target: under 1 hour during business hours",
    proofLine: "Licensed, insured, and built for GC timelines.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2662&auto=format&fit=crop",
    bullets: ["Multifamily buildings", "Commercial offices", "Schools & institutional"],
  },
  {
    anchor: "service-final-clean",
    title: "Final Clean",
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
    title: "Commercial Cleaning",
    packageLabel: "Recurring Site Care",
    description: "Ongoing and one-time cleaning for offices, retail spaces, and commercial facilities.",
    responsePromise: "Flexible scheduling for active business hours",
    proofLine: "Operational continuity with clean-ready standards.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2669&auto=format&fit=crop",
    bullets: ["Office complexes", "Retail environments", "Regular maintenance"],
  },
  {
    anchor: "service-move",
    title: "Move-In / Move-Out",
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
    title: "Windows & Power Wash",
    packageLabel: "Exterior Detail Upgrade",
    description: "Interior/exterior window cleaning and power washing for polished final delivery.",
    responsePromise: "Scope + equipment quote sent after initial call",
    proofLine: "High-visibility finish work for handoff quality.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop",
    bullets: ["Exterior facades", "High-reach windows", "Concrete & walkways"],
  },
];

export function ServiceSpreadSection({ onOpenQuote }: ServiceSpreadSectionProps) {
  return (
    <section id="services" className="border-b border-slate-200 bg-white">
      {services.map((service) => (
        <article
          key={service.title}
          id={service.anchor}
          className={`flex min-h-[56vh] flex-col ${service.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
        >
          <div className="relative h-[36vh] w-full md:h-auto md:w-[56%] lg:w-[58%]">
            <Image src={service.image} alt={service.title} fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover" />
          </div>
          <div className="flex w-full items-center bg-[#FAFAF8] md:w-[44%] lg:w-[42%]">
            <div className="max-w-xl p-8 md:p-12 lg:p-14 xl:p-20">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2563EB]">{service.packageLabel}</p>
              <h2 className="mb-5 font-serif text-3xl uppercase leading-[1.1] tracking-tight text-[#0A1628] md:text-4xl lg:text-5xl">
                {service.title}
              </h2>
              <p className="mb-6 text-lg font-light text-slate-600">{service.description}</p>
              <ul className="mb-8 space-y-2 text-slate-700">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" /> {bullet}
                  </li>
                ))}
              </ul>

              <div className="mb-8 rounded-sm border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{service.responsePromise}</p>
                <p className="mt-1 text-xs text-slate-600">{service.proofLine}</p>
              </div>

              <button
                type="button"
                onClick={onOpenQuote}
                className="border-b border-[#0A1628] pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#0A1628] transition hover:text-[#2563EB]"
              >
                Get a Quote for This Service
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
