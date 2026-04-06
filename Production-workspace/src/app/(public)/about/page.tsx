import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  COMPANY_CITY,
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_PHONE_E164,
  COMPANY_SHORT_NAME,
} from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About A&A Cleaning Services | Licensed Cleaning Team in Austin TX",
  description:
    "Learn how A&A Cleaning supports contractors, property teams, and commercial operators with standards-driven cleaning across Austin. Licensed, insured, and built for high-accountability jobs.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About A&A Cleaning Services",
    description:
      "Built by a crew that does not cut corners. See our standards, credentials, and the systems behind reliable cleaning delivery across Austin.",
    url: `${getSiteUrl()}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/about#page`,
        name: `About ${COMPANY_SHORT_NAME}`,
        url: `${baseUrl}/about`,
        description:
          "Company background, standards, and credentials for A&A Cleaning in Austin.",
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: COMPANY_NAME,
        url: baseUrl,
        telephone: COMPANY_PHONE_E164,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "About", item: `${baseUrl}/about` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="bg-[#FAFAF8]">
        <section className="border-b border-slate-200 bg-white pb-14 pt-28 md:pt-36">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex items-center gap-2 text-xs text-slate-500">
                  <li>
                    <Link href="/" className="hover:text-[#0A1628]">Home</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-semibold text-[#0A1628]">About</li>
                </ol>
              </nav>

              <p className="section-kicker">About A&A</p>
              <h1 className="mt-4 max-w-2xl font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">
                Built by a Crew That Does Not Cut Corners.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                A&A Cleaning started on real jobsites, not in a boardroom. Every standard we use is shaped by
                what a failed walkthrough, delayed turnover, or inconsistent vendor handoff costs a project team.
              </p>
            </div>

            <div className="surface-panel relative overflow-hidden">
              <div className="relative h-[20rem] md:h-[24rem]">
                <Image
                  src="/images/variant-a/about-hero.jpg"
                  alt="A&A team member detail-cleaning a finished commercial interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  quality={78}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/40 to-transparent" aria-hidden="true" />
                <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-[#0A1628]/70 px-3 py-2 text-xs text-slate-200 backdrop-blur">
                  Licensed and insured across {COMPANY_CITY}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#FAFAF8] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">How We Started</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">Built to fix a real handoff problem</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <p className="surface-panel-soft p-5 text-sm leading-relaxed text-slate-700 md:text-base">
                Before A&A was a company, it was a pattern: missed cleaning timelines, avoidable walkthrough
                failures, and project teams carrying the risk when vendors under-delivered. We built A&A to remove
                that risk with schedule discipline and execution clarity.
              </p>
              <p className="surface-panel-soft p-5 text-sm leading-relaxed text-slate-700 md:text-base">
                What started as a small crew has grown into a standards-driven operation supporting contractors,
                property managers, and commercial teams across the Austin corridor from Georgetown to San Marcos.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">The A&A Standard</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">What drives every crew and every project</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Schedule Is Sacred",
                  detail: "If we commit to a date, we execute to that date. Your handoff timeline is our operating timeline.",
                },
                {
                  title: "First-Pass Quality",
                  detail: "Our goal is walkthrough-ready quality the first time, not repeated cleaning loops.",
                },
                {
                  title: "Communication Without Chasing",
                  detail: "Teams get clear updates on arrival, execution status, and completion without follow-up friction.",
                },
                {
                  title: "Scope-Honest Pricing",
                  detail: "Scope is clearly defined up front so there are no surprise line items at closeout.",
                },
              ].map((item) => (
                <article key={item.title} className="surface-panel p-5">
                  <h3 className="text-lg font-semibold text-[#0A1628]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#F1F0EE] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">By the Numbers</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "500+", label: "Projects Delivered" },
                { value: "15+", label: "Years Field Experience" },
                { value: "1hr", label: "Response Target" },
                { value: "100%", label: "Standards-Driven Execution" },
              ].map((item) => (
                <article key={item.label} className="surface-panel p-5 text-center">
                  <p className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">{item.value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">Credentials and Coverage</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">Built for accountable project environments</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="surface-panel p-5">
                <h3 className="text-lg font-semibold text-[#0A1628]">Licensed and Insured</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Documentation-ready for contractor onboarding and commercial site requirements.
                </p>
              </article>
              <article className="surface-panel p-5">
                <h3 className="text-lg font-semibold text-[#0A1628]">Austin Metro Coverage</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Active support across Austin and surrounding growth corridors where handoff quality matters.
                </p>
              </article>
              <article className="surface-panel p-5">
                <h3 className="text-lg font-semibold text-[#0A1628]">Bilingual Coordination</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  English and Spanish communication support for smooth on-site coordination.
                </p>
              </article>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-[#0A1628] p-6 text-white">
              <p className="font-serif text-2xl leading-relaxed md:text-3xl">
                &ldquo;We do not leave until it is right.&rdquo;
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#FAFAF8] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">Who We Work With</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  href: "/industries/general-contractors",
                  title: "General Contractors",
                  detail: "Closeout-ready cleaning for schedule-sensitive handoffs.",
                },
                {
                  href: "/industries/property-managers",
                  title: "Property Managers",
                  detail: "Consistent turnover cleaning for leasing readiness.",
                },
                {
                  href: "/industries/commercial-spaces",
                  title: "Commercial Spaces",
                  detail: "Reliable recurring and deep-clean support for active operations.",
                },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="surface-panel group p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-600">
              Need coverage details?
              {" "}
              <Link href="/service-area" className="font-semibold text-[#2563EB]">
                Explore service areas
              </Link>
              {" • "}
              <Link href="/faq" className="font-semibold text-[#2563EB]">
                View FAQ
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#0A1628] py-14 text-center md:py-18">
          <div className="mx-auto max-w-4xl px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">Ready to Work Together?</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-white md:text-4xl">Tell us about your project scope.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              We respond quickly with clear next steps and scope alignment for your team.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/#quote-request" className="cta-gold min-h-[48px]">
                Request a Quote
              </Link>
              <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[48px] border-white/35 text-white hover:bg-white hover:text-[#0A1628]">
                Call {COMPANY_PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
