import Image from "next/image";

import { QuoteCTA } from "./QuoteCTA";
import { ScrollReveal } from "./ScrollReveal";

const PROOF_POINTS = [
  { value: "500+", label: "Projects delivered" },
  { value: "6+", label: "Years in Austin" },
  { value: "24hr", label: "Turnaround capability" },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-32 overflow-hidden bg-white md:scroll-mt-36"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        aria-hidden="true"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative flex min-h-[70vh] flex-col md:flex-row">
        <ScrollReveal
          as="div"
          className="relative flex w-full items-center justify-center bg-[#FAFAF8] px-8 py-20 md:w-[52%] md:px-16 lg:px-24"
          threshold={0.15}
          hiddenClassName="-translate-x-10 opacity-0"
          visibleClassName="translate-x-0 opacity-100"
        >
          <div className="max-w-lg">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-8 bg-[#2563EB]"
                aria-hidden="true"
              />
              <span className="section-kicker">About A&A</span>
            </div>

            <h2
              id="about-heading"
              className="mt-5 font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-[3.25rem]"
            >
              Built on Standards
            </h2>

            <div className="mt-8 space-y-5 text-[1.05rem] font-light leading-relaxed text-slate-600">
              <p>
                A&A Cleaning was built on a simple principle: the job is not
                done until every detail meets the standard.
              </p>
              <p>
                From rough cleans on active construction sites to final
                walkthrough preparation, the goal is consistent — help the
                space feel ready, finished, and professionally presented.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {PROOF_POINTS.map((point, i) => (
                <ScrollReveal
                  key={point.label}
                  as="div"
                  className="duration-500"
                  threshold={0.15}
                  hiddenClassName="translate-y-6 opacity-0"
                  visibleClassName="translate-y-0 opacity-100"
                  style={{
                    transitionDelay: `${400 + i * 120}ms`,
                  }}
                >
                  <p className="text-2xl font-bold tracking-tight text-[#0A1628] lg:text-3xl">
                    {point.value}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-600">
                    {point.label}
                  </p>
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border-l-[3px] border-[#C9A94E] bg-slate-50/80 py-6 pl-6 pr-5">
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-[#C9A94E]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
                  The A&A Standard
                </span>
              </div>
              <blockquote className="mt-3 font-serif text-2xl italic leading-snug text-[#0A1628] lg:text-3xl">
                &ldquo;We don&apos;t leave until it&apos;s right.&rdquo;
              </blockquote>
            </div>

            <QuoteCTA className="cta-primary group mt-10 inline-flex items-center gap-3">
              Start Your Project
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
            </QuoteCTA>
          </div>
        </ScrollReveal>

        <ScrollReveal
          as="div"
          className="relative h-[55vh] w-full overflow-hidden md:h-auto md:w-[48%] md:self-stretch"
          threshold={0.15}
          hiddenClassName="translate-x-10 opacity-0"
          visibleClassName="translate-x-0 opacity-100"
        >
          <Image
            src="/images/variant-a/about-hero.jpg"
            alt="A&A crew member detail-cleaning a newly finished commercial interior"
            fill
            quality={75}
            sizes="(max-width: 768px) 100vw, 48vw"
            className="object-cover"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081120]/20 via-transparent to-transparent"
            aria-hidden="true"
          />

          <ScrollReveal
            as="div"
            className="absolute bottom-6 left-6 z-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#0A1628]/70 px-5 py-3 backdrop-blur-md"
            threshold={0.15}
            hiddenClassName="translate-y-6 opacity-0"
            visibleClassName="translate-y-0 opacity-100"
            style={{ transitionDelay: "800ms" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3 5 6v5c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
                <path d="m9.5 12 1.8 1.8 3.2-3.6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Licensed & Insured
              </p>
              <p className="text-[10px] text-slate-400">
                Austin Metro Area
              </p>
            </div>
          </ScrollReveal>
        </ScrollReveal>
      </div>
    </section>
  );
}
