import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageShell } from "@/components/public/PublicPageShell";
import {
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_PHONE,
  COMPANY_PHONE_E164,
} from "@/lib/company";
import { getSiteUrl } from "@/lib/site";
import type { ServiceAreaRegion } from "@/lib/service-areas";
import { SERVICE_AREA_CITIES } from "@/lib/service-areas";

export const metadata: Metadata = {
  title: "Service Area — Austin Metro Cleaning Coverage",
  description: `${COMPANY_NAME} serves the greater Austin, TX metro area with post-construction, commercial, and turnover cleaning. View all cities and service areas we cover.`,
  alternates: { canonical: "/service-area" },
  openGraph: {
    title: `Service Area | ${COMPANY_SHORT_NAME}`,
    description:
      "Georgetown to San Marcos — same standards, every location. See the full Austin metro coverage map.",
    url: `${getSiteUrl()}/service-area`,
    type: "website",
  },
};

type CityData = {
  name: string;
  slug: string;
  distance: string;
  region: ServiceAreaRegion;
  tagline: string;
  highlights: string[];
};

const CITIES: CityData[] = [
  {
    name: "Austin",
    slug: "",
    distance: "Headquarters",
    region: "Central",
    tagline:
      "Our home base. Full service coverage across all Austin neighborhoods and commercial districts.",
    highlights: ["Post-Construction", "Commercial", "Turnover"],
  },
  ...SERVICE_AREA_CITIES.map((city) => ({
    name: city.name,
    slug: city.slug,
    distance: city.distanceLabel.replace(" miles from Austin HQ", " mi"),
    region: city.region,
    tagline: city.description,
    highlights: city.highlights.slice(0, 3),
  })),
];

const REGION_COLORS: Record<CityData["region"], { dot: string; badge: string }> = {
  North: {
    dot: "bg-[#3b82f6]",
    badge: "bg-blue-50 text-blue-700 border-blue-200/60",
  },
  Central: {
    dot: "bg-[#0A1628]",
    badge: "bg-slate-100 text-[#0A1628] border-slate-300",
  },
  South: {
    dot: "bg-[#C9A94E]",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
};

export default function ServiceAreaIndexPage() {
  const baseUrl = getSiteUrl();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${baseUrl}/service-area#page`,
      name: `Service Area — ${COMPANY_NAME}`,
      description: `Cities and areas served by ${COMPANY_NAME} in the Austin, TX metro.`,
      url: `${baseUrl}/service-area`,
      isPartOf: { "@id": `${baseUrl}#website` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Service Area",
            item: `${baseUrl}/service-area`,
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#localbusiness`,
      name: COMPANY_NAME,
      areaServed: CITIES.map((city) => ({
        "@type": "City",
        name: city.name,
        containedInPlace: {
          "@type": "State",
          name: "Texas",
        },
      })),
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
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#0A1628] pb-20 pt-32 md:pb-28 md:pt-40">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
              style={{
                background: "radial-gradient(ellipse, rgba(201,169,78,0.4) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl px-6">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-xs text-slate-400">
                  <li>
                    <Link href="/" className="transition hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-medium text-white">Service Area</li>
                </ol>
              </nav>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-8 bg-[#C9A94E]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">
                  Where We Work
                </span>
              </div>

              <h1 className="mt-4 max-w-3xl font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-[3.5rem]">
                Greater Austin Metro Coverage
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-300">
                Georgetown to San Marcos — same standards, same responsiveness, every location. We serve
                {" "}
                {CITIES.length} cities across the Austin metro with post-construction, commercial, and
                turnover cleaning.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                {(["North", "Central", "South"] as const).map((region) => {
                  const count = CITIES.filter((city) => city.region === region).length;
                  return (
                    <div key={region} className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${REGION_COLORS[region].dot} ${
                          region === "Central" ? "ring-1 ring-white/30" : ""
                        }`}
                      />
                      <span className="text-sm text-slate-300">
                        {region}{" "}
                        <span className="text-slate-500">
                          ({count} {count === 1 ? "city" : "cities"})
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                {[
                  { value: String(CITIES.length), label: "Cities Served" },
                  { value: "30mi", label: "Max Radius" },
                  { value: "1hr", label: "Response Target" },
                  { value: "500+", label: "Projects Delivered" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4"
                  >
                    <p className="font-serif text-2xl tracking-tight text-white md:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#FAFAF8] py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
                      All Locations
                    </span>
                  </div>
                  <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">
                    Cities We Serve
                  </h2>
                  <p className="mt-3 max-w-lg text-base font-light leading-relaxed text-slate-600">
                    Click any city below to view location-specific details, services available, and how to
                    get started.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {CITIES.map((city) => {
                  const regionColor = REGION_COLORS[city.region];
                  const isHQ = city.slug === "";
                  const href = isHQ ? "/#service-area" : `/service-area/${city.slug}`;

                  return (
                    <Link
                      key={city.name}
                      href={href}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        isHQ
                          ? "border-[#C9A94E]/30 ring-1 ring-[#C9A94E]/10"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`h-1 w-full transition-all duration-300 group-hover:h-1.5 ${
                          city.region === "North"
                            ? "bg-[#3b82f6]"
                            : city.region === "South"
                            ? "bg-[#C9A94E]"
                            : "bg-[#0A1628]"
                        }`}
                        aria-hidden="true"
                      />

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${regionColor.dot} ${
                                isHQ ? "ring-2 ring-[#C9A94E]/30" : ""
                              }`}
                            />
                            <h3 className="text-lg font-semibold text-[#0A1628]">{city.name}</h3>
                          </div>
                          <span className="text-xs font-medium text-slate-500">{city.distance}</span>
                        </div>

                        <span
                          className={`mb-4 inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${regionColor.badge}`}
                        >
                          {city.region}
                        </span>

                        <p className="text-sm leading-relaxed text-slate-600">{city.tagline}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {city.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="rounded-full border border-slate-200 bg-[#FAFAF8] px-2.5 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628]">
                          {isHQ ? "View Austin section" : `View ${city.name} page`}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 10h12M12 6l4 4-4 4" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="rounded-3xl border border-slate-200 bg-[#0A1628] p-8 md:p-12">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">
                      Need Service Outside These Cities?
                    </p>
                    <h2 className="mt-4 font-serif text-3xl tracking-tight text-white md:text-4xl">
                      Tell Us About Your Project Location
                    </h2>
                    <p className="mt-4 text-base font-light leading-relaxed text-slate-300">
                      We regularly support projects just outside our standard service footprint depending on
                      scope, timeline, and crew availability.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/contact" className="cta-primary px-6 py-3">
                      Request Coverage
                    </Link>
                    <a
                      href={`tel:${COMPANY_PHONE_E164}`}
                      className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
                    >
                      Call {COMPANY_PHONE}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PublicPageShell>
    </>
  );
}
