"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStat = {
  target: number;
  suffix: string;
  label: string;
};

const animatedStats: AnimatedStat[] = [
  { target: 15, suffix: "+", label: "Years" },
  { target: 500, suffix: "+", label: "Projects" },
  { target: 100, suffix: "%", label: "On-Time" },
];

const staticStat = {
  title: "Licensed",
  subtitle: "& Insured",
};

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      return;
    }

    let frame = 0;
    const totalFrames = 70;

    const interval = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - (1 - progress) * (1 - progress) * (1 - progress);
      setValue(Math.round(target * eased));

      if (progress >= 1) {
        window.clearInterval(interval);
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [start, target]);

  return value;
}

function AnimatedMetric({ target, suffix, label, start }: AnimatedStat & { start: boolean }) {
  const value = useCountUp(target, start);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-2 font-serif text-5xl tracking-tight text-[#0A1628] md:text-6xl lg:text-[5.25rem]">
        <span>{value}</span>
        <span className="text-[#94A3B8]">{suffix}</span>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">{label}</div>
    </div>
  );
}

export function AuthorityBar() {
  const [startCounters, setStartCounters] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        setStartCounters(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-slate-200 bg-[#FAFAF8] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 text-center md:grid-cols-4 md:gap-x-6">
          <AnimatedMetric {...animatedStats[0]} start={startCounters} />
          <AnimatedMetric {...animatedStats[1]} start={startCounters} />

          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 font-serif text-3xl leading-[0.95] tracking-tight text-[#0A1628] md:text-4xl lg:text-[3.75rem]">
              {staticStat.title}
              <br />
              {staticStat.subtitle}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">Austin Standards</div>
          </div>

          <AnimatedMetric {...animatedStats[2]} start={startCounters} />
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 shadow-sm">
            <span className="text-base tracking-[0.22em] text-[#C9A94E]">★★★★★</span>
            <span className="font-light">Trusted across Austin-area job sites, office spaces, and turnover projects.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
