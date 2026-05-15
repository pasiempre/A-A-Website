"use client";

import { useEffect, useState } from "react";

import { useInViewOnce } from "./useInViewOnce";

type AnimatedStat = {
  target: number;
  suffix: string;
  label: string;
  detail: string;
  icon: "years" | "projects" | "timing";
};

const animatedStats: AnimatedStat[] = [
  { target: 15, suffix: "+", label: "Years", detail: "field experience", icon: "years" },
  { target: 500, suffix: "+", label: "Projects", detail: "spaces delivered", icon: "projects" },
  { target: 100, suffix: "%", label: "On-Time", detail: "handoff rate", icon: "timing" },
];

const staticStat = {
  title: "Licensed",
  subtitle: "& Insured",
  detail: "fully credentialed for commercial sites",
};

const dividerCellClass = "relative lg:px-6 lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-24 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-slate-200";

function MetricIcon({ icon }: { icon: AnimatedStat["icon"] }) {
  if (icon === "years") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M12 5v7l4 2.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "projects") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M5 19.5V7l7-2 7 2v12.5H5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M9 10.5h6M9 14h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M6.5 12.5 10 16l7.5-8.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => setValue(target));
      return () => window.cancelAnimationFrame(frame);
    }

    let animationFrame = 0;
    const startTime = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress) * (1 - progress);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [start, target]);

  return value;
}

function AnimatedMetric({ target, suffix, label, detail, icon, start }: AnimatedStat & { start: boolean }) {
  const value = useCountUp(target, start);

  return (
    /* MOBILE-HARDENING: py-3→py-2 for tighter stat cells on mobile. md:py-4 preserved. */
    <div className="flex h-full flex-col items-center justify-center px-2 py-2 text-center md:px-5 md:py-4">
      <div className="icon-tile mb-3 hidden md:flex md:mb-5">
        <MetricIcon icon={icon} />
      </div>
      <div className="mb-1 font-serif text-2xl tracking-tight text-[#0A1628] md:mb-2 md:text-6xl lg:text-[5.25rem]" aria-label={`${target}${suffix} ${label}`}>
        <span aria-hidden="true">{value}</span>
        <span className="text-[#94A3B8]" aria-hidden="true">{suffix}</span>
      </div>
      <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-slate-600 md:text-[10px]">{label}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500 md:mt-2 md:text-xs">{detail}</div>
    </div>
  );
}

export function AuthorityBar() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.35);
  const startCounters = isVisible;

  return (
    <section ref={ref} aria-labelledby="authority-heading" className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] py-8 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(201,169,78,0.12),transparent_34%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        {/* MOBILE-HARDENING: mb-6→mb-4 for tighter heading spacing. md:mb-10 preserved. */}
        <div className="mb-4 text-center md:mb-10">
          <p className="section-kicker">The A&A Standard</p>
          <h2 id="authority-heading" className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628] md:mt-3 md:text-5xl">15+ Years. 500+ Spaces. Austin&apos;s Standard.</h2>
        </div>

        {/* MOBILE-HARDENING: gap-y-4→gap-y-2 for tighter grid rows on mobile. Desktop is single row (4 cols) so gap-y irrelevant. */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-center md:grid-cols-4 md:gap-y-0">
          <div className={dividerCellClass}>
            <AnimatedMetric {...animatedStats[0]} start={startCounters} />
          </div>
          <div className={dividerCellClass}>
            <AnimatedMetric {...animatedStats[1]} start={startCounters} />
          </div>

          {/* MOBILE-HARDENING: py-3→py-2 matching AnimatedMetric cells. md:py-4 preserved. */}
          {/* MOBILE-ELEVATION: P-4 — entrance animation with 600ms delay so Licensed & Insured
              fades in after the two animated counters finish. Eliminates the visual "dead spot"
              where neighboring cells animate but this one sits static. */}
          <div
            className={`${dividerCellClass} flex flex-col items-center justify-center px-2 py-2 text-center transition duration-700 md:px-5 md:py-4 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
          >
            <div className="mb-2 hidden items-center gap-2 rounded-full border border-[#C9A94E]/30 bg-[#C9A94E]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1c] md:inline-flex md:mb-5">
              Key credential
            </div>
            <div className="mb-1 font-serif text-xl leading-[1.04] tracking-tight text-[#0A1628] md:mb-3 md:text-[3.2rem]">
              {staticStat.title}
              <span className="md:hidden"> {staticStat.subtitle}</span>
              <br className="hidden md:block" />
              <span className="hidden md:inline-block pt-1">{staticStat.subtitle}</span>
            </div>
            <div className="mt-1 max-w-[14rem] text-[10px] uppercase tracking-[0.16em] text-slate-500 md:mt-3 md:text-xs">{staticStat.detail}</div>
          </div>

          <div className="lg:px-6">
            <AnimatedMetric {...animatedStats[2]} start={startCounters} />
          </div>
        </div>

        {/* MOBILE-HARDENING: mt-6→mt-4, pt-5→pt-4 for tighter bottom trust bar. md:mt-12 md:pt-8 preserved. */}
        <div className="mt-4 border-t border-slate-200 pt-4 text-center md:mt-12 md:pt-8">
          <div className="surface-panel-soft inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 text-xs text-slate-600 md:gap-3 md:px-5 md:py-3 md:text-sm">
            <span className="text-sm tracking-[0.22em] text-[#C9A94E] md:text-base" aria-hidden="true">★★★★★</span>
            <span className="sr-only">Rated 5 out of 5 stars</span>
            <span className="font-light">Rated 5 stars by Austin-area clients and project teams</span>
          </div>
        </div>
      </div>
    </section>
  );
}
