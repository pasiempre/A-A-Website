import type { Metadata } from "next";
import Link from "next/link";

import { EmploymentApplicationForm } from "@/components/public/EmploymentApplicationForm";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Apply to join A&A Cleaning. We hire for reliable, detail-focused cleaning work across active construction and turnover projects.",
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Careers</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Join a crew that values consistency, pace, and finish quality.</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              This intake is Spanish-first in spirit and built for practical hiring. Share your experience, availability, and contact details and A&A will follow up directly.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">What matters</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Reliable attendance and transportation</li>
              <li>Attention to detail on visible finish work</li>
              <li>Comfort working on active construction and turnover schedules</li>
              <li>Clear communication with supervisors and lead cleaners</li>
            </ul>
          </div>

          <Link href="/" className="inline-flex rounded border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">
            Back to home
          </Link>
        </section>

        <EmploymentApplicationForm />
      </div>
    </main>
  );
}
