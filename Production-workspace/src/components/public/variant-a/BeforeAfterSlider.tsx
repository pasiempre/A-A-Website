"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useInViewOnce } from "./useInViewOnce";

type ComparisonPair = {
  before: string;
  after: string;
  caption: string;
  tag: string;
  scope: string;
  turnaround: string;
};

const pairs: ComparisonPair[] = [
  {
    before: "/images/variant-a/comparison-01-before.jpg",
    after: "/images/variant-a/comparison-01-after.jpg",
    caption: "Commercial Office Finish • Downtown Austin, TX",
    tag: "Commercial Office",
    scope: "Lobby + Shared Areas",
    turnaround: "Final Presentation",
  },
  {
    before: "/images/variant-a/comparison-02-before.jpg",
    after: "/images/variant-a/comparison-02-after.jpg",
    caption: "Luxury Apartment Turnover • South Congress, Austin",
    tag: "Apartment Turn",
    scope: "Vacant Unit Refresh",
    turnaround: "Leasing Ready",
  },
  {
    before: "/images/variant-a/comparison-03-before.jpg",
    after: "/images/variant-a/comparison-03-after.jpg",
    caption: "Post-Construction Final Clean • Round Rock, TX",
    tag: "Post-Construction",
    scope: "Dust + Detail Finish",
    turnaround: "Walkthrough Ready",
  },
];

export function BeforeAfterSlider() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.2);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const item = pairs[active];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const hasRunIntroRef = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRunIntroRef.current || hasInteracted) return;
    hasRunIntroRef.current = true;

    const steps = [
      { pos: 50, delay: 600 },
      { pos: 25, delay: 1400 },
      { pos: 75, delay: 2200 },
      { pos: 50, delay: 3000 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach(({ pos, delay }) => {
      timers.push(setTimeout(() => setPosition(pos), delay));
    });

    return () => timers.forEach(clearTimeout);
  }, [isVisible, hasInteracted]);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPosition(Math.max(2, Math.min(98, pct)));
      if (!hasInteracted) setHasInteracted(true);
    },
    [hasInteracted]
  );

  useEffect(() => {
    const onMove = (clientX: number) => {
      if (!isDraggingRef.current) return;
      updatePosition(clientX);
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) onMove(touch.clientX);
    };
    const onEnd = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [updatePosition]);

  const startDrag = useCallback(
    (clientX: number) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      updatePosition(clientX);
    },
    [updatePosition]
  );

  const switchSlide = useCallback(
    (idx: number) => {
      if (idx === active) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActive(idx);
        setPosition(50);
        setIsTransitioning(false);
      }, 300);
    },
    [active]
  );

  return (
    <section
      ref={ref}
      aria-labelledby="before-after-heading"
      /* MOBILE-HARDENING: Tightened vertical padding for mobile */
      className="relative overflow-hidden bg-white py-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] hidden md:block" aria-hidden="true">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div
          className={`mb-8 transition-all duration-700 ease-out md:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                <span className="section-kicker">The A&A Standard</span>
              </div>

              <h2
                id="before-after-heading"
                className="mt-4 font-serif text-3xl tracking-tight text-[#0A1628] sm:text-5xl"
              >
                See the Difference
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-500 md:mt-4">
                Every project is cleaned to the same standard. Drag to compare
                the before and after — the results speak for&nbsp;themselves.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {pairs.map((pair, idx) => (
                <button
                  key={pair.tag}
                  type="button"
                  onClick={() => switchSlide(idx)}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 min-h-[44px] ${
                    active === idx
                      ? "bg-[#0A1628] text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-[#0A1628]"
                  }`}
                >
                  {pair.tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div
            ref={trackRef}
            /* MOBILE-HARDENING: Higher aspect ratio for better mobile viewing */
            className={`group/slider relative mx-auto aspect-[4/3] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-200/50 transition-opacity duration-300 md:aspect-[16/9] ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            style={{
              touchAction: "pan-y pinch-zoom",
              cursor: isDragging ? "ew-resize" : "default",
            }}
            onClick={(e) => {
              if (!isDragging) updatePosition(e.clientX);
            }}
          >
            <Image
              src={item.after}
              alt={`${item.tag} — after professional cleaning`}
              fill
              quality={80}
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover"
              priority={active === 0}
            />

            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - position}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - position}% 0 0)`,
                transition: isDragging ? "none" : "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <Image
                src={item.before}
                alt={`${item.tag} — before cleaning`}
                fill
                quality={80}
                sizes="(max-width: 1280px) 100vw, 1152px"
                className="object-cover"
                style={{ filter: "saturate(0.6) brightness(0.95)" }}
              />
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent"
              aria-hidden="true"
            />

            <span
              className={`absolute left-5 top-5 rounded-lg border border-white/15 bg-black/50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-opacity duration-300 ${
                position < 10 ? "opacity-0" : "opacity-100"
              }`}
            >
              Before
            </span>
            <span
              className={`absolute right-5 top-5 rounded-lg border border-white/15 bg-black/50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-opacity duration-300 ${
                position > 90 ? "opacity-0" : "opacity-100"
              }`}
            >
              After
            </span>

            <div
              className="absolute inset-y-0 z-20 w-[2px] -translate-x-1/2 bg-white/90"
              style={{
                left: `${position}%`,
                transition: isDragging ? "none" : "left 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                boxShadow: "0 0 12px rgba(0,0,0,0.3)",
              }}
              role="slider"
              tabIndex={0}
              aria-label="Before and after comparison slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position)}
              aria-valuetext={`${Math.round(position)} percent before image visible`}
              onKeyDown={(e) => {
                setHasInteracted(true);
                if (e.key === "ArrowLeft") setPosition((p) => Math.max(2, p - 3));
                if (e.key === "ArrowRight") setPosition((p) => Math.min(98, p + 3));
                if (e.key === "Home") setPosition(2);
                if (e.key === "End") setPosition(98);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                startDrag(e.clientX);
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                if (touch) startDrag(touch.clientX);
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-xl transition-transform duration-200 hover:scale-110 active:scale-95"
                style={{
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 4l-4 6 4 6" />
                  <path d="M13 4l4 6-4 6" />
                </svg>
              </div>
            </div>

            {!hasInteracted && (
              <div
                className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 animate-pulse"
              >
                <div className="rounded-full border border-white/20 bg-black/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                  Drag to compare
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`mx-auto mt-5 max-w-6xl transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          } ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
            {[
              {
                label: "Project",
                value: item.caption,
                accent: true,
              },
              { label: "Scope", value: item.scope },
              { label: "Result", value: item.turnaround },
              { label: "Key Benefit", value: "Inspection-ready results" },
            ].map((cell) => (
              <div
                key={cell.label}
                className="bg-white p-3 md:p-5"
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.22em] ${
                    cell.accent ? "text-[#2563EB]" : "text-slate-500"
                  }`}
                >
                  {cell.label}
                </p>
                <p className="mt-2 text-sm font-medium text-[#0A1628]">
                  {cell.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
