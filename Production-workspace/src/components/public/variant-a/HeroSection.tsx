import Image from "next/image";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";

type HeroSectionProps = {
  onOpenQuote: () => void;
};

export function HeroSection({ onOpenQuote }: HeroSectionProps) {
  return (
    <section id="main-content" className="relative min-h-[90vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2700&auto=format&fit=crop"
        alt="Modern glass-walled office lobby"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#0A1628]/55" />
      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-end px-6 pb-24 text-center md:pb-32">
        <h1 className="mb-6 font-serif text-5xl leading-[1] tracking-tight text-white md:text-7xl lg:text-8xl">
          Every Surface.
          <br />
          Every Detail.
          <br />
          <span className="italic text-slate-200">Every Time.</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg font-light text-slate-100">
          Post-construction & commercial cleaning across the Austin metro area.
        </p>
        <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href={`tel:${COMPANY_PHONE_E164}`}
            className="order-1 inline-flex h-12 items-center justify-center rounded-sm bg-white px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#0A1628] transition hover:bg-slate-100 sm:order-none"
            onClick={() => {
              void trackConversionEvent({ eventName: "call_click", source: "hero" });
            }}
          >
            Call Now: {COMPANY_PHONE}
          </a>
          <button
            type="button"
            onClick={onOpenQuote}
            className="order-2 h-12 rounded-sm border border-white/50 px-8 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#0A1628] sm:order-none"
          >
            Request a Quote
          </button>
        </div>
      </div>
    </section>
  );
}
