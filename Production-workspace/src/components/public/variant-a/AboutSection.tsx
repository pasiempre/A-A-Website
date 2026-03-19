"use client";

import Image from "next/image";

import { useInViewOnce } from "./useInViewOnce";

export function AboutSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} id="about" className="scroll-mt-32 overflow-hidden border-b border-slate-200 bg-white md:scroll-mt-36">
      <div className="flex min-h-[70vh] flex-col md:flex-row">
        <div
          className={`flex w-full items-center justify-center bg-white p-12 transition duration-1000 md:w-[55%] md:p-24 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          }`}
        >
          <div className="max-w-lg">
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">About A&A</span>
            <h2 className="mt-6 font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl">Built on Standards</h2>

            <div className="mt-8 space-y-6 text-lg font-light leading-relaxed text-slate-600">
              <p>A&A Cleaning was built on a simple principle: the job is not done until every detail meets the standard.</p>
              <p>
                From rough cleans on active construction sites to final walkthrough preparation, the goal is consistent: help the space feel ready, finished, and professionally presented.
              </p>
            </div>

            <blockquote className="mt-10 border-l-2 border-[#C9A94E] pl-6 font-serif text-2xl italic leading-snug text-[#0A1628]">
              “We don&apos;t leave until it&apos;s right.”
            </blockquote>

            <a
              href="#quote"
              className="mt-10 inline-flex items-center gap-3 border-b border-[#0A1628] pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#0A1628] transition hover:border-slate-500 hover:text-slate-500"
            >
              Work With Us
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div
          className={`relative h-[50vh] w-full overflow-hidden transition duration-1000 md:h-auto md:w-[45%] ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
        >
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2670&auto=format&fit=crop"
            alt="A&A Cleaning standards"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
