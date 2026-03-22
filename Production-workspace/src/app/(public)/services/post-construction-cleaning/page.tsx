import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { COMPANY_CITY, COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

const PAGE_PATH = "/services/post-construction-cleaning";
const PAGE_TITLE = "Post-Construction Cleaning in Austin";
const PAGE_DESCRIPTION =
  "Rough and final construction cleaning for Austin projects, including debris removal, dust mitigation, and walkthrough-ready detailing.";

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

export default function PostConstructionCleaningPage() {
  const baseUrl = getSiteUrl();
  const pageUrl = `${baseUrl}${PAGE_PATH}`;

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Post-Construction Cleaning",
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
      { "@type": "ListItem", position: 3, name: "Post-Construction Cleaning", item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceData, breadcrumbData]),
        }}
      />

      <main id="main-content" className="bg-[#F1F0EE]">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-28 md:pt-32">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-[#0A1628]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/services" className="hover:text-[#0A1628]">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-[#0A1628]">Post-Construction Cleaning</li>
          </ol>
        </nav>

        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
            <div className="max-w-2xl flex-1">
              <p className="section-kicker mb-4">Builder Turnover Package</p>
              <h1 className="font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">{PAGE_TITLE}</h1>
              <p className="mt-6 text-lg font-light leading-relaxed text-slate-600">
                Rough and final clean for new construction projects across the Austin metro area. We handle debris removal,
                dust mitigation, and detail-level finish so spaces are walkthrough-ready and move-in ready.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Multifamily buildings and apartment complexes",
                  "Commercial offices and retail buildouts",
                  "Schools, institutional, and municipal projects",
                  "First and second final clean workflows",
                  "Punch-list closeout and walkthrough preparation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A94E]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/#quote" className="cta-primary px-8 py-4">
                  Request a Quote
                </Link>
                <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">
                  Call {COMPANY_PHONE}
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(2,6,23,0.18)] lg:w-[480px]">
              <Image
                src="/images/variant-a/service-spread-01.jpg"
                alt="Post-construction cleaning crew working in a newly built Austin commercial space"
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">How Post-Construction Cleaning Works</h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-slate-600">
              We follow a structured rough-to-final workflow that aligns with contractor schedules and walkthrough deadlines.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Rough Clean",
                  body: "Debris removal, bulk dust, and workspace clearing while trades are still active on site.",
                },
                {
                  step: "02",
                  title: "Detail Clean",
                  body: "Surface-level dust removal, fixture cleaning, floor preparation, and touch-point detailing.",
                },
                {
                  step: "03",
                  title: "Final Walkthrough",
                  body: "Inspection-ready presentation with punch-list closeout support before final handoff.",
                },
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

        <section className="bg-[#0A1628] py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">Ready to schedule your post-construction clean?</h2>
            <p className="mt-4 text-base font-light text-slate-300">
              We respond within one hour during business hours. Tell us about your project and we&apos;ll confirm scope and timeline.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/#quote" className="cta-gold px-8 py-4">
                Get a Quote
              </Link>
              <a
                href={`tel:${COMPANY_PHONE_E164}`}
                className="text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white"
              >
                Or call {COMPANY_PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
