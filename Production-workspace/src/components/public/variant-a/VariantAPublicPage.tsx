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
import { PublicHeader } from "./PublicHeader";
import { QuoteSection } from "./QuoteSection";
import { ServiceAreaSection } from "./ServiceAreaSection";
import { ServiceSpreadSection } from "./ServiceSpreadSection";
import { TestimonialSection } from "./TestimonialSection";
import { TimelineSection } from "./TimelineSection";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";

export function VariantAPublicPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

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
      <PublicHeader onOpenQuote={openQuote} />
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

      <div
        className="fixed bottom-0 left-0 z-40 flex w-full gap-3 border-t border-slate-200/50 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        <a
          href={`tel:${COMPANY_PHONE_E164}`}
          onClick={() => {
            void trackConversionEvent({ eventName: "call_click", source: "mobile_sticky" });
          }}
          className="flex-1 rounded-md border border-slate-300 bg-white py-3.5 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-sm transition active:bg-slate-50"
        >
          Call
        </a>
        <button
          type="button"
          onClick={openQuote}
          className="flex-1 rounded-md bg-[#0A1628] py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition active:bg-[#1e293b]"
        >
          Get a Quote
        </button>
      </div>
    </main>
  );
}
