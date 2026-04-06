import type { Metadata } from "next";
import Link from "next/link";

import {
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_PHONE,
  COMPANY_PHONE_E164,
} from "@/lib/company";
import { getSiteUrl } from "@/lib/site";
import type { ServiceAreaRegion } from "@/lib/service-areas";
import { SERVICE_AREA_CITIES } from "@/lib/service-areas";
import {
  SERVICE_AREA_VISUAL_POINTS,
} from "@/data/service-area-visual";

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

const VISUAL_REGION_MAP: Record<"north" | "central" | "south", "North" | "Central" | "South"> = {
  north: "North",
  central: "Central",
  south: "South",
};

const SERVICES_ACROSS_AREAS = [
  {
    title: "Post-Construction Cleaning",
    detail: "Rough and final cleaning support for active jobsite closeouts and handoff readiness.",
    href: "/services/post-construction-cleaning",
  },
  {
    title: "Commercial Cleaning",
    detail: "Recurring and scheduled support for offices, retail environments, and facility operations.",
    href: "/services/commercial-cleaning",
  },
  {
    title: "Move-In / Move-Out",
    detail: "Unit turnover and transition cleaning support for leasing and occupancy timelines.",
    href: "/services/move-in-move-out-cleaning",
  },
];

const COVERAGE_FAQS = [
  {
    question: "Do you serve areas outside the listed city pages?",
    answer:
      "Often yes. We can support nearby areas based on scope, schedule, and crew availability. Contact us with project details for confirmation.",
  },
  {
    question: "How quickly can you respond to service requests across the metro?",
    answer:
      "Our team targets fast response on quote requests and schedules execution windows based on project urgency and location.",
  },
  {
    question: "Do standards vary by city?",
    answer:
      "No. Service standards remain consistent across the Austin corridor. Location affects logistics, not quality expectations.",
  },
  {
    question: "Can you support recurring and one-time scopes in the same area?",
    answer:
      "Yes. We support recurring maintenance and one-time project-based cleaning in every active coverage area.",
  },
];

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

      <main>
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

              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-2xl border border-slate-200 bg-[#0A1628] p-5 shadow-sm md:p-7">
                  <svg
                    viewBox="0 0 100 100"
                    className="h-[300px] w-full"
                    role="img"
                    aria-label="Austin metro service map showing North, Central, and South coverage"
                  >
                    <ellipse
                      cx="48"
                      cy="50"
                      rx="30"
                      ry="46"
                      fill="none"
                      stroke="rgba(201,169,78,0.2)"
                      strokeWidth="0.7"
                      strokeDasharray="2 3"
                    />

                    {SERVICE_AREA_VISUAL_POINTS.filter((area) => area.name !== "Austin").map((area) => {
                      const austin = SERVICE_AREA_VISUAL_POINTS.find((point) => point.name === "Austin");
                      if (!austin) return null;
                      return (
                        <line
                          key={`line-${area.name}`}
                          x1={austin.x}
                          y1={austin.y}
                          x2={area.x}
                          y2={area.y}
                          stroke="rgba(255,255,255,0.12)"
                          strokeWidth="0.5"
                          strokeDasharray="1.5 3"
                        />
                      );
                    })}

                    {SERVICE_AREA_VISUAL_POINTS.map((area) => {
                      const region = VISUAL_REGION_MAP[area.region];
                      const dot = REGION_COLORS[region].dot.replace("bg-[", "").replace("]", "");
                      const isHQ = area.name === "Austin";

                      return (
                        <g key={`point-${area.name}`}>
                          <circle
                            cx={area.x}
                            cy={area.y}
                            r={isHQ ? 2.6 : 1.9}
                            fill={dot}
                            opacity={0.95}
                          />
                          <text
                            x={area.x}
                            y={area.y + (isHQ ? 5.8 : 4.8)}
                            textAnchor="middle"
                            className="fill-slate-300 text-[3.6px]"
                          >
                            {area.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {(Object.keys(REGION_COLORS) as Array<CityData["region"]>).map((region) => (
                      <div key={`legend-${region}`} className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${REGION_COLORS[region].dot}`} aria-hidden="true" />
                        <span className="text-xs text-slate-300">{region}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                  <h3 className="text-lg font-semibold text-[#0A1628]">City Pages</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Use the links below to open city-specific service details, local proof signals, and nearby-area handoffs.
                  </p>

                  <ul className="mt-5 space-y-2">
                    {CITIES.map((city) => {
                      const isHQ = city.slug === "";
                      const href = isHQ ? "/service-area" : `/service-area/${city.slug}`;

                      return (
                        <li key={`city-link-${city.name}`}>
                          <Link
                            href={href}
                            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-[#FAFAF8] px-4 py-3 transition hover:border-slate-300 hover:bg-white"
                          >
                            <span className="flex items-center gap-2.5">
                              <span className={`h-2 w-2 rounded-full ${REGION_COLORS[city.region].dot}`} aria-hidden="true" />
                              <span className="text-sm font-semibold text-[#0A1628]">{city.name}</span>
                            </span>
                            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700">{city.distance}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-slate-200 bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
                  Services Across All Areas
                </span>
              </div>

              <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">
                Built for Consistent Coverage
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {SERVICES_ACROSS_AREAS.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="group rounded-2xl border border-slate-200 bg-[#FAFAF8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                  >
                    <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.detail}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
                      Learn more
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
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

          <section className="bg-[#FAFAF8] py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
                  Coverage FAQ
                </span>
              </div>

              <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">
                Common Questions About Service Area Coverage
              </h2>

              <div className="mt-6 space-y-3">
                {COVERAGE_FAQS.map((faq) => (
                  <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-[#0A1628] md:text-base">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-[#2563EB]">+</span>
                        {faq.question}
                      </span>
                    </summary>
                    <p className="border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </details>
                ))}
              </div>

              <div className="mt-6 text-sm text-slate-600">
                Looking for buyer-specific guidance?
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
    </>
  );
}
