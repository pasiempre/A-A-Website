import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageShell } from "@/components/public/PublicPageShell";
import { FAQSection } from "@/components/public/variant-a/FAQSection";
import { FAQ_ITEMS } from "@/components/public/variant-a/faq-items";
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about A&A Cleaning services, timelines, pricing, and coverage across the Austin metro area.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "A&A Cleaning FAQ",
    description:
      "Get quick answers about service area, turnaround, pricing, and what to expect from A&A Cleaning.",
    url: `${getSiteUrl()}/faq`,
    type: "website",
  },
};

export default function FAQPage() {
  const baseUrl = getSiteUrl();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${baseUrl}/faq#page`,
      name: "Frequently Asked Questions",
      url: `${baseUrl}/faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
            item: `${baseUrl}/faq`,
          },
        ],
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicPageShell>
        <main className="pb-24 md:pb-0">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-slate-200 bg-white pb-20 pt-32 md:pb-24 md:pt-40">
            <div className="mx-auto max-w-4xl px-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">Quick Answers</span>
                  <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                </div>
                <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A1628] mb-6">
                  Everything You Need to Know
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                  Find answers about our process, coverage, pricing, and what to expect when working with A&amp;A Cleaning.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={`tel:${COMPANY_PHONE_E164}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1628] text-white rounded-lg hover:bg-[#0f2746] transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Us
                  </a>
                  <a
                    href="#faq"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-[#0A1628] rounded-lg hover:border-slate-400 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    Browse FAQs
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <FAQSection />

          {/* CTA Band */}
          <section className="bg-[#0A1628] py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-6">
              <div className="text-center">
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-white mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                  Get in touch directly with our team. We respond to all inquiries within one hour during business hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={`tel:${COMPANY_PHONE_E164}`}
                    className="cta-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {COMPANY_PHONE}
                  </a>
                  <a
                    href={`mailto:${COMPANY_EMAIL}`}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/35 px-6 py-3 text-white transition-colors hover:border-white/60 hover:bg-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA Band */}
          <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-200">
            <div className="mx-auto max-w-4xl px-6">
              <div className="text-center">
                <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-[#0A1628] mb-3">
                  Ready to Get Started?
                </h3>
                <p className="text-slate-600 mb-8">
                  Request a quote for your project – same-day response during business hours.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1628] text-white rounded-lg hover:bg-[#0f2746] transition-colors font-medium"
                >
                  Get a Quote
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 bg-white py-14 md:py-16">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <p className="section-kicker">Keep Exploring</p>
              <h3 className="mt-3 font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">
                Need More Than Answers?
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                Explore our industry-specific pages, coverage map, and company standards to find the right fit for your project.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <Link href="/industries/general-contractors" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                  General Contractors
                </Link>
                <Link href="/industries/property-managers" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                  Property Managers
                </Link>
                <Link href="/service-area" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                  Service Area
                </Link>
                <Link href="/about" className="surface-panel p-4 text-sm font-semibold text-[#0A1628] transition hover:-translate-y-0.5 hover:text-[#2563EB]">
                  About A&amp;A
                </Link>
              </div>
            </div>
          </section>
        </main>
      </PublicPageShell>
    </>
  );
}
