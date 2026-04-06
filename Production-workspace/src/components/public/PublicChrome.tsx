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
import type { QuoteOpenContext } from "./variant-a/QuoteContext";
import { CTAButton } from "./variant-a/CTAButton";

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
  const [quoteOpenContext, setQuoteOpenContext] = useState<QuoteOpenContext | undefined>();
  const mainRef = useRef<HTMLDivElement | null>(null);

  /* MOBILE-ELEVATION: H-8 — sticky bar hidden until user scrolls past hero (~80vh).
     Prevents CTA stacking on the first viewport where hero CTAs are already visible.
     Bar slides up via translate-y transition once scroll intent is demonstrated. */
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage || !mainRef.current || typeof window === "undefined") {
      return;
    }

    const getViewport = () => (window.innerWidth < 768 ? "mobile" : "desktop");
    const slugify = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const mainElement = mainRef.current.querySelector("main");
    const allSections = Array.from((mainElement ?? mainRef.current).querySelectorAll("section"));
    const sectionIndexMap = new Map<Element, number>();
    allSections.forEach((section, index) => sectionIndexMap.set(section, index + 1));

    const resolveSectionId = (section: Element) => {
      const htmlSection = section as HTMLElement;
      if (htmlSection.id) {
        return htmlSection.id;
      }

      const labelledBy = htmlSection.getAttribute("aria-labelledby");
      if (labelledBy) {
        return labelledBy.replace(/-heading$/, "");
      }

      const ariaLabel = htmlSection.getAttribute("aria-label");
      if (ariaLabel) {
        return slugify(ariaLabel);
      }

      const dataSectionId = htmlSection.getAttribute("data-section-id");
      if (dataSectionId) {
        return dataSectionId;
      }

      return `section_${sectionIndexMap.get(section) ?? 0}`;
    };

    const visibleSince = new Map<Element, number>();
    const threshold = 0.25;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const now = Date.now();

        for (const entry of entries) {
          const sectionId = resolveSectionId(entry.target);
          const shouldBeVisible = entry.isIntersecting && entry.intersectionRatio >= threshold;

          if (shouldBeVisible && !visibleSince.has(entry.target)) {
            visibleSince.set(entry.target, now);
            void trackConversionEvent({
              eventName: "section_view",
              metadata: {
                section_id: sectionId,
                viewport: getViewport(),
                action: "enter",
                time_in_view_ms: 0,
              },
            });
          }

          if (!shouldBeVisible && visibleSince.has(entry.target)) {
            const startedAt = visibleSince.get(entry.target) ?? now;
            visibleSince.delete(entry.target);

            void trackConversionEvent({
              eventName: "section_view",
              metadata: {
                section_id: sectionId,
                viewport: getViewport(),
                action: "exit",
                time_in_view_ms: Math.max(now - startedAt, 0),
              },
            });
          }
        }
      },
      {
        threshold: [0, threshold, 1],
      },
    );

    allSections.forEach((section) => sectionObserver.observe(section));

    const milestones = [25, 50, 75, 100] as const;
    const firedMilestones = new Set<number>();

    const trackDepth = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScrollable = documentHeight - viewportHeight;

      const depth =
        maxScrollable <= 0
          ? 100
          : Math.min((window.scrollY / maxScrollable) * 100, 100);

      milestones.forEach((milestone) => {
        if (depth >= milestone && !firedMilestones.has(milestone)) {
          firedMilestones.add(milestone);
          void trackConversionEvent({
            eventName: "scroll_depth",
            metadata: {
              depth: milestone,
              viewport: getViewport(),
            },
          });
        }
      });
    };

    window.addEventListener("scroll", trackDepth, { passive: true });
    trackDepth();

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", trackDepth);

      const now = Date.now();
      visibleSince.forEach((startedAt, section) => {
        void trackConversionEvent({
          eventName: "section_view",
          metadata: {
            section_id: resolveSectionId(section),
            viewport: getViewport(),
            action: "exit",
            time_in_view_ms: Math.max(now - startedAt, 0),
          },
        });
      });
    };
  }, [isHomePage]);

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

  const openQuote = (context?: QuoteOpenContext) => {
    setQuoteOpenContext(context);
    void trackConversionEvent({
      eventName: "quote_open_clicked",
      source: isHomePage ? "public_page" : "sub_page",
      metadata: {
        service_type: context?.serviceType,
        source_cta: context?.sourceCta,
      },
    });
    setIsQuoteOpen(true);
  };

  const closeQuote = () => {
    setIsQuoteOpen(false);
    setQuoteOpenContext(undefined);
  };

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
        <FloatingQuotePanel
          isOpen={isQuoteOpen}
          onClose={closeQuote}
          initialServiceType={quoteOpenContext?.serviceType}
        />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <AIQuoteAssistant />
      </ErrorBoundary>
      <ScrollToTopButton />

      {/* MOBILE-ELEVATION: MF-5 — sticky bar hidden when quote panel is open (isQuoteOpen).
          Prevents tappable bar behind the z-50 FloatingQuotePanel.
          H-8 — bar hidden until user scrolls past hero (showStickyBar).
          Combined: bar only visible when scrolled AND panel closed. */}
      <div
        className={`floating-widget fixed bottom-0 left-0 z-[30] flex w-full gap-3 border-t border-slate-200/50 bg-white/95 px-4 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-transform duration-300 md:hidden ${
          showStickyBar && !isQuoteOpen
            ? "translate-y-0"
            : "translate-y-full"
        }`}
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
        }}
      >
        <CTAButton
          ctaId={isHomePage ? "mobile_sticky_call" : "mobile_sticky_call_sub"}
          actionType="call"
          href={`tel:${COMPANY_PHONE_E164}`}
          className="cta-outline-dark min-h-[48px] flex-1 whitespace-nowrap px-4 py-3.5 text-center tracking-[0.14em]"
        >
          Call
        </CTAButton>
        <CTAButton
          ctaId={isHomePage ? "mobile_sticky_quote" : "mobile_sticky_quote_sub"}
          actionType="quote"
          className="cta-primary min-h-[48px] flex-1 whitespace-nowrap px-4 py-3.5 tracking-[0.14em] active:bg-[#1e293b]"
        >
          Free Quote
        </CTAButton>
      </div>
    </QuoteContext.Provider>
  );
}