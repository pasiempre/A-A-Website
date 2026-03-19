type OfferTier = {
  title: string;
  bestFor: string;
  response: string;
  includes: string[];
};

type IndustryBlock = {
  title: string;
  painPoint: string;
  outcome: string;
};

const tiers: OfferTier[] = [
  {
    title: "Standard",
    bestFor: "Routine project closeout and recurring maintenance",
    response: "Scheduling confirmation target: same day",
    includes: [
      "Scope-aligned cleaning crew",
      "Completion photo upload",
      "Issue reporting with notes",
      "Basic completion summary",
    ],
  },
  {
    title: "Priority Turnaround",
    bestFor: "Compressed construction timelines and urgent handoffs",
    response: "Callback target: within 1 hour during business hours",
    includes: [
      "Priority dispatch sequencing",
      "Enhanced QA checklist workflow",
      "Escalation-ready issue visibility",
      "Completion report with checklist + photos",
    ],
  },
  {
    title: "Enterprise / Portfolio",
    bestFor: "Multi-site property portfolios and recurring GC programs",
    response: "Dedicated operating cadence and recurring review rhythm",
    includes: [
      "Portfolio-level service planning",
      "Standardized checklist templates",
      "Operational message threads by job",
      "Client-ready reporting structure",
    ],
  },
];

const industries: IndustryBlock[] = [
  {
    title: "General Contractors",
    painPoint: "Punch-list pressure and inconsistent final-clean quality across trades.",
    outcome: "Delivery-ready closeouts with documented completion records before walkthrough.",
  },
  {
    title: "Property Managers",
    painPoint: "Slow unit turns and unclear cleaning handoff communication.",
    outcome: "Faster turnover velocity with proof-of-completion photos and checklist traceability.",
  },
  {
    title: "Office Operations",
    painPoint: "Cleaning interruptions that disrupt active business hours.",
    outcome: "Flexible scheduling and consistent standards that protect daily operations.",
  },
];

type OfferAndIndustrySectionProps = {
  onOpenQuote: () => void;
};

export function OfferAndIndustrySection({ onOpenQuote }: OfferAndIndustrySectionProps) {
  return (
    <section className="bg-white px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Service Packages</p>
            <h2 className="mt-2 font-serif text-3xl uppercase tracking-tight text-[#0A1628] md:text-4xl">Choose the Right Delivery Tier</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
              Built for construction pace, property turnover, and operational continuity with clear scope ownership.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenQuote}
            className="w-fit rounded-sm bg-[#0A1628] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#2563EB]"
          >
            Get a Package Quote
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.title} className="rounded border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-serif text-2xl uppercase tracking-tight text-[#0A1628]">{tier.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-700">Best for: {tier.bestFor}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-[#2563EB]">{tier.response}</p>
              <ul className="mt-4 space-y-1 text-sm text-slate-700">
                {tier.includes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Who We Serve</p>
          <h3 className="mt-2 font-serif text-3xl uppercase tracking-tight text-[#0A1628] md:text-4xl">Industry-Focused Execution</h3>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {industries.map((industry) => (
              <article key={industry.title} className="rounded border border-slate-200 bg-white p-5">
                <h4 className="text-lg font-semibold text-[#0A1628]">{industry.title}</h4>
                <p className="mt-2 text-sm text-slate-600">Pain point: {industry.painPoint}</p>
                <p className="mt-2 text-sm font-medium text-slate-800">Outcome: {industry.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}