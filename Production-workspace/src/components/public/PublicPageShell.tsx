"use client";

import { useEffect, useRef, useState } from "react";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";
import { AIQuoteAssistant } from "./variant-a/AIQuoteAssistant";
import { FloatingQuotePanel } from "./variant-a/FloatingQuotePanel";
import { FooterSection } from "./variant-a/FooterSection";
import { PublicHeader } from "./variant-a/PublicHeader";
import { QuoteContext } from "./variant-a/QuoteContext";
import { ScrollToTopButton } from "./variant-a/ScrollToTopButton";

export function PublicPageShell({ children }: { children: React.ReactNode }) {
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
    void trackConversionEvent({
      eventName: "quote_open_clicked",
      source: "sub_page",
    });
    setIsQuoteOpen(true);
  };

  const closeQuote = () => setIsQuoteOpen(false);

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      <div ref={mainRef}>
        <PublicHeader />
        <div className="pb-24 md:pb-0">
          {children}
          <FooterSection />
        </div>
      </div>

      <ErrorBoundary>
        <FloatingQuotePanel isOpen={isQuoteOpen} onClose={closeQuote} />
      </ErrorBoundary>
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
            void trackConversionEvent({
              eventName: "call_click",
              source: "mobile_sticky_sub",
            });
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
