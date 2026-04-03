"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { COMPANY_PHONE, COMPANY_PHONE_E164, COMPANY_SHORT_NAME } from "@/lib/company";
import { QuoteCTA } from "./QuoteCTA";
import { CTAButton } from "./CTAButton";

const serviceLinks = [
  { href: "/#service-post-construction", label: "Post-Construction", desc: "Rough and final cleans for turnovers." },
  { href: "/#service-final-clean", label: "Final Clean", desc: "Detail-level move-in readiness." },
  { href: "/#service-commercial", label: "Commercial", desc: "Ongoing facility care and maintenance." },
  { href: "/#service-move", label: "Move-In / Move-Out", desc: "Fast vacant unit turnovers." },
  { href: "/#service-windows", label: "Windows & Power Wash", desc: "Exterior polishing and details." },
];

const industryLinks = [
  { href: "/#industries", label: "General Contractors", desc: "Walkthrough-ready closeouts." },
  { href: "/#industries", label: "Property Managers", desc: "Fast leasing turnovers." },
  { href: "/#industries", label: "Commercial Offices", desc: "Zero-disruption active site cleaning." },
];

const primaryLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#service-area", label: "Service Area" },
  { href: "/faq", label: "FAQ" },
  { href: "/#careers", label: "Careers" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<"services" | "industries" | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const threshold = Math.max(120, window.innerHeight * 0.5);
      setIsScrolled(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    document.body.dataset.mobileMenuOpen = isMobileMenuOpen ? "true" : "false";

    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.mobileMenuOpen;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenDesktopMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDesktopMenu(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const forceSolidHeader = pathname === "/privacy" || pathname === "/terms" || pathname === "/faq";

  const navShellClass = forceSolidHeader || isScrolled || isMobileMenuOpen
    ? "border-[#183556] bg-[#0f2746] shadow-[0_22px_70px_rgba(2,6,23,0.42)] md:backdrop-blur-md"
    : "border-transparent bg-[#07101d]/22 shadow-[0_18px_60px_rgba(2,6,23,0.16)] md:backdrop-blur-xl";

  /* MOBILE-ELEVATION: P-7 — collapse any expanded <details> elements in mobile nav on close.
     Prevents stale expanded state when the menu re-opens after navigating. */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document
      .querySelectorAll("#mobile-nav-panel details[open]")
      .forEach((el) => el.removeAttribute("open"));
  };

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-[var(--z-header)] text-white"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Floating Header Shell */}
      <div className={`transition-all duration-300 ${forceSolidHeader || isScrolled ? "pt-2" : "pt-3 md:pt-6"}`}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className={`flex h-14 items-center justify-between gap-4 rounded-xl border px-4 md:h-[4.5rem] md:px-6 transition duration-300 ${navShellClass}`}>
            
            {/* Logo */}
            <Link href="/" className="min-w-0">
              <p className="font-serif text-xl font-semibold tracking-tight text-white md:text-3xl md:font-normal">{COMPANY_SHORT_NAME}</p>
              <p className="hidden text-[9px] uppercase tracking-[0.24em] text-slate-300 md:block">
                Construction-Ready Cleaning
              </p>
            </Link>

            <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
              <div
                className="relative"
                onMouseEnter={() => setOpenDesktopMenu("services")}
                onMouseLeave={() => setOpenDesktopMenu((current) => (current === "services" ? null : current))}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm text-slate-100 transition hover:text-white"
                  aria-expanded={openDesktopMenu === "services"}
                  aria-haspopup="true"
                  onFocus={() => setOpenDesktopMenu("services")}
                  onClick={() => setOpenDesktopMenu((current) => (current === "services" ? null : "services"))}
                >
                  Services
                  <span className={`text-[9px] text-slate-400 transition-transform ${openDesktopMenu === "services" ? "rotate-180" : ""}`}>▼</span>
                </button>
                <div
                  className={`absolute left-0 top-full pt-3 transition duration-200 ${
                    openDesktopMenu === "services" ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="min-w-[20rem] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5">
                    {serviceLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpenDesktopMenu(null)}
                        className="block rounded-lg p-3 transition hover:bg-slate-50"
                      >
                        <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{link.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="relative"
                onMouseEnter={() => setOpenDesktopMenu("industries")}
                onMouseLeave={() => setOpenDesktopMenu((current) => (current === "industries" ? null : current))}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm text-slate-100 transition hover:text-white"
                  aria-expanded={openDesktopMenu === "industries"}
                  aria-haspopup="true"
                  onFocus={() => setOpenDesktopMenu("industries")}
                  onClick={() => setOpenDesktopMenu((current) => (current === "industries" ? null : "industries"))}
                >
                  Industries
                  <span className={`text-[9px] text-slate-400 transition-transform ${openDesktopMenu === "industries" ? "rotate-180" : ""}`}>▼</span>
                </button>
                <div
                  className={`absolute left-0 top-full pt-3 transition duration-200 ${
                    openDesktopMenu === "industries" ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="min-w-[19rem] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5">
                    {industryLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpenDesktopMenu(null)}
                        className="block rounded-lg p-3 transition hover:bg-slate-50"
                      >
                        <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{link.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {primaryLinks.slice(2).map((link) => (
                <a key={link.label} href={link.href} className="text-sm text-slate-100 transition hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-3 md:flex">
              <CTAButton
                ctaId="header_nav_call"
                actionType="call"
                href={`tel:${COMPANY_PHONE_E164}`}
                className="hidden min-h-[40px] items-center rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:border-white/35 hover:bg-white/8 lg:inline-flex"
              >
                Call
              </CTAButton>
              <QuoteCTA ctaId="header_nav_quote" className="min-h-[40px] rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-sm transition hover:bg-slate-100">
                Free Quote
              </QuoteCTA>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <QuoteCTA ctaId="header_mobile_toggle_quote" className="min-h-[44px] rounded-lg bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-sm active:bg-slate-100">
                Free Quote
              </QuoteCTA>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/6"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span className="text-lg" aria-hidden="true">{isMobileMenuOpen ? "×" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-nav-panel"
        role="region"
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
        className={`md:hidden ${isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition duration-300`}
      >
        <div
          className="absolute inset-x-4 top-[4.5rem] max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0A1628] p-5 shadow-2xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}
        >
          <div className="space-y-3">
            <CTAButton
              ctaId="mobile_menu_call"
              actionType="call"
              href={`tel:${COMPANY_PHONE_E164}`}
              onClick={closeMobileMenu}
              className="w-full rounded-2xl bg-white/6 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white"
            >
              Call {COMPANY_PHONE}
            </CTAButton>

            <details className="rounded-2xl border border-white/10 bg-white/4">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm uppercase tracking-[0.18em] text-white">
                Services
              </summary>
              <div className="space-y-1 px-3 pb-3">
                {serviceLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/6 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </details>

            <details className="rounded-2xl border border-white/10 bg-white/4">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm uppercase tracking-[0.18em] text-white">
                Industries
              </summary>
              <div className="space-y-1 px-3 pb-3">
                {industryLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/6 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </details>

            {primaryLinks.slice(2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className="block rounded-2xl border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
