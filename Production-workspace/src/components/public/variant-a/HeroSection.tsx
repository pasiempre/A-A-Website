"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { QuoteCTA } from "./QuoteCTA";

type TrustIcon = "shield" | "clock" | "message";

const SERVICE_SIGNALS = ["Final Clean", "Turnovers"];

function TrustGlyph({ icon }: { icon: TrustIcon }) {
  if (icon === "shield") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-slate-400">
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
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-slate-400">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7.5v5l3 1.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-slate-400">
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
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-100 md:backdrop-blur-md">
      <TrustGlyph icon={icon} />
      <span>{label}</span>
    </div>
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 220);
    return () => window.clearTimeout(timer);
  }, []);

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
    <section id="hero" aria-labelledby="hero-heading" className="relative min-h-[100svh] overflow-hidden">
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-6 pb-36 pt-28 text-center md:justify-end md:pb-32 md:pt-40">
        <div className="max-w-4xl">
          <p
            className="mb-5 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-100 opacity-0 md:backdrop-blur"
            style={fadeUp(220, 820)}
          >
            Austin Metro • Post-Construction • Commercial
          </p>

          <h1 id="hero-heading" className="font-serif text-[clamp(3.8rem,14vw,6.8rem)] leading-[0.94] tracking-tight text-white sm:text-[clamp(4.4rem,11vw,7.2rem)] md:text-[clamp(5rem,9vw,8rem)]">
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

          <p
            className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-slate-100 opacity-0 md:text-lg"
            style={fadeUp(1420, 900)}
          >
            Post-construction & commercial cleaning across the Austin metro area.
          </p>

          <ul
            className="mt-5 flex flex-wrap items-center justify-center gap-2 opacity-0"
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
            className="mt-10 flex w-full max-w-xl flex-col gap-4 opacity-0 sm:mx-auto sm:flex-row sm:justify-center"
            style={fadeUp(1640, 920)}
          >
            <QuoteCTA className="cta-primary min-h-[48px] w-full bg-white px-8 py-4 text-[#0A1628] hover:bg-slate-100 sm:w-auto">
              Get a Free Quote
            </QuoteCTA>
            <a
              href={`tel:${COMPANY_PHONE_E164}`}
              className="cta-light min-h-[48px] w-full px-8 py-4 sm:w-auto"
              onClick={() => {
                void trackConversionEvent({ eventName: "call_click", source: "hero" });
              }}
            >
              Call Now: {COMPANY_PHONE}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[72px] left-1/2 z-30 hidden -translate-x-1/2 opacity-0 sm:block" style={fadeUp(1860, 900)}>
        <div className="hero-bounce-subtle flex flex-col items-center gap-1 text-white/55">
          <span className="text-[8px] font-medium uppercase tracking-[0.3em]">Scroll</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
            <path d="m5.5 7.5 4.5 5 4.5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-20 w-full border-t border-white/20 bg-[#07101d]/45 opacity-0 md:backdrop-blur-md" style={fadeUp(1760, 900)}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6 py-4 md:justify-between md:gap-4">
          <TrustItem icon="shield" label="Licensed & Insured" />
          <TrustItem icon="clock" label="Response Within 1 Hour" />
          <TrustItem icon="message" label="Se Habla Español" />
        </div>
      </div>

    </section>
  );
}
