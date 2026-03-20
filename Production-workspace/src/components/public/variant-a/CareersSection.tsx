import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "./ScrollReveal";

const PERKS = [
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l2.5 1.5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    label: "Consistent Hours",
    detail: "Reliable weekly schedules",
  },
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
      </svg>
    ),
    label: "Growth Path",
    detail: "Crew lead opportunities",
  },
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Team Culture",
    detail: "Respectful, detail-driven crews",
  },
];

export function CareersSection() {
  return (
    <section
      id="careers"
      aria-labelledby="careers-heading"
      className="relative scroll-mt-32 overflow-hidden md:scroll-mt-36"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/variant-a/careers-hero.jpg"
          alt=""
          fill
          quality={75}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0A1628]/70" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/90 via-[#0A1628]/60 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-36">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <ScrollReveal as="div" className="max-w-xl" threshold={0.2}>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#C9A94E]" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A94E]">
                Careers
              </span>
            </div>

            <h2
              id="careers-heading"
              className="mt-5 font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-[3.25rem]"
            >
              We&apos;re Building a Team
            </h2>

            <p className="mt-6 text-lg font-light leading-relaxed text-slate-300">
              Professional cleaning careers for people who care about finish
              quality, reliability, and attention to detail. If you take pride in
              your work, we want to hear from you.
            </p>

            <ScrollReveal
              as="div"
              className="mt-8 flex gap-8"
              threshold={0.2}
              style={{ transitionDelay: "200ms" }}
              hiddenClassName="translate-y-6 opacity-0"
              visibleClassName="translate-y-0 opacity-100"
            >
              {[
                { value: "20+", label: "Team Members" },
                { value: "4.8★", label: "Glassdoor Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </ScrollReveal>

            <ScrollReveal
              as="div"
              className="mt-10"
              threshold={0.2}
              style={{ transitionDelay: "350ms" }}
            >
              <Link
                href="/careers"
                className="group inline-flex items-center gap-3 rounded-lg bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-lg shadow-white/10 transition-all duration-300 hover:bg-slate-100 hover:shadow-xl"
              >
                See Open Positions
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h12M12 6l4 4-4 4" />
                </svg>
              </Link>
            </ScrollReveal>
          </ScrollReveal>

          <div className="flex flex-col gap-4 lg:w-[380px]">
            {PERKS.map((perk, i) => (
              <ScrollReveal
                key={perk.label}
                as="div"
                className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/[0.1]"
                style={{ transitionDelay: `${300 + i * 120}ms` }}
                threshold={0.2}
                hiddenClassName="translate-x-8 opacity-0"
                visibleClassName="translate-x-0 opacity-100"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C9A94E] transition-colors duration-300 group-hover:bg-[#C9A94E]/20">
                  {perk.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {perk.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {perk.detail}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
