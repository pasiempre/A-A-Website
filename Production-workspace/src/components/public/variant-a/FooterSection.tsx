import Link from "next/link";

import { COMPANY_EMAIL, COMPANY_PHONE_E164, COMPANY_PHONE } from "@/lib/company";
import { QuoteCTA } from "./QuoteCTA";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer aria-label="Site footer" className="relative overflow-hidden bg-[#081120] pb-12 pt-20 text-slate-300 md:pt-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle at top, rgba(201,169,78,0.5), transparent 26%)" }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A94E]/60 to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-8 py-10 shadow-[0_28px_90px_rgba(2,6,23,0.35)] backdrop-blur md:flex md:items-center md:justify-between md:px-10">
          <div className="max-w-2xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">Project Closeout Ready</p>
            <h3 className="font-serif text-3xl tracking-tight text-white md:text-4xl">Bring A&A in before the handoff gets rushed.</h3>
            <p className="mt-4 text-sm font-light leading-relaxed text-slate-300 md:text-base">
              Construction-ready cleaning support for final walkthroughs, turnovers, and active commercial spaces across the Austin metro.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Service highlights">
              <li className="info-chip-dark">Walkthrough Support</li>
              <li className="info-chip-dark">Turnover Ready</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 md:mt-0 md:items-end">
            <QuoteCTA className="cta-gold">
              Get Your Free Quote
            </QuoteCTA>
            <a href={`tel:${COMPANY_PHONE_E164}`} className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:text-white">
              Or call {COMPANY_PHONE}
            </a>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-serif text-3xl text-white">A&A</h3>
            <p className="max-w-xs text-sm font-light leading-relaxed text-slate-300">
              Standards-driven facility care for contractors, property teams, and commercial spaces that need clean handoff quality.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Brand values">
              <li className="info-chip-dark">Detail Finish</li>
              <li className="info-chip-dark">Responsive Scheduling</li>
            </ul>
          </div>
          <nav aria-label="Footer navigation">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Navigate</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#services" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Services</Link></li>
              <li><Link href="/#industries" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Who We Serve</Link></li>
              <li><Link href="/#about" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />About</Link></li>
              <li><Link href="/#service-area" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Service Area</Link></li>
              <li><Link href="/faq" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />FAQ</Link></li>
              <li><Link href="/contact" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Contact</Link></li>
              <li><Link href="/privacy" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Privacy</Link></li>
              <li><Link href="/terms" className="inline-flex items-center gap-2 transition hover:text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />Terms</Link></li>
            </ul>
          </nav>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${COMPANY_PHONE_E164}`} className="transition hover:text-white">
                  {COMPANY_PHONE}
                </a>
              </li>
              <li><a href={`mailto:${COMPANY_EMAIL}`} className="transition hover:text-white">{COMPANY_EMAIL}</a></li>
              <li className="text-slate-400">Serving Austin and surrounding metro areas</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Built For</p>
            <ul className="flex flex-wrap gap-2" aria-label="Target clients">
              <li className="info-chip-dark">Contractors</li>
              <li className="info-chip-dark">Property Teams</li>
              <li className="info-chip-dark">Commercial Spaces</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 px-6 pt-6 text-[11px] text-slate-500">
        © {currentYear} A&A Cleaning Services.
      </div>
    </footer>
  );
}
