import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore A&A Cleaning services for post-construction final clean, builder turnover, recurring site care, and commercial presentation readiness.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  const services = [
    {
      title: "Builder Turnover",
      description: "Fast, standards-driven turnover support for units, common areas, and final readiness before walkthrough.",
    },
    {
      title: "Final Clean",
      description: "Detail-heavy finish cleaning for glass, fixtures, millwork, and visible touchpoints where callbacks happen.",
    },
    {
      title: "Recurring Site Care",
      description: "Ongoing cleaning support for offices, model units, and light commercial environments that need consistency.",
    },
    {
      title: "Vacant Unit Turnover",
      description: "Apartment and property turns with dependable resets, scope clarity, and responsive scheduling.",
    },
    {
      title: "Exterior Detail Upgrade",
      description: "Windows, washdown, and exterior-facing finishing work when presentation matters at handoff.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Services</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Scopes built for GC expectations, property turnover, and commercial upkeep.</h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>

        <Link href="/" className="inline-flex rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
          Request a Quote
        </Link>
      </div>
    </main>
  );
}
