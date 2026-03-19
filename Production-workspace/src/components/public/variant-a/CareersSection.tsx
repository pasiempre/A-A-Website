import Link from "next/link";

export function CareersSection() {
  return (
    <section id="careers" className="border-b border-slate-200 bg-[#F1F0EE] py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl">We’re Building a Team</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg font-light text-slate-600">
          Professional cleaning careers in the Austin metro area. We value detail and consistency.
        </p>
        <Link href="/careers" className="inline-flex rounded-sm border border-[#0A1628] px-8 py-3 text-xs uppercase tracking-[0.2em] text-[#0A1628] transition hover:bg-[#0A1628] hover:text-white">
          Apply Now
        </Link>
      </div>
    </section>
  );
}
