"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { trackConversionEvent } from "@/lib/analytics";
import { SERVICES, type ServiceData } from "@/data/services";
import { SERVICE_ANCHOR_TO_FORM_VALUE } from "@/lib/service-type-map";

import { QuoteCTA } from "./QuoteCTA";
import { useInViewOnce } from "./useInViewOnce";

type ServiceItem = ServiceData;

const services = SERVICES;

function ServiceIcon({ icon }: { icon: ServiceItem["icon"] }) {
  if (icon === "build") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M4 18h16M6.5 18V9.5L12 6l5.5 3.5V18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M10 18v-4h4v4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "detail") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="m6 16 3.5-9 1.6 4.2L15 13l3 7-4.2-1.3L11 22l-1.1-4-4.5-2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "office") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M5 20V5.5L12 4l7 1.5V20M9 8.5h.01M9 12h.01M9 15.5h.01M15 8.5h.01M15 12h.01M15 15.5h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (icon === "turn") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M7 10.5 12 6l5 4.5M8.5 9.5V18h7V9.5M4.5 13.5c0 3 2.6 5.5 5.8 5.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="m4.5 18 1.8 1.6L8 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M6 5h10l2 3v3H6V5Zm0 6h13l-2 8H8L6 11Zm4-6 2 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ServiceSpreadItem({ service }: { service: ServiceItem }) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.2);

  return (
    <article
      ref={ref}
      id={service.anchor}
      className={`group flex flex-col overflow-hidden md:min-h-[60vh] ${service.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <div
        className={`relative h-40 w-full overflow-hidden transition duration-700 md:h-auto md:w-[56%] lg:w-[58%] ${
          isVisible ? "translate-x-0 opacity-100" : service.reverse ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0"
        }`}
      >
        <Image
          src={service.image}
          alt={`${service.titleLines.join(" ")} service example for ${service.packageLabel}`}
          fill
          quality={68}
          sizes="(max-width: 768px) 100vw, 58vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081120]/30 via-transparent to-transparent" />
        {/* MOBILE-HARDENING: Hide top image overlay badges on mobile — redundant with content area. */}
        <div className="pointer-events-none absolute inset-x-4 top-4 hidden items-start justify-between md:flex md:inset-x-8 md:top-8">
          <ul className="flex gap-2" aria-label={`${service.titleLines.join(" ")} badges`}>
            <li className="info-chip-dark">{service.packageLabel}</li>
          </ul>
          <span className="rounded-full border border-white/20 bg-[#081120]/28 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {service.index}
          </span>
        </div>
        {/* MOBILE-HARDENING: Hide bottom image overlay on mobile — response promise is in content area on desktop panel. */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 hidden md:block md:inset-x-8 md:bottom-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-[#081120]/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#C9A94E]" aria-hidden="true" />
            {service.responsePromise}
          </div>
        </div>
      </div>
      <div
        className={`flex w-full items-center ${service.reverse ? "bg-[#FAFAF8]" : "bg-white"} transition duration-700 md:w-[44%] lg:w-[42%] ${
          isVisible ? "translate-x-0 opacity-100" : service.reverse ? "-translate-x-10 opacity-0" : "translate-x-10 opacity-0"
        }`}
      >
        {/* MOBILE-HARDENING: p-5→p-4 for tighter mobile card content. md:p-12 preserved. */}
        <div className="relative max-w-xl p-4 md:p-12 lg:p-14 xl:p-20">
          <p
            className={`mb-1 hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2563EB] transition duration-700 md:block md:mb-2 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            {service.packageLabel}
          </p>
          <div
            className={`mb-3 flex items-center gap-3 transition duration-700 md:mb-5 md:gap-4 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
            style={{ transitionDelay: "40ms" }}
          >
            <span className="icon-tile hidden md:inline-flex">
              <ServiceIcon icon={service.icon} />
            </span>
            <span className="signal-line hidden md:inline-flex">{service.proofLine}</span>
          </div>
          {/* MOBILE-HARDENING: mb-3→mb-2 for tighter title spacing on mobile. md:mb-6 preserved. */}
          <h2
            className={`mb-2 font-serif text-2xl uppercase leading-[1.05] tracking-tight text-[#0A1628] transition duration-700 md:mb-6 md:text-5xl lg:text-5xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            {service.titleLines.map((line) => (
              <span key={line} className="md:block">
                {line}{" "}
              </span>
            ))}
          </h2>
          {/* MOBILE-HARDENING: mb-4→mb-3 for tighter description spacing. md:mb-8 preserved. */}
          {/* MOBILE-ELEVATION: P-9 — font-normal on mobile for legibility, font-light on md+ */}
          <p
            className={`mb-3 text-sm font-normal leading-relaxed text-slate-600 transition duration-700 md:mb-8 md:font-light md:text-lg ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            {service.description}
          </p>

          {/* MOBILE-ELEVATION: H-6 — response promise visible on mobile.
              This is a key trust signal that was completely hidden from ~70%+ of users (mobile traffic).
              Shown below description, above bullets. Hidden on md+ where image overlay version is visible. */}
          <p
            className={`mb-3 flex items-center gap-2 text-xs text-[#C9A94E] transition duration-700 md:hidden ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A94E]" aria-hidden="true" />
            {service.responsePromise}
          </p>

          {/* MOBILE-HARDENING: mb-5→mb-4, space-y-2→space-y-1.5 for tighter bullet list. md values preserved. */}
          <ul
            className={`mb-4 space-y-1.5 text-slate-700 transition duration-700 md:mb-8 md:space-y-3 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "240ms" }}
          >
            {service.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" />
                <span className="text-xs md:text-base">{bullet}</span>
              </li>
            ))}
          </ul>

          <div
            className={`hidden surface-panel-soft mb-8 overflow-hidden px-4 py-4 transition duration-700 md:block ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "320ms" }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{service.responsePromise}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {service.bullets.slice(0, 2).map((bullet) => (
                <span key={bullet} className="info-chip">
                  {bullet}
                </span>
              ))}
            </div>
          </div>

          <QuoteCTA
            ctaId={`service_${service.anchor}_quote`}
            serviceType={SERVICE_ANCHOR_TO_FORM_VALUE[service.anchor]}
            className={`cta-outline-dark gap-3 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Quote This Service
            <span aria-hidden="true">→</span>
          </QuoteCTA>
        </div>
      </div>
    </article>
  );
}

function MobileServiceAccordion() {
  const [openService, setOpenService] = useState<string>(services[0]?.anchor ?? "");
  const [loadedServiceImages, setLoadedServiceImages] = useState<string[]>(() =>
    services[0]?.anchor ? [services[0].anchor] : [],
  );

  const markImageLoaded = (anchor: string) => {
    setLoadedServiceImages((previous) =>
      previous.includes(anchor) ? previous : [...previous, anchor],
    );
  };

  useEffect(() => {
    const syncWithHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && services.some((service) => service.anchor === hash)) {
        setOpenService(hash);
        markImageLoaded(hash);
      }
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, []);

  return (
    <div className="md:hidden">
      {services.map((service) => {
        const isOpen = openService === service.anchor;
        const panelId = `${service.anchor}-panel`;
        const shouldRenderImage = isOpen || loadedServiceImages.includes(service.anchor);

        return (
          <article key={service.anchor} id={service.anchor} className="border-b border-slate-200 bg-white">
            <button
              type="button"
              className="flex w-full items-start gap-3 px-4 py-4 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => {
                const willOpen = !isOpen;
                const next = willOpen ? service.anchor : "";
                setOpenService(next);
                if (next) {
                  markImageLoaded(next);
                }

                if (willOpen) {
                  void trackConversionEvent({
                    eventName: "accordion_service_expanded",
                    source: "mobile_service_accordion",
                    metadata: {
                      service_anchor: service.anchor,
                      service_title: service.titleLines.join(" "),
                      position: service.index,
                    },
                  });
                }
              }}
            >
              <span className="icon-tile mt-0.5 inline-flex h-9 w-9 rounded-xl text-[#0A1628]">
                <ServiceIcon icon={service.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-xl leading-tight tracking-tight text-[#0A1628]">{service.titleLines.join(" ")}</span>
                <span className="mt-1 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {service.packageLabel}
                </span>
                <span className="mt-2 flex items-center gap-2 text-[11px] font-medium text-slate-600">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A94E]" aria-hidden="true" />
                  {service.responsePromise}
                </span>
              </span>
              <span className="pt-1 text-sm text-slate-500" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>

            <div
              id={panelId}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!isOpen}
              inert={!isOpen ? true : undefined}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-5">
                  {shouldRenderImage ? (
                    <div className="relative h-40 overflow-hidden rounded-xl">
                      <Image
                        src={service.image}
                        alt={`${service.titleLines.join(" ")} service example for ${service.packageLabel}`}
                        fill
                        quality={68}
                        sizes="100vw"
                        className="object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081120]/25 via-transparent to-transparent" />
                    </div>
                  ) : null}

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>

                  <div className="mt-2 rounded-lg border border-[#C9A94E]/25 bg-[#C9A94E]/8 px-3 py-2">
                    <p className="text-sm font-medium leading-relaxed text-slate-700">{service.proofLine}</p>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-slate-700">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2.5 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A94E]" aria-hidden="true" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {isOpen ? (
                    <QuoteCTA
                      ctaId={`service_${service.anchor}_quote_mobile`}
                      serviceType={SERVICE_ANCHOR_TO_FORM_VALUE[service.anchor]}
                      className="cta-outline-dark mt-4 min-h-[48px] w-full justify-center gap-2"
                    >
                      Quote This Service
                      <span aria-hidden="true">→</span>
                    </QuoteCTA>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ServiceSpreadSection() {
  return (
    /* MOBILE-ELEVATION: P-6 — removed border-b. This section transitions to OfferAndIndustry
       which has a different background (gradient from-slate-50). The color change itself
       serves as the visual divider; border-b is redundant and adds a visible line that
       fights with the background transition. */
    <section id="services" aria-label="Services" className="scroll-mt-32 bg-white md:scroll-mt-36">
      <MobileServiceAccordion />
      <div className="hidden md:block">
        {services.map((service) => (
          <ServiceSpreadItem key={service.anchor} service={service} />
        ))}
      </div>
    </section>
  );
}
