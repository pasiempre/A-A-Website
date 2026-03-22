"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AboutSection } from "./AboutSection";
import { AuthorityBar } from "./AuthorityBar";
import { CareersSection } from "./CareersSection";
import { HeroSection } from "./HeroSection";
import { OfferAndIndustrySection } from "./OfferAndIndustrySection";
import { useQuoteAction } from "./QuoteContext";
import { ServiceAreaSection } from "./ServiceAreaSection";
import { ServiceSpreadSection } from "./ServiceSpreadSection";
import { TimelineSection } from "./TimelineSection";

const BeforeAfterSlider = dynamic(
  () => import("./BeforeAfterSlider").then((module) => module.BeforeAfterSlider),
);
const TestimonialSection = dynamic(
  () => import("./TestimonialSection").then((module) => module.TestimonialSection),
);
const QuoteSection = dynamic(() => import("./QuoteSection").then((module) => module.QuoteSection));
const ExitIntentOverlay = dynamic(
  () => import("./ExitIntentOverlay").then((module) => module.ExitIntentOverlay),
  { ssr: false },
);

export function VariantAPublicPage() {
  const openQuote = useQuoteAction();

  return (
    <>
      <main>
        <HeroSection />
        <AuthorityBar />
        <IncludedSummarySection />
        <ServiceSpreadSection />
        <OfferAndIndustrySection />
        <ErrorBoundary>
          <BeforeAfterSlider />
        </ErrorBoundary>
        <ErrorBoundary>
          <TestimonialSection />
        </ErrorBoundary>
        <TimelineSection />
        <AboutSection />
        <ServiceAreaSection />
        <ErrorBoundary>
          <QuoteSection />
        </ErrorBoundary>
        <CareersSection />
      </main>
      <ExitIntentOverlay onOpenQuote={openQuote} />
    </>
  );
}

function IncludedSummarySection() {
  const summaryItems = [
    {
      title: "Scope-Driven Planning",
      description: "We align crew, service type, and schedule before work starts.",
    },
    {
      title: "Detail-Level Delivery",
      description: "From rough clean to final walkthrough readiness, every phase is covered.",
    },
    {
      title: "Fast Communication",
      description: "Direct response and bilingual coordination with your team.",
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-white px-6 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">What&apos;s Included</p>
        <h2 className="mt-3 max-w-xl font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">A clear process from first call to final clean.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {summaryItems.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
