"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { AboutSection } from "./AboutSection";
import { AuthorityBar } from "./AuthorityBar";
import { CTAButton } from "./CTAButton";
import { HeroSection } from "./HeroSection";
import { OfferAndIndustrySection } from "./OfferAndIndustrySection";
import { useQuoteAction } from "./QuoteContext";
import { QuoteCTA } from "./QuoteCTA";
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

export function VariantAPublicPage() {
  const openQuote = useQuoteAction();

  return (
    <>
      <main>
        <HeroSection />
        <AuthorityBar />
        <ServiceSpreadSection />
        <OfferAndIndustrySection />
        <TimelineSection />
        <ErrorBoundary>
          <BeforeAfterSlider />
        </ErrorBoundary>
        <ErrorBoundary>
          <TestimonialSection />
        </ErrorBoundary>
        <AboutSection />
        <ServiceAreaSection />
        <div id="quote-request" className="scroll-mt-32 md:scroll-mt-36" aria-hidden="true" />
        <MobileQuoteCloser />
        <ErrorBoundary>
          <div className="hidden md:block">
            <QuoteSection />
          </div>
        </ErrorBoundary>
      </main>
      <ExitIntentOverlay onOpenQuote={openQuote} />
    </>
  );
}

function MobileQuoteCloser() {
  return (
    <section id="quote-closer" className="border-b border-slate-200 bg-white px-6 py-10 md:hidden">
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Final Step</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#0A1628]">Let&apos;s Talk About Your Project</h2>

        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          <li>Quote within 24 hours</li>
          <li>No-obligation walkthrough available</li>
          <li>Bilingual crew coordination</li>
        </ul>

        <div id="mobile-quote-closer-cta" className="mt-6 flex flex-col gap-3">
          <QuoteCTA ctaId="mobile_quote_closer_primary" className="cta-primary min-h-[48px] w-full">
            Get Your Free Quote
          </QuoteCTA>
          <CTAButton
            ctaId="mobile_quote_closer_call"
            actionType="call"
            href={`tel:${COMPANY_PHONE_E164}`}
            className="cta-outline-dark min-h-[48px] w-full"
          >
            Or call directly: {COMPANY_PHONE}
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
