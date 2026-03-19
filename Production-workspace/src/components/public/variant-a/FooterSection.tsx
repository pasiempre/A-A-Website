import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_EMAIL, COMPANY_PHONE_E164, COMPANY_PHONE } from "@/lib/company";

type FooterSectionProps = {
  onOpenQuote: () => void;
};

export function FooterSection({ onOpenQuote }: FooterSectionProps) {
  return (
    <footer className="bg-[#0A1628] pb-10 pt-16 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
        <div>
          <h3 className="mb-4 font-serif text-3xl text-white">A&A</h3>
          <p className="text-sm font-light">Standards-driven facility care for construction professionals.</p>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/careers" className="hover:text-white">Careers</a></li>
            <li><a href="/auth/admin" className="hover:text-white">Admin Portal</a></li>
            <li><a href="/auth/employee" className="hover:text-white">Employee Portal</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`tel:${COMPANY_PHONE_E164}`}
                className="hover:text-white"
                onClick={() => {
                  void trackConversionEvent({ eventName: "call_click", source: "footer" });
                }}
              >
                {COMPANY_PHONE}
              </a>
            </li>
            <li><a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-white">{COMPANY_EMAIL}</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Ready to Start?</p>
          <button
            type="button"
            onClick={onOpenQuote}
            className="rounded-sm bg-[#C9A94E] px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#0A1628] transition hover:bg-[#b8993f]"
          >
            Request a Quote
          </button>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 px-6 pt-6 text-[11px] text-slate-500">
        © 2026 A&A Cleaning Services.
      </div>
    </footer>
  );
}
