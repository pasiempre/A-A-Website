"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AboutSection } from "./AboutSection";
import { AuthorityBar } from "./AuthorityBar";
import { CareersSection } from "./CareersSection";
import { FooterSection } from "./FooterSection";
import { HeroSection } from "./HeroSection";
import { OfferAndIndustrySection } from "./OfferAndIndustrySection";
import { PublicHeader } from "./PublicHeader";
import { QuoteContext } from "./QuoteContext";
import { ServiceAreaSection } from "./ServiceAreaSection";
import { ServiceSpreadSection } from "./ServiceSpreadSection";
import { TimelineSection } from "./TimelineSection";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";

const BeforeAfterSlider = dynamic(
  () => import("./BeforeAfterSlider").then((module) => module.BeforeAfterSlider),
);
const TestimonialSection = dynamic(
  () => import("./TestimonialSection").then((module) => module.TestimonialSection),
);
const QuoteSection = dynamic(() => import("./QuoteSection").then((module) => module.QuoteSection));
const FloatingQuotePanel = dynamic(
  () => import("./FloatingQuotePanel").then((module) => module.FloatingQuotePanel),
  { ssr: false },
);
const ExitIntentOverlay = dynamic(
  () => import("./ExitIntentOverlay").then((module) => module.ExitIntentOverlay),
  { ssr: false },
);
const AIQuoteAssistant = dynamic(
  () => import("./AIQuoteAssistant").then((module) => module.AIQuoteAssistant),
  { ssr: false },
);
const ScrollToTopButton = dynamic(
  () => import("./ScrollToTopButton").then((module) => module.ScrollToTopButton),
  { ssr: false },
);

export function VariantAPublicPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mainElement = mainRef.current;

    document.body.style.overflow = isQuoteOpen ? "hidden" : "";

    if (mainElement) {
      if (isQuoteOpen) {
        mainElement.setAttribute("inert", "");
      } else {
        mainElement.removeAttribute("inert");
      }
    }

    return () => {
      document.body.style.overflow = "";
      mainElement?.removeAttribute("inert");
    };
  }, [isQuoteOpen]);

  const openQuote = () => {
    void trackConversionEvent({ eventName: "quote_open_clicked", source: "public_page" });
    setIsQuoteOpen(true);
  };
  const closeQuote = () => setIsQuoteOpen(false);

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      <div ref={mainRef}>
        <main className="pb-24 md:pb-0">
          <PublicHeader />
          <HeroSection />
          <AuthorityBar />
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
          <FooterSection />
        </main>
      </div>

      <ErrorBoundary>
        <FloatingQuotePanel isOpen={isQuoteOpen} onClose={closeQuote} />
      </ErrorBoundary>
      <ExitIntentOverlay onOpenQuote={openQuote} />
      <ErrorBoundary fallback={null}>
        <AIQuoteAssistant />
      </ErrorBoundary>
      <ScrollToTopButton />

      <div
        className="fixed bottom-0 left-0 z-40 flex w-full gap-3 border-t border-slate-200/50 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        <a
          href={`tel:${COMPANY_PHONE_E164}`}
          onClick={() => {
            void trackConversionEvent({ eventName: "call_click", source: "mobile_sticky" });
          }}
          className="cta-outline-dark flex-1 py-3.5 text-center"
        >
          Call
        </a>
        <button
          type="button"
          onClick={openQuote}
          className="cta-primary flex-1 py-3.5 active:bg-[#1e293b]"
        >
          Free Quote
        </button>
      </div>
    </QuoteContext.Provider>
  );
}
