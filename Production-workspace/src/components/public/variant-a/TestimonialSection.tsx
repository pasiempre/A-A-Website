"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useInViewOnce } from "./useInViewOnce";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  tag: string;
  city: string;
  timeframe: string;
};

const testimonials: Testimonial[] = [
  {
    quote: "A&A Cleaning has been our go-to subcontractor for three years. Reliable, detail-oriented, and always on schedule.",
    name: "Marcus Torres",
    role: "Project Manager, Top-Tier Construction",
    initials: "MT",
    tag: "Post-Construction",
    city: "Austin Metro",
    timeframe: "Multi-year Partner",
  },
  {
    quote: "They fundamentally understand the demands of commercial builds. We don't worry when they're on the schedule.",
    name: "David Chen",
    role: "Site Superintendent, BuildCo Partners",
    initials: "DC",
    tag: "Commercial Build",
    city: "Round Rock",
    timeframe: "Repeat Work",
  },
  {
    quote: "From rough clean to final walk-through, their attention to detail is unmatched. The best sub we've worked with.",
    name: "Sarah Mitchell",
    role: "General Contractor, Mitchell & Associates",
    initials: "SM",
    tag: "Final Clean",
    city: "Georgetown",
    timeframe: "Walkthrough Ready",
  },
  {
    quote: "Fast turnaround, professional crew, zero punch list items. A&A sets the standard for construction cleaning.",
    name: "James Rodriguez",
    role: "Operations Director, Prestige Developments",
    initials: "JR",
    tag: "Turnover Support",
    city: "Austin",
    timeframe: "Tight Timeline",
  },
];

export function TestimonialSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.35);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [isTransitionVisible, setIsTransitionVisible] = useState(true);
  const transitionTimerRef = useRef<number | null>(null);

  const goToTestimonial = useCallback((nextIndex: number) => {
    if (nextIndex === active) {
      return;
    }

    if (isReducedMotion) {
      setActive(nextIndex);
      return;
    }

    setIsTransitionVisible(false);

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setActive(nextIndex);
      setIsTransitionVisible(true);
    }, 180);
  }, [active, isReducedMotion]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewportQuery = window.matchMedia("(max-width: 767px)");

    const updateMotion = () => setIsReducedMotion(motionQuery.matches);
    const updateViewport = () => setIsCompactViewport(viewportQuery.matches);

    updateMotion();
    updateViewport();

    motionQuery.addEventListener("change", updateMotion);
    viewportQuery.addEventListener("change", updateViewport);

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      viewportQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || hasStarted) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActive(0);
      setHasStarted(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [hasStarted, isVisible]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted || paused || isReducedMotion || isCompactViewport) {
      return;
    }

    const timer = window.setInterval(() => {
      goToTestimonial((active + 1) % testimonials.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [active, goToTestimonial, hasStarted, isCompactViewport, isReducedMotion, paused]);

  const visibleIndex = hasStarted ? active : 0;
  const testimonial = testimonials[visibleIndex];

  return (
    <section
      ref={ref}
      id="testimonial-section"
      className="relative overflow-hidden bg-[#0A1628] py-24 text-center text-white md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,169,78,0.14),transparent_34%)]" />

      <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col items-center justify-center px-6">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="section-kicker !text-slate-300">Client Feedback</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-white md:text-5xl">What Clients Say</h2>
        </div>

        <div
          key={testimonial.name}
          className={`relative z-10 w-full max-w-5xl px-6 text-center transition-all duration-300 ${isTransitionVisible ? "translate-x-0 scale-100 opacity-100" : "translate-x-2 scale-95 opacity-0"}`}
        >
          <div className="dark-surface-panel max-w-5xl px-8 py-12 md:px-14 md:py-14">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                {testimonial.tag}
              </span>
            </div>

            <blockquote className="mx-auto max-w-4xl border-l-[3px] border-[#C9A94E] pl-6 text-left font-serif text-2xl leading-[1.35] tracking-tight text-white md:text-4xl">
              <span className="block transition duration-700">{testimonial.quote}</span>
            </blockquote>

            <div className="mt-10 flex items-center justify-center gap-4 transition duration-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A94E]/30 bg-[#1a2a44] font-serif text-base text-[#C9A94E]">
                {testimonial.initials}
              </div>
              <div className="text-left">
                <p className="text-base font-light text-slate-100">{testimonial.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">{testimonial.role} — {testimonial.city}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 flex w-full max-w-xl items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goToTestimonial((active - 1 + testimonials.length) % testimonials.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`View testimonial ${idx + 1}`}
              onClick={() => goToTestimonial(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${idx === visibleIndex ? "w-12 bg-[#C9A94E]" : "w-2 bg-slate-600 hover:bg-slate-400"}`}
            />
          ))}

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goToTestimonial((active + 1) % testimonials.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
