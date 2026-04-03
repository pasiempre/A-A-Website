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

function SectionSkeleton() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-white" aria-hidden="true">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
    </div>
  );
}

const BeforeAfterSlider = dynamic(
  () => import("./BeforeAfterSlider").then((module) => module.BeforeAfterSlider),
  { loading: () => <SectionSkeleton /> },
);
const TestimonialSection = dynamic(
  () => import("./TestimonialSection").then((module) => module.TestimonialSection),
  { loading: () => <SectionSkeleton /> },
);
const QuoteSection = dynamic(
  () => import("./QuoteSection").then((module) => module.QuoteSection),
  { loading: () => <SectionSkeleton /> },
);
const ExitIntentOverlay = dynamic(
  () => import("./ExitIntentOverlay").then((module) => module.ExitIntentOverlay),
  { ssr: false },
);

const INCLUDED_SUMMARY_ITEMS = [
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
] as const;

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
  return (
    /* MOBILE-HARDENING: Tightened section padding and compact grid gap */
    <section className="border-b border-slate-200 bg-white px-6 py-6 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">What&apos;s Included</p>
        <h2 className="mt-2 max-w-xl font-serif text-2xl tracking-tight text-[#0A1628] md:mt-3 md:text-4xl">A clear process from first call to final clean.</h2>
        <div className="mt-5 grid gap-3 md:mt-10 md:gap-5 md:grid-cols-3">
          {INCLUDED_SUMMARY_ITEMS.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-6">
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 md:mt-2.5">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
