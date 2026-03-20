import type { Metadata } from "next";
import Link from "next/link";

import { COMPANY_CITY, COMPANY_NAME, COMPANY_PHONE } from "@/lib/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how A&A Cleaning supports contractors, property teams, and commercial operators with standards-driven cleaning across Austin.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">About {COMPANY_NAME}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Quality control for jobsites that cannot afford sloppy handoff.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            A&A Cleaning supports contractors, property managers, and commercial operators across {COMPANY_CITY}. The focus is simple:
            consistent finish quality, faster turnover, and fewer last-minute callbacks.
          </p>
        </div>

        <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Construction-ready</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Post-construction and final clean scopes built around deadlines, walkthroughs, and subcontractor coordination.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Operations-minded</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Structured dispatch, completion reporting, and quality review reduce the dependency on text-message chaos.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Relationship-first</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">The goal is repeatable trust with GCs and property teams, not one-off cleanup work.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
            Request a Quote
          </Link>
          <a href={`tel:${COMPANY_PHONE.replace(/\D/g, "")}`} className="rounded border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">
            Call {COMPANY_PHONE}
          </a>
        </div>
      </div>
    </main>
  );
}
