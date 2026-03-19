"use client";

import Link from "next/link";

import { useInViewOnce } from "./useInViewOnce";

export function CareersSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.25 });

  return (
    <section ref={ref} id="careers" className="scroll-mt-32 relative flex h-[50vh] items-center justify-center overflow-hidden md:scroll-mt-36 md:h-[60vh]">
      <div
        className={`absolute inset-0 bg-cover bg-center transition duration-[2200ms] ${isVisible ? "scale-100" : "scale-[1.08]"}`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,22,40,0.62), rgba(10,22,40,0.62)), url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2669&auto=format&fit=crop')",
        }}
      />
      <div className={`relative z-10 px-6 text-center transition duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <h2 className="font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">We&apos;re Building a Team</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg font-light text-slate-200">
          Professional cleaning careers in the Austin metro area. We value attention to detail and a commitment to quality.
        </p>
        <Link
          href="/careers"
          className="group mt-8 inline-flex items-center gap-3 border-b border-white pb-1 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:border-[#C9A94E] hover:text-[#C9A94E]"
        >
          See Open Positions
          <span className="transition group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
