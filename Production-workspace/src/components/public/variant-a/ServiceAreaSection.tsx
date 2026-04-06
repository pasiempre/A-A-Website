"use client";

import { useState } from "react";
import {
  SERVICE_AREA_REGION_META,
  SERVICE_AREA_VISUAL_POINTS,
  type ServiceAreaVisualPoint,
} from "@/data/service-area-visual";
import { QuoteCTA } from "./QuoteCTA";
import { useInViewOnce } from "./useInViewOnce";

type AreaData = ServiceAreaVisualPoint;

const areas: AreaData[] = SERVICE_AREA_VISUAL_POINTS;
const regionMeta = SERVICE_AREA_REGION_META;

export function ServiceAreaSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.2);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const austin = areas.find((a) => a.name === "Austin")!;

  return (
    <section
      ref={ref}
      id="service-area"
      aria-labelledby="service-area-heading"
      className="relative scroll-mt-32 overflow-hidden bg-[#0A1628] md:scroll-mt-36"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] hidden md:block"
        aria-hidden="true"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.15] hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,169,78,0.35) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10 md:py-24">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-20">
          <div
            className={`relative w-full max-w-md flex-shrink-0 transition-all duration-700 ease-out hidden md:block lg:w-[420px] ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="relative aspect-[3/4]">
              <div className="absolute inset-0 rounded-3xl border border-white/[0.06] bg-white/[0.02]" />

              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <ellipse
                  cx="48"
                  cy="50"
                  rx="30"
                  ry="46"
                  fill="none"
                  stroke="rgba(201,169,78,0.1)"
                  strokeWidth="0.6"
                  strokeDasharray="2 3"
                />

                {areas
                  .filter((a) => a.name !== "Austin")
                  .map((area) => {
                    const isHovered = hoveredArea === area.name;
                    return (
                      <line
                        key={area.name}
                        x1={austin.x}
                        y1={austin.y}
                        x2={area.x}
                        y2={area.y}
                        stroke={isHovered ? "#C9A94E" : "rgba(255,255,255,0.06)"}
                        strokeWidth={isHovered ? "0.8" : "0.4"}
                        strokeDasharray={isHovered ? "none" : "1.5 3"}
                        className="transition-all duration-300"
                      />
                    );
                  })}
              </svg>

              {areas.map((area, i) => {
                const meta = regionMeta[area.region];
                const isHQ = area.name === "Austin";
                const isHovered = hoveredArea === area.name;

                return (
                  <div
                    key={area.name}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                      isVisible
                        ? "scale-100 opacity-100"
                        : "scale-0 opacity-0"
                    }`}
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                      transitionDelay: isVisible
                        ? `${300 + i * 70}ms`
                        : "0ms",
                      zIndex: isHovered ? 20 : isHQ ? 15 : 10,
                    }}
                    onMouseEnter={() => setHoveredArea(area.name)}
                    onMouseLeave={() => setHoveredArea(null)}
                  >
                    {isHQ && (
                      <span
                        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/10"
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                        isHQ ? "h-9 w-9" : "h-6 w-6"
                      } ${isHovered ? "scale-[1.4]" : ""}`}
                      style={{ backgroundColor: meta.ring }}
                      aria-hidden="true"
                    />

                    <span
                      className={`relative block rounded-full transition-all duration-300 ${
                        isHQ ? "h-3.5 w-3.5" : "h-2 w-2"
                      } ${isHovered ? "scale-[1.6]" : ""}`}
                      style={{ backgroundColor: meta.dot }}
                    />

                    <span
                      className={`pointer-events-none absolute left-full ml-2.5 whitespace-nowrap rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                        isHovered
                          ? "bg-white px-3 py-1.5 text-[#0A1628] shadow-xl shadow-black/20"
                          : isHQ
                          ? "px-0 py-0 text-sm font-bold text-white"
                          : "px-0 py-0 text-slate-500"
                      }`}
                    >
                      {area.name}
                      {isHovered && !isHQ && (
                        <span className="ml-1.5 font-normal text-slate-400">
                          {area.distance}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`flex-1 transition-all duration-700 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="md:hidden">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#C9A94E]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A94E]">Coverage Area</span>
              </div>
              <h2 id="service-area-heading" className="mt-2 font-serif text-3xl tracking-tight text-white">
                Georgetown to San Marcos
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                Same standards at every location across the Austin metro.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#C9A94E]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A94E]">Where We Work</span>
              </div>

              <h2 className="mt-3 font-serif text-3xl tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                Greater Austin Metro
              </h2>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400 md:mt-4 md:text-base">
                Georgetown to San Marcos — same standards,
                every&nbsp;location.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 md:hidden">
              {areas.map((area) => {
                const meta = regionMeta[area.region];
                return (
                  <div
                    key={area.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.dot }} aria-hidden="true" />
                    <span className="font-medium text-slate-100">{area.name}</span>
                    <span className="text-xs text-slate-400">{area.distance}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-center md:hidden">
              <svg
                viewBox="0 0 100 100"
                className="h-[180px] w-full max-w-[280px]"
                aria-label="Service area map showing coverage from Georgetown to San Marcos"
                role="img"
              >
                <ellipse
                  cx="48"
                  cy="50"
                  rx="30"
                  ry="46"
                  fill="none"
                  stroke="rgba(201,169,78,0.18)"
                  strokeWidth="0.6"
                  strokeDasharray="2 3"
                />
                {areas.map((area) => (
                  <circle
                    key={`mobile-${area.name}`}
                    cx={area.x}
                    cy={area.y}
                    r={area.name === "Austin" ? 2.8 : 1.8}
                    fill={regionMeta[area.region].dot}
                    opacity={0.9}
                  />
                ))}
                {areas
                  .filter((a) => ["Austin", "Round Rock", "Georgetown", "San Marcos"].includes(a.name))
                  .map((area) => (
                    <text
                      key={`mobile-label-${area.name}`}
                      x={area.x}
                      y={area.y + 5}
                      textAnchor="middle"
                      className="fill-slate-300 text-[4px]"
                    >
                      {area.name}
                    </text>
                  ))}
              </svg>
            </div>

            <div className="mt-6 hidden grid-cols-2 gap-2 sm:grid-cols-4 md:mt-8 md:grid lg:grid-cols-2 xl:grid-cols-4">
              {areas.map((area, i) => {
                const meta = regionMeta[area.region];
                const isHQ = area.name === "Austin";
                const isHovered = hoveredArea === area.name;

                return (
                  <div
                    key={area.name}
                    className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-all duration-300 ${
                      isHovered
                        ? "border-[#C9A94E]/30 bg-white/[0.08]"
                        : "border-white/[0.05] bg-white/[0.02]"
                    } ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                    style={{
                      transitionDelay: isVisible
                        ? `${400 + i * 50}ms`
                        : "0ms",
                    }}
                    onMouseEnter={() => setHoveredArea(area.name)}
                    onMouseLeave={() => setHoveredArea(null)}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        isHQ ? "ring-1 ring-white/30" : ""
                      }`}
                      style={{ backgroundColor: meta.dot }}
                    />
                    <div className="min-w-0">
                      <p
                        className={`truncate text-xs font-semibold ${
                          isHQ ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {area.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {area.distance}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 hidden items-center gap-5 md:mt-6 md:flex">
              {Object.entries(regionMeta).map(([key, meta]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      key === "central" ? "ring-1 ring-white/30" : ""
                    }`}
                    style={{ backgroundColor: meta.dot }}
                  />
                  <span className="text-[10px] text-slate-500">
                    {meta.label}
                  </span>
                </div>
              ))}
            </div>

            <div id="service-area-primary-cta" className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-8">
              <QuoteCTA ctaId="service_area_check_availability" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A94E] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0A1628] transition-all duration-300 hover:bg-[#d4b85e] hover:shadow-lg hover:shadow-[#C9A94E]/20 min-h-[48px]">
                Check Availability in Your Area
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h12M12 6l4 4-4 4" />
                </svg>
              </QuoteCTA>
              <span className="text-xs text-slate-500">
                Don&apos;t see your area? We may still cover it.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
