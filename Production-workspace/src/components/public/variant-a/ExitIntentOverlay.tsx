"use client";

import { useEffect, useRef, useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";

type ExitIntentOverlayProps = {
  onOpenQuote: () => void;
};

export function ExitIntentOverlay({ onOpenQuote }: ExitIntentOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hasShownRef = useRef(false);
  const hasScrolledRef = useRef(false);
  const timeOnPageRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      timeOnPageRef.current = Date.now() - startTime;
    }, 1000);

    const handleScroll = () => {
      if (window.scrollY > 600) {
        hasScrolledRef.current = true;
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (hasShownRef.current) {
        return;
      }

      if (event.clientY > 5) {
        return;
      }

      if (timeOnPageRef.current < 10_000 || !hasScrolledRef.current) {
        return;
      }

      if (document.body.style.overflow === "hidden") {
        return;
      }

      if (sessionStorage.getItem("aa_exit_intent_shown")) {
        return;
      }

      hasShownRef.current = true;
      sessionStorage.setItem("aa_exit_intent_shown", "1");
      setIsVisible(true);

      void trackConversionEvent({
        eventName: "exit_intent_shown",
        source: "exit_intent_overlay",
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    void trackConversionEvent({
      eventName: "exit_intent_dismissed",
      source: "exit_intent_overlay",
    });
  };

  const acceptOffer = () => {
    setIsVisible(false);
    onOpenQuote();
    void trackConversionEvent({
      eventName: "exit_intent_accepted",
      source: "exit_intent_overlay",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0A1628]/50 p-6 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dismiss();
        }
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-heading"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#C9A94E] via-[#2563EB] to-[#C9A94E]" aria-hidden="true" />

        <div className="px-8 pb-8 pt-7">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-4 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A94E]/10 text-[#C9A94E]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5v5l3 1.8" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A94E]">Before you go</p>
            </div>
          </div>

          <h2 id="exit-intent-heading" className="text-2xl tracking-tight text-[#0A1628] md:text-3xl">
            Get your free quote in under a minute
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Tell us about your project — we respond within one hour during business hours with a clear scope and estimate. No obligation.
          </p>

          <ul className="mt-5 space-y-2">
            {[
              "Response within 1 hour",
              "No obligation or hidden fees",
              "Serving the full Austin metro",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[#C9A94E]">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <button type="button" onClick={acceptOffer} className="cta-primary w-full py-4">
              Get My Free Quote
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs font-medium text-slate-400 transition hover:text-slate-600"
            >
              No thanks, I&apos;ll come back later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
