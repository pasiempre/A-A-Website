import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { QuoteCTA } from "@/components/public/variant-a/QuoteCTA";
import { COMPANY_CITY, COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { SERVICE_FAQS } from "@/lib/service-faqs";
import { getSiteUrl } from "@/lib/site";
import { ServicePageHardening } from "@/components/public/variant-a/ServicePageHardening";

const PAGE_PATH = "/services/windows-power-wash";
const PAGE_TITLE = "Window Cleaning & Power Washing in Austin";
const PAGE_DESCRIPTION =
  "Exterior detail services in Austin including window cleaning and power washing for facades, walkways, and presentation-critical surfaces.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${getSiteUrl()}${PAGE_PATH}`,
    type: "website",
  },
};

export default function WindowsPowerWashPage() {
  const baseUrl = getSiteUrl();
  const pageUrl = `${baseUrl}${PAGE_PATH}`;

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Window Cleaning and Power Washing",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    areaServed: COMPANY_CITY,
    provider: {
      "@type": "LocalBusiness",
      name: COMPANY_NAME,
      telephone: COMPANY_PHONE_E164,
      url: baseUrl,
    },
    url: pageUrl,
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${baseUrl}/services` },
      { "@type": "ListItem", position: 3, name: "Window Cleaning & Power Washing", item: pageUrl },
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SERVICE_FAQS.specialty.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceData, breadcrumbData, faqData]) }}
      />

      <main id="main-content" className="bg-[#FAFAF8]">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-28 md:pt-32">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-[#0A1628]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/services" className="hover:text-[#0A1628]">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-[#0A1628]">Windows &amp; Power Wash</li>
          </ol>
        </nav>

        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
            <div className="max-w-2xl flex-1">
              <p className="section-kicker mb-4">Exterior Presentation Package</p>
              <h1 className="font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">{PAGE_TITLE}</h1>
              <p className="mt-6 text-lg font-light leading-relaxed text-slate-600">
                Improve curb appeal and handoff presentation with exterior-focused cleaning for glass, facades, concrete, and high-traffic paths.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Exterior facades and storefront presentation",
                  "High-reach windows and detailed glass work",
                  "Concrete and entryway washdown",
                  "Walkways and approach area refreshes",
                  "Project closeout and property curb-appeal support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A94E]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <QuoteCTA ctaId="windows_power_wash_hero_quote" serviceType="specialty" className="cta-primary px-8 py-4">Request a Quote</QuoteCTA>
                <CTAButton ctaId="windows_power_wash_hero_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">Call {COMPANY_PHONE}</CTAButton>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(2,6,23,0.18)] lg:w-[480px]">
              <Image
                src="/images/variant-a/service-spread-05.jpg"
                alt="Window cleaning and exterior power washing service in Austin"
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">How Exterior Detail Services Work</h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-slate-600">
              We stage equipment safely and deliver a finish pass focused on visible presentation impact.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { step: "01", title: "Site Survey", body: "We review surfaces, reach requirements, and access constraints." },
                { step: "02", title: "Equipment Setup", body: "Our team deploys the right tools and safety workflow for your site." },
                { step: "03", title: "Detail Finish", body: "We complete window and surface detailing for a clean final appearance." },
              ].map((item) => (
                <div key={item.step} className="surface-panel p-8">
                  <span className="text-2xl font-bold text-[#C9A94E]">{item.step}</span>
                  <h3 className="mt-4 text-lg font-semibold text-[#0A1628]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServicePageHardening serviceType="specialty" />

        <section className="bg-[#0A1628] py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">Ready to improve exterior presentation?</h2>
            <p className="mt-4 text-base font-light text-slate-300">Tell us what needs attention and we&apos;ll align timing and scope.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <QuoteCTA ctaId="windows_power_wash_closing_quote" serviceType="specialty" className="cta-gold px-8 py-4">Get a Quote</QuoteCTA>
              <CTAButton ctaId="windows_power_wash_closing_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="min-h-0 text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white">Or call {COMPANY_PHONE}</CTAButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
