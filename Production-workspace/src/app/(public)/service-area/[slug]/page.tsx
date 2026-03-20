import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

type LocationData = {
  slug: string;
  name: string;
  distance: string;
  region: string;
  description: string;
  highlights: string[];
  nearbyAreas: string[];
};

const locations: LocationData[] = [
  {
    slug: "round-rock",
    name: "Round Rock",
    distance: "20 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "A&A Cleaning provides post-construction cleaning, final clean services, and commercial facility care throughout Round Rock, TX. From new multifamily developments along I-35 to commercial office buildouts in the La Frontera area, we bring the same walkthrough-ready standard to every project.",
    highlights: [
      "Post-construction cleaning for new residential and commercial builds",
      "Final clean services for property turnovers and lease-ready units",
      "Ongoing commercial cleaning for Round Rock office parks and retail",
      "Fast response times — typically under 1 hour during business hours",
    ],
    nearbyAreas: ["Pflugerville", "Georgetown", "Hutto", "Austin"],
  },
  {
    slug: "georgetown",
    name: "Georgetown",
    distance: "30 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "From Sun City developments to downtown Georgetown's growing commercial district, A&A Cleaning delivers construction-ready cleaning with the detail and consistency that contractors and property managers expect.",
    highlights: [
      "Post-construction rough and final cleans for Georgetown builders",
      "Turnover cleaning for property management companies",
      "Commercial facility maintenance for retail and office spaces",
      "Licensed and insured for all commercial and construction site work",
    ],
    nearbyAreas: ["Round Rock", "Hutto", "Pflugerville", "Austin"],
  },
  {
    slug: "pflugerville",
    name: "Pflugerville",
    distance: "15 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "Pflugerville's rapid growth means more construction projects and more turnovers. A&A Cleaning supports local contractors and property teams with reliable, detail-focused cleaning that keeps handoffs on schedule.",
    highlights: [
      "Construction cleaning for Pflugerville's growing residential developments",
      "Move-in/move-out cleaning for apartment communities",
      "Commercial cleaning for tech corridor offices and retail",
      "Crew scheduling that aligns with contractor timelines",
    ],
    nearbyAreas: ["Round Rock", "Hutto", "Austin"],
  },
  {
    slug: "buda",
    name: "Buda",
    distance: "12 miles from Austin HQ",
    region: "South Austin Metro",
    description:
      "A&A Cleaning serves the Buda area with the same standards-driven cleaning we bring to every Austin metro project. Whether it's a new build along I-35 or a commercial space in downtown Buda, we deliver walkthrough-ready results.",
    highlights: [
      "Post-construction cleaning for South Austin corridor developments",
      "Turnover support for Buda property management teams",
      "Detail-focused final cleans for residential and commercial projects",
      "Flexible scheduling including weekends and off-hours",
    ],
    nearbyAreas: ["Kyle", "Austin", "San Marcos"],
  },
  {
    slug: "kyle",
    name: "Kyle",
    distance: "18 miles from Austin HQ",
    region: "South Austin Metro",
    description:
      "Kyle is one of the fastest-growing cities in Texas, and A&A Cleaning is here to support the construction and property management teams building it. We handle post-construction cleans, turnovers, and commercial maintenance throughout the Kyle area.",
    highlights: [
      "Cleaning support for Kyle's residential construction boom",
      "Apartment turnover cleaning for leasing teams",
      "Commercial facility care for Kyle Crossing and surrounding retail",
      "Same-day emergency turnovers available by request",
    ],
    nearbyAreas: ["Buda", "San Marcos", "Austin"],
  },
  {
    slug: "san-marcos",
    name: "San Marcos",
    distance: "28 miles from Austin HQ",
    region: "South Austin Metro",
    description:
      "A&A Cleaning brings professional construction and commercial cleaning to San Marcos. From student housing turnovers near Texas State University to new commercial builds along the I-35 corridor, we deliver consistent, inspection-ready results.",
    highlights: [
      "Student housing turnover cleaning at scale",
      "Post-construction services for San Marcos commercial development",
      "Recurring cleaning contracts for retail and office environments",
      "Bilingual crews — Se Habla Español",
    ],
    nearbyAreas: ["Kyle", "Buda", "Austin"],
  },
  {
    slug: "hutto",
    name: "Hutto",
    distance: "25 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "As Hutto continues its rapid residential and commercial growth, A&A Cleaning supports builders and property managers with reliable post-construction and turnover cleaning. We bring Austin-level standards to every Hutto project.",
    highlights: [
      "Post-construction cleaning for Hutto's new home developments",
      "Builder turnover packages for production homebuilders",
      "Commercial cleaning for Hutto's expanding retail and office market",
      "Consistent crew quality and on-time delivery",
    ],
    nearbyAreas: ["Round Rock", "Pflugerville", "Georgetown"],
  },
];

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

function getLocation(slug: string): LocationData | undefined {
  return locations.find((location) => location.slug === slug);
}

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
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
    description: `Professional post-construction, commercial, and turnover cleaning in ${location.name}, Texas. ${location.distance}. Licensed and insured.`,
    alternates: {
      canonical: `/service-area/${location.slug}`,
    },
    openGraph: {
      title: `Cleaning Services in ${location.name}, TX`,
      description: `Post-construction and commercial cleaning serving ${location.name} and the ${location.region}.`,
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

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Cleaning Services in ${location.name}`,
      description: location.description,
      provider: {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}#localbusiness`,
        name: COMPANY_NAME,
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

      <main id="main-content" className="bg-[#F1F0EE]">
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
          <p className="section-kicker mb-4">{location.region}</p>
          <h1 className="max-w-3xl font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">
            Professional Cleaning in {location.name}, TX
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">{location.distance}</p>
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
            <Link href="/#quote" className="cta-primary px-8 py-4">Request a Quote</Link>
            <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">Call {COMPANY_PHONE}</a>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">Services Available in {location.name}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Post-Construction",
                  body: "Rough and final clean for active construction sites and new builds.",
                  href: "/services/post-construction-cleaning",
                },
                {
                  title: "Turnover Cleaning",
                  body: "Fast vacant unit turns for property managers and leasing teams.",
                  href: "/services/move-in-move-out-cleaning",
                },
                {
                  title: "Commercial Cleaning",
                  body: "Ongoing facility care for offices, retail, and commercial spaces.",
                  href: "/services/commercial-cleaning",
                },
              ].map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="surface-panel group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.body}</p>
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

        <section className="border-t border-slate-200 bg-[#F1F0EE] py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-lg font-semibold text-[#0A1628]">Also serving nearby areas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {location.nearbyAreas.map((area) => {
                const areaData = locations.find((entry) => entry.name === area);
                const href = areaData ? `/service-area/${areaData.slug}` : "/#service-area";

                return (
                  <Link
                    key={area}
                    href={href}
                    className="info-chip transition-colors hover:border-slate-300 hover:text-[#0A1628]"
                  >
                    {area}, TX
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#0A1628] py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">Ready to get started in {location.name}?</h2>
            <p className="mt-4 text-base font-light text-slate-300">Same standards, same responsiveness — wherever the project is.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/#quote" className="cta-gold px-8 py-4">Get a Quote</Link>
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
