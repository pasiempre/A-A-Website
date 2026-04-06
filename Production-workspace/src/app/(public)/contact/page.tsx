import type { Metadata } from "next";
import Link from "next/link";

import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { ContactPageClient } from "./ContactPageClient";
import {
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  COMPANY_PHONE_E164,
} from "@/lib/company";
import { SERVICE_AREA_CITIES } from "@/lib/service-areas";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us | A&A Cleaning Austin TX",
  description: `Contact ${COMPANY_NAME} for post-construction, commercial, and turnover cleaning quotes in the Austin, TX metro area. Call, email, or submit a request online.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact ${COMPANY_SHORT_NAME}`,
    description: "Get in touch for a cleaning quote. Same-day response during business hours.",
    url: `${getSiteUrl()}/contact`,
    type: "website",
  },
};

const CONTACT_METHODS = [
  {
    label: "Call Us",
    value: COMPANY_PHONE,
    href: `tel:${COMPANY_PHONE_E164}`,
    detail: "Mon–Fri 7am–6pm · Sat 8am–2pm",
    icon: "phone" as const,
    highlight: true,
  },
  {
    label: "Email Us",
    value: COMPANY_EMAIL,
    href: `mailto:${COMPANY_EMAIL}`,
    detail: "We respond within one business day",
    icon: "email" as const,
    highlight: false,
  },
  {
    label: "Service Area",
    value: "Greater Austin Metro",
    href: "/service-area",
    detail: "Georgetown to San Marcos",
    icon: "map" as const,
    highlight: false,
  },
];

const QUICK_FACTS = [
  {
    title: "Response Time",
    body: "We aim to return calls and form submissions within 1 hour during business hours.",
    icon: "clock" as const,
  },
  {
    title: "Languages",
    body: "Our team and AI assistant support both English and Spanish.",
    icon: "language" as const,
  },
  {
    title: "Coverage",
    body: "Austin, Round Rock, Pflugerville, Georgetown, Buda, Kyle, and San Marcos.",
    icon: "coverage" as const,
  },
  {
    title: "Licensed & Insured",
    body: "Fully licensed and insured for commercial and construction site work. COI available on request.",
    icon: "shield" as const,
  },
];

const SERVICE_TYPES = [
  "Post-Construction Cleaning",
  "Final Clean / Walkthrough Prep",
  "Commercial / Office Cleaning",
  "Move-In / Move-Out Turnover",
  "Windows & Power Washing",
  "Custom or Multi-Service Scope",
];

function ContactIcon({ icon }: { icon: "phone" | "email" | "map" }) {
  if (icon === "phone") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }
  if (icon === "email") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function QuickFactIcon({ icon }: { icon: "clock" | "language" | "coverage" | "shield" }) {
  if (icon === "clock") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5l3 1.8" />
      </svg>
    );
  }
  if (icon === "language") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
      </svg>
    );
  }
  if (icon === "coverage") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.2-3.6" />
    </svg>
  );
}

export default function ContactPage() {
  const baseUrl = getSiteUrl();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${baseUrl}/contact#page`,
      name: `Contact ${COMPANY_NAME}`,
      url: `${baseUrl}/contact`,
      mainEntity: { "@id": `${baseUrl}#localbusiness` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: `${baseUrl}/contact`,
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

      <main>
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#0A1628] pb-20 pt-32 md:pb-24 md:pt-40">
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
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,78,0.15),transparent_40%)]"
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
                  <li className="font-medium text-white">Contact</li>
                </ol>
              </nav>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-8 bg-[#C9A94E]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">
                  Get In Touch
                </span>
              </div>

              <h1 className="mt-4 max-w-3xl font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-[3.5rem]">
                Let&apos;s Talk About Your Next Project
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-300">
                Whether you need a quote for a multi-building closeout or a single unit turn, we&apos;re here
                to help. Reach out by phone, email, or use the form below — we respond within one hour
                during business hours.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {CONTACT_METHODS.map((method) => {
                  const isLink = method.href.startsWith("/");
                  const Tag = isLink ? Link : "a";

                  return (
                    <Tag
                      key={method.label}
                      href={method.href}
                      className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        method.highlight
                          ? "border-[#C9A94E]/30 bg-[#C9A94E]/10 hover:border-[#C9A94E]/50 hover:bg-[#C9A94E]/15"
                          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div
                        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${
                          method.highlight
                            ? "bg-[#C9A94E]/20 text-[#C9A94E] group-hover:bg-[#C9A94E]/30"
                            : "bg-white/10 text-slate-300 group-hover:bg-white/15 group-hover:text-white"
                        }`}
                      >
                        <ContactIcon icon={method.icon} />
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        {method.label}
                      </p>
                      <p
                        className={`mt-2 text-lg font-semibold ${
                          method.highlight ? "text-white" : "text-slate-100"
                        }`}
                      >
                        {method.value}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{method.detail}</p>

                      {method.highlight && (
                        <div
                          className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#C9A94E]/10"
                          aria-hidden="true"
                        />
                      )}
                    </Tag>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="contact-form" className="scroll-mt-32 bg-[#FAFAF8] py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
                      Send a Message
                    </span>
                  </div>

                  <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">
                    Contact Form
                  </h2>
                  <p className="mt-3 max-w-lg text-base font-light leading-relaxed text-slate-600">
                    Fill out the details below and we&apos;ll follow up with a scope review and next steps.
                    All fields marked with * are required.
                  </p>

                  <div className="mt-10">
                    <ContactPageClient serviceTypes={SERVICE_TYPES} />
                  </div>
                </div>

                <div className="lg:w-[380px] lg:shrink-0">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      Quick Facts
                    </p>

                    {QUICK_FACTS.map((fact) => (
                      <div
                        key={fact.title}
                        className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-[#FAFAF8] text-[#0A1628]">
                          <QuickFactIcon icon={fact.icon} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0A1628]">{fact.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500">{fact.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A94E]">
                      Business Hours
                    </p>
                    <div className="space-y-2.5 text-sm">
                      {[
                        { day: "Monday – Friday", hours: "7:00 AM – 6:00 PM" },
                        { day: "Saturday", hours: "8:00 AM – 2:00 PM" },
                        { day: "Sunday", hours: "Closed" },
                      ].map((row) => (
                        <div key={row.day} className="flex items-center justify-between">
                          <span className="text-slate-600">{row.day}</span>
                          <span
                            className={`font-medium ${
                              row.hours === "Closed" ? "text-slate-400" : "text-[#0A1628]"
                            }`}
                          >
                            {row.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-500">
                        Emergency and same-day service available outside business hours by request.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#C9A94E]/20 bg-[#C9A94E]/5 p-6">
                    <p className="text-sm font-semibold text-[#0A1628]">Prefer to talk directly?</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Our team is standing by during business hours. Call now and speak with someone who can
                      review your project scope.
                    </p>
                    <CTAButton
                      ctaId="contact_sidebar_call"
                      actionType="call"
                      href={`tel:${COMPANY_PHONE_E164}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#C9A94E] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0A1628] transition-all duration-300 hover:bg-[#d4b85e] hover:shadow-lg hover:shadow-[#C9A94E]/20"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                      </svg>
                      Call {COMPANY_PHONE}
                    </CTAButton>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h2 className="font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">
                    Serving the Greater Austin Metro
                  </h2>
                  <p className="mt-4 text-base font-light leading-relaxed text-slate-600">
                    From Georgetown to San Marcos, we bring the same standards to every location. Don&apos;t
                    see your area listed? Reach out — we may still cover it.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Austin", href: "/service-area" },
                    ...SERVICE_AREA_CITIES.slice(0, 6).map((city) => ({
                      name: city.name,
                      href: `/service-area/${city.slug}`,
                    })),
                  ].map((city) => (
                    <Link
                      key={city.name}
                      href={city.href}
                      className="rounded-full border border-slate-200 bg-[#FAFAF8] px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-[#0A1628]"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/service-area" className="cta-outline-dark gap-2 px-6 py-3">
                  View All Service Areas
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M12 6l4 4-4 4" />
                  </svg>
                </Link>
                <Link href="/services" className="cta-outline-dark gap-2 px-6 py-3">
                  Explore Our Services
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M12 6l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
      </main>
    </>
  );
}
