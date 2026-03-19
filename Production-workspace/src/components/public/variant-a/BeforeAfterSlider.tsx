"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const pairs = [
  {
    before:
      "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2669&auto=format&fit=crop",
    caption: "Commercial Office Finish • Downtown Austin, TX",
  },
  {
    before:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=2670&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
    caption: "Luxury Apartment Turnover • South Congress, Austin",
  },
  {
    before:
      "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=2670&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
    caption: "Post-Construction Final Clean • Round Rock, TX",
  },
];

export function BeforeAfterSlider() {
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(50);
  const item = useMemo(() => pairs[active], [active]);

  return (
    <section className="border-b border-slate-200 bg-[#FAFAF8] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500">The A&A Standard</p>
          <h2 className="font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl">See the Difference</h2>
        </div>
        <div className="mb-6 flex justify-center gap-3">
          {pairs.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`View comparison ${idx + 1}`}
              onClick={() => {
                setActive(idx);
                setPosition(50);
              }}
              className={`h-2 w-2 rounded-full transition ${active === idx ? "scale-125 bg-[#0A1628]" : "bg-slate-300"}`}
            />
          ))}
        </div>

        <div className="relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-sm shadow-2xl" style={{ touchAction: "pan-y" }}>
          <Image src={item.after} alt="After cleaning" fill sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" />

          <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
            <Image src={item.before} alt="Before cleaning" fill sizes="(max-width: 1024px) 100vw, 960px" className="object-cover grayscale" />
          </div>

          <div
            className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 cursor-ew-resize bg-white"
            style={{ left: `${position}%` }}
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPosition((prev) => Math.max(0, prev - 5));
              if (e.key === "ArrowRight") setPosition((prev) => Math.min(100, prev + 5));
              if (e.key === "Home") setPosition(0);
              if (e.key === "End") setPosition(100);
            }}
            onMouseDown={(e) => {
              const rect = (e.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
              const move = (ev: MouseEvent) => {
                const pct = ((ev.clientX - rect.left) / rect.width) * 100;
                setPosition(Math.max(0, Math.min(100, pct)));
              };
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
            onTouchStart={(e) => {
              const rect = (e.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
              const move = (ev: TouchEvent) => {
                const pct = ((ev.touches[0].clientX - rect.left) / rect.width) * 100;
                setPosition(Math.max(0, Math.min(100, pct)));
              };
              const up = () => {
                window.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", up);
              };
              window.addEventListener("touchmove", move, { passive: true });
              window.addEventListener("touchend", up);
            }}
          >
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white shadow" />
          </div>

          <span className="absolute left-4 top-4 rounded-sm bg-[#0A1628]/75 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white">Before</span>
          <span className="absolute right-4 top-4 rounded-sm bg-[#0A1628]/75 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white">After</span>
        </div>

        <p className="mt-4 text-center text-sm font-light text-slate-500">{item.caption}</p>
      </div>
    </section>
  );
}
