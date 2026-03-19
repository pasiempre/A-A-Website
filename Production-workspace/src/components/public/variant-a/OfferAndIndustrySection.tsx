type IndustryBlock = {
  title: string;
  eyebrow: string;
  painPoint: string;
  outcome: string;
};

const industries: IndustryBlock[] = [
  {
    title: "General Contractors",
    eyebrow: "Walkthrough-ready closeouts",
    painPoint: "Punch-list pressure and inconsistent final-clean quality across trades can slow handoff.",
    outcome: "A&A helps tighten the final presentation with detail-focused cleaning and proof-of-completion support.",
  },
  {
    title: "Property Managers",
    eyebrow: "Faster turnover flow",
    painPoint: "Slow turns and inconsistent unit-ready standards make leasing and inspections harder than they should be.",
    outcome: "Projects move faster when units, common areas, and touchpoints are cleaned to a predictable standard.",
  },
  {
    title: "Commercial Spaces",
    eyebrow: "Clean without disruption",
    painPoint: "Office and operational teams need reliable cleaning that fits active business environments and deadlines.",
    outcome: "Flexible scheduling and standards-driven work help maintain a clean impression without unnecessary friction.",
  },
];

type OfferAndIndustrySectionProps = {
  onOpenQuote: () => void;
};

export function OfferAndIndustrySection({ onOpenQuote }: OfferAndIndustrySectionProps) {
  return (
    <section id="industries" className="scroll-mt-32 bg-white px-6 py-16 md:scroll-mt-36 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Who We Serve</p>
            <h2 className="mt-2 font-serif text-3xl uppercase tracking-tight text-[#0A1628] md:text-4xl">Built for Demanding Spaces</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              The work changes by project type. The standard does not. A&A supports closeout schedules, turnover pace, and polished day-to-day environments.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenQuote}
            className="w-fit rounded-md bg-[#0A1628] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#1E293B]"
          >
            Talk Through Your Scope
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {industries.map((industry) => (
            <article key={industry.title} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">{industry.eyebrow}</p>
                <h3 className="mt-3 font-serif text-2xl tracking-tight text-[#0A1628]">{industry.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{industry.painPoint}</p>
              </div>
              <div className="mt-8 rounded-xl bg-slate-50 p-5 ring-1 ring-inset ring-slate-900/5 transition-colors group-hover:bg-slate-100/80">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Why it works</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800">{industry.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
