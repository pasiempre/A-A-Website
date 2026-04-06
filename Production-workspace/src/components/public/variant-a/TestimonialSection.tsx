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

  /* MOBILE-ELEVATION: C-3 — track touch start position for swipe gesture detection */
  const touchStartX = useRef(0);

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
      className="relative overflow-hidden bg-[#0A1628] py-12 text-center text-white md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,169,78,0.14),transparent_34%)]" />

      <div className="relative mx-auto flex min-h-0 max-w-6xl flex-col items-center justify-center px-6 md:min-h-[420px]">
        {/* MOBILE-HARDENING: mb-8→mb-6 for tighter heading block. md:mb-12 preserved. */}
        <div className="mb-6 flex flex-col items-center text-center md:mb-12">
          <p className="section-kicker !text-slate-300">Verified Results</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight text-white md:text-5xl">Trusted by Austin&apos;s Toughest Projects</h2>
        </div>

        {/* MOBILE-ELEVATION: C-3 — swipe gesture support for carousel navigation.
            Tracks touchstart X and compares to touchend X. >50px delta triggers slide change.
            This is the single most expected mobile interaction pattern for card carousels. */}
        <div
          key={testimonial.name}
          className={`relative z-10 w-full max-w-5xl px-0 text-center transition-all duration-300 md:px-6 ${isTransitionVisible ? "translate-x-0 scale-100 opacity-100" : "translate-x-2 scale-95 opacity-0"}`}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              touchStartX.current = e.touches[0].clientX;
            }
          }}
          onTouchEnd={(e) => {
            if (e.changedTouches[0]) {
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(delta) > 50) {
                if (delta > 0) {
                  goToTestimonial((active - 1 + testimonials.length) % testimonials.length);
                } else {
                  goToTestimonial((active + 1) % testimonials.length);
                }
              }
            }
          }}
        >
          <div className="dark-surface-panel max-w-5xl px-5 py-6 md:px-14 md:py-14">
            {/* MOBILE-HARDENING: mb-4→mb-3 for tighter tag badge spacing. md:mb-8 preserved. */}
            {/* MOBILE-ELEVATION: H-5 — star rating added for instant visual trust signal before reading quote text */}
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:mb-8">
              <span className="text-sm tracking-[0.22em] text-[#C9A94E]" aria-hidden="true">★★★★★</span>
              <span className="sr-only">Rated 5 out of 5 stars</span>
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                {testimonial.tag}
              </span>
            </div>

            <blockquote className="mx-auto max-w-4xl border-l-[3px] border-[#C9A94E] pl-4 text-left font-serif text-lg leading-[1.4] tracking-tight text-white md:pl-6 md:text-4xl md:leading-[1.35]">
              <span className="block transition duration-700">{testimonial.quote}</span>
            </blockquote>

            {/* MOBILE-HARDENING: mt-6→mt-5 for tighter attribution spacing. md:mt-10 preserved. */}
            <div className="mt-5 flex items-center justify-center gap-3 transition duration-700 md:mt-10 md:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A94E]/30 bg-[#1a2a44] font-serif text-sm text-[#C9A94E] md:h-12 md:w-12 md:text-base">
                {testimonial.initials}
              </div>
              <div className="text-left">
                {/* MOBILE-ELEVATION: P-9 — font-normal on mobile for legibility, font-light on md+ */}
                <p className="text-sm font-normal text-slate-100 md:font-light md:text-base">{testimonial.name}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-normal text-slate-400 md:mt-1 md:text-[10px] md:tracking-[0.24em]">{testimonial.role} — {testimonial.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE-HARDENING: mt-6→mt-5 for tighter nav dots spacing. md:mt-10 preserved. */}
        {/* MOBILE-ELEVATION: MF-1 — arrow buttons h-8→h-11 (44px), dot buttons wrapped with
            h-11 padding for 44px touch target while visual dot stays small.
            Gap reduced from gap-4 to gap-2 to compensate for larger button hit areas. */}
        <div className="relative z-10 mt-5 flex w-full max-w-xl items-center justify-center gap-2 md:mt-10 md:gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goToTestimonial((active - 1 + testimonials.length) % testimonials.length)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-white/30 hover:text-white"
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
              className="group flex h-11 items-center justify-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-500 ${
                  idx === visibleIndex ? "w-12 bg-[#C9A94E]" : "w-2 bg-slate-600 group-hover:bg-slate-400"
                }`}
              />
            </button>
          ))}

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goToTestimonial((active + 1) % testimonials.length)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-white/30 hover:text-white"
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
