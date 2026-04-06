"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { INDUSTRY_MENU_LINKS } from "@/data/industries";
import { SERVICE_MENU_LINKS } from "@/data/services";
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_E164, COMPANY_SHORT_NAME } from "@/lib/company";
import { QuoteCTA } from "./QuoteCTA";
import { CTAButton } from "./CTAButton";

const serviceLinks = SERVICE_MENU_LINKS;
const industryLinks = INDUSTRY_MENU_LINKS;

const primaryLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/service-area", label: "Service Area" },
  { href: "/faq", label: "FAQ" },
  { href: "/careers", label: "Careers" },
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

  const forceSolidHeader =
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/faq" ||
    pathname === "/about" ||
    pathname === "/careers" ||
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname === "/service-area" ||
    pathname.startsWith("/service-area/");

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
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOpenDesktopMenu((current) => (current === "services" ? null : current));
                  }
                }}
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
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOpenDesktopMenu((current) => (current === "industries" ? null : current));
                  }
                }}
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
                className="hidden min-h-[44px] items-center rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:border-white/35 hover:bg-white/8 lg:inline-flex"
              >
                Call
              </CTAButton>
              <QuoteCTA ctaId="header_nav_quote" className="min-h-[44px] rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-sm transition hover:bg-slate-100">
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
        <button
          type="button"
          aria-label="Close mobile navigation"
          className="fixed inset-0 bg-black/70"
          onClick={closeMobileMenu}
        />
        {/* Top offset aligns below the floating header shell: h-14 nav bar + shell top padding + visual gap. */}
        <div
          className="absolute inset-x-4 top-[4.5rem] z-10 max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-gradient-to-b from-[#0E2340] to-[#081427] p-5 shadow-2xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-3">
              <div className="grid grid-cols-2 gap-2">
                <CTAButton
                  ctaId="mobile_menu_call"
                  actionType="call"
                  href={`tel:${COMPANY_PHONE_E164}`}
                  onClick={closeMobileMenu}
                  className="flex min-h-[48px] items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
                >
                  Call Now
                </CTAButton>
                {/* QuoteCTA does not expose onClick; capture phase closes menu before panel open handling. */}
                <div onClickCapture={closeMobileMenu}>
                  <QuoteCTA
                    ctaId="mobile_menu_quote"
                    className="flex min-h-[48px] items-center justify-center rounded-xl bg-white px-3 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A1628]"
                  >
                    Free Quote
                  </QuoteCTA>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-300">Call {COMPANY_PHONE}</p>
            </div>

            <div>
              <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Explore</p>
              <div className="mt-2 space-y-1">
                <details className="group rounded-xl bg-white/[0.04]">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-white">
                    <span>Services</span>
                    <span aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-90">›</span>
                  </summary>
                  <div className="space-y-1 px-3 pb-3">
                    {serviceLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-slate-200 transition hover:bg-white/7 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </details>

                <details className="group rounded-xl bg-white/[0.04]">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-white">
                    <span>Industries</span>
                    <span aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-90">›</span>
                  </summary>
                  <div className="space-y-1 px-3 pb-3">
                    {industryLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-slate-200 transition hover:bg-white/7 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </details>

                {primaryLinks
                  .filter((link) => ["About", "Service Area"].includes(link.label))
                  .map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex min-h-[44px] items-center rounded-xl px-4 py-3 text-[13px] font-medium text-white/95 transition hover:bg-white/6"
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
            </div>

            <div>
              <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Resources</p>
              <div className="mt-2 space-y-1">
                {primaryLinks
                  .filter((link) => ["FAQ", "Careers"].includes(link.label))
                  .map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex min-h-[44px] items-center rounded-xl px-4 py-3 text-[13px] font-medium text-white/95 transition hover:bg-white/6"
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 text-center text-[11px] text-slate-300">
              <a href={`mailto:${COMPANY_EMAIL}`} className="text-slate-300 underline-offset-2 hover:text-white hover:underline">
                {COMPANY_EMAIL}
              </a>
              <p>Serving Austin metro area</p>
              <p className="mt-1 text-slate-400">© {new Date().getFullYear()} {COMPANY_SHORT_NAME}</p>
            </div>
          </div>
        </div>
      </div>

      <noscript>
        <nav aria-label="Navigation (no JavaScript)" className="bg-[#0f2746] px-6 py-4">
          <ul className="flex flex-wrap gap-4 text-sm text-white">
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/service-area">Service Area</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </noscript>
    </header>
  );
}
