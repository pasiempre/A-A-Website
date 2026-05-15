import type { Metadata } from "next";
import Link from "next/link";

import { EmploymentApplicationForm } from "@/components/public/EmploymentApplicationForm";
import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { QuoteCTA } from "@/components/public/variant-a/QuoteCTA";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers | Join the A&A Cleaning Team",
  description:
    "Apply to join A&A Cleaning. We hire for reliable, detail-focused cleaning work across active construction and turnover projects.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers | Join the A&A Cleaning Team",
    description:
      "Apply to join A&A Cleaning. We hire for reliable, detail-focused cleaning work across active construction and turnover projects.",
    url: `${getSiteUrl()}/careers`,
    type: "website",
  },
};

export default function CareersPage() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "Careers", item: `${baseUrl}/careers` },
        ],
      },
      {
        "@type": "WebPage",
        name: "Careers | Join the A&A Cleaning Team",
        url: `${baseUrl}/careers`,
        description:
          "Apply to join A&A Cleaning. We hire for reliable, detail-focused cleaning work across active construction and turnover projects.",
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
      <section className="border-b border-slate-200 bg-white pb-12 pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-6">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-[#0A1628]">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#0A1628]">Careers</li>
            </ol>
          </nav>

          <p className="section-kicker">Careers</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-6xl">
            Join a crew that values consistency, pace, and finish quality.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            This intake is Spanish-first in spirit and built for practical hiring. Share your experience,
            availability, and contact details and A&amp;A will follow up directly.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="info-chip">Reliable schedules</span>
            <span className="info-chip">Construction + turnover work</span>
            <span className="info-chip">Bilingual coordination</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="space-y-6">
            <article className="surface-panel p-6">
              <h2 className="text-lg font-semibold text-slate-900">What matters</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Reliable attendance and transportation</li>
                <li>Attention to detail on visible finish work</li>
                <li>Comfort working on active construction and turnover schedules</li>
                <li>Clear communication with supervisors and lead cleaners</li>
              </ul>
            </article>

            <article className="surface-panel p-6">
              <h3 className="text-base font-semibold text-[#0A1628]">Hiring Process</h3>
              <ol className="mt-3 space-y-3 text-sm text-slate-600">
                <li><span className="font-semibold text-slate-800">1.</span> Submit your application with availability and experience.</li>
                <li><span className="font-semibold text-slate-800">2.</span> We review and follow up for role fit and scheduling.</li>
                <li><span className="font-semibold text-slate-800">3.</span> Qualified candidates are invited for next-step onboarding.</li>
              </ol>
            </article>

            <article className="surface-panel p-6">
              <h3 className="text-base font-semibold text-[#0A1628]">Questions Before Applying?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Reach out and we can clarify role expectations and scheduling before you submit.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <CTAButton ctaId="careers_sidebar_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[44px]">
                  Call {COMPANY_PHONE}
                </CTAButton>
                <Link href="/faq" className="cta-primary min-h-[44px]">
                  View FAQ
                </Link>
              </div>
            </article>

            <div className="text-sm text-slate-600">
              Learn more about our standards:
              {" "}
              <Link href="/about" className="font-semibold text-[#2563EB]">About A&amp;A</Link>
              {" • "}
              <Link href="/service-area" className="font-semibold text-[#2563EB]">Service Area</Link>
            </div>
          </section>

          <EmploymentApplicationForm />
        </div>
      </section>

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
          Looking for project services instead of careers?
          {" "}
          <QuoteCTA ctaId="careers_bottom_quote" className="min-h-0 font-semibold text-[#2563EB]">Request a Quote</QuoteCTA>
        </div>
      </section>

      </main>
    </>
  );
}
