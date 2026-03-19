"use client";

import { useEffect, useState } from "react";

import { useInViewOnce } from "./useInViewOnce";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote: "A&A Cleaning has been our go-to subcontractor for three years. Reliable, detail-oriented, and always on schedule.",
    name: "Marcus Torres",
    role: "Project Manager, Top-Tier Construction",
    initials: "MT",
  },
  {
    quote: "They fundamentally understand the demands of commercial builds. We don't worry when they're on the schedule.",
    name: "David Chen",
    role: "Site Superintendent, BuildCo Partners",
    initials: "DC",
  },
  {
    quote: "From rough clean to final walk-through, their attention to detail is unmatched. The best sub we've worked with.",
    name: "Sarah Mitchell",
    role: "General Contractor, Mitchell & Associates",
    initials: "SM",
  },
  {
    quote: "Fast turnaround, professional crew, zero punch list items. A&A sets the standard for construction cleaning.",
    name: "James Rodriguez",
    role: "Operations Director, Prestige Developments",
    initials: "JR",
  },
];

export function TestimonialSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.35 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

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
    if (!hasStarted || paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [hasStarted, paused]);

  return (
    <section
      ref={ref}
      id="testimonial-section"
      className="relative overflow-hidden bg-[#0A1628] py-32 text-center text-white md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative mx-auto flex min-h-[420px] max-w-5xl flex-col items-center justify-center px-6">
        {testimonials.map((testimonial, idx) => {
          const isActive = hasStarted && idx === active;

          return (
            <div
              key={testimonial.name}
              aria-hidden={!isActive}
              className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-1000 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="mb-8 select-none font-serif text-8xl leading-none text-[#C9A94E]">“</p>

              <blockquote className="max-w-4xl font-serif text-3xl leading-[1.3] tracking-tight md:text-5xl">
                {testimonial.quote.split(" ").map((word, index) => (
                  <span
                    key={`${idx}-${word}-${index}`}
                    className={`inline-block transition duration-500 ${
                      isActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: isActive ? `${index * 40}ms` : "0ms" }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </blockquote>

              <div
                className={`mt-10 flex flex-col items-center transition duration-1000 ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: isActive ? "520ms" : "0ms" }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A94E]/40 bg-white/5 font-serif text-base text-[#C9A94E]">
                  {testimonial.initials}
                </div>
                <p className="text-sm font-light text-slate-200">{testimonial.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">{testimonial.role}</p>
              </div>
            </div>
          );
        })}

        <div className="min-h-[420px]" />

        <div className="relative z-10 mt-10 flex justify-center gap-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`View testimonial ${idx + 1}`}
              onClick={() => setActive(idx)}
              className={`h-2 w-2 rounded-full transition ${hasStarted && idx === active ? "scale-125 bg-[#C9A94E]" : "bg-slate-600 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
