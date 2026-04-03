"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useInViewOnce } from "./useInViewOnce";

const steps = [
  {
    number: "01",
    icon: "request",
    title: "Request a Quote",
    body: "Submit our form or call directly. We review the request quickly and confirm the next step during business hours.",
    image: "/images/variant-a/timeline-01.jpg",
    detail: "Fast intake",
  },
  {
    number: "02",
    icon: "assess",
    title: "We Assess",
    body: "We review the scope, visit if needed, and provide a clear estimate based on the project reality.",
    image: "/images/variant-a/timeline-02.jpg",
    detail: "Scope clarity",
  },
  {
    number: "03",
    icon: "clean",
    title: "We Clean",
    body: "A&A crews handle the work with detail-focused standards, responsive communication, and schedule awareness.",
    image: "/images/variant-a/timeline-03.jpg",
    detail: "Crew execution",
  },
  {
    number: "04",
    icon: "handoff",
    title: "You Walk Through",
    body: "We finish for presentation and final review so the handoff feels complete, not rushed.",
    image: "/images/variant-a/timeline-04.jpg",
    detail: "Closeout ready",
  },
];

function StepIcon({ icon }: { icon: (typeof steps)[number]["icon"] }) {
  if (icon === "request") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M7 6.5h10M7 11h10M7 15.5h6M5 4.5h14v15H5z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "assess") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="m15 15 4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "clean") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="m7 18 3.5-9 1.6 4.1 3.9 1.7L13 22l-1.1-3.8L7 18Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M5 14.5 9 18l10-11" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TimelineStep({
  onVisible,
  step,
  reverse,
}: {
  onVisible: (stepNumber: string) => void;
  step: (typeof steps)[number];
  reverse?: boolean;
}) {
  const { ref, isVisible } = useInViewOnce<HTMLDivElement>(0.25);

  useEffect(() => {
    if (isVisible) {
      onVisible(step.number);
    }
  }, [isVisible, onVisible, step.number]);

  return (
    /* MOBILE-HARDENING: mb-8→mb-5 for tighter step spacing on mobile. md:mb-14 preserved. */
    <div ref={ref} className={`group relative mb-5 flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} md:mb-14 md:items-center`}>
      <div
        aria-hidden="true"
        className={`absolute left-1/2 top-1 z-20 hidden h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-[#0A1628]/12 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition duration-700 md:flex ${
          isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <span className="relative h-2 w-2 rounded-full bg-[#0A1628]" />
      </div>
      <div
        className={`w-full transition duration-700 md:w-1/2 ${reverse ? "md:pl-16 md:pr-0" : "md:pr-16 md:pl-0 md:text-right"} ${
          isVisible ? "translate-x-0 opacity-100" : reverse ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0"
        }`}
      >
        <div
          className={`font-serif text-2xl leading-none transition duration-700 md:absolute md:text-3xl ${
            reverse ? "md:-left-8 md:top-0 md:bg-[#FAFAF8] md:pr-4" : "md:right-0 md:top-0"
          } ${isVisible ? "text-[#0A1628]" : "text-slate-200"}`}
        >
          {step.number}
        </div>
        {/* MOBILE-HARDENING: mb-3→mb-2, mt-4→mt-2 for tighter step content spacing. md values preserved. */}
        <div className={`mb-2 mt-2 inline-flex items-center gap-3 transition duration-700 md:mb-4 md:mt-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <span className="icon-tile hidden md:inline-flex">
            <StepIcon icon={step.icon} />
          </span>
          <p className="section-kicker text-[#2563EB] md:hidden">{step.detail}</p>
        </div>
        <h3 className="font-serif text-xl tracking-tight text-[#0A1628] md:text-2xl">{step.title}</h3>
        {/* MOBILE-HARDENING: mt-2→mt-1.5 for tighter description spacing on mobile. md:mt-3 preserved. */}
        {/* MOBILE-ELEVATION: P-9 — font-normal on mobile for legibility, font-light on md+ */}
        <p className="mt-1.5 max-w-md text-sm font-normal leading-relaxed text-slate-600 md:mt-3 md:inline-block md:font-light md:text-base md:leading-7">{step.body}</p>
        </div>


      <div
        className={`hidden mt-4 w-full md:mt-0 md:w-1/2 md:block ${reverse ? "md:pr-16" : "md:pl-16"} transition duration-700 ${
          isVisible ? "translate-x-0 opacity-100" : reverse ? "-translate-x-10 opacity-0" : "translate-x-10 opacity-0"
        }`}
      >
        <div className="relative h-48 overflow-hidden rounded-[1.5rem] shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:h-72">
          <Image
            src={step.image}
            alt={step.title}
            fill
            quality={68}
            sizes="(max-width: 768px) 100vw, 480px"
            className={`object-cover transition duration-700 ${isVisible ? "grayscale-0 opacity-100" : "grayscale opacity-60"}`}
          />
        </div>
      </div>
    </div>
  );
}

export function TimelineSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.15);
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);

  const revealStep = (stepNumber: string) => {
    setVisibleSteps((previous) => (previous.includes(stepNumber) ? previous : [...previous, stepNumber]));
  };

  const progressHeight = `${(visibleSteps.length / steps.length) * 100}%`;

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] py-12 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(201,169,78,0.09),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(37,99,235,0.08),transparent_28%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        {/* MOBILE-HARDENING: mb-10→mb-8 for tighter heading block. md:mb-14 preserved. */}
        <div className={`mb-8 text-center transition duration-700 md:mb-14 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <p className="section-kicker">Process</p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628] md:mt-0 md:text-5xl">How It Works</h2>
          {/* MOBILE-ELEVATION: P-9 — font-normal on mobile for legibility, font-light on md+ */}
          <p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-slate-600 md:font-light md:text-base">
            The workflow stays simple: rapid intake, clean scope alignment, disciplined execution, and a handoff that feels ready.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent md:left-1/2 md:block md:-translate-x-1/2">
            <div
                className="w-full bg-gradient-to-b from-slate-300 to-[#0A1628] transition-all duration-700"
              style={{ height: progressHeight }}
            />
          </div>
          {steps.map((index_step, index) => (
            <TimelineStep key={index_step.number} onVisible={revealStep} step={index_step} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
