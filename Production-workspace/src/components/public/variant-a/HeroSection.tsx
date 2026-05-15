"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { QuoteCTA } from "./QuoteCTA";
import { CTAButton } from "./CTAButton";

type TrustIcon = "shield" | "clock" | "message";

const SERVICE_SIGNALS = ["Final Clean", "Turnovers"];

function getInitialHeroVariant() {
  if (typeof window === "undefined") {
    // Keep SSR and first client paint aligned to avoid hydration mismatches.
    return true;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const queryVariant = searchParams.get("hero");

  if (queryVariant === "compact" || queryVariant === "75") {
    window.localStorage.setItem("hero_mobile_variant_v2", "compact");
    return true;
  }

  if (queryVariant === "default" || queryVariant === "100") {
    window.localStorage.setItem("hero_mobile_variant_v2", "default");
    return false;
  }

  const storedVariant = window.localStorage.getItem("hero_mobile_variant_v2");
  if (storedVariant === "compact") {
    return true;
  }
  if (storedVariant === "default") {
    return false;
  }

  // Default new visitors to compact hero height on mobile.
  return true;
}

function TrustGlyph({ icon }: { icon: TrustIcon }) {
  if (icon === "shield") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-slate-400 md:h-4 md:w-4">
        <path
          d="M12 3 5 6v5c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path d="m9.5 12 1.8 1.8 3.2-3.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "clock") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-slate-400 md:h-4 md:w-4">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7.5v5l3 1.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-slate-400 md:h-4 md:w-4">
      <path
        d="M7.5 8.5h9m-9 4h5M6 18.5l1.4-2.8a8 8 0 1 1 2.1 1.3L6 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TrustItem({ icon, label }: { icon: TrustIcon; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-200 md:gap-3 md:rounded-full md:border md:border-white/10 md:bg-white/6 md:px-4 md:py-2 md:text-[11px] md:tracking-[0.18em] md:text-slate-100 md:backdrop-blur-md">
      <TrustGlyph icon={icon} />
      <span>{label}</span>
    </div>
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompactMobileHero] = useState(getInitialHeroVariant);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 220);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    void trackConversionEvent({
      eventName: "hero_variant_applied",
      metadata: {
        variant: isCompactMobileHero ? "compact_75svh" : "default_100svh",
      },
    });
  }, [isCompactMobileHero]);

  const fadeUp = (delay: number, duration = 900) =>
    isVisible
      ? {
          animationName: "heroFadeUp",
          animationDuration: `${duration}ms`,
          animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          animationFillMode: "forwards",
          animationDelay: `${delay}ms`,
        }
      : undefined;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className={`relative overflow-hidden ${isCompactMobileHero ? "min-h-[75svh] md:min-h-[100svh]" : "min-h-[100svh]"}`}
    >
      <Image
        src="/images/variant-a/hero.jpg"
        alt="Modern glass-walled office lobby"
        fill
        priority
        quality={68}
        sizes="100vw"
        className="object-cover"
        style={isVisible ? { animation: "heroKenBurns 15s ease-out forwards" } : undefined}
      />
      <div className="absolute inset-0 bg-[#0A1628]/34" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/92 via-[#0A1628]/42 to-transparent" aria-hidden="true" />

      {/* MOBILE-HARDENING: justify-center on mobile eliminates dead space above content.
          pb-8 pt-16 on mobile (trust bar is now inline, less clearance needed).
          Desktop md:justify-end md:pb-32 md:pt-40 preserved exactly. */}
      <div className={`relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 pb-8 pt-16 text-center md:justify-end md:pb-32 md:pt-40 ${isCompactMobileHero ? "min-h-[75svh] md:min-h-[100svh]" : "min-h-[100svh]"}`}>
        <div className="max-w-4xl">
          {/* MOBILE-HARDENING: Badge hidden on mobile — text wraps inside rounded-full pill at 375px.
              Desktop md:inline-flex preserved. opacity-0 + fadeUp animation still works on md+. */}
          <p
            className="hidden rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-slate-100 opacity-0 md:mb-5 md:inline-flex md:px-4 md:py-2 md:text-[10px] md:backdrop-blur"
            style={fadeUp(220, 820)}
          >
            Austin Metro • Post-Construction • Commercial
          </p>

          <h1 id="hero-heading" className="font-serif text-[clamp(2.6rem,10vw,4rem)] leading-[0.94] tracking-tight text-white sm:text-[clamp(3.4rem,11vw,6rem)] md:text-[clamp(5rem,9vw,8rem)]">
            {[
              { text: "Every Surface.", delay: 760 },
              { text: "Every Detail.", delay: 980 },
              { text: "Every Time.", delay: 1200, italic: true },
            ].map((line) => (
              <span
                key={line.text}
                className={`block opacity-0 ${line.italic ? "italic text-slate-300" : ""}`}
                style={fadeUp(line.delay, 880)}
              >
                {line.text}
              </span>
            ))}
          </h1>

          {/* MOBILE-ELEVATION: P-9 — font-normal on mobile for legibility, font-light on md+ */}
          <p
            className="mx-auto mt-3 max-w-2xl text-[15px] font-normal leading-relaxed text-slate-100 opacity-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] md:mt-6 md:font-light md:text-lg"
            style={fadeUp(1420, 900)}
          >
            Post-construction & commercial cleaning across the Austin metro area.
          </p>

          {/* MOBILE-HARDENING: Service chips hidden on mobile — redundant with subtitle.
              Desktop md:flex preserved. opacity-0 + fadeUp animation still works on md+. */}
          <ul
            className="hidden flex-wrap items-center justify-center gap-2 opacity-0 md:mt-5 md:flex"
            style={fadeUp(1520, 900)}
            aria-label="Service highlights"
          >
            {SERVICE_SIGNALS.map((signal) => (
              <li key={signal} className="info-chip-dark">
                {signal}
              </li>
            ))}
          </ul>

          <div
            id="hero-primary-cta"
            className="mt-5 flex w-full max-w-xl flex-col gap-3 opacity-0 sm:mx-auto sm:flex-row sm:justify-center md:mt-10 md:gap-4"
            style={fadeUp(1640, 920)}
          >
            <QuoteCTA 
              ctaId="hero_get_quote_primary"
              className="cta-primary min-h-[48px] w-full bg-white px-8 py-3.5 text-[#0A1628] hover:bg-slate-100 sm:w-auto md:py-4"
            >
              Get a Free Quote
            </QuoteCTA>
            {/* MOBILE-ELEVATION: P-3 — Hero Call Now button uses explicit glassmorphism instead of cta-light.
                Changes: border-white/30→/40, bg-opacity-10→bg-white/15, shadow-sm→shadow-lg shadow-black/10,
                backdrop-blur→backdrop-blur-md. Ensures visibility regardless of hero image brightness. */}
            <CTAButton
              ctaId="hero_call_now_secondary"
              actionType="call"
              href={`tel:${COMPANY_PHONE_E164}`}
              className="min-h-[48px] w-full rounded-md border border-white/40 bg-white/15 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-black/10 backdrop-blur-md hover:bg-white hover:text-[#0A1628] hover:-translate-y-0.5 sm:w-auto md:py-4"
            >
              Call Now: {COMPANY_PHONE}
            </CTAButton>
          </div>

          {/* MOBILE-HARDENING: Inline trust bar for mobile only.
              Replaces absolute-positioned version that was getting cut off below fold.
              Shorter labels to fit 320px–375px widths. Hidden on md+ where absolute version takes over. */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 opacity-0 md:hidden"
            style={fadeUp(1760, 900)}
          >
            <TrustItem icon="shield" label="Licensed & Insured" />
            <TrustItem icon="clock" label="1-Hr Response" />
            <TrustItem icon="message" label="Habla Español" />
          </div>
        </div>
      </div>

      {/* MOBILE-HARDENING: Absolute trust bar now desktop-only (hidden md:block).
          On mobile, inline version above handles trust signals in the content flow. */}
      <div className="absolute bottom-0 left-0 z-20 hidden w-full border-t border-white/20 bg-[#07101d]/45 opacity-0 md:block md:backdrop-blur-md" style={fadeUp(1760, 900)}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <TrustItem icon="shield" label="Licensed & Insured" />
          <TrustItem icon="clock" label="Response Within 1 Hour" />
          <TrustItem icon="message" label="Se Habla Español" />
        </div>
      </div>
    </section>
  );
}
