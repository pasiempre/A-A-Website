"use client";

import { useEffect, useState } from "react";
import { AIQuoteAssistant } from "./AIQuoteAssistant";
import { AboutSection } from "./AboutSection";
import { AuthorityBar } from "./AuthorityBar";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { CareersSection } from "./CareersSection";
import { FloatingQuotePanel } from "./FloatingQuotePanel";
import { FooterSection } from "./FooterSection";
import { HeroSection } from "./HeroSection";
import { OfferAndIndustrySection } from "./OfferAndIndustrySection";
import { QuoteSection } from "./QuoteSection";
import { ServiceAreaSection } from "./ServiceAreaSection";
import { ServiceSpreadSection } from "./ServiceSpreadSection";
import { TestimonialSection } from "./TestimonialSection";
import { TimelineSection } from "./TimelineSection";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";

export function VariantAPublicPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 900);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isQuoteOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isQuoteOpen]);

  const openQuote = () => {
    void trackConversionEvent({ eventName: "quote_open_clicked", source: "public_page" });
    setIsQuoteOpen(true);
  };
  const closeQuote = () => setIsQuoteOpen(false);

  return (
    <main>
      <HeroSection onOpenQuote={openQuote} />
      <AuthorityBar />
      <ServiceSpreadSection onOpenQuote={openQuote} />
      <OfferAndIndustrySection onOpenQuote={openQuote} />
      <BeforeAfterSlider />
      <TestimonialSection />
      <TimelineSection />
      <AboutSection />
      <ServiceAreaSection />
      <QuoteSection onOpenQuote={openQuote} />
      <CareersSection />
      <FooterSection onOpenQuote={openQuote} />

      <FloatingQuotePanel isOpen={isQuoteOpen} onClose={closeQuote} />
      <AIQuoteAssistant />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-6 z-40 h-11 w-11 rounded-full bg-[#0A1628] text-white transition ${
          showBackToTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Back to top"
      >
        ↑
      </button>

      <div className="fixed bottom-0 left-0 z-40 flex w-full gap-3 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <a
          href={`tel:${COMPANY_PHONE_E164}`}
          onClick={() => {
            void trackConversionEvent({ eventName: "call_click", source: "mobile_sticky" });
          }}
          className="flex-1 rounded-sm border border-[#0A1628] py-3 text-center text-xs uppercase tracking-[0.18em] text-[#0A1628]"
        >
          Call
        </a>
        <button
          type="button"
          onClick={openQuote}
          className="flex-1 rounded-sm bg-[#0A1628] py-3 text-xs uppercase tracking-[0.18em] text-white"
        >
          Get a Quote
        </button>
      </div>
    </main>
  );
}
