import type { Metadata } from "next";
import Link from "next/link";

import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { QuoteCTA } from "@/components/public/variant-a/QuoteCTA";
import { INDUSTRIES } from "@/data/industries";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries We Serve | A&A Cleaning Austin TX",
  description:
    "Cleaning services for general contractors, property managers, and commercial space operators across Austin.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries We Serve | A&A Cleaning Austin TX",
    description:
      "Cleaning services for general contractors, property managers, and commercial space operators across Austin.",
    url: `${getSiteUrl()}/industries`,
    type: "website",
  },
};

export default function IndustriesIndexPage() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Industries",
            item: `${baseUrl}/industries`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Industries We Serve",
        numberOfItems: INDUSTRIES.length,
        itemListElement: INDUSTRIES.map((industry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: `Cleaning Services for ${industry.title}`,
            description: industry.outcome,
            url: `${baseUrl}/industries/${industry.slug}`,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="bg-[#FAFAF8]">
        <section className="border-b border-slate-200 bg-white pb-14 pt-28 md:pt-36">
          <div className="mx-auto max-w-7xl px-6">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-2 text-xs text-slate-500">
                <li>
                  <Link href="/" className="hover:text-[#0A1628]">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-[#0A1628]">Industries</li>
              </ol>
            </nav>

            <p className="section-kicker">Who We Serve</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">
              Cleaning Standards Built for Your Industry
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-slate-600">
              Every industry has different handoff requirements. We align scope, scheduling, and
              communication to the way your team actually works.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {INDUSTRIES.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="surface-panel group flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
                    {industry.eyebrow}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628] group-hover:text-[#2563EB]">
                    {industry.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {industry.outcome}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {industry.fit.map((item) => (
                      <span key={item} className="info-chip text-slate-600">{item}</span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                    <span className="font-semibold text-[#0A1628]">{industry.stat}</span>
                    <span className="text-slate-500">{industry.statLabel}</span>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 md:py-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="section-kicker">Keep Exploring</p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">
              See How We Work Across the Austin Metro
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <Link href="/services" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                Services
              </Link>
              <Link href="/service-area" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                Service Area
              </Link>
              <Link href="/about" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                About A&A
              </Link>
              <Link href="/faq" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                FAQ
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#0A1628] py-14 text-center md:py-18">
          <div className="mx-auto max-w-4xl px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">
              Ready to Start?
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-white md:text-4xl">
              Tell us about your project scope.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Share your industry, timeline, and service needs. We respond quickly with clear next steps.
            </p>
            <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <QuoteCTA ctaId="industries_index_closing_quote" className="cta-gold min-h-[48px]">
                Get a Quote
              </QuoteCTA>
              <CTAButton
                ctaId="industries_index_closing_call"
                actionType="call"
                href={`tel:${COMPANY_PHONE_E164}`}
                className="min-h-0 text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white"
              >
                Or call {COMPANY_PHONE}
              </CTAButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
