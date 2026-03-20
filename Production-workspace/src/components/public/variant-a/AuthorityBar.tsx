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
  { target: 100, suffix: "%", label: "On-Time", detail: "handoff focus", icon: "timing" },
];

const staticStat = {
  title: "Licensed",
  subtitle: "& Insured",
  detail: "ready for commercial and site work",
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
    <div className="flex h-full flex-col items-center justify-center px-5 py-4 text-center">
      <div className="icon-tile mb-5">
        <MetricIcon icon={icon} />
      </div>
      <div className="mb-2 font-serif text-5xl tracking-tight text-[#0A1628] md:text-6xl lg:text-[5.25rem]" aria-label={`${target}${suffix} ${label}`}>
        <span aria-hidden="true">{value}</span>
        <span className="text-[#94A3B8]" aria-hidden="true">{suffix}</span>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-600">{label}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{detail}</div>
    </div>
  );
}

export function AuthorityBar() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.35);
  const startCounters = isVisible;

  return (
    <section ref={ref} aria-labelledby="authority-heading" className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(201,169,78,0.12),transparent_34%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="section-kicker">Track Record</p>
          <h2 id="authority-heading" className="mt-3 font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl">Our Numbers Speak</h2>
        </div>

        <div className="grid grid-cols-1 gap-y-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          <div className={dividerCellClass}>
            <AnimatedMetric {...animatedStats[0]} start={startCounters} />
          </div>
          <div className={dividerCellClass}>
            <AnimatedMetric {...animatedStats[1]} start={startCounters} />
          </div>

          <div className={`${dividerCellClass} flex flex-col items-center justify-center px-5 py-4 text-center`}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A94E]/30 bg-[#C9A94E]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1c]">
              Key credential
            </div>
            <div className="mb-3 font-serif text-[2.6rem] leading-[1.04] tracking-tight text-[#0A1628] md:text-[3.2rem]">
              {staticStat.title}
              <br />
              <span className="inline-block pt-1">{staticStat.subtitle}</span>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-600">Austin Standards</div>
            <div className="mt-3 max-w-[14rem] text-xs uppercase tracking-[0.16em] text-slate-500">{staticStat.detail}</div>
          </div>

          <div className="lg:px-6">
            <AnimatedMetric {...animatedStats[2]} start={startCounters} />
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <div className="surface-panel-soft inline-flex flex-wrap items-center justify-center gap-3 px-5 py-3 text-sm text-slate-600">
            <span className="text-base tracking-[0.22em] text-[#C9A94E]" aria-hidden="true">★★★★★</span>
            <span className="sr-only">Rated 5 out of 5 stars</span>
            <span className="font-light">Trusted across Austin-area job sites, office spaces, and turnover projects.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
