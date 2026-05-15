I have everything. Two bonus findings before I start:

**F-012 (FAQSection filter buttons) — ALREADY DONE.** The code already has both `min-h-[44px]` and `aria-pressed={filter === category}`. Session 4E requires zero changes.

**F-019 on FAQSection — ALREADY DONE.** The section already uses `bg-[#FAFAF8]`, not `bg-[#F1F0EE]`.

Now delivering the complete Session 4 remainder + full Session 5, organized by file.

---

## Session 4 Remainder

### 4E · FAQSection Filter Buttons → F-012 — ✅ ALREADY DONE

No changes needed. Both `min-h-[44px]` and `aria-pressed` already present.

### 4H · ServicePageHardening Heading Hierarchy → F-018

The four top-level sections already use `<h2>` (correct). The issue is `<h4>` sub-headings that skip `<h3>`:

**Pricing "Includes" and "Common Add-Ons":**
```typescript
// ━━━ FIND (2 instances): ━━━
              <h4 className="text-sm font-bold uppercase tracking-wide text-[#0A1628]">Includes</h4>

// ━━━ REPLACE WITH: ━━━
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#0A1628]">Includes</h3>
```

```typescript
// ━━━ FIND: ━━━
              <h4 className="text-sm font-bold uppercase tracking-wide text-[#0A1628]">Common Add-Ons</h4>

// ━━━ REPLACE WITH: ━━━
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#0A1628]">Common Add-Ons</h3>
```

**Objection item titles:**
```typescript
// ━━━ FIND: ━━━
                <h4 className="font-bold text-[#0A1628]">{obj.title}</h4>

// ━━━ REPLACE WITH: ━━━
                <h3 className="font-bold text-[#0A1628]">{obj.title}</h3>
```

This fixes h2→h4 level-skipping to proper h2→h3 nesting.

---

## Session 5: Complete Implementation

### `PublicHeader.tsx` — 5B + 5P

**5B — Add `/industries` to forceSolidHeader:**
```typescript
// ━━━ FIND (after Session 1B additions): ━━━
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname === "/service-area" ||

// ━━━ ADD BEFORE service-area: ━━━
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname === "/industries" ||
    pathname === "/service-area" ||
```

**5P — Fix primaryLinks hrefs:**
```typescript
// ━━━ FIND: ━━━
const primaryLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Industries" },

// ━━━ REPLACE WITH: ━━━
const primaryLinks = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
```

---

### `FooterSection.tsx` — 5A + 5L

**5A — Fix nav routes (4 changes):**
```typescript
// ━━━ FIND: ━━━
              <li><Link href="/#services" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Services</Link></li>
              <li><Link href="/#industries" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Who We Serve</Link></li>
              <li><Link href="/#about" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />About</Link></li>
              <li><Link href="/#service-area" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Service Area</Link></li>

// ━━━ REPLACE WITH: ━━━
              <li><Link href="/services" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Services</Link></li>
              <li><Link href="/industries" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Who We Serve</Link></li>
              <li><Link href="/about" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />About</Link></li>
              <li><Link href="/service-area" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Service Area</Link></li>
```

**5L — Fix "Built For" chip labels:**
```typescript
// ━━━ FIND: ━━━
              <li className="info-chip-dark">Contractors</li>
              <li className="info-chip-dark">Property Teams</li>

// ━━━ REPLACE WITH: ━━━
              <li className="info-chip-dark">General Contractors</li>
              <li className="info-chip-dark">Property Managers</li>
```

---

### `industries/[slug]/page.tsx` — 5C + 5D + 5K + 5M

**5C — Fix breadcrumb link:**
```typescript
// ━━━ FIND: ━━━
                  <Link href="/#industries" className="hover:text-white">Industries</Link>

// ━━━ REPLACE WITH: ━━━
                  <Link href="/industries" className="hover:text-white">Industries</Link>
```

**5D — Hero call CTA → `.cta-light` (after Session 2 wiring):**
```typescript
// ━━━ FIND (hero): ━━━
              <CTAButton ctaId={`industry_${industry.slug}_hero_call`} actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[48px] border-white/30 bg-white/5 text-white hover:bg-white hover:text-[#0A1628]">

// ━━━ REPLACE WITH: ━━━
              <CTAButton ctaId={`industry_${industry.slug}_hero_call`} actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-light min-h-[48px]">
```

**5D — Closing call CTA → `.cta-light`:**
```typescript
// ━━━ FIND (closing): ━━━
              <CTAButton ctaId={`industry_${industry.slug}_closing_call`} actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[48px] border-white/35 text-white hover:bg-white hover:text-[#0A1628]">

// ━━━ REPLACE WITH: ━━━
              <CTAButton ctaId={`industry_${industry.slug}_closing_call`} actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-light min-h-[48px]">
```

**5D — Replace SERVICE_LINK_BY_ANCHOR with service.href (now available from Session 3A):**
```typescript
// ━━━ FIND: ━━━
const SERVICE_LINK_BY_ANCHOR: Record<string, string> = {
  "service-post-construction": "/services/post-construction-cleaning",
  "service-final-clean": "/services/final-clean",
  "service-commercial": "/services/commercial-cleaning",
  "service-move": "/services/move-in-move-out-cleaning",
  "service-windows": "/services/windows-power-wash",
};

// ━━━ DELETE entirely. Then find the usage: ━━━

                    href={SERVICE_LINK_BY_ANCHOR[service.anchor] ?? "/services"}

// ━━━ REPLACE WITH: ━━━
                    href={service.href}
```

**5K — Fix "Español" accent (2 instances in hero + closing chips):**
```typescript
// ━━━ FIND (2 instances): ━━━
              <span className="info-chip-dark">Se Habla Espanol</span>

// ━━━ REPLACE WITH: ━━━
              <span className="info-chip-dark">Se Habla Español</span>
```

**5M — Testimonial anonymization (in INDUSTRY_PAGE_CONTENT):**

```typescript
// ━━━ FIND (general-contractors socialProof): ━━━
      name: "Marcus Torres",
      role: "Project Manager, Top-Tier Construction",

// ━━━ REPLACE WITH: ━━━
      name: "Project Manager",
      role: "General Contractor, Austin TX",
```

```typescript
// ━━━ FIND (property-managers socialProof): ━━━
      name: "James Rodriguez",
      role: "Operations Director, Prestige Developments",

// ━━━ REPLACE WITH: ━━━
      name: "Operations Director",
      role: "Property Management, Austin TX",
```

```typescript
// ━━━ FIND (commercial-spaces socialProof): ━━━
      name: "David Chen",
      role: "Site Superintendent, BuildCo Partners",

// ━━━ REPLACE WITH: ━━━
      name: "Site Superintendent",
      role: "Commercial Operations, Austin TX",
```

---

### `about/page.tsx` — 5D + 5N

**5D — Closing call CTA → `.cta-light` (after Session 2 wiring):**
```typescript
// ━━━ FIND: ━━━
              <CTAButton ctaId="about_closing_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[48px] border-white/35 text-white hover:bg-white hover:text-[#0A1628]">

// ━━━ REPLACE WITH: ━━━
              <CTAButton ctaId="about_closing_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-light min-h-[48px]">
```

**5N — Add careers link to "Who We Work With" cross-links:**
```typescript
// ━━━ FIND: ━━━
            <div className="mt-6 text-sm text-slate-600">
              Need coverage details?
              {" "}
              <Link href="/service-area" className="font-semibold text-[#2563EB]">
                Explore service areas
              </Link>
              {" • "}
              <Link href="/faq" className="font-semibold text-[#2563EB]">
                View FAQ
              </Link>
            </div>

// ━━━ REPLACE WITH: ━━━
            <div className="mt-6 text-sm text-slate-600">
              Need coverage details?
              {" "}
              <Link href="/service-area" className="font-semibold text-[#2563EB]">
                Explore service areas
              </Link>
              {" • "}
              <Link href="/faq" className="font-semibold text-[#2563EB]">
                View FAQ
              </Link>
              {" • "}
              <Link href="/careers" className="font-semibold text-[#2563EB]">
                Careers
              </Link>
            </div>
```

---

### `careers/page.tsx` — 5H

**Add closing dark CTA band BEFORE the existing bottom bar section:**
```typescript
// ━━━ FIND: ━━━
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-sm text-slate-600">

// ━━━ ADD BEFORE: ━━━
      <section className="bg-[#0A1628] py-14 text-center md:py-18">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">Join the Team</p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-white md:text-4xl">
            Ready to work with a crew that values quality?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Submit your application above, or call us to learn more about open roles.
          </p>
          <div className="mt-7">
            <CTAButton ctaId="careers_closing_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-light min-h-[48px]">
              Call {COMPANY_PHONE}
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-sm text-slate-600">
```

Need to add `COMPANY_PHONE_E164` to imports:
```typescript
// ━━━ FIND: ━━━
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";

// ━━━ Already present from Session 2. No change needed. ━━━
```

---

### `contact/page.tsx` — 5G + 5R

**5G — Import SERVICE_AREA_CITIES:**
```typescript
// ━━━ ADD (after existing imports): ━━━
import { SERVICE_AREA_CITIES } from "@/lib/service-areas";
```

**5G — Replace static city chips with linked chips:**
```typescript
// ━━━ FIND: ━━━
                <div className="flex flex-wrap gap-2">
                  {["Austin", "Round Rock", "Pflugerville", "Georgetown", "Hutto", "Buda", "Kyle", "San Marcos"].map(
                    (city) => (
                      <span
                        key={city}
                        className="rounded-full border border-slate-200 bg-[#FAFAF8] px-4 py-2 text-sm font-medium text-slate-600"
                      >
                        {city}
                      </span>
                    ),
                  )}
                </div>

// ━━━ REPLACE WITH: ━━━
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
```

**5G — Update QUICK_FACTS Coverage text:**
```typescript
// ━━━ FIND: ━━━
    body: "Austin, Round Rock, Pflugerville, Georgetown, Hutto, Buda, Kyle, and San Marcos.",

// ━━━ REPLACE WITH: ━━━
    body: "Austin, Round Rock, Pflugerville, Georgetown, Buda, Kyle, and San Marcos.",
```

**5R — Fix "Explore Our Services" link:**
```typescript
// ━━━ FIND: ━━━
                <Link href="/#services" className="cta-outline-dark gap-2 px-6 py-3">
                  Explore Our Services

// ━━━ REPLACE WITH: ━━━
                <Link href="/services" className="cta-outline-dark gap-2 px-6 py-3">
                  Explore Our Services
```

---

### `service-area/page.tsx` (hub) — 5F

**Replace hardcoded SERVICES_ACROSS_AREAS with data-driven:**

Add import:
```typescript
// ━━━ ADD (after existing imports): ━━━
import { SERVICES } from "@/data/services";
```

Delete the `SERVICES_ACROSS_AREAS` constant:
```typescript
// ━━━ DELETE ENTIRELY: ━━━
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
```

Replace the rendering:
```typescript
// ━━━ FIND: ━━━
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {SERVICES_ACROSS_AREAS.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="group rounded-2xl border border-slate-200 bg-[#FAFAF8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                  >
                    <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.detail}</p>

// ━━━ REPLACE WITH: ━━━
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map((service) => (
                  <Link
                    key={service.anchor}
                    href={service.href}
                    className="group rounded-2xl border border-slate-200 bg-[#FAFAF8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                  >
                    <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">{service.titleLines.join(" ")}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
```

The rest of the card JSX (the "Learn more" link + SVG) stays the same.

---

### `service-area/[slug]/page.tsx` (city) — 5F

Add import:
```typescript
// ━━━ ADD (after existing imports): ━━━
import { SERVICES } from "@/data/services";
```

Replace hardcoded services:
```typescript
// ━━━ FIND: ━━━
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

// ━━━ REPLACE WITH: ━━━
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <Link
                  key={service.anchor}
                  href={service.href}
                  className="surface-panel group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">{service.titleLines.join(" ")}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
```

The rest of the card JSX ("Learn more" link + SVG) stays the same.

---

### `faq-items.ts` — 5I + 5J

**5J — Update "What areas do you serve?" answer:**
```typescript
// ━━━ FIND: ━━━
    answer:
      "We serve the greater Austin metro area including Round Rock, Pflugerville, Georgetown, Hutto, Buda, Kyle, and San Marcos. If you're outside that range, reach out — we may still be able to help depending on project size.",

// ━━━ REPLACE WITH: ━━━
    answer:
      "We serve the greater Austin metro area including Round Rock, Pflugerville, Georgetown, Buda, Kyle, and San Marcos. We also cover other communities in the corridor — reach out if your project is outside these areas.",
```

**5I — Update "How quickly can you start?" answer:**
```typescript
// ━━━ FIND: ━━━
    answer:
      "We respond to quote requests within one hour during business hours. Depending on crew availability, we can often begin within 24–48 hours. Emergency same-day starts are available by request for turnover and move-out situations.",

// ━━━ REPLACE WITH: ━━━
    answer:
      "We respond to quote requests within one hour during business hours for the central Austin metro. Response windows for outlying areas like Georgetown, Kyle, and San Marcos may be up to 90 minutes. Depending on crew availability, we can often begin within 24–48 hours. Emergency same-day starts are available by request for turnover and move-out situations.",
```

---

### `lib/service-areas.ts` — 5J

**Add documenting comment:**
```typescript
// ━━━ FIND: ━━━
export const HOMEPAGE_SERVICE_AREA_LINKS = SERVICE_AREA_CITIES.slice(0, 6).map((city) => ({

// ━━━ REPLACE WITH: ━━━
// Display the first 6 cities on homepage/service pills. Hutto (index 6) retains
// its own city page for organic search but is excluded from featured navigation.
export const HOMEPAGE_SERVICE_AREA_LINKS = SERVICE_AREA_CITIES.slice(0, 6).map((city) => ({
```

---

### `lib/company.ts` — 5Q

**Add company stats and hours:**
```typescript
// ━━━ ADD at end of file: ━━━

export const COMPANY_STATS = {
  projectsDelivered: "500+",
  yearsExperience: "15+",
  responseTarget: "1hr",
  executionStandard: "100%",
} as const;

export const COMPANY_HOURS = {
  weekday: { label: "Monday – Friday", hours: "7:00 AM – 6:00 PM" },
  saturday: { label: "Saturday", hours: "8:00 AM – 2:00 PM" },
  sunday: { label: "Sunday", hours: "Closed" },
  summary: "Mon–Fri 7am–6pm · Sat 8am–2pm",
} as const;
```

---

### Service Detail Pages (all 5) — 5O

**Add import to each:**
```typescript
// ━━━ ADD (after existing imports): ━━━
import { SERVICES } from "@/data/services";
```

**Add related services section BEFORE the closing dark CTA band on each page:**
```typescript
// ━━━ FIND (on each service page): ━━━
        <section className="bg-[#0A1628] py-16 text-center md:py-20">

// ━━━ ADD BEFORE: ━━━
        <section className="border-t border-slate-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">Related Services</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">
              Explore Other Services
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {SERVICES.filter((s) => s.href !== PAGE_PATH).slice(0, 3).map((service) => (
                <Link
                  key={service.anchor}
                  href={service.href}
                  className="surface-panel group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">{service.packageLabel}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#0A1628] group-hover:text-[#2563EB]">
                    {service.titleLines.join(" ")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
                    Learn more <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0A1628] py-16 text-center md:py-20">
```

Each page already defines `PAGE_PATH` — the filter works correctly to exclude the current page.

---

### NEW FILE: `app/(public)/industries/page.tsx` — 5B

```typescript
import type { Metadata } from "next";
import Link from "next/link";

import { INDUSTRIES } from "@/data/industries";
import { QuoteCTA } from "@/components/public/variant-a/QuoteCTA";
import { CTAButton } from "@/components/public/variant-a/CTAButton";
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
                    Learn more <span aria-hidden="true">→</span>
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
                About A&amp;A
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
```

---

## Session 4 + 5 Combined Summary

| Task | File(s) | Change |
|------|---------|--------|
| 4E | `FAQSection.tsx` | **Already done** — no changes |
| 4H | `ServicePageHardening.tsx` | 3× `<h4>` → `<h3>` |
| 5A | `FooterSection.tsx` | 4 nav links → dedicated routes |
| 5B | NEW `industries/page.tsx` + `PublicHeader.tsx` | New page + forceSolidHeader |
| 5C | `industries/[slug]/page.tsx` | Breadcrumb → `/industries` |
| 5D | `about/page.tsx`, `industries/[slug]/page.tsx` | 3× `.cta-outline-dark` overrides → `.cta-light` |
| 5F | `service-area/page.tsx`, `service-area/[slug]/page.tsx` | Data-driven 5 services |
| 5G | `contact/page.tsx` | City chips → links, remove Hutto from QUICK_FACTS |
| 5H | `careers/page.tsx` | Add closing dark CTA band |
| 5I | `faq-items.ts` | Response time nuance |
| 5J | `faq-items.ts`, `lib/service-areas.ts` | Remove Hutto from FAQ, add comment |
| 5K | `industries/[slug]/page.tsx` | 2× "Espanol" → "Español" |
| 5L | `FooterSection.tsx` | "Contractors" → "General Contractors", "Property Teams" → "Property Managers" |
| 5M | `industries/[slug]/page.tsx` | 3 testimonials anonymized |
| 5N | `about/page.tsx` | Add careers link |
| 5O | 5 service detail pages | Add related services section |
| 5P | `PublicHeader.tsx` | primaryLinks → `/services`, `/industries` |
| 5Q | `lib/company.ts` | Add COMPANY_STATS, COMPANY_HOURS |
| 5R | `contact/page.tsx` | `/#services` → `/services` |

**New files:** `industries/page.tsx`
**New CTA IDs:** `industries_index_closing_quote`, `industries_index_closing_call`, `careers_closing_call`
**Findings resolved:** F-012 (already done), F-018, F-023–F-030, F-032, F-037–F-042, F-045–F-048

---

