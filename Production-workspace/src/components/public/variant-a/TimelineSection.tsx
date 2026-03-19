"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useInViewOnce } from "./useInViewOnce";

const steps = [
  {
    number: "1",
    title: "Request a Quote",
    body: "Submit our form or call directly. We respond within the hour during business hours.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2670&auto=format&fit=crop",
  },
  {
    number: "2",
    title: "We Assess",
    body: "We review the scope, visit if needed, and provide a clear estimate based on the project reality.",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=2670&auto=format&fit=crop",
  },
  {
    number: "3",
    title: "We Clean",
    body: "A&A crews handle the work with detail-focused standards, responsive communication, and schedule awareness.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2670&auto=format&fit=crop",
  },
  {
    number: "4",
    title: "You Walk Through",
    body: "We finish for presentation and final review so the handoff feels complete, not rushed.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2669&auto=format&fit=crop",
  },
];

function TimelineStep({
  onVisible,
  step,
  reverse,
}: {
  onVisible: (stepNumber: string) => void;
  step: (typeof steps)[number];
  reverse?: boolean;
}) {
  const { ref, isVisible } = useInViewOnce<HTMLDivElement>({ threshold: 0.25 });

  useEffect(() => {
    if (isVisible) {
      onVisible(step.number);
    }
  }, [isVisible, onVisible, step.number]);

  return (
    <div ref={ref} className={`group relative mb-20 flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} md:items-center`}>
      <div
        className={`w-full pl-16 md:w-1/2 ${reverse ? "md:pl-16 md:pr-0" : "md:pr-16 md:pl-0 md:text-right"} transition duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : reverse ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0"
        }`}
      >
        <div
          className={`absolute left-0 top-0 font-serif text-7xl leading-none transition duration-700 md:text-8xl ${
            reverse ? "md:-left-8 md:bg-[#FAFAF8] md:pr-4" : ""
          } ${isVisible ? "text-[#0A1628]" : "text-slate-200"}`}
        >
          {step.number}
        </div>
        <h3 className="mt-3 font-serif text-2xl tracking-tight text-[#0A1628] md:mt-0">{step.title}</h3>
        <p className="mt-3 max-w-md font-light leading-7 text-slate-600 md:inline-block">{step.body}</p>
      </div>

      <div
        className={`mt-6 w-full md:mt-0 md:w-1/2 ${reverse ? "md:pr-16" : "md:pl-16"} transition duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : reverse ? "-translate-x-10 opacity-0" : "translate-x-10 opacity-0"
        }`}
      >
        <div className="relative h-44 overflow-hidden rounded-sm shadow-lg md:h-56">
          <Image
            src={step.image}
            alt={step.title}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className={`object-cover transition duration-700 ${isVisible ? "grayscale-0 opacity-100" : "grayscale opacity-60"}`}
          />
        </div>
      </div>
    </div>
  );
}

export function TimelineSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.15 });
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);

  const revealStep = (stepNumber: string) => {
    setVisibleSteps((previous) => (previous.includes(stepNumber) ? previous : [...previous, stepNumber]));
  };

  const progressHeight = `${(visibleSteps.length / steps.length) * 100}%`;

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] py-28 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className={`mb-20 text-center transition duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <h2 className="font-serif text-5xl tracking-tight text-[#0A1628]">How It Works</h2>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-slate-200 md:left-1/2 md:-translate-x-1/2">
            <div className="w-full bg-[#0A1628] transition-all duration-1000" style={{ height: progressHeight }} />
          </div>
          {steps.map((step, index) => (
            <TimelineStep key={step.number} onVisible={revealStep} step={step} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
