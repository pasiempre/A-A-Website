"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    quote: "A&A Cleaning has been our go-to subcontractor for three years. Reliable, detail-oriented, and always on schedule.",
    author: "Marcus Torres • Top-Tier Construction",
  },
  {
    quote: "They understand commercial build pressure. We don’t worry when they’re on the schedule.",
    author: "David Chen • BuildCo Partners",
  },
  {
    quote: "Fast turnaround, professional crew, zero punch list surprises.",
    author: "James Rodriguez • Prestige Developments",
  },
];

export function TestimonialSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="testimonial-section"
      className="bg-[#0A1628] py-28 text-center text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-6 text-7xl font-serif text-[#C9A94E]">“</p>
        <blockquote className="mx-auto mb-6 max-w-4xl font-serif text-3xl italic leading-tight md:text-5xl">
          {testimonials[active].quote}
        </blockquote>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{testimonials[active].author}</p>
        <div className="mt-8 flex justify-center gap-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`View testimonial ${idx + 1}`}
              onClick={() => setActive(idx)}
              className={`h-2 w-2 rounded-full transition ${idx === active ? "scale-125 bg-[#C9A94E]" : "bg-slate-500"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
