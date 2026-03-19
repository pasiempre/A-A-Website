import { trackConversionEvent } from "@/lib/analytics";

type QuoteSectionProps = {
  onOpenQuote: () => void;
};

export function QuoteSection({ onOpenQuote }: QuoteSectionProps) {
  return (
    <section id="quote" className="border-b border-slate-200 bg-white py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-3 font-serif text-4xl tracking-tight text-[#0A1628] md:text-6xl">Let’s Talk.</h2>
        <p className="mb-10 text-slate-500">Tell us about your project. We call back within the hour.</p>
        <div className="mx-auto flex max-w-xl flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="tel:5125550199"
            className="inline-flex h-12 items-center justify-center rounded-sm bg-[#0A1628] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2563EB]"
            onClick={() => {
              void trackConversionEvent({ eventName: "call_click", source: "quote_section" });
            }}
          >
            Call Now
          </a>
          <button
            type="button"
            onClick={onOpenQuote}
            className="h-12 rounded-sm border border-[#0A1628] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#0A1628] transition hover:bg-slate-50"
          >
            Open Quote Form
          </button>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.16em] text-slate-500">Licensed • Insured • Austin Metro</p>
      </div>
    </section>
  );
}
