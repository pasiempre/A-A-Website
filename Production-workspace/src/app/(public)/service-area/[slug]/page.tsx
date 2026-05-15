import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AccordionFAQ } from "@/components/public/variant-a/AccordionFAQ";
import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { QuoteCTA } from "@/components/public/variant-a/QuoteCTA";
import { SERVICES } from "@/data/services";
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";
import { SERVICE_AREA_BY_SLUG, SERVICE_AREA_CITIES } from "@/lib/service-areas";

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

function getLocation(slug: string) {
  return SERVICE_AREA_BY_SLUG[slug];
}

export function generateStaticParams() {
  return SERVICE_AREA_CITIES.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);

  if (!location) {
    return { title: "Service Area Not Found" };
  }

  const baseUrl = getSiteUrl();

  return {
    title: `Cleaning Services in ${location.name}, TX | ${COMPANY_NAME}`,
    description: `Professional post-construction, commercial, and turnover cleaning in ${location.name}, Texas. ${location.distanceLabel}. Licensed and insured.`,
    alternates: {
      canonical: `/service-area/${location.slug}`,
    },
    openGraph: {
      title: `Cleaning Services in ${location.name}, TX`,
      description: `Post-construction and commercial cleaning serving ${location.name} and the ${location.region} Austin metro area.`,
      url: `${baseUrl}/service-area/${location.slug}`,
      type: "website",
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = getLocation(slug);

  if (!location) {
    notFound();
  }

  const baseUrl = getSiteUrl();
  const nearbyAreas = location.nearbyAreaSlugs.map((slugValue) => {
    if (slugValue === "austin") {
      return { name: "Austin", href: "/service-area" };
    }

    const city = SERVICE_AREA_BY_SLUG[slugValue];
    if (!city) {
      return null;
    }

    return { name: city.name, href: `/service-area/${city.slug}` };
  }).filter(Boolean) as Array<{ name: string; href: string }>;

  const locationFaqs = [
    {
      question: `Do you provide services across all of ${location.name}?`,
      answer:
        "Yes. We support project scopes across the local area and coordinate scheduling windows based on your site needs.",
    },
    {
      question: "How fast can your team respond for this location?",
      answer:
        "Response timing depends on current schedule and scope, but we prioritize fast quote response and clear scheduling communication.",
    },
    {
      question: "Can you handle both one-time and recurring work?",
      answer:
        "Yes. We support one-time project cleaning and ongoing recurring service models depending on your operation.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Cleaning Services in ${location.name}`,
      description: location.description,
      serviceType: [
        "Post-Construction Cleaning",
        "Commercial Cleaning",
        "Turnover Cleaning",
      ],
      provider: {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/service-area/${location.slug}#localbusiness`,
        name: COMPANY_NAME,
        telephone: COMPANY_PHONE_E164,
        url: `${baseUrl}/service-area/${location.slug}`,
      },
      areaServed: {
        "@type": "City",
        name: location.name,
        containedInPlace: {
          "@type": "State",
          name: "Texas",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/service-area/${location.slug}#localbusiness`,
      name: `${COMPANY_NAME} - ${location.name}`,
      telephone: COMPANY_PHONE_E164,
      url: `${baseUrl}/service-area/${location.slug}`,
      areaServed: {
        "@type": "City",
        name: location.name,
      },
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Post-Construction Cleaning" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Cleaning" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Move-In / Move-Out Cleaning" } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Service Area", item: `${baseUrl}/service-area` },
        {
          "@type": "ListItem",
          position: 3,
          name: location.name,
          item: `${baseUrl}/service-area/${location.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main id="main-content" className="bg-[#FAFAF8]">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-28 md:pt-32">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-[#0A1628]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/service-area" className="hover:text-[#0A1628]">Service Area</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-[#0A1628]">{location.name}</li>
          </ol>
        </nav>

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24">
          <p className="section-kicker mb-4">{location.region} Austin Metro</p>
          <h1 className="max-w-3xl font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">
            Commercial and Post-Construction Cleaning in {location.name}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">{location.distanceLabel}</p>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-600">{location.description}</p>

          <ul className="mt-8 space-y-3">
            {location.highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-700">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A94E]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <QuoteCTA ctaId={`city_${location.slug}_hero_quote`} className="cta-primary px-8 py-4">Request a Quote</QuoteCTA>
            <CTAButton ctaId={`city_${location.slug}_hero_call`} actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">Call {COMPANY_PHONE}</CTAButton>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Projects This Year", value: location.proof.annualProjects },
              { label: "Response Window", value: location.proof.responseWindow },
              { label: "Average Turnaround", value: location.proof.averageTurnaround },
              { label: "Recurring Accounts", value: location.proof.recurringAccounts },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-bold text-[#0A1628]">{item.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#FAFAF8] py-14 md:py-18">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">Local Project Signals in {location.name}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {location.localSignals.map((signal) => (
                <article key={signal} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm leading-relaxed text-slate-600">{signal}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">Services Available in {location.name}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <Link
                  key={service.anchor}
                  href={service.href}
                  className="surface-panel group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">{service.titleLines.join(" ")}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
                    Learn more
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10h12M12 6l4 4-4 4" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#FAFAF8] py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-lg font-semibold text-[#0A1628]">Also serving nearby areas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {nearbyAreas.map((area) => {
                return (
                  <Link
                    key={area.name}
                    href={area.href}
                    className="info-chip transition-colors hover:border-slate-300 hover:text-[#0A1628]"
                  >
                    {area.name}, TX
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl">
              Coverage Questions in {location.name}
            </h2>
            <div className="mt-5">
              <AccordionFAQ items={locationFaqs} />
            </div>

            <div className="mt-6 text-sm text-slate-600">
              Need role-specific scope guidance?
              {" "}
              <Link href="/industries/general-contractors" className="font-semibold text-[#2563EB]">
                General Contractors
              </Link>
              {" · "}
              <Link href="/industries/property-managers" className="font-semibold text-[#2563EB]">
                Property Managers
              </Link>
              {" · "}
              <Link href="/industries/commercial-spaces" className="font-semibold text-[#2563EB]">
                Commercial Spaces
              </Link>
              {" • "}
              <Link href="/about" className="font-semibold text-[#2563EB]">
                About A&amp;A
              </Link>
              {" • "}
              <Link href="/faq" className="font-semibold text-[#2563EB]">
                FAQ
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#0A1628] py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">Ready to get started in {location.name}?</h2>
            <p className="mt-4 text-base font-light text-slate-300">Same standards, same responsiveness — wherever the project is.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <QuoteCTA ctaId={`city_${location.slug}_closing_quote`} className="cta-gold px-8 py-4">Get a Quote</QuoteCTA>
              <CTAButton
                ctaId={`city_${location.slug}_closing_call`}
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
