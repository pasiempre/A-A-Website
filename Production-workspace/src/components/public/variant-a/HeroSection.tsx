"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";

type HeroSectionProps = {
  onOpenQuote: () => void;
};

type TrustIcon = "shield" | "clock" | "message";

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
    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-200">
      <TrustGlyph icon={icon} />
      <span>{label}</span>
    </div>
  );
}

export function HeroSection({ onOpenQuote }: HeroSectionProps) {
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
    <section id="main-content" className="relative min-h-[100svh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2700&auto=format&fit=crop"
        alt="Modern glass-walled office lobby"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={isVisible ? { animation: "heroKenBurns 15s ease-out forwards" } : undefined}
      />
      <div className="absolute inset-0 bg-[#0A1628]/34" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/92 via-[#0A1628]/42 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-6 pb-36 pt-28 text-center md:justify-end md:pb-32 md:pt-40">
        <div className="max-w-4xl">
          <p
            className="mb-5 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-100 opacity-0 backdrop-blur"
            style={fadeUp(220, 820)}
          >
            Austin Metro • Post-Construction • Commercial
          </p>

          <h1 className="font-serif text-[clamp(3.8rem,14vw,6.8rem)] leading-[0.94] tracking-tight text-white sm:text-[clamp(4.4rem,11vw,7.2rem)] md:text-[clamp(5rem,9vw,8rem)]">
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

          <div
            className="mt-10 flex w-full max-w-xl flex-col gap-4 opacity-0 sm:mx-auto sm:flex-row sm:justify-center"
            style={fadeUp(1640, 920)}
          >
            <button
              type="button"
              onClick={onOpenQuote}
              className="w-full rounded-md bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Request a Quote
            </button>
            <a
              href={`tel:${COMPANY_PHONE_E164}`}
              className="inline-flex w-full items-center justify-center rounded-md border border-white/30 bg-white/8 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-white hover:text-[#0A1628] sm:w-auto"
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

      <div className="absolute bottom-0 left-0 z-20 w-full border-t border-white/20 bg-[#07101d]/45 opacity-0 backdrop-blur-md" style={fadeUp(1760, 900)}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 py-4 md:justify-between">
          <TrustItem icon="shield" label="Licensed & Insured" />
          <div className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
          <TrustItem icon="clock" label="Response Within 1 Hour" />
          <div className="hidden h-1 w-1 rounded-full bg-white/25 md:block" />
          <TrustItem icon="message" label="Se Habla Espanol" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroKenBurns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
        }

        @keyframes heroBounceSubtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }

        .hero-bounce-subtle {
          animation: heroBounceSubtle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
