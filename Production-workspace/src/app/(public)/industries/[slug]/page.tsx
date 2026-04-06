import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { INDUSTRIES, type IndustryData } from "@/data/industries";
import { SERVICES } from "@/data/services";
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { INDUSTRY_TO_SERVICE_TYPE } from "@/lib/service-type-map";
import { getSiteUrl } from "@/lib/site";

type IndustrySlug = IndustryData["slug"];

type IndustryPageContent = {
  title: string;
  description: string;
  hero: {
    kicker: string;
    headline: string;
    subtitle: string;
    stat: string;
    statLabel: string;
    image: string;
    imageAlt: string;
  };
  pain: {
    headline: string;
    body: string;
    signals: string[];
  };
  solutionsHeadline: string;
  solutions: Array<{
    title: string;
    detail: string;
  }>;
  serviceAnchors: string[];
  socialProof: {
    quote: string;
    name: string;
    role: string;
    tag: string;
    stats: string[];
  };
  beforeAfter: {
    beforeImage: string;
    afterImage: string;
    caption: string;
    projectType: string;
    scope: string;
    keyBenefit: string;
  };
  howItWorksHeadline: string;
  stepThreeLabel: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  conversionHeadline: string;
};

const SERVICE_LINK_BY_ANCHOR: Record<string, string> = {
  "service-post-construction": "/services/post-construction-cleaning",
  "service-final-clean": "/services/final-clean",
  "service-commercial": "/services/commercial-cleaning",
  "service-move": "/services/move-in-move-out-cleaning",
  "service-windows": "/services/windows-power-wash",
};

const INDUSTRY_PAGE_CONTENT: Record<IndustrySlug, IndustryPageContent> = {
  "general-contractors": {
    title: "Post-Construction Cleaning for General Contractors | Austin TX",
    description:
      "Closeout-ready post-construction and final clean support for Austin general contractors. Licensed crews, first-pass quality, and schedule-locked execution.",
    hero: {
      kicker: "For General Contractors",
      headline: "Closeout-Ready Cleaning. On Your Schedule.",
      subtitle:
        "Post-construction rough and final cleans for Austin GCs who cannot afford walkthrough callbacks.",
      stat: "200+",
      statLabel: "closeouts completed on schedule",
      image: "/images/variant-a/comparison-03-after.jpg",
      imageAlt: "Final-cleaned commercial space prepared for contractor walkthrough",
    },
    pain: {
      headline: "The final clean should not be the reason your handoff slips.",
      body:
        "Missed walkthrough readiness and uneven finish quality cause punch-list resets and unnecessary pressure at closeout. We align execution to your schedule so your turnover stays protected.",
      signals: [
        "Missed handoff windows",
        "Inconsistent detail finish across units or floors",
        "Extra coordination burden on PMs and supers",
      ],
    },
    solutionsHeadline: "How A&A Works With General Contractors",
    solutions: [
      {
        title: "Schedule-Locked Crews",
        detail:
          "Dispatch plans are aligned to your walkthrough and CO targets, not generic vendor windows.",
      },
      {
        title: "First-Pass Quality Standard",
        detail:
          "Detail protocols are built for glass, trim, fixtures, and finish surfaces so you avoid cleaning callbacks.",
      },
      {
        title: "Scope-Aware Coordination",
        detail:
          "Phase-specific execution keeps rough clean and final clean expectations clear across active trades.",
      },
      {
        title: "COI Ready Response",
        detail: "Insurance documentation is available quickly for site onboarding and compliance checks.",
      },
    ],
    serviceAnchors: ["service-post-construction", "service-final-clean", "service-windows"],
    socialProof: {
      quote:
        "A&A has been our go-to final-clean partner for closeout pressure jobs. They show up on schedule and deliver to walkthrough standard.",
      name: "Marcus Torres",
      role: "Project Manager, Top-Tier Construction",
      tag: "Post-Construction",
      stats: ["200+ closeouts on schedule", "Zero cleaning punch-list callbacks", "15+ years field experience"],
    },
    beforeAfter: {
      beforeImage: "/images/variant-a/comparison-03-before.jpg",
      afterImage: "/images/variant-a/comparison-03-after.jpg",
      caption: "Construction final-clean comparison",
      projectType: "Commercial closeout",
      scope: "Dust, detail finish, walkthrough prep",
      keyBenefit: "Owner-ready presentation",
    },
    howItWorksHeadline: "Three Steps to a Cleaner Handoff",
    stepThreeLabel: "You Walk Through a Closeout-Ready Space",
    faqs: [
      {
        question: "Can you match our construction timeline?",
        answer:
          "Yes. We align dispatch to your milestone schedule and walkthrough dates, with communication checkpoints before arrival and completion.",
      },
      {
        question: "Do you provide COI documentation?",
        answer:
          "Yes. We can provide insurance documentation for site onboarding and compliance requirements.",
      },
      {
        question: "What is included in rough clean vs final clean?",
        answer:
          "Rough clean handles debris and bulk dust during active construction. Final clean is the detailed pass for handoff and walkthrough presentation.",
      },
      {
        question: "What happens if the walkthrough flags cleaning items?",
        answer:
          "If cleaning-related issues are identified, we return and resolve items quickly so the handoff stays on track.",
      },
    ],
    conversionHeadline: "Let us keep your closeout on schedule.",
  },
  "property-managers": {
    title: "Turnover Cleaning for Property Managers | Austin TX",
    description:
      "Fast, consistent turnover cleaning for Austin property managers. Unit-ready execution, predictable scheduling, and cleaner handoffs between maintenance and leasing.",
    hero: {
      kicker: "For Property Managers",
      headline: "Turnover-Ready Units. Every Time.",
      subtitle:
        "Fast move-in and move-out cleaning support that keeps leasing timelines moving and inspections cleaner.",
      stat: "48hr",
      statLabel: "average unit turnaround",
      image: "/images/variant-a/comparison-02-after.jpg",
      imageAlt: "Lease-ready apartment interior after turnover cleaning",
    },
    pain: {
      headline: "Slow turns cost more than cleaning ever will.",
      body:
        "When turnover quality varies, leasing schedules slip, inspections fail, and your onsite team absorbs the rework. We reduce reset cycles with consistent unit-ready standards.",
      signals: [
        "Units not ready for leasing timeline",
        "Repeated cleaning corrections",
        "Unclear handoff between teams",
      ],
    },
    solutionsHeadline: "How A&A Works With Property Managers",
    solutions: [
      {
        title: "48-Hour Turnaround Baseline",
        detail: "Schedules are structured around occupancy windows and leasing pressure.",
      },
      {
        title: "Consistent Unit Standards",
        detail: "Repeatable checklists reduce variation between units, shifts, and crew members.",
      },
      {
        title: "Flexible Leasing Coordination",
        detail: "Execution adapts to tours, maintenance sequencing, and move-in/out timing.",
      },
      {
        title: "Predictable Scope Framing",
        detail: "Service definitions are clear so teams know what is complete and ready to hand off.",
      },
    ],
    serviceAnchors: ["service-move", "service-final-clean", "service-commercial"],
    socialProof: {
      quote:
        "We depend on unit-ready consistency, and A&A has helped us reduce turnover stress across active leasing cycles.",
      name: "James Rodriguez",
      role: "Operations Director, Prestige Developments",
      tag: "Turnover Support",
      stats: ["48hr average turnaround", "Inspection-ready handoff focus", "Portfolio-scale scheduling support"],
    },
    beforeAfter: {
      beforeImage: "/images/variant-a/comparison-02-before.jpg",
      afterImage: "/images/variant-a/comparison-02-after.jpg",
      caption: "Unit turnover before and after",
      projectType: "Apartment turnover",
      scope: "Kitchen, bath, floors, fixtures",
      keyBenefit: "Lease-ready presentation",
    },
    howItWorksHeadline: "Three Steps to a Faster Turn",
    stepThreeLabel: "Your Unit Is Lease-Ready",
    faqs: [
      {
        question: "How quickly can you turn a unit?",
        answer:
          "Typical turnover windows are planned within 48 hours depending on scope, with flexibility for priority scenarios.",
      },
      {
        question: "Can you support multiple units in one cycle?",
        answer:
          "Yes. Crew allocation scales to volume so your team can maintain turnover flow during peak periods.",
      },
      {
        question: "Do you clean common areas too?",
        answer:
          "Yes. In addition to unit turns, we support common-area and amenity-space cleaning programs.",
      },
      {
        question: "What if a unit fails inspection for cleanliness?",
        answer:
          "If cleaning-related corrections are required, we coordinate a follow-up pass quickly to restore handoff readiness.",
      },
    ],
    conversionHeadline: "Let us help your units turn faster.",
  },
  "commercial-spaces": {
    title: "Commercial Cleaning for Facilities and Office Teams | Austin TX",
    description:
      "Reliable commercial cleaning support for Austin facilities and office teams. Off-hours capable, standards-driven, and built for active operations.",
    hero: {
      kicker: "For Commercial Spaces",
      headline: "Clean Spaces That Run Like Your Business.",
      subtitle:
        "Ongoing and deep-clean support for offices, retail environments, and active facilities across Austin.",
      stat: "15+",
      statLabel: "active facilities served weekly",
      image: "/images/variant-a/comparison-01-after.jpg",
      imageAlt: "Polished office common area after professional cleaning",
    },
    pain: {
      headline: "Your space is a visible signal of operational discipline.",
      body:
        "When cleaning consistency slips, tenant confidence and internal standards slip with it. We provide reliable, low-disruption coverage that fits active business operations.",
      signals: [
        "Service windows conflict with active operations",
        "Inconsistent visit-to-visit quality",
        "Slow response on urgent support",
      ],
    },
    solutionsHeadline: "How A&A Works With Commercial Teams",
    solutions: [
      {
        title: "Off-Hours Service Coverage",
        detail: "Evening and non-peak scheduling helps teams maintain business continuity.",
      },
      {
        title: "Recurring + On-Demand Scope",
        detail: "Structured recurring maintenance plus deep-clean support under one partner model.",
      },
      {
        title: "Multi-Zone Standards",
        detail: "Lobbies, restrooms, offices, and shared spaces are maintained to a consistent presentation grade.",
      },
      {
        title: "Responsive Communication",
        detail: "Clear escalation paths and dispatch responsiveness when site conditions change.",
      },
    ],
    serviceAnchors: ["service-commercial", "service-final-clean", "service-windows"],
    socialProof: {
      quote:
        "A&A keeps our occupied spaces presentation-ready without disrupting operations. Their consistency is exactly what we needed.",
      name: "David Chen",
      role: "Site Superintendent, BuildCo Partners",
      tag: "Commercial Build",
      stats: ["15+ active facilities weekly", "Off-hours capable crews", "Recurring and deep-clean support"],
    },
    beforeAfter: {
      beforeImage: "/images/variant-a/comparison-01-before.jpg",
      afterImage: "/images/variant-a/comparison-01-after.jpg",
      caption: "Commercial common-area refresh",
      projectType: "Office and facility space",
      scope: "Lobby, shared spaces, finish detail",
      keyBenefit: "Presentation-ready environment",
    },
    howItWorksHeadline: "Three Steps to a Cleaner Space",
    stepThreeLabel: "Your Space Stays Presentation-Ready",
    faqs: [
      {
        question: "Can you clean during off-hours?",
        answer:
          "Yes. We can coordinate service windows around operating hours to minimize disruption and maintain business continuity.",
      },
      {
        question: "Do you support both recurring and deep cleans?",
        answer:
          "Yes. We support structured recurring maintenance and higher-intensity deep-clean cycles based on your needs.",
      },
      {
        question: "What facility types do you support?",
        answer:
          "We support offices, retail environments, mixed-use sites, and other active commercial properties across the Austin corridor.",
      },
      {
        question: "Do we need a long-term contract?",
        answer:
          "Scope and service model can be structured around your operations; we focus on consistency and measurable service quality.",
      },
    ],
    conversionHeadline: "Let us keep your operation running clean.",
  },
};

function getIndustry(slug: string): IndustryData | undefined {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}

function getIndustryServices(slug: IndustrySlug) {
  const anchors = INDUSTRY_PAGE_CONTENT[slug].serviceAnchors;
  return SERVICES.filter((service) => anchors.includes(service.anchor));
}

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) {
    return {
      title: "Industry",
      robots: { index: false, follow: false },
    };
  }

  const pageContent = INDUSTRY_PAGE_CONTENT[industry.slug];

  return {
    title: pageContent.title,
    description: pageContent.description,
    alternates: {
      canonical: `/industries/${industry.slug}`,
    },
    openGraph: {
      title: pageContent.title,
      description: pageContent.description,
      url: `${getSiteUrl()}/industries/${industry.slug}`,
      type: "website",
    },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) {
    notFound();
  }

  const content = INDUSTRY_PAGE_CONTENT[industry.slug];
  const defaultService = INDUSTRY_TO_SERVICE_TYPE[industry.slug];
  const serviceSet = getIndustryServices(industry.slug);
  const baseUrl = getSiteUrl();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${industry.title} Cleaning Services`,
    description: content.description,
    provider: {
      "@type": "LocalBusiness",
      name: COMPANY_NAME,
      url: baseUrl,
      telephone: COMPANY_PHONE_E164,
    },
    areaServed: {
      "@type": "City",
      name: "Austin",
      containedInPlace: {
        "@type": "State",
        name: "Texas",
      },
    },
    audience: {
      "@type": "Audience",
      audienceType: industry.title,
    },
    url: `${baseUrl}/industries/${industry.slug}`,
  };

  const relatedIndustries = INDUSTRIES.filter((item) => item.slug !== industry.slug).slice(0, 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <main className="bg-[#FAFAF8]">
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#0A1628] pb-16 pt-28 md:pt-36">
          <Image
            src={content.hero.image}
            alt={content.hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={72}
          />
          <div className="absolute inset-0 bg-[#0A1628]/68" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/58 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-6">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-slate-300">
                <li>
                  <Link href="/" className="hover:text-white">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/#industries" className="hover:text-white">Industries</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-white">{industry.title}</li>
              </ol>
            </nav>

            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">{content.hero.kicker}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">{content.hero.headline}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">{content.hero.subtitle}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={`/?serviceType=${defaultService}#quote-request`} className="cta-primary min-h-[48px]">
                Request a Quote
              </Link>
              <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[48px] border-white/30 bg-white/5 text-white hover:bg-white hover:text-[#0A1628]">
                Call {COMPANY_PHONE}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="info-chip-dark">Licensed &amp; Insured</span>
              <span className="info-chip-dark">Response Within 1 Hour</span>
              <span className="info-chip-dark">Se Habla Espanol</span>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-slate-200">
              <span className="font-semibold text-white">{content.hero.stat}</span>
              <span>{content.hero.statLabel}</span>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">The Problem</p>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">{content.pain.headline}</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{content.pain.body}</p>
            <ul className="mt-5 grid gap-2 md:grid-cols-3">
              {content.pain.signals.map((signal) => (
                <li key={signal} className="surface-panel-soft px-4 py-3 text-sm text-slate-700">
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#FAFAF8] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">How We Solve It</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">{content.solutionsHeadline}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {content.solutions.map((solution) => (
                <article key={solution.title} className="surface-panel p-5">
                  <p className="text-lg font-semibold text-[#0A1628]">{solution.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{solution.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">Recommended Services</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">Services for {industry.title}</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {serviceSet.map((service) => (
                <article key={service.anchor} className="surface-panel flex h-full flex-col p-5">
                  <p className="text-lg font-semibold text-[#0A1628]">{service.titleLines.join(" ")}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                  <p className="mt-3 inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                    {service.proofLine}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.bullets.slice(0, 3).map((bullet) => (
                      <span key={bullet} className="info-chip text-slate-600">
                        {bullet}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={SERVICE_LINK_BY_ANCHOR[service.anchor] ?? "/services"}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB]"
                  >
                    Learn more
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0A1628] py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-6">
            <p className="section-kicker !text-slate-300">Verified Results</p>
            <article className="dark-surface-panel mt-4 p-6 md:p-8">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                {content.socialProof.tag}
              </div>
              <blockquote className="mt-4 border-l-[3px] border-[#C9A94E] pl-4 font-serif text-xl leading-relaxed text-white md:text-3xl">
                {content.socialProof.quote}
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-slate-200">{content.socialProof.name}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{content.socialProof.role}</p>
              <div className="mt-6 grid gap-2 md:grid-cols-3">
                {content.socialProof.stats.map((stat) => (
                  <div key={stat} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                    {stat}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">Proof of Work</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">Before and After</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="surface-panel overflow-hidden">
                <div className="relative h-60 md:h-72">
                  <Image src={content.beforeAfter.beforeImage} alt={`${content.beforeAfter.caption} before`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <p className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Before</p>
              </article>
              <article className="surface-panel overflow-hidden">
                <div className="relative h-60 md:h-72">
                  <Image src={content.beforeAfter.afterImage} alt={`${content.beforeAfter.caption} after`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <p className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">After</p>
              </article>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-3">
              <div className="surface-panel-soft px-4 py-3 text-sm text-slate-700">Project: {content.beforeAfter.projectType}</div>
              <div className="surface-panel-soft px-4 py-3 text-sm text-slate-700">Scope: {content.beforeAfter.scope}</div>
              <div className="surface-panel-soft px-4 py-3 text-sm text-slate-700">Benefit: {content.beforeAfter.keyBenefit}</div>
            </div>
          </div>
        </section>

        <section className="bg-[#FAFAF8] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="section-kicker">Getting Started</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">{content.howItWorksHeadline}</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Tell Us Your Scope",
                  detail: "Submit the form or call and share timeline, service need, and key requirements.",
                },
                {
                  step: "02",
                  title: "We Scope and Quote",
                  detail: "We review scope, confirm details, and return a clear quote as quickly as possible.",
                },
                {
                  step: "03",
                  title: content.stepThreeLabel,
                  detail: "Crews execute to standard and coordinate completion so your team can move forward.",
                },
              ].map((item) => (
                <article key={item.step} className="surface-panel p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">Step {item.step}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#0A1628]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-6">
            <p className="section-kicker">Common Questions</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0A1628] md:text-4xl">Questions {industry.title} Ask</h2>

            <div className="mt-6 space-y-3">
              {content.faqs.map((item) => (
                <details key={item.question} className="surface-panel group overflow-hidden">
                  <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-[#0A1628] marker:content-none md:text-base">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-[#2563EB]">+</span>
                      {item.question}
                    </span>
                  </summary>
                  <p className="border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-5 text-sm text-slate-600">
              More questions? <Link href="/faq" className="font-semibold text-[#2563EB]">See our full FAQ</Link>
            </div>
          </div>
        </section>

        <section className="bg-[#0A1628] py-14 text-center md:py-18">
          <div className="mx-auto max-w-4xl px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">Ready to Start</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-white md:text-4xl">{content.conversionHeadline}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Tell us your scope and timeline. We will respond quickly with next-step clarity for your team.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={`/?serviceType=${defaultService}#quote-request`} className="cta-gold min-h-[48px]">
                Request a Quote
              </Link>
              <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[48px] border-white/35 text-white hover:bg-white hover:text-[#0A1628]">
                Call {COMPANY_PHONE}
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="info-chip-dark">Response Within 1 Hour</span>
              <span className="info-chip-dark">Licensed &amp; Insured</span>
              <span className="info-chip-dark">Se Habla Espanol</span>
            </div>

            <div className="mt-8 text-sm text-slate-300">
              Also serving:
              {" "}
              {relatedIndustries.map((item, index) => (
                <span key={item.slug}>
                  <Link href={`/industries/${item.slug}`} className="font-semibold text-white underline-offset-4 hover:underline">
                    {item.title}
                  </Link>
                  {index === relatedIndustries.length - 1 ? "" : " • "}
                </span>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-300">
              Learn more:
              {" "}
              <Link href="/service-area" className="font-semibold text-white underline-offset-4 hover:underline">
                Where We Work
              </Link>
              {" • "}
              <Link href="/about" className="font-semibold text-white underline-offset-4 hover:underline">
                About A&amp;A
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
