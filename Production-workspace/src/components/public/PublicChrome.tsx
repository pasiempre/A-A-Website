"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";
import { FooterSection } from "./variant-a/FooterSection";
import { PublicHeader } from "./variant-a/PublicHeader";
import { QuoteContext } from "./variant-a/QuoteContext";

const FloatingQuotePanel = dynamic(
  () => import("./variant-a/FloatingQuotePanel").then((module) => module.FloatingQuotePanel),
  { ssr: false },
);
const AIQuoteAssistant = dynamic(
  () => import("./variant-a/AIQuoteAssistant").then((module) => module.AIQuoteAssistant),
  { ssr: false },
);
const ScrollToTopButton = dynamic(
  () => import("./variant-a/ScrollToTopButton").then((module) => module.ScrollToTopButton),
  { ssr: false },
);

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
      source: isHomePage ? "public_page" : "sub_page",
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
        className="fixed bottom-0 left-0 z-40 flex w-full gap-3 border-t border-slate-200/50 bg-white/95 px-4 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm md:hidden"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
        }}
      >
        <a
          href={`tel:${COMPANY_PHONE_E164}`}
          onClick={() => {
            void trackConversionEvent({
              eventName: "call_click",
              source: isHomePage ? "mobile_sticky" : "mobile_sticky_sub",
            });
          }}
          className="cta-outline-dark min-h-[48px] flex-1 py-3.5 text-center"
        >
          Call
        </a>
        <button
          type="button"
          onClick={openQuote}
          className="cta-primary min-h-[48px] flex-1 py-3.5 active:bg-[#1e293b]"
        >
          Get a Free Quote
        </button>
      </div>
    </QuoteContext.Provider>
  );
}