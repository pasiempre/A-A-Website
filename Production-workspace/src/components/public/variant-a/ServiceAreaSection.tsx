"use client";

import { useInViewOnce } from "./useInViewOnce";

const majorCities = ["Austin", "Round Rock", "Georgetown"];
const supportingCities = ["Kyle", "Buda", "Pflugerville", "Hutto", "San Marcos"];

export function ServiceAreaSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} id="service-area" className="scroll-mt-32 overflow-hidden border-b border-slate-200 bg-[#F1F0EE] py-24 text-center md:scroll-mt-36 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <span className={`mb-12 block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 transition duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          Where We Work
        </span>

        <div className="flex flex-col items-center justify-center gap-6 md:gap-10">
          <h3 className={`font-serif text-6xl leading-none tracking-tight text-[#0A1628] transition duration-1000 hover:scale-105 hover:text-[#C9A94E] md:text-8xl lg:text-9xl ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            {majorCities[0].toUpperCase()}
          </h3>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-16">
            {majorCities.slice(1).map((city, index) => (
              <span
                key={city}
                className={`cursor-default font-serif text-3xl tracking-tight text-slate-700 transition duration-1000 hover:scale-105 hover:text-[#C9A94E] md:text-5xl lg:text-6xl ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 120 + 120}ms` }}
              >
                {city}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-12">
            {supportingCities.map((city, index) => (
              <span
                key={city}
                className={`cursor-default font-serif text-2xl tracking-tight text-slate-500 transition duration-1000 hover:scale-105 hover:text-[#C9A94E] md:text-4xl lg:text-5xl ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100 + 260}ms` }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        <p className={`mt-16 text-sm font-light uppercase tracking-[0.2em] text-slate-500 transition duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: "520ms" }}>
          Serving the greater Austin metropolitan area
        </p>
      </div>
    </section>
  );
}
