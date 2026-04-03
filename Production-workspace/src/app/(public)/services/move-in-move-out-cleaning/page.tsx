import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { COMPANY_CITY, COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { SERVICE_FAQS } from "@/lib/service-faqs";
import { getSiteUrl } from "@/lib/site";
import { ServicePageHardening } from "@/components/public/variant-a/ServicePageHardening";

const PAGE_PATH = "/services/move-in-move-out-cleaning";
const PAGE_TITLE = "Move-In Move-Out Cleaning in Austin";
const PAGE_DESCRIPTION =
  "Vacant unit turnover cleaning in Austin with deep sanitation, property-ready resets, and fast scheduling for move-in deadlines.";

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

export default function MoveInMoveOutCleaningPage() {
  const baseUrl = getSiteUrl();
  const pageUrl = `${baseUrl}${PAGE_PATH}`;

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Move-In Move-Out Cleaning",
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
      { "@type": "ListItem", position: 3, name: "Move-In Move-Out Cleaning", item: pageUrl },
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SERVICE_FAQS.turnover.map((item) => ({
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

      <main id="main-content" className="bg-[#F1F0EE]">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-28 md:pt-32">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-[#0A1628]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/services" className="hover:text-[#0A1628]">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-[#0A1628]">Move-In Move-Out Cleaning</li>
          </ol>
        </nav>

        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
            <div className="max-w-2xl flex-1">
              <p className="section-kicker mb-4">Unit Turnover Package</p>
              <h1 className="font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">{PAGE_TITLE}</h1>
              <p className="mt-6 text-lg font-light leading-relaxed text-slate-600">
                We help property managers and owners reset units quickly with deep cleaning standards that support faster leasing and fewer callbacks.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Vacant apartment and condo turns",
                  "Deep sanitation for kitchens and baths",
                  "Property management-ready documentation",
                  "Fast turnaround for move-in schedules",
                  "Consistent finish quality across portfolios",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A94E]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/#quote" className="cta-primary px-8 py-4">Request a Quote</Link>
                <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">Call {COMPANY_PHONE}</a>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(2,6,23,0.18)] lg:w-[480px]">
              <Image
                src="/images/variant-a/service-spread-04.jpg"
                alt="Move-out apartment cleaning and turnover prep in Austin"
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
            <h2 className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">How Unit Turnovers Are Delivered</h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-slate-600">
              Our team works through a fast, repeatable turnover process designed for inspection and occupancy readiness.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { step: "01", title: "Unit Assessment", body: "We review condition, scope, and priority timeline for the turnover." },
                { step: "02", title: "Deep Clean", body: "We execute full-detail cleaning across surfaces, fixtures, and touchpoints." },
                { step: "03", title: "Inspection Pass", body: "Final quality check confirms readiness for showings or immediate move-in." },
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

        <ServicePageHardening serviceType="turnover" />

        <section className="bg-[#0A1628] py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">Need faster move-in readiness across your units?</h2>
            <p className="mt-4 text-base font-light text-slate-300">Share your property type and timeline, and we&apos;ll align service quickly.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/#quote" className="cta-gold px-8 py-4">Get a Quote</Link>
              <a href={`tel:${COMPANY_PHONE_E164}`} className="text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white">Or call {COMPANY_PHONE}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
