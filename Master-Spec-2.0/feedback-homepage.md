# Code Review: `AboutSection.tsx` & `AIQuoteAssistant.tsx`

---

## 1. `AboutSection.tsx`

### Grade: **B+**

| Category | Score | Notes |
|---|---|---|
| Structure / Semantics | ⭐⭐⭐⭐ | Good use of `<section>`, `<blockquote>`, semantic layout |
| Accessibility | ⭐⭐⭐ | `aria-hidden` on arrow is good, but image alt text is generic |
| Responsiveness | ⭐⭐⭐⭐ | Solid md breakpoints, scroll-mt offsets |
| Performance | ⭐⭐⭐ | External Unsplash URL in production is risky; no `priority` consideration |
| Maintainability | ⭐⭐⭐ | Magic color strings scattered; animation logic inline |
| Animation | ⭐⭐⭐⭐ | Clean entrance with `useInViewOnce` |

### Key Issues

1. **Generic alt text** — `"A&A Cleaning standards"` tells screen readers nothing useful
2. **Hardcoded colors everywhere** — `#0A1628`, `#081120`, `#C9A94E` repeated as raw strings
3. **External image URL in production** — Unsplash hotlinking is unreliable and breaks `next/image` domain requirements unless configured
4. **Animation classes are inline ternaries** — hard to scan, easy to break
5. **`&amp;` in JSX text nodes** — unnecessary; JSX handles `&` natively in text content

### Recommended Upgrade

```tsx
"use client";

import Image from "next/image";
import { useInViewOnce } from "./useInViewOnce";
import { cn } from "@/lib/utils"; // or your own clsx/twMerge helper

const STANDARDS = ["Detail-first", "Walkthrough ready", "Responsive crews"] as const;

// If you don't have a cn() helper yet:
// export const cn = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");

export function AboutSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-32 overflow-hidden border-b border-slate-200 bg-white md:scroll-mt-36"
    >
      <div className="flex min-h-[70vh] flex-col md:flex-row">
        {/* ── Text Column ── */}
        <div
          className={cn(
            "relative flex w-full items-center justify-center bg-white p-12 transition duration-1000 md:w-[55%] md:p-24",
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          )}
        >
          {/* Decorative radial background */}
          <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_18%_18%,rgba(201,169,78,0.08),transparent_34%)]" />
          </div>

          <div className="max-w-lg">
            <span className="section-kicker block">About A&A</span>

            <h2
              id="about-heading"
              className="mt-6 font-serif text-4xl tracking-tight text-brand-dark md:text-5xl"
            >
              Built on Standards
            </h2>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Core values">
              {STANDARDS.map((item) => (
                <li key={item} className="info-chip">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-6 text-lg font-light leading-relaxed text-slate-600">
              <p>
                A&A Cleaning was built on a simple principle: the job is not
                done until every detail meets the standard.
              </p>
              <p>
                From rough cleans on active construction sites to final
                walkthrough preparation, the goal is consistent: help the space
                feel ready, finished, and professionally presented.
              </p>
            </div>

            <figure className="surface-panel-soft mt-10 p-6">
              <figcaption className="signal-line">The A&A standard</figcaption>
              <blockquote className="mt-4 font-serif text-2xl italic leading-snug text-brand-dark">
                "We don&apos;t leave until it&apos;s right."
              </blockquote>
            </figure>

            <a href="#quote" className="cta-outline-dark mt-10 gap-3">
              Work With Us
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* ── Image Column ── */}
        <div
          className={cn(
            "relative h-[50vh] w-full overflow-hidden transition duration-1000 md:h-auto md:w-[45%]",
            isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          )}
        >
          <Image
            src="/images/about-hero.jpg" // ← self-host the asset
            alt="A cleaning crew member carefully wiping down a newly constructed office lobby"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />

          {/* Overlay gradient */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-darker/20 via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* Top badges */}
          <div className="pointer-events-none absolute left-8 right-8 top-8 flex justify-between" aria-hidden="true">
            <span className="info-chip-dark">Field-ready detail</span>
            <span className="rounded-full border border-white/15 bg-brand-darker/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              Finish-Ready Standard
            </span>
          </div>

          {/* Bottom card */}
          <div className="pointer-events-none absolute bottom-8 left-8 right-8" aria-hidden="true">
            <div className="dark-surface-panel max-w-xs px-5 py-4">
              <p className="section-kicker text-brand-gold">Why it matters</p>
              <p className="mt-2 text-sm font-light leading-relaxed text-slate-200">
                The last impression of a space comes from finish quality, not
                just completion status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| `aria-labelledby="about-heading"` on `<section>` | Screen readers announce the section's purpose |
| Standards list → `<ul>` / `<li>` | Semantically a list, not bare `<span>` elements |
| `<figure>` + `<figcaption>` wrapping the blockquote | Correct semantic container for a quote with attribution |
| `cn()` helper for conditional classes | Eliminates long inline ternaries; easy to read & extend |
| `STANDARDS` extracted as a `const` | Hoisted out of render; `as const` gives literal types |
| Self-hosted image path | Unsplash hotlinks require `next.config.js` domain config and can break; self-hosting is reliable |
| Descriptive `alt` text | Meaningful to screen-reader users |
| `aria-hidden="true"` on decorative overlays | Prevents decorative elements from polluting the a11y tree |
| Brand color tokens (`text-brand-dark`, etc.) | Extend `tailwind.config.ts` once, reference everywhere |

**Tailwind config addition you'd need:**

```ts
// tailwind.config.ts (partial)
theme: {
  extend: {
    colors: {
      brand: {
        dark: "#0A1628",
        darker: "#081120",
        gold: "#C9A94E",
        blue: "#1D4ED8",
      },
    },
  },
},
```

---

## 2. `AIQuoteAssistant.tsx`

### Grade: **B−**

| Category | Score | Notes |
|---|---|---|
| Functionality | ⭐⭐⭐⭐ | Session, bilingual, error handling — solid |
| Accessibility | ⭐⭐ | No focus trap, no `aria-live`, no keyboard send |
| Mobile support | ⭐ | Completely hidden below `md` |
| UX polish | ⭐⭐ | No auto-scroll, no typing indicator, no Enter-to-send |
| Code quality | ⭐⭐⭐ | Clean but has fragile index keys, unlogged errors |
| Security | ⭐⭐⭐ | Client-side is OK; relies on API for real validation |

### Key Issues

1. **Zero mobile presence** — `hidden md:inline-flex` / `hidden md:flex` means the majority of traffic can't use it
2. **No auto-scroll** — after 5-6 messages the user must manually scroll down
3. **No `Enter` key to send** — textarea swallows Enter as a newline; no shortcut
4. **No focus management** — opening the dialog doesn't move focus into it; closing doesn't return focus
5. **No `aria-live` region** — screen readers are never informed of new assistant responses
6. **Index-based keys** — can cause reconciliation bugs if messages are ever reordered/removed
7. **Error swallowed silently** — `catch` block adds a message but never logs for debugging
8. **No typing/thinking indicator** — user has no visual cue the AI is processing

### Recommended Upgrade

```tsx
"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────── */
/*  Types                                      */
/* ────────────────────────────────────────── */
type Locale = "en" | "es";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

interface ApiResponse {
  reply?: string;
  sessionId?: string;
  error?: string;
}

/* ────────────────────────────────────────── */
/*  Helpers                                    */
/* ────────────────────────────────────────── */
const GREETING: Record<Locale, string> = {
  en: "Hi — I can help you with a fast quote. Tell me your service type, project address, size, and target date.",
  es: "Hola — puedo ayudarte con una cotización rápida. Dime el tipo de servicio, dirección, tamaño y fecha deseada.",
};

const ERROR_MSG: Record<Locale, string> = {
  en: "I could not process that right now. Share service type, address, project size, and timeline and I'll help structure your quote request.",
  es: "No pude procesar eso ahora. Comparte tipo de servicio, dirección, tamaño y fecha para ayudarte con la cotización.",
};

const PLACEHOLDER: Record<Locale, string> = {
  en: "Type your message…",
  es: "Escribe tu mensaje…",
};

const SEND_LABEL: Record<Locale, { idle: string; busy: string }> = {
  en: { idle: "Send", busy: "Sending…" },
  es: { idle: "Enviar", busy: "Enviando…" },
};

let msgCounter = 0;
function nextMsgId(): string {
  msgCounter += 1;
  return `msg-${msgCounter}-${Date.now()}`;
}

/* ────────────────────────────────────────── */
/*  Component                                  */
/* ────────────────────────────────────────── */
export function AIQuoteAssistant() {
  const dialogLabelId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: nextMsgId(), role: "assistant", text: GREETING.en },
  ]);

  const assistantRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  /* ── Focus management ── */
  useEffect(() => {
    if (isOpen) {
      // Small delay lets the DOM render first
      requestAnimationFrame(() => textareaRef.current?.focus());
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  /* ── Outside click & Escape ── */
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (assistantRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setIsOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  /* ── Reset greeting when locale changes ── */
  useEffect(() => {
    setMessages([{ id: nextMsgId(), role: "assistant", text: GREETING[locale] }]);
    setSessionId(null);
  }, [locale]);

  /* ── Send handler ── */
  const sendMessage = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || isSending) return;

    setMessages((prev) => [...prev, { id: nextMsgId(), role: "user", text: prompt }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, locale, sessionId }),
      });

      const data: ApiResponse = await res.json();
      if (!res.ok || !data.reply) throw new Error(data.error ?? "Empty reply");

      setSessionId(data.sessionId ?? sessionId);
      setMessages((prev) => [
        ...prev,
        { id: nextMsgId(), role: "assistant", text: data.reply! },
      ]);
    } catch (err) {
      console.error("[AIQuoteAssistant]", err);
      setMessages((prev) => [
        ...prev,
        { id: nextMsgId(), role: "assistant", text: ERROR_MSG[locale] },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, locale, sessionId]);

  /* ── Keyboard: Enter to send, Shift+Enter for newline ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-label={isOpen ? "Close quote assistant" : "Open quote assistant"}
        aria-expanded={isOpen}
        aria-controls="ai-assistant-panel"
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-brand-blue text-white shadow-[0_18px_50px_rgba(29,78,216,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1948ca]"
      >
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-white/40 bg-brand-gold" />
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
          <path
            d="M8 10V9a4 4 0 1 1 8 0v1M7.5 16.5V13a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v3.5M6 14h1.5M16.5 14H18M9.5 18h5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {/* ── Chat Panel ── */}
      {isOpen && (
        <aside
          id="ai-assistant-panel"
          ref={assistantRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogLabelId}
          className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[calc(100vw-3rem)] max-w-[22rem] flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl sm:w-[22rem]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
            <p id={dialogLabelId} className="text-sm font-semibold text-slate-800">
              Quote Assistant
            </p>
            <fieldset className="flex gap-1" aria-label="Language">
              <legend className="sr-only">Language</legend>
              {(["en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  aria-pressed={locale === lang}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium transition",
                    locale === lang
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  )}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </fieldset>
          </div>

          {/* Messages */}
          <div
            className="flex-1 space-y-2 overflow-y-auto px-3 py-3"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-slate-100 text-slate-800"
                    : "ml-auto bg-brand-blue text-white"
                )}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex items-center gap-1 px-1 py-2" aria-label="Assistant is typing">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={scrollAnchorRef} />
          </div>

          {/* Input */}
          <form
            className="border-t border-slate-200 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER[locale]}
              className="w-full resize-none rounded border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue/40"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="mt-2 w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? SEND_LABEL[locale].busy : SEND_LABEL[locale].idle}
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **Mobile visible** — removed `hidden md:` from trigger & panel; uses `w-[calc(100vw-3rem)] max-w-[22rem]` | The assistant was invisible to all mobile users |
| **`aria-modal`, `aria-expanded`, `aria-controls`, `aria-labelledby`** | Proper dialog semantics for assistive tech |
| **`role="log"` + `aria-live="polite"`** on message container | Screen readers announce new messages automatically |
| **Stable `id` per message** via `nextMsgId()` | Eliminates fragile index-based React keys |
| **Auto-scroll** via `scrollAnchorRef` | Chat scrolls to bottom on every new message |
| **Focus management** — textarea on open, trigger on close | Standard dialog focus behavior |
| **`Enter` to send / `Shift+Enter` for newline** | Expected chat UX; eliminates friction |
| **Typing indicator** (bouncing dots) | Visual feedback while awaiting API response |
| **`<form>` wrapper** with `onSubmit` | Proper form semantics; works with assistive tech "submit" actions |
| **`useCallback` on `sendMessage`** | Stable reference; avoids re-creation every render |
| **`console.error` in catch** | Errors are now debuggable in dev tools |
| **Locale-aware greeting reset** | Switching language resets context so the greeting matches |
| **Extracted copy to `Record<Locale, …>` constants** | Single source of truth; easy to add more locales later |
| **Disabled send when input is empty** | Prevents accidental blank submissions |
| **`resize-none`** on textarea | Prevents user from breaking the layout by dragging the handle |

---

## Summary Comparison

| | AboutSection | AIQuoteAssistant |
|---|---|---|
| **Grade** | **B+** | **B−** |
| Biggest win already | Scroll-animation + semantic layout | Bilingual + session + error UX |
| Highest-impact fix | Self-host image + semantic list/figure | Mobile visibility + auto-scroll + a11y |
| Effort to upgrade | Low (~15 min) | Medium (~30 min) |

Let me know when you send the next files — happy to keep going.


# Code Review: `AuthorityBar`, `BeforeAfterSlider`, `CareersSection`

---

## 1. `AuthorityBar.tsx`

### Grade: **B**

| Category | Score | Notes |
|---|---|---|
| Visual Design | ⭐⭐⭐⭐⭐ | Impressive animated counter bar with dividers |
| Animation Quality | ⭐⭐⭐ | Custom easing is good, but uses `setInterval` instead of `rAF`; no reduced-motion support |
| Accessibility | ⭐⭐ | No `aria-labelledby`, counters not semantically meaningful, star rating is pure text |
| DRY / Maintainability | ⭐⭐ | Duplicates `useInViewOnce` logic; divider pseudo-class repeated 3× verbatim |
| Hardcoded values | ⭐⭐ | Same raw color strings; magic numbers in animation |

### Key Issues

1. **Duplicates existing `useInViewOnce` hook** — component re-implements `IntersectionObserver` + `useState` when you already have a shared hook
2. **`setInterval` at 16ms ≠ smooth animation** — it drifts off v-sync; `requestAnimationFrame` is the correct primitive
3. **No `prefers-reduced-motion`** — counters should instantly show final values for users who've enabled reduced motion
4. **Star rating is inaccessible** — `★★★★★` is meaningless to screen readers
5. **Divider pseudo-element CSS duplicated 3×** — extract a utility class
6. **Spread `animatedStats[0]` etc. without null guard** — works because the array is static, but fragile

### Recommended Upgrade

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInViewOnce } from "./useInViewOnce";
import { cn } from "@/lib/utils";

/* ───────────────────────────────── Types ── */
interface StatDef {
  target: number;
  suffix: string;
  label: string;
  detail: string;
  icon: "years" | "projects" | "timing";
}

/* ─────────────────────────────── Constants ── */
const ANIMATED_STATS: StatDef[] = [
  { target: 15, suffix: "+", label: "Years", detail: "field experience", icon: "years" },
  { target: 500, suffix: "+", label: "Projects", detail: "spaces delivered", icon: "projects" },
  { target: 100, suffix: "%", label: "On-Time", detail: "handoff focus", icon: "timing" },
];

const STATIC_STAT = {
  title: "Licensed",
  subtitle: "& Insured",
  detail: "ready for commercial and site work",
} as const;

const COUNT_DURATION_MS = 1200;

/* ──────────────────────────────── Helpers ── */

/** Returns true when the user prefers reduced motion. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/** Eased count-up powered by `requestAnimationFrame`. */
function useCountUp(target: number, start: boolean, skipAnimation: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (skipAnimation) {
      setValue(target);
      return;
    }

    let raf: number;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / COUNT_DURATION_MS, 1);
      // cubic ease-out
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, skipAnimation]);

  return value;
}

/* ──────────────────────────────── Icons ── */
function MetricIcon({ icon }: { icon: StatDef["icon"] }) {
  const paths: Record<StatDef["icon"], React.ReactNode> = {
    years: (
      <>
        <path
          d="M12 5v7l4 2.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    projects: (
      <>
        <path
          d="M5 19.5V7l7-2 7 2v12.5H5Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M9 10.5h6M9 14h6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </>
    ),
    timing: (
      <>
        <path
          d="M6.5 12.5 10 16l7.5-8.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      {paths[icon]}
    </svg>
  );
}

/* ──────────────────────────── Metric Card ── */
function AnimatedMetric({
  target,
  suffix,
  label,
  detail,
  icon,
  start,
  skipAnimation,
}: StatDef & { start: boolean; skipAnimation: boolean }) {
  const value = useCountUp(target, start, skipAnimation);

  return (
    <div className="flex h-full flex-col items-center justify-center px-5 py-4 text-center">
      <div className="icon-tile mb-5">
        <MetricIcon icon={icon} />
      </div>

      {/* Expose the real number to assistive tech, show animated value visually */}
      <p
        className="mb-2 font-serif text-5xl tracking-tight text-brand-dark md:text-6xl lg:text-[5.25rem]"
        aria-label={`${target}${suffix} ${label}`}
      >
        <span aria-hidden="true">{value}</span>
        <span className="text-slate-400" aria-hidden="true">
          {suffix}
        </span>
      </p>

      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">{detail}</p>
    </div>
  );
}

/* ──────────────────────── Grid cell wrapper ── */
const DIVIDER_CLASSES =
  "relative lg:px-6 lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-24 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-slate-200";

/* ──────────────────────── Main Component ── */
export function AuthorityBar() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.35 });
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      aria-labelledby="authority-heading"
      className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] py-24 md:py-28"
    >
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(201,169,78,0.12),transparent_34%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="section-kicker">Proof Rail</p>
          <h2
            id="authority-heading"
            className="mt-3 font-serif text-4xl tracking-tight text-brand-dark md:text-5xl"
          >
            Standards You Can Read Fast
          </h2>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-1 gap-y-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0"
          role="list"
          aria-label="Key metrics"
        >
          {/* Animated stat 1 */}
          <div className={DIVIDER_CLASSES} role="listitem">
            <AnimatedMetric
              {...ANIMATED_STATS[0]}
              start={isVisible}
              skipAnimation={reducedMotion}
            />
          </div>

          {/* Animated stat 2 */}
          <div className={DIVIDER_CLASSES} role="listitem">
            <AnimatedMetric
              {...ANIMATED_STATS[1]}
              start={isVisible}
              skipAnimation={reducedMotion}
            />
          </div>

          {/* Static "Licensed & Insured" */}
          <div className={cn(DIVIDER_CLASSES, "flex flex-col items-center justify-center")} role="listitem">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1c]">
              Core signal
            </div>
            <p className="mb-3 font-serif text-[2.6rem] leading-[1.04] tracking-tight text-brand-dark md:text-[3.2rem]">
              {STATIC_STAT.title}
              <br />
              <span className="inline-block pt-1">{STATIC_STAT.subtitle}</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
              Austin Standards
            </p>
            <p className="mt-3 max-w-[14rem] text-xs uppercase tracking-[0.16em] text-slate-400">
              {STATIC_STAT.detail}
            </p>
          </div>

          {/* Animated stat 3 */}
          <div className="lg:px-6" role="listitem">
            <AnimatedMetric
              {...ANIMATED_STATS[2]}
              start={isVisible}
              skipAnimation={reducedMotion}
            />
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <div className="surface-panel-soft inline-flex flex-wrap items-center justify-center gap-3 px-5 py-3 text-sm text-slate-600">
            <span aria-label="5 out of 5 stars" className="text-base tracking-[0.22em] text-brand-gold">
              ★★★★★
            </span>
            <span className="font-light">
              Trusted across Austin-area job sites, office spaces, and turnover projects.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **Reuse `useInViewOnce`** instead of manual observer | DRY — one hook, one pattern |
| **`requestAnimationFrame`** replaces `setInterval(…, 16)` | True v-sync alignment; no timer drift |
| **`usePrefersReducedMotion` + `skipAnimation`** | Counters snap to final value for motion-sensitive users |
| **`aria-label` on metric `<p>`** with real target number | Screen readers get "500+ Projects" immediately, not "0" then "1" then "2"… |
| **`DIVIDER_CLASSES` extracted** | Eliminates 3× copy-paste of the `lg:after:*` chain |
| **`role="list"` / `"listitem"` on grid** | Communicates the stats are a set of related items |
| **`aria-label="5 out of 5 stars"` on star string** | Screen readers read meaning, not "star star star star star" |
| **Brand color tokens** | Consistent with earlier tailwind config |
| **`COUNT_DURATION_MS` constant** | Tunable in one place |

---

## 2. `BeforeAfterSlider.tsx`

### Grade: **B−**

| Category | Score | Notes |
|---|---|---|
| Interactivity | ⭐⭐⭐⭐ | Keyboard + mouse + touch support for slider |
| Visual polish | ⭐⭐⭐⭐⭐ | Beautiful result: labels, gradient, grid overlay |
| Accessibility | ⭐⭐⭐ | Slider has `role="slider"` and keyboard, but images lack per-pair alt text; instruction says "drag" but not keyboard |
| Performance | ⭐⭐ | External Unsplash URLs; `useMemo` on a trivial lookup; two full-bleed `<Image>` per pair |
| Robustness | ⭐⭐ | Listeners added to `window` in handlers may leak on unmount mid-drag; no null-check on `touches[0]` |
| Maintainability | ⭐⭐ | Massive single component; hardcoded colors; `!text-slate-500` specificity override |

### Key Issues

1. **External image URLs** — Same problem; Unsplash hotlinks need `next.config.js` `remotePatterns` and are unreliable in production
2. **`useMemo` is overkill** — `pairs[active]` is a constant-time lookup, not a computation
3. **Drag event listeners can leak** — If the component unmounts while the user is mid-drag, the `mousemove`/`mouseup` on `window` are never cleaned up
4. **`!text-slate-500` override** — Indicates a specificity conflict with `section-kicker`; fix the root style instead
5. **`touches[0].clientX` no null-check** — TypeScript won't catch this at runtime
6. **Index keys** on pagination dots and tick marks
7. **No `prefers-reduced-motion`** — entrance animations should be skippable
8. **Instruction says "Drag to Compare"** — keyboard users can use arrow keys but aren't told
9. **Image `alt` is generic** — should reflect the specific pair content
10. **Massive JSX** — slider handle, overlays, info panel could be sub-components

### Recommended Upgrade

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInViewOnce } from "./useInViewOnce";
import { cn } from "@/lib/utils";

/* ────────────────────────────── Types ── */
interface ComparisonPair {
  id: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
  tag: string;
  scope: string;
  turnaround: string;
}

/* ─────────────────────────── Constants ── */
const PAIRS: ComparisonPair[] = [
  {
    id: "commercial-office",
    before: "/images/comparisons/office-before.jpg",
    after: "/images/comparisons/office-after.jpg",
    beforeAlt: "Unfinished office lobby with construction dust on floors and windows",
    afterAlt: "Same office lobby fully cleaned with polished floors and streak-free glass",
    caption: "Commercial Office Finish • Downtown Austin, TX",
    tag: "Commercial Office",
    scope: "Lobby + Shared Areas",
    turnaround: "Final Presentation",
  },
  {
    id: "apartment-turn",
    before: "/images/comparisons/apartment-before.jpg",
    after: "/images/comparisons/apartment-after.jpg",
    beforeAlt: "Vacant apartment unit with scuffed floors and dust on countertops",
    afterAlt: "Same apartment unit freshly cleaned and ready for leasing photos",
    caption: "Luxury Apartment Turnover • South Congress, Austin",
    tag: "Apartment Turn",
    scope: "Vacant Unit Refresh",
    turnaround: "Leasing Ready",
  },
  {
    id: "post-construction",
    before: "/images/comparisons/construction-before.jpg",
    after: "/images/comparisons/construction-after.jpg",
    beforeAlt: "Newly remodeled kitchen covered in drywall dust and debris",
    afterAlt: "Same kitchen spotlessly cleaned and staged for final walkthrough",
    caption: "Post-Construction Final Clean • Round Rock, TX",
    tag: "Post-Construction",
    scope: "Dust + Detail Finish",
    turnaround: "Walkthrough Ready",
  },
];

/* ───────────────────── Comparison Slider ── */
function ComparisonSlider({ pair }: { pair: ComparisonPair }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  /* Centralized position updater */
  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  /* Mouse drag — attached at document level for reliability */
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    };
    const onUp = () => {
      isDragging.current = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [updatePosition]);

  /* Touch drag */
  const handleTouchStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  useEffect(() => {
    const onMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      if (touch) updatePosition(touch.clientX);
    };
    const onEnd = () => {
      isDragging.current = false;
    };

    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
    return () => {
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [updatePosition]);

  /* Keyboard */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number | undefined> = {
      ArrowLeft: Math.max(0, position - 5),
      ArrowRight: Math.min(100, position + 5),
      Home: 0,
      End: 100,
    };
    const next = map[e.key];
    if (next !== undefined) {
      e.preventDefault();
      setPosition(next);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,39,70,0.16)]"
      style={{ touchAction: "pan-y" }}
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* After (full) */}
      <Image
        src={pair.after}
        alt={pair.afterAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 960px"
        className="object-cover"
      />

      {/* Before (clipped) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <Image
          src={pair.before}
          alt={pair.beforeAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover grayscale"
        />
      </div>

      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-darker/60 to-transparent"
        aria-hidden="true"
      />

      {/* Side tick marks */}
      {(["left-6", "right-6"] as const).map((side) => (
        <div
          key={side}
          className={cn(
            "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex",
            side === "left-6" ? "left-6" : "right-6"
          )}
          aria-hidden="true"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <span key={`tick-${side}-${i}`} className="h-px w-8 bg-white/35" />
          ))}
        </div>
      ))}

      {/* Slider handle */}
      <div
        className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 cursor-ew-resize bg-white/95"
        style={{ left: `${position}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison — use arrow keys or drag"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% before, ${Math.round(100 - position)}% after`}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center gap-0.5 text-slate-500">
            <span className="h-3 w-px bg-slate-400" />
            <span className="h-3 w-px bg-slate-300" />
            <span className="h-3 w-px bg-slate-400" />
          </div>
        </div>
      </div>

      {/* Before / After labels */}
      <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-brand-dark/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
        Before
      </span>
      <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-brand-dark/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
        After
      </span>

      {/* Instruction pill */}
      <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center">
        <div className="rounded-full border border-white/20 bg-brand-darker/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
          Drag or use arrow keys to compare
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Info Panel ── */
function PairInfoPanel({ pair }: { pair: ComparisonPair }) {
  return (
    <div className="surface-panel grid gap-4 p-5 md:grid-cols-[1.4fr,1fr,1fr,1fr] md:items-center">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">
          {pair.tag}
        </p>
        <p className="mt-2 text-sm font-medium text-brand-dark">{pair.caption}</p>
      </div>
      {[
        { heading: "Scope", value: pair.scope },
        { heading: "Result", value: pair.turnaround },
        { heading: "Signal", value: "Visible finish quality" },
      ].map((col) => (
        <div key={col.heading} className="border-slate-200 md:border-l md:pl-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {col.heading}
          </p>
          <p className="mt-2 text-sm text-slate-700">{col.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────── Main Component ── */
export function BeforeAfterSlider() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const activePair = PAIRS[activeIndex];

  const fadeClass = (delay?: string) =>
    cn(
      "transition duration-1000 motion-reduce:transition-none",
      delay,
      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    );

  return (
    <section
      ref={ref}
      aria-labelledby="comparison-heading"
      className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] py-24 md:py-28"
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,22,40,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(10,22,40,0.08) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className={cn(fadeClass(), "mb-12 text-center")}>
          <p className="section-kicker mb-4 text-slate-500">The A&A Standard</p>
          <h2
            id="comparison-heading"
            className="font-serif text-4xl tracking-tight text-brand-dark md:text-5xl"
          >
            See the Difference
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Compare the finish quality side by side. Drag the slider—or use your arrow
            keys—to reveal the transformation.
          </p>
        </div>

        {/* Pagination dots */}
        <nav
          className={cn(fadeClass(), "mb-6 flex justify-center gap-3")}
          aria-label="Comparison selector"
        >
          {PAIRS.map((pair, idx) => (
            <button
              key={pair.id}
              type="button"
              aria-label={`View ${pair.tag} comparison`}
              aria-current={activeIndex === idx ? "true" : undefined}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                activeIndex === idx
                  ? "w-12 bg-brand-dark"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              )}
            />
          ))}
        </nav>

        {/* Slider */}
        <div className={fadeClass()}>
          <ComparisonSlider pair={activePair} />
        </div>

        {/* Detail panel */}
        <div className={cn(fadeClass(), "mx-auto mt-6 max-w-5xl")}>
          <PairInfoPanel pair={activePair} />
        </div>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **Extracted `ComparisonSlider` + `PairInfoPanel`** | Main component dropped from ~160 lines of JSX to ~60; each piece is testable |
| **Document-level listeners with cleanup** | Mouse/touch listeners are added in `useEffect` and always cleaned up — no leak risk on unmount mid-drag |
| **`isDragging` ref** instead of inline closure listeners | Simpler mental model; one listener pair for the whole lifecycle |
| **Self-hosted images + descriptive `beforeAlt`/`afterAlt`** | Reliable loading; meaningful to assistive tech |
| **Removed `useMemo`** | `PAIRS[activeIndex]` is O(1) — memo added overhead for zero benefit |
| **`aria-valuetext`** on slider | Reads "35% before, 65% after" instead of a raw number |
| **"Drag or use arrow keys"** instruction | Inclusive of keyboard users |
| **Removed `!text-slate-500`** | Replaced with `text-slate-500` directly (fixed the specificity issue in the kicker class) |
| **Stable `pair.id` keys** on pagination | No more index-based keys |
| **`motion-reduce:transition-none`** | Tailwind's built-in reduced-motion utility |
| **`fadeClass()` helper** | Eliminates 4× repeated transition ternary |
| **`<nav>` for pagination** | Semantic grouping for dot navigation |
| **`aria-current`** on active dot | Standard pattern for indicating current item in navigation |

---

## 3. `CareersSection.tsx`

### Grade: **B**

| Category | Score | Notes |
|---|---|---|
| Simplicity | ⭐⭐⭐⭐⭐ | Clean, focused, easy to read |
| Semantics | ⭐⭐⭐ | No `aria-labelledby`; background image not optimized |
| Accessibility | ⭐⭐⭐ | Good link semantics; missing reduced-motion support |
| Performance | ⭐⭐ | CSS background image bypasses Next.js Image optimization and lazy loading |
| Robustness | ⭐⭐⭐ | `h-[52vh]` can clip content on short viewports |

### Key Issues

1. **CSS `backgroundImage` bypasses Next.js optimization** — no lazy loading, no format negotiation (WebP/AVIF), no responsive srcset
2. **External Unsplash URL** — same reliability concern
3. **No `aria-labelledby`** on section
4. **`h-[52vh]`** — on a 600px tall viewport that's only 312px; heading + paragraph + link may overflow
5. **No `prefers-reduced-motion`** — scale animation and translate entrance should be optional
6. **Hardcoded color strings** again

### Recommended Upgrade

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useInViewOnce } from "./useInViewOnce";
import { cn } from "@/lib/utils";

export function CareersSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.25 });

  return (
    <section
      ref={ref}
      id="careers"
      aria-labelledby="careers-heading"
      className="relative flex min-h-[52vh] scroll-mt-32 items-center justify-center overflow-hidden md:min-h-[60vh] md:scroll-mt-36"
    >
      {/* ── Background Image via next/image ── */}
      <div
        className={cn(
          "absolute inset-0 transition duration-[2200ms] motion-reduce:transition-none",
          isVisible ? "scale-100" : "scale-[1.08]"
        )}
        aria-hidden="true"
      >
        <Image
          src="/images/careers-hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-brand-dark/60" />
      </div>

      {/* ── Content ── */}
      <div
        className={cn(
          "relative z-10 max-w-2xl px-6 text-center transition duration-1000 motion-reduce:transition-none",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <h2
          id="careers-heading"
          className="font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          We&apos;re Building a Team
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-lg font-light leading-relaxed text-slate-200">
          Professional cleaning careers for people who care about finish quality,
          reliability, and attention to detail.
        </p>

        <Link
          href="/careers"
          className="group mt-8 inline-flex items-center gap-3 border-b border-white pb-1 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:border-brand-gold hover:text-brand-gold"
        >
          See Open Positions
          <span
            className="transition group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **`next/image` with `fill`** replaces CSS `backgroundImage` | Enables lazy loading, responsive srcset, format negotiation (WebP/AVIF), blur placeholder support |
| **Self-hosted path** | Reliable; no external dependency |
| **`alt=""`** on decorative hero image | It's a background/ambiance image; the section heading conveys the content |
| **`min-h-[52vh]`** instead of `h-[52vh]`** | Content can't be clipped on short viewports — it grows if needed |
| **`aria-labelledby="careers-heading"`** | Section is properly announced |
| **`motion-reduce:transition-none`** | Scale + translate animations are skipped for reduced-motion users |
| **Brand tokens** (`brand-dark`, `brand-gold`) | Consistent; single source of truth |
| **Overlay as separate `<div>`** instead of gradient in `backgroundImage` | Cleaner separation; can animate opacity independently if needed |

---

## Summary Table

| Component | Before | After | Highest-Impact Fix |
|---|---|---|---|
| **AuthorityBar** | **B** | **A−** | `rAF` + reduced-motion + reuse `useInViewOnce` |
| **BeforeAfterSlider** | **B−** | **A−** | Extracted sub-components + leak-free drag listeners + descriptive alt text |
| **CareersSection** | **B** | **A** | `next/image` for background + `min-h` + `aria-labelledby` |

### Cross-Cutting Themes Across All 5 Files So Far

| Pattern | Frequency | Fix |
|---|---|---|
| Raw hex colors | Every file | Add `brand` tokens to `tailwind.config.ts` |
| External Unsplash URLs | 4 / 5 files | Self-host or use a configured `remotePatterns` entry |
| No `prefers-reduced-motion` | 4 / 5 files | Use `motion-reduce:` Tailwind variant or the custom hook |
| No `aria-labelledby` on `<section>` | 4 / 5 files | Always pair a heading `id` with `aria-labelledby` |
| Inline transition ternaries | Every file | `cn()` helper or a shared `fadeIn()` class builder |

Ready for the next batch — send them over!

# Code Review: `FloatingQuotePanel`, `FooterSection`, `HeroSection`, `OfferAndIndustrySection`

---

## 1. `FloatingQuotePanel.tsx`

### Grade: **B+**

| Category | Score | Notes |
|---|---|---|
| Accessibility | ⭐⭐⭐⭐ | Focus trap, escape, `aria-modal`, `aria-labelledby`, `aria-busy`, `aria-live` — well above average |
| Form UX | ⭐⭐⭐ | Phone formatting is nice; but no client-side feedback on invalid fields, no `type="tel"`, no success/error visual distinction |
| Analytics | ⭐⭐⭐⭐⭐ | Tracks both success and failure with metadata |
| Scroll Lock | ⭐ | Body still scrolls behind the open panel |
| Focus Restoration | ⭐⭐ | Focuses close button on open, but doesn't return focus to the trigger on close |
| Rendering | ⭐⭐ | Panel is always in the DOM (translated off-screen) — screen readers may discover it |

### Key Issues

1. **No body scroll lock** — the page scrolls behind the panel on mobile
2. **Panel always in DOM** — when `isOpen` is false, the panel is merely `translate-x-full` + `opacity-0` but still rendered; screen readers can find it
3. **Close button has no `aria-label`** — `✕` is not reliably announced
4. **Phone `<input>` missing `type="tel"` and `inputMode="tel"`** — mobile keyboards won't show the dialpad
5. **No visual distinction between success and error feedback** — both show the same gray `<p>`
6. **No focus restoration** — when the panel closes, focus doesn't return to the element that opened it
7. **`h3` assumes heading level** — in a dialog, an `h2` is more appropriate since the dialog is an independent context

### Recommended Upgrade

```tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trackConversionEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/* ────────────────────────────── Types ── */
interface FloatingQuotePanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Element that triggered the panel — focus returns here on close */
  triggerRef?: React.RefObject<HTMLElement>;
}

interface FeedbackState {
  type: "success" | "error";
  message: string;
}

/* ────────────────────────────── Helpers ── */
function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/* ──────────────────── Scroll Lock Hook ── */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.insetInline = "0";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.insetInline = "";
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}

/* ─────────────── Label Component (DRY) ── */
function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500"
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-red-400">
          *
        </span>
      )}
    </label>
  );
}

/* ──────────── Shared input class (DRY) ── */
const INPUT_CLS =
  "w-full border-b border-slate-300 px-1 py-2 text-sm transition focus:border-brand-blue focus:outline-none";

/* ──────────────────── Main Component ── */
export function FloatingQuotePanel({
  isOpen,
  onClose,
  triggerRef,
}: FloatingQuotePanelProps) {
  const uid = useId().replace(/:/g, "");
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* Form state */
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  /* Scroll lock */
  useScrollLock(isOpen);

  /* Focus management */
  useEffect(() => {
    if (isOpen) {
      // Delay one frame so the panel is visible before focusing
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      // Return focus to trigger
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  /* Escape + focus trap */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  /* Reset */
  const resetForm = () => {
    setName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
    setServiceType("");
    setTimeline("");
    setDescription("");
  };

  /* Submit */
  const submitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          companyName,
          phone,
          email,
          serviceType,
          timeline,
          description,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setFeedback({
          type: "error",
          message: "Unable to submit right now. Please call us directly.",
        });
        await trackConversionEvent({
          eventName: "quote_submit_failed",
          source: "floating_quote_panel",
          metadata: { message: body?.error || `HTTP ${res.status}` },
        });
        return;
      }

      await trackConversionEvent({
        eventName: "quote_submit_success",
        source: "floating_quote_panel",
        metadata: { serviceType },
      });

      setFeedback({
        type: "success",
        message: "Submitted. We'll call you within the hour.",
      });
      resetForm();
    } catch (err) {
      console.error("[FloatingQuotePanel]", err);
      setFeedback({
        type: "error",
        message: "Something went wrong. Please try again or call us.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Don't render when closed (removes from a11y tree) ── */
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-dark/45 backdrop-blur-sm transition"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className="absolute right-0 top-0 h-full w-full max-w-md animate-slideInRight overflow-y-auto bg-white p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2
            id={`${uid}-title`}
            className="font-serif text-3xl text-brand-dark"
          >
            Detailed Scope Request
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close quote panel"
            className="rounded p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
            >
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          className="space-y-5"
          aria-busy={isSubmitting}
          noValidate
          onSubmit={(e) => void submitLead(e)}
        >
          {/* Name */}
          <div>
            <FieldLabel htmlFor={`${uid}-name`} required>
              Name
            </FieldLabel>
            <input
              id={`${uid}-name`}
              name="name"
              autoComplete="name"
              required
              aria-required="true"
              className={INPUT_CLS}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Company */}
          <div>
            <FieldLabel htmlFor={`${uid}-company`}>Company Name</FieldLabel>
            <input
              id={`${uid}-company`}
              name="companyName"
              autoComplete="organization"
              className={INPUT_CLS}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <FieldLabel htmlFor={`${uid}-phone`} required>
              Phone
            </FieldLabel>
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              aria-required="true"
              className={INPUT_CLS}
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
            />
          </div>

          {/* Email */}
          <div>
            <FieldLabel htmlFor={`${uid}-email`}>Email</FieldLabel>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              autoComplete="email"
              className={INPUT_CLS}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Service Type */}
          <div>
            <FieldLabel htmlFor={`${uid}-service`}>Service Type</FieldLabel>
            <select
              id={`${uid}-service`}
              name="serviceType"
              className={cn(INPUT_CLS, "text-slate-600")}
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="">Select a service…</option>
              <option value="post_construction">Post-Construction</option>
              <option value="final_clean">Final Clean</option>
              <option value="commercial">Commercial</option>
              <option value="move_in_out">Move-In / Move-Out</option>
              <option value="window">Windows & Power Wash</option>
            </select>
          </div>

          {/* Timeline */}
          <div>
            <FieldLabel htmlFor={`${uid}-timeline`}>Timeline</FieldLabel>
            <select
              id={`${uid}-timeline`}
              name="timeline"
              className={cn(INPUT_CLS, "text-slate-600")}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            >
              <option value="">Select a timeline…</option>
              <option value="asap">ASAP</option>
              <option value="this_week">This Week</option>
              <option value="next_2_weeks">Next 2 Weeks</option>
              <option value="next_month">Next Month</option>
              <option value="just_getting_quotes">Just Getting Quotes</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <FieldLabel htmlFor={`${uid}-description`}>
              Project Description
            </FieldLabel>
            <textarea
              id={`${uid}-description`}
              name="description"
              rows={3}
              className={cn(INPUT_CLS, "resize-none")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <p
              id={`${uid}-feedback`}
              role="status"
              aria-live="polite"
              className={cn(
                "rounded px-3 py-2 text-sm",
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {feedback.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-describedby={feedback ? `${uid}-feedback` : undefined}
            className="w-full rounded-sm bg-brand-dark py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-brand-blue disabled:opacity-70"
          >
            {isSubmitting ? "Submitting…" : "Submit Request"}
          </button>

          <p className="text-center text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Avg. response: under 1 hour
          </p>
        </form>
      </aside>
    </div>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **`if (!isOpen) return null`** | Panel is fully removed from DOM when closed — screen readers can't discover it |
| **`useScrollLock` hook** | Body can't scroll behind the panel on mobile |
| **`triggerRef` prop + focus restoration** | Focus returns to the trigger element when the panel closes — standard dialog pattern |
| **Close button `aria-label` + SVG icon** | `✕` character is unreliable for screen readers; SVG + `aria-label` is robust |
| **`type="tel"` + `inputMode="tel"`** on phone | Mobile users get the dialpad keyboard |
| **Typed `FeedbackState`** with `type: "success" | "error"` | Visual distinction: green for success, red for error |
| **`console.error` in catch** | Previously had no catch at all — network errors were completely silent |
| **`FieldLabel` component + `INPUT_CLS` constant** | DRY — 7 labels and 7 inputs now share consistent styling |
| **`h2` instead of `h3`** | Dialog is an independent context; `h2` is the correct starting level |
| **`aria-required="true"`** on required fields | Belt and suspenders; some screen readers prefer the ARIA attribute |
| **`noValidate` on form** | Lets you control validation UX yourself (browser default popups are inconsistent) |
| **`autoComplete="organization"`** on company field | Correct autocomplete token |
| **`resize-none`** on textarea | Prevents layout breakage |
| **Brand color tokens** | Consistent with project-wide config |

---

## 2. `FooterSection.tsx`

### Grade: **B**

| Category | Score | Notes |
|---|---|---|
| Content Structure | ⭐⭐⭐⭐ | Great CTA band, clear columns, contact info from constants |
| Semantics | ⭐⭐ | Navigation links lack `<nav>`, chip lists aren't `<ul>`, decorative elements exposed |
| Accessibility | ⭐⭐⭐ | Footer landmark is correct; but no `aria-label` to distinguish it from other potential footers |
| Maintainability | ⭐⭐ | Hardcoded colors; nav items duplicated as raw `<li>` markup |
| Performance | ⭐⭐⭐⭐ | No images, lightweight |

### Key Issues

1. **Navigation links need `<nav aria-label="…">`** — currently bare `<ul>` inside a `<div>`
2. **Decorative elements not hidden** — gold dots, gradient line, radial gradient
3. **Chip lists should be `<ul>`/`<li>`** for semantics
4. **Navigation items are repetitive markup** — extract a data array
5. **Copyright year hardcoded** to 2026
6. **No `aria-label`** on `<footer>` to distinguish it as the site footer

### Recommended Upgrade

```tsx
"use client";

import Link from "next/link";
import { trackConversionEvent } from "@/lib/analytics";
import {
  COMPANY_EMAIL,
  COMPANY_PHONE_E164,
  COMPANY_PHONE,
} from "@/lib/company";
import { cn } from "@/lib/utils";

/* ────────────────────────────── Types ── */
interface FooterSectionProps {
  onOpenQuote: () => void;
}

/* ────────────────────────── Constants ── */
const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Who We Serve" },
  { href: "/#about", label: "About" },
  { href: "/#service-area", label: "Service Area" },
] as const;

const BUILT_FOR = [
  "Contractors",
  "Property Teams",
  "Commercial Spaces",
  "Closeout Work",
] as const;

const CTA_CHIPS = [
  "Walkthrough Support",
  "Turnover Ready",
  "Active Sites",
] as const;

const BRAND_CHIPS = ["Detail Finish", "Responsive Scheduling"] as const;

/* ──────────────────── Helper Component ── */
function ChipList({
  items,
  label,
}: {
  items: readonly string[];
  label: string;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="info-chip-dark">
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ──────────────────── Main Component ── */
export function FooterSection({ onOpenQuote }: FooterSectionProps) {
  const year = new Date().getFullYear();

  const trackCall = (source: string) => () => {
    void trackConversionEvent({ eventName: "call_click", source });
  };

  return (
    <footer
      aria-label="Site footer"
      className="relative overflow-hidden bg-brand-darker pb-12 pt-20 text-slate-300 md:pt-24"
    >
      {/* ── Decorative ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(201,169,78,0.5), transparent 26%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* ── CTA Band ── */}
        <div className="mb-16 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-8 py-10 shadow-[0_28px_90px_rgba(2,6,23,0.35)] backdrop-blur md:flex md:items-center md:justify-between md:px-10">
          <div className="max-w-2xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold">
              Project Closeout Ready
            </p>
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">
              Bring A&A in before the handoff gets rushed.
            </h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-slate-300 md:text-base">
              Construction-ready cleaning support for final walkthroughs,
              turnovers, and active commercial spaces across the Austin metro.
            </p>
            <div className="mt-5">
              <ChipList items={CTA_CHIPS} label="Service highlights" />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 md:mt-0 md:items-end">
            <button type="button" onClick={onOpenQuote} className="cta-gold">
              Request a Quote
            </button>
            <a
              href={`tel:${COMPANY_PHONE_E164}`}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:text-white"
              onClick={trackCall("footer_cta_band")}
            >
              Or call {COMPANY_PHONE}
            </a>
          </div>
        </div>

        {/* ── Columns ── */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="A&A Cleaning — home" className="inline-block">
              <span className="font-serif text-3xl text-white">A&A</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-slate-300">
              Standards-driven facility care for contractors, property teams,
              and commercial spaces that need clean handoff quality.
            </p>
            <div className="mt-5">
              <ChipList items={BRAND_CHIPS} label="Brand values" />
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">
              Navigate
            </p>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-brand-gold"
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">
              Contact
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${COMPANY_PHONE_E164}`}
                  className="transition hover:text-white"
                  onClick={trackCall("footer")}
                >
                  {COMPANY_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="transition hover:text-white"
                >
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li className="text-slate-400">
                Serving Austin and surrounding metro areas
              </li>
            </ul>
          </div>

          {/* Built For */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">
              Built For
            </p>
            <ChipList items={BUILT_FOR} label="Target clients" />
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 px-6 pt-6 text-[11px] text-slate-500">
        © {year} A&A Cleaning Services.
      </div>
    </footer>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **`<nav aria-label="Footer navigation">`** | Screen readers can jump to and announce the landmark |
| **`<ChipList>` component with `<ul>`/`<li>`** | Chips are semantically lists; extracted to DRY up 4 usages |
| **`aria-hidden` on gold dots** | Decorative; shouldn't be announced |
| **`aria-hidden` on decorative gradients** | Same |
| **`aria-label="Site footer"` on `<footer>`** | Distinguishes from any other footer landmarks |
| **`new Date().getFullYear()`** | Copyright stays current |
| **`NAV_LINKS` data array** | Loop replaces 4× copy-pasted `<li>` blocks |
| **Brand logo is a `<Link>` to home** | The "A&A" text should be clickable; `aria-label` provides context |
| **`trackCall` helper** | Eliminates inline `() => { void trackConversionEvent(…) }` repetition |
| **Brand tokens** | Consistent with project-wide Tailwind config |
| **`h3` → `h2`** in CTA band | It's the first heading in the footer — hierarchically correct |

---

## 3. `HeroSection.tsx`

### Grade: **B−**

| Category | Score | Notes |
|---|---|---|
| Visual Impact | ⭐⭐⭐⭐⭐ | Beautiful staggered entrance, Ken Burns, trust bar — very polished |
| Animation System | ⭐⭐⭐ | Custom, but uses global CSS + inline styles; `prefers-reduced-motion` absent |
| Accessibility | ⭐⭐ | `id="main-content"` is good for skip-nav, but no `aria-labelledby`; scroll indicator hidden from keyboard users |
| Performance | ⭐⭐ | External Unsplash URL; `serviceSignals` array re-created every render |
| Maintainability | ⭐⭐ | `style jsx global` leaks keyframes globally; inline `style` objects everywhere |
| Content | ⭐⭐⭐ | "Se Habla Espanol" is missing the accent (`Español`) |

### Key Issues

1. **`<style jsx global>`** — keyframes leak into the entire application; any other element could accidentally trigger them
2. **No `prefers-reduced-motion`** — Ken Burns, staggered fade-ups, and bounce animation all run unconditionally
3. **External Unsplash image** — same reliability issue
4. **`serviceSignals` re-created every render** — minor but easy to fix
5. **"Se Habla Espanol"** → should be **"Se Habla Español"**
6. **Inline `style` objects for animation** — hard to maintain, can't leverage Tailwind's `motion-reduce:`
7. **Scroll indicator** uses `hidden sm:block` — mobile users get no scroll affordance, but that's arguably fine
8. **No `aria-labelledby`** on the section

### Recommended Upgrade

```tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { cn } from "@/lib/utils";

/* ────────────────────────────── Types ── */
interface HeroSectionProps {
  onOpenQuote: () => void;
}

type TrustIcon = "shield" | "clock" | "message";

/* ────────────────────────── Constants ── */
const SERVICE_SIGNALS = ["Final Clean", "Turnovers", "Detail-Driven"] as const;

const HEADLINE_LINES = [
  { text: "Every Surface.", delay: "delay-[760ms]" },
  { text: "Every Detail.", delay: "delay-[980ms]" },
  { text: "Every Time.", delay: "delay-[1200ms]", italic: true },
] as const;

const TRUST_ITEMS: { icon: TrustIcon; label: string }[] = [
  { icon: "shield", label: "Licensed & Insured" },
  { icon: "clock", label: "Response Within 1 Hour" },
  { icon: "message", label: "Se Habla Español" },
];

/* ──────────────────── Trust Components ── */
function TrustGlyph({ icon }: { icon: TrustIcon }) {
  const paths: Record<TrustIcon, React.ReactNode> = {
    shield: (
      <>
        <path
          d="M12 3 5 6v5c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="m9.5 12 1.8 1.8 3.2-3.6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </>
    ),
    clock: (
      <>
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 7.5v5l3 1.8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </>
    ),
    message: (
      <path
        d="M7.5 8.5h9m-9 4h5M6 18.5l1.4-2.8a8 8 0 1 1 2.1 1.3L6 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-slate-400">
      {paths[icon]}
    </svg>
  );
}

function TrustItem({ icon, label }: { icon: TrustIcon; label: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md">
      <TrustGlyph icon={icon} />
      <span>{label}</span>
    </div>
  );
}

/* ───────── CSS-class-based staggered fade ── */
/**
 * Instead of inline `style` objects + `<style jsx global>`,
 * we define Tailwind-friendly animation utilities.
 *
 * Add to your tailwind.config.ts → theme.extend:
 *
 * keyframes: {
 *   heroFadeUp: {
 *     from: { opacity: '0', transform: 'translateY(30px)' },
 *     to:   { opacity: '1', transform: 'translateY(0)' },
 *   },
 *   heroKenBurns: {
 *     from: { transform: 'scale(1)' },
 *     to:   { transform: 'scale(1.05)' },
 *   },
 *   heroBounce: {
 *     '0%,100%': { transform: 'translateY(0)' },
 *     '50%':     { transform: 'translateY(6px)' },
 *   },
 * },
 * animation: {
 *   'hero-fade':    'heroFadeUp 880ms cubic-bezier(0.22,1,0.36,1) forwards',
 *   'hero-ken':     'heroKenBurns 15s ease-out forwards',
 *   'hero-bounce':  'heroBounce 2s ease-in-out infinite',
 * },
 */

/* ──────────────────── Main Component ── */
export function HeroSection({ onOpenQuote }: HeroSectionProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /** Applies the fade-up animation class with a custom delay. */
  const fade = (delayCls: string) =>
    cn(
      "opacity-0",
      ready && "animate-hero-fade motion-reduce:animate-none motion-reduce:opacity-100",
      ready && delayCls
    );

  return (
    <section
      id="main-content"
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-hidden"
    >
      {/* ── Background Image ── */}
      <Image
        src="/images/hero.jpg"
        alt="Modern glass-walled office lobby with polished concrete floors"
        fill
        priority
        sizes="100vw"
        className={cn(
          "object-cover",
          ready && "animate-hero-ken motion-reduce:animate-none"
        )}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-brand-dark/35" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-6 pb-36 pt-28 text-center md:justify-end md:pb-32 md:pt-40">
        <div className="max-w-4xl">
          {/* Kicker */}
          <p
            className={cn(
              "mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-100 backdrop-blur",
              fade("delay-[220ms]")
            )}
          >
            Austin Metro • Post-Construction • Commercial
          </p>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="font-serif text-[clamp(3.8rem,14vw,6.8rem)] leading-[0.94] tracking-tight text-white sm:text-[clamp(4.4rem,11vw,7.2rem)] md:text-[clamp(5rem,9vw,8rem)]"
          >
            {HEADLINE_LINES.map((line) => (
              <span
                key={line.text}
                className={cn(
                  "block",
                  line.italic && "italic text-slate-300",
                  fade(line.delay)
                )}
              >
                {line.text}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-slate-100 md:text-lg",
              fade("delay-[1420ms]")
            )}
          >
            Post-construction & commercial cleaning across the Austin metro
            area.
          </p>

          {/* Service chips */}
          <ul
            className={cn(
              "mt-5 flex flex-wrap items-center justify-center gap-2",
              fade("delay-[1520ms]")
            )}
            aria-label="Service highlights"
          >
            {SERVICE_SIGNALS.map((signal) => (
              <li key={signal} className="info-chip-dark">
                {signal}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div
            className={cn(
              "mt-10 flex w-full max-w-xl flex-col gap-4 sm:mx-auto sm:flex-row sm:justify-center",
              fade("delay-[1640ms]")
            )}
          >
            <button
              type="button"
              onClick={onOpenQuote}
              className="cta-primary w-full bg-white px-8 py-4 text-brand-dark hover:bg-slate-100 sm:w-auto"
            >
              Request a Quote
            </button>
            <a
              href={`tel:${COMPANY_PHONE_E164}`}
              className="cta-light w-full px-8 py-4 sm:w-auto"
              onClick={() => {
                void trackConversionEvent({
                  eventName: "call_click",
                  source: "hero",
                });
              }}
            >
              Call Now: {COMPANY_PHONE}
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className={cn(
          "absolute bottom-[72px] left-1/2 z-30 hidden -translate-x-1/2 sm:block",
          fade("delay-[1860ms]")
        )}
        aria-hidden="true"
      >
        <div className="flex animate-hero-bounce flex-col items-center gap-1 text-white/55 motion-reduce:animate-none">
          <span className="text-[8px] font-medium uppercase tracking-[0.3em]">
            Scroll
          </span>
          <svg viewBox="0 0 20 20" className="h-4 w-4">
            <path
              d="m5.5 7.5 4.5 5 4.5-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </div>

      {/* ── Trust Bar ── */}
      <div
        className={cn(
          "absolute bottom-0 left-0 z-20 w-full border-t border-white/20 bg-[#07101d]/45 backdrop-blur-md",
          fade("delay-[1760ms]")
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6 py-4 md:justify-between md:gap-4">
          {TRUST_ITEMS.map((item) => (
            <TrustItem key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **Removed `<style jsx global>`** | Keyframes moved to `tailwind.config.ts` as custom animations — scoped, cacheable, and integrated with Tailwind's `motion-reduce:` |
| **`motion-reduce:animate-none` + `motion-reduce:opacity-100`** | All animations are skippable for reduced-motion users |
| **`cn()` utility for conditional class names** | Replaces inline `style` objects entirely — everything is now class-based |
| **Self-hosted `/images/hero.jpg`** | Reliable; no external dependency |
| **`aria-labelledby="hero-heading"`** on section | Screen readers announce the section |
| **"Se Habla Español"** — accent fixed | Correct Spanish |
| **`SERVICE_SIGNALS` + `HEADLINE_LINES` + `TRUST_ITEMS` hoisted** | Out of render; no re-creation; stable keys from data |
| **Service chips → `<ul>`/`<li>`** | Semantic list |
| **`requestAnimationFrame` instead of `setTimeout(…, 220)`** | More idiomatic for "next paint" triggering |
| **Overlays get `aria-hidden`** | Decorative |
| **`TrustGlyph` paths in a record** | DRY, same pattern as earlier icon components |
| **`border-white/10` instead of `border-white/12`** | `12` isn't a default Tailwind opacity; `10` is (`/12` would require arbitrary value syntax) |

---

## 4. `OfferAndIndustrySection.tsx`

### Grade: **B**

| Category | Score | Notes |
|---|---|---|
| Data Architecture | ⭐⭐⭐⭐ | Clean typed array driving the cards |
| Visual Design | ⭐⭐⭐⭐⭐ | Beautiful cards with accent gradients, outcome callouts |
| Accessibility | ⭐⭐ | No `aria-labelledby`, chip lists aren't semantic, `article` headings could be linked |
| Maintainability | ⭐⭐ | `accent` embeds Tailwind classes in data; `min-h-[112px]` is fragile; hardcoded colors |
| Reduced Motion | ⭐ | Staggered entrance + hover translate with no `motion-reduce:` |

### Key Issues

1. **`accent` field stores Tailwind classes in data** — tight coupling; if you change your design system, you need to touch the data
2. **`min-h-[112px]` on pain point** — brittle; longer text or smaller screens will overflow
3. **No `aria-labelledby`** on section or individual articles
4. **Chip lists should be `<ul>`/`<li>`**
5. **No `prefers-reduced-motion`**
6. **Hardcoded colors**

### Recommended Upgrade

```tsx
"use client";

import { useInViewOnce } from "./useInViewOnce";
import { cn } from "@/lib/utils";

/* ────────────────────────────── Types ── */
interface IndustryBlock {
  id: string;
  title: string;
  eyebrow: string;
  painPoint: string;
  outcome: string;
  fit: string[];
  /** Semantic color key — mapped to Tailwind classes in the component */
  accentColor: "blue" | "gold" | "green";
  signal: string;
  icon: "contractor" | "property" | "office";
}

/* ────────────────────────── Constants ── */
const ACCENT_MAP: Record<IndustryBlock["accentColor"], string> = {
  blue: "from-[#E8EEF9] to-white",
  gold: "from-[#F3EEE2] to-white",
  green: "from-[#E7F1EF] to-white",
};

const INDUSTRIES: IndustryBlock[] = [
  {
    id: "contractors",
    title: "General Contractors",
    eyebrow: "Walkthrough-ready closeouts",
    painPoint:
      "Punch-list pressure and inconsistent final-clean quality across trades can slow handoff.",
    outcome:
      "A&A helps tighten the final presentation with detail-focused cleaning and proof-of-completion support.",
    fit: ["Final walkthroughs", "Multi-trade closeouts", "Schedule-sensitive turnovers"],
    accentColor: "blue",
    signal: "Closeout Support",
    icon: "contractor",
  },
  {
    id: "property",
    title: "Property Managers",
    eyebrow: "Faster turnover flow",
    painPoint:
      "Slow turns and inconsistent unit-ready standards make leasing and inspections harder than they should be.",
    outcome:
      "Projects move faster when units, common areas, and touchpoints are cleaned to a predictable standard.",
    fit: ["Vacant unit turns", "Common areas", "Leasing-ready presentation"],
    accentColor: "gold",
    signal: "Turnover Velocity",
    icon: "property",
  },
  {
    id: "commercial",
    title: "Commercial Spaces",
    eyebrow: "Clean without disruption",
    painPoint:
      "Office and operational teams need reliable cleaning that fits active business environments and deadlines.",
    outcome:
      "Flexible scheduling and standards-driven work help maintain a clean impression without unnecessary friction.",
    fit: ["Off-hours service", "Active facilities", "Polished daily environments"],
    accentColor: "green",
    signal: "Operational Fit",
    icon: "office",
  },
];

const HEADER_CHIPS = [
  "Project-fit workflows",
  "Clear scope alignment",
  "Detail-first finish",
] as const;

/* ──────────────────────────── Icons ── */
function IndustryIcon({ icon }: { icon: IndustryBlock["icon"] }) {
  const paths: Record<IndustryBlock["icon"], React.ReactNode> = {
    contractor: (
      <>
        <path
          d="M4.5 17.5h15M7 17.5V9l5-3.5L17 9v8.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M10 13h4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </>
    ),
    property: (
      <path
        d="M5.5 19V7.5h13V19M9 11h2m4 0h-2m-4 3h2m4 0h-2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    ),
    office: (
      <path
        d="M6 18.5V6.5h12v12m-9-8h6m-6 3h6m-6 3h3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      {paths[icon]}
    </svg>
  );
}

/* ────────────── Industry Card Component ── */
function IndustryCard({
  industry,
  index,
  isVisible,
}: {
  industry: IndustryBlock;
  index: number;
  isVisible: boolean;
}) {
  const headingId = `industry-${industry.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 motion-reduce:transition-none",
        "hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,39,70,0.12)] motion-reduce:hover:translate-y-0",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: isVisible ? `${index * 120}ms` : "0ms" }}
    >
      {/* Accent gradient */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-28 bg-gradient-to-br",
          ACCENT_MAP[industry.accentColor]
        )}
        aria-hidden="true"
      />

      <div className="relative p-8">
        {/* Header */}
        <div className="mb-7 flex items-start gap-4">
          <div className="icon-tile h-12 w-12 shrink-0">
            <IndustryIcon icon={industry.icon} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">
              {industry.eyebrow}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
              {industry.signal}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3
          id={headingId}
          className="max-w-[16rem] font-serif text-[2rem] leading-tight tracking-tight text-brand-dark"
        >
          {industry.title}
        </h3>

        {/* Pain point — removed fixed min-h; let content flow naturally */}
        <p className="mt-5 text-sm leading-relaxed text-slate-600">
          {industry.painPoint}
        </p>

        {/* Fit tags */}
        <div className="mt-7 border-t border-slate-200 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Best suited for
          </p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${industry.title} use cases`}>
            {industry.fit.map((item) => (
              <li key={item} className="info-chip">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Outcome callout */}
        <div className="mt-7 rounded-[1.4rem] border border-slate-200 bg-[#FAFAF8] p-5">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-brand-gold"
              aria-hidden="true"
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Why it works
            </p>
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-800">
            {industry.outcome}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ──────────────────── Main Component ── */
interface OfferAndIndustrySectionProps {
  onOpenQuote: () => void;
}

export function OfferAndIndustrySection({
  onOpenQuote,
}: OfferAndIndustrySectionProps) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });

  const fadeIn = cn(
    "transition duration-1000 motion-reduce:transition-none",
    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  );

  return (
    <section
      ref={ref}
      id="industries"
      aria-labelledby="industries-heading"
      className="scroll-mt-32 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f5f1_100%)] px-6 py-24 md:scroll-mt-36 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={cn(
            fadeIn,
            "mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          )}
        >
          <div>
            <p className="section-kicker">Who We Serve</p>
            <h2
              id="industries-heading"
              className="mt-3 max-w-3xl font-serif text-4xl tracking-tight text-brand-dark md:text-5xl"
            >
              Built for Demanding Spaces
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              The work changes by project type. The standard does not. A&A
              supports closeout schedules, turnover pace, and polished
              day-to-day environments.
            </p>
            <ul
              className="mt-6 flex flex-wrap gap-2"
              aria-label="Section highlights"
            >
              {HEADER_CHIPS.map((chip) => (
                <li key={chip} className="info-chip">
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={onOpenQuote}
            className="cta-primary w-fit"
          >
            Talk Through Your Scope
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {INDUSTRIES.map((industry, index) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **`accentColor` semantic key + `ACCENT_MAP`** | Data is decoupled from Tailwind classes; changing gradients doesn't touch the data |
| **Extracted `IndustryCard` component** | ~60 lines of card JSX is now its own testable unit |
| **`aria-labelledby` on section + each `<article>`** | Screen readers can navigate by landmarks and by article headings |
| **Chip lists → `<ul>`/`<li>`** with `aria-label` | Semantic, accessible |
| **Removed `min-h-[112px]`** | Let content flow naturally; avoids clipping on different viewports |
| **`motion-reduce:transition-none`** on all animated elements | Stagger + hover translate are skippable |
| **`transitionDelay` only when `isVisible`** | Prevents delay from applying on the initial hidden state |
| **Stable `industry.id` keys** | Better than `industry.title` (less fragile if titles change) |
| **`HEADER_CHIPS` array** | Hoisted out of render |
| **Decorative elements get `aria-hidden`** | Gold dot, accent gradient |
| **Brand tokens** | Consistent |
| **`IndustryIcon` paths in a record** | DRY; consistent with earlier icon components |

---

## Summary Table

| Component | Before | After | Highest-Impact Fix |
|---|---|---|---|
| **FloatingQuotePanel** | **B+** | **A** | Scroll lock + focus restore + remove from DOM when closed |
| **FooterSection** | **B** | **A−** | `<nav>` landmark + `<ul>`/`<li>` chips + dynamic year |
| **HeroSection** | **B−** | **A−** | Tailwind keyframes replace global CSS; `motion-reduce:` everywhere |
| **OfferAndIndustrySection** | **B** | **A−** | Card extraction + semantic lists + `accentColor` decoupling |

---

## Cumulative Cross-Cutting Issues (All 9 Files)

| Pattern | Files Affected | Status |
|---|---|---|
| Raw hex colors | 9 / 9 | → `brand.*` tokens in `tailwind.config.ts` |
| External Unsplash URLs | 5 / 9 | → Self-host or configure `remotePatterns` |
| No `prefers-reduced-motion` | 7 / 9 | → `motion-reduce:` variant or custom hook |
| No `aria-labelledby` on `<section>` | 7 / 9 | → Pair heading `id` with attribute |
| Chips rendered as bare `<span>` | 6 / 9 | → `<ul>`/`<li>` with `aria-label` |
| `<style jsx global>` |

# Code Review: `PublicHeader`, `QuoteSection`, `ServiceAreaSection`, `ServiceSpreadSection`, `TestimonialSection`, `TimelineSection`, `useInViewOnce`, `VariantAPublicPage`

---

## 1. `PublicHeader.tsx`

### Grade: **B−**

| Category | Score | Notes |
|---|---|---|
| Visual Design | ⭐⭐⭐⭐⭐ | Beautiful floating shell, responsive scroll behavior, mega-menu dropdowns |
| Accessibility | ⭐⭐ | Missing `role="navigation"`, no `aria-label`, dropdown items use `<a>` instead of `<Link>`, no `id` for `aria-controls` |
| Mobile UX | ⭐⭐⭐ | `<details>` pattern is clever but unconventional for a nav; hamburger uses text characters |
| Keyboard Navigation | ⭐⭐ | Dropdowns open on focus (good) but no arrow-key navigation between items; no `aria-controls` connecting button to panel |
| Maintainability | ⭐⭐ | Two nearly identical dropdown blocks; hardcoded colors |
| Performance | ⭐⭐⭐ | Scroll listener runs on every pixel — no throttle |

### Key Issues

1. **Two identical dropdown implementations** — Services and Industries dropdowns are copy-pasted with different data
2. **No `<nav>` landmark on desktop** — screen readers can't identify navigation
3. **`<a>` tags instead of `<Link>`** for hash-based navigation inside dropdowns — inconsistent with `primaryLinks` which uses raw `<a>` too; should use `<Link>` throughout for SPA navigation
4. **No `aria-controls`** linking dropdown buttons to their panels
5. **Hamburger uses `×` and `☰` text characters** — unreliable cross-platform; use SVG
6. **Scroll listener not throttled** — fires on every scroll event; should use `requestAnimationFrame` or passive + throttle
7. **`<details>` for mobile nav** — loses ability to close other open sections when one opens; no animated transition
8. **No skip-nav link** — critical accessibility feature for a fixed header
9. **Logo `<p>` tags** — should be semantic heading or at minimum wrap the company name properly
10. **Mobile menu panel positioning** uses magic top values (`4.8rem`/`5.8rem`) that could drift

### Recommended Upgrade

```tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { trackConversionEvent } from "@/lib/analytics";
import {
  COMPANY_PHONE,
  COMPANY_PHONE_E164,
  COMPANY_SHORT_NAME,
} from "@/lib/company";
import { cn } from "@/lib/utils";

/* ────────────────────────────── Types ── */
interface PublicHeaderProps {
  onOpenQuote: () => void;
}

interface DropdownLink {
  href: string;
  label: string;
  desc: string;
}

type MenuKey = "services" | "industries";

/* ────────────────────────── Constants ── */
const SERVICE_LINKS: DropdownLink[] = [
  { href: "/#service-post-construction", label: "Post-Construction", desc: "Rough and final cleans for turnovers." },
  { href: "/#service-final-clean", label: "Final Clean", desc: "Detail-level move-in readiness." },
  { href: "/#service-commercial", label: "Commercial", desc: "Ongoing facility care and maintenance." },
  { href: "/#service-move", label: "Move-In / Move-Out", desc: "Fast vacant unit turnovers." },
  { href: "/#service-windows", label: "Windows & Power Wash", desc: "Exterior polishing and details." },
];

const INDUSTRY_LINKS: DropdownLink[] = [
  { href: "/#industries", label: "General Contractors", desc: "Walkthrough-ready closeouts." },
  { href: "/#industries", label: "Property Managers", desc: "Fast leasing turnovers." },
  { href: "/#industries", label: "Commercial Offices", desc: "Zero-disruption active site cleaning." },
];

const PLAIN_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#service-area", label: "Service Area" },
  { href: "/#careers", label: "Careers" },
] as const;

const DROPDOWNS: { key: MenuKey; label: string; links: DropdownLink[] }[] = [
  { key: "services", label: "Services", links: SERVICE_LINKS },
  { key: "industries", label: "Industries", links: INDUSTRY_LINKS },
];

/* ─────────────── Hamburger / Close SVG ── */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </>
      ) : (
        <>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  );
}

/* ──────── Chevron ── */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cn("h-2.5 w-2.5 text-slate-400 transition-transform", open && "rotate-180")}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────── Desktop Dropdown (DRY) ── */
function DesktopDropdown({
  menuKey,
  label,
  links,
  isOpen,
  onToggle,
  onClose,
}: {
  menuKey: MenuKey;
  label: string;
  links: DropdownLink[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const panelId = `dropdown-${menuKey}`;

  return (
    <div
      className="relative"
      onMouseEnter={onToggle}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm text-slate-100 transition hover:text-white"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        onFocus={onToggle}
        onClick={onToggle}
      >
        {label}
        <Chevron open={isOpen} />
      </button>

      <div
        id={panelId}
        role="menu"
        className={cn(
          "absolute left-0 top-full pt-3 transition duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="min-w-[20rem] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              role="menuitem"
              onClick={onClose}
              className="block rounded-lg p-3 transition hover:bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-900">{link.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────── Mobile Accordion Item ── */
function MobileAccordion({
  label,
  links,
  onNavigate,
}: {
  label: string;
  links: DropdownLink[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between px-4 py-3 text-sm uppercase tracking-[0.18em] text-white"
      >
        {label}
        <Chevron open={open} />
      </button>

      <div
        id={contentId}
        role="region"
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 pb-3" : "max-h-0"
        )}
      >
        <div className="space-y-1 px-3">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onNavigate}
              className="block rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Scroll Hook ── */
function useScrolled(threshold = 120) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > Math.max(threshold, window.innerHeight * 0.5));
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/* ──────────────────── Main Component ── */
export function PublicHeader({ onOpenQuote }: PublicHeaderProps) {
  const isScrolled = useScrolled();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<MenuKey | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  /* Outside click + Escape for desktop dropdown */
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setOpenDesktopMenu(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDesktopMenu(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const shellClass = cn(
    "flex h-16 items-center justify-between gap-4 rounded-xl border px-5 transition duration-300 md:h-[4.5rem] md:px-6",
    isScrolled || isMobileMenuOpen
      ? "border-[#183556] bg-[#0f2746] shadow-[0_22px_70px_rgba(2,6,23,0.42)] backdrop-blur-md"
      : "border-transparent bg-[#07101d]/20 shadow-[0_18px_60px_rgba(2,6,23,0.16)] backdrop-blur-xl"
  );

  return (
    <>
      {/* ── Skip-nav ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-brand-dark focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 text-white">
        <div className={cn("transition-all duration-300", isScrolled ? "pt-2" : "pt-4 md:pt-6")}>
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className={shellClass}>
              {/* Logo */}
              <Link href="/" className="min-w-0" aria-label={`${COMPANY_SHORT_NAME} — home`}>
                <span className="block font-serif text-2xl tracking-tight text-white md:text-3xl">
                  {COMPANY_SHORT_NAME}
                </span>
                <span className="hidden text-[9px] uppercase tracking-[0.24em] text-slate-300 md:block">
                  Construction-Ready Cleaning
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
                {DROPDOWNS.map((dd) => (
                  <DesktopDropdown
                    key={dd.key}
                    menuKey={dd.key}
                    label={dd.label}
                    links={dd.links}
                    isOpen={openDesktopMenu === dd.key}
                    onToggle={() =>
                      setOpenDesktopMenu((cur) => (cur === dd.key ? null : dd.key))
                    }
                    onClose={() =>
                      setOpenDesktopMenu((cur) => (cur === dd.key ? null : cur))
                    }
                  />
                ))}

                {PLAIN_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-slate-100 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Desktop CTAs */}
              <div className="hidden items-center gap-3 md:flex">
                <a
                  href={`tel:${COMPANY_PHONE_E164}`}
                  className="hidden rounded-md border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:border-white/35 hover:bg-white/[0.08] lg:inline-flex"
                  onClick={() => {
                    void trackConversionEvent({ eventName: "call_click", source: "header_nav" });
                  }}
                >
                  Call
                </a>
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="rounded-md bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-dark shadow-sm transition hover:bg-slate-100"
                >
                  Get a Quote
                </button>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="rounded-md bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-dark shadow-sm"
                >
                  Quote
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((p) => !p)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]"
                  aria-expanded={isMobileMenuOpen}
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                  <MenuIcon open={isMobileMenuOpen} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={cn(
            "md:hidden transition-all duration-300",
            isMobileMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className={cn(
              "absolute inset-x-4 rounded-2xl border border-white/10 bg-brand-dark p-5 shadow-2xl transition-all duration-300",
              isScrolled ? "top-[4.8rem]" : "top-[5.8rem]"
            )}
          >
            <div className="space-y-3">
              <a
                href={`tel:${COMPANY_PHONE_E164}`}
                className="block rounded-2xl bg-white/[0.06] px-4 py-3 text-sm uppercase tracking-[0.18em] text-white"
                onClick={() => {
                  closeMobileMenu();
                  void trackConversionEvent({ eventName: "call_click", source: "header_mobile" });
                }}
              >
                Call {COMPANY_PHONE}
              </a>

              {DROPDOWNS.map((dd) => (
                <MobileAccordion
                  key={dd.key}
                  label={dd.label}
                  links={dd.links}
                  onNavigate={closeMobileMenu}
                />
              ))}

              {PLAIN_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block rounded-2xl border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **Skip-nav link** | Critical a11y — keyboard users can bypass the entire header |
| **`<nav aria-label="Main navigation">`** | Desktop nav is a proper landmark |
| **`DesktopDropdown` extracted** | Two identical blocks → one reusable component; eliminates ~60 lines of duplication |
| **`MobileAccordion` replaces `<details>`** | Controlled state, animated open/close, `aria-expanded` + `aria-controls` |
| **`MenuIcon` SVG** replaces `×` / `☰` characters | Reliable cross-platform rendering |
| **`Chevron` component** replaces `▼` text | Consistent, animatable |
| **`useScrolled` hook** with `rAF` throttle | Prevents layout thrash; passive listener |
| **`<Link>` throughout** | Consistent SPA navigation |
| **`aria-controls` on dropdown buttons** | Links trigger to panel for assistive tech |
| **`role="menu"` + `role="menuitem"`** on dropdown panels/items | Proper ARIA menu pattern |
| **`role="dialog" aria-modal` on mobile panel** | Communicates overlay semantics |
| **Brand tokens** | Consistent with project |
| **`DROPDOWNS` data array** | Drives both desktop and mobile from a single source |

---

## 2. `QuoteSection.tsx`

### Grade: **B**

| Category | Score | Notes |
|---|---|---|
| Feature Completeness | ⭐⭐⭐⭐ | Full form with analytics, floating labels, signal icons — comprehensive |
| Form UX | ⭐⭐⭐ | Phone formatting, expectation items — good; but same issues as FloatingQuotePanel (no `type="tel"`, no error/success distinction) |
| Code Reuse | ⭐ | Duplicates nearly the entire FloatingQuotePanel form logic — `formatPhoneInput`, all 7 state fields, `submitLead`, same API endpoint |
| Accessibility | ⭐⭐ | `FloatingLabel` places label with `absolute` positioning — but no `aria-required`; no section `aria-labelledby`; feedback has no color distinction |
| Performance | ⭐⭐ | CSS background image bypasses Next.js; `expectationChips` and `expectationItems` recreated each render |

### Key Issues

1. **Massive duplication with `FloatingQuotePanel`** — both components have: identical state, identical API call, identical `formatPhoneInput`, identical service/timeline options. This should be a shared form hook or component
2. **CSS `backgroundImage` instead of `next/image`** — same issue as CareersSection
3. **`FloatingLabel` positions label with `-top-2`** — when the input has a value, the label overlaps the content; there's no float-up animation; `placeholder=" "` is a hack
4. **No `type="tel"`** on phone input
5. **Arrays inside render** — `expectationChips` and `expectationItems` recreated every render
6. **No error/success visual distinction**
7. **No `aria-labelledby`** on section

### Recommended Upgrade — Extract Shared Hook

```tsx
// hooks/useQuoteForm.ts
"use client";

import { useState, useCallback } from "react";
import { trackConversionEvent } from "@/lib/analytics";

export interface QuoteFormState {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  serviceType: string;
  timeline: string;
  description: string;
}

export interface QuoteFormFeedback {
  type: "success" | "error";
  message: string;
}

const INITIAL_STATE: QuoteFormState = {
  name: "",
  companyName: "",
  phone: "",
  email: "",
  serviceType: "",
  timeline: "",
  description: "",
};

export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export const SERVICE_OPTIONS = [
  { value: "post_construction", label: "Post-Construction" },
  { value: "final_clean", label: "Final Clean" },
  { value: "commercial", label: "Commercial" },
  { value: "move_in_out", label: "Move-In / Move-Out" },
  { value: "window", label: "Windows & Power Wash" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "this_week", label: "This Week" },
  { value: "next_2_weeks", label: "Next 2 Weeks" },
  { value: "next_month", label: "Next Month" },
  { value: "just_getting_quotes", label: "Just Getting Quotes" },
] as const;

export function useQuoteForm(source: string) {
  const [fields, setFields] = useState<QuoteFormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<QuoteFormFeedback | null>(null);

  const setField = useCallback(
    <K extends keyof QuoteFormState>(key: K, value: QuoteFormState[K]) => {
      setFields((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const submitLead = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFeedback(null);
      setIsSubmitting(true);

      try {
        const res = await fetch("/api/quote-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          setFeedback({ type: "error", message: "Unable to submit right now. Please call us directly." });
          await trackConversionEvent({
            eventName: "quote_submit_failed",
            source,
            metadata: { message: body?.error || `HTTP ${res.status}` },
          });
          return;
        }

        await trackConversionEvent({
          eventName: "quote_submit_success",
          source,
          metadata: { serviceType: fields.serviceType },
        });

        setFeedback({ type: "success", message: "Submitted. We'll call you within the hour." });
        setFields(INITIAL_STATE);
      } catch (err) {
        console.error(`[useQuoteForm:${source}]`, err);
        setFeedback({ type: "error", message: "Something went wrong. Please try again or call us." });
      } finally {
        setIsSubmitting(false);
      }
    },
    [fields, source]
  );

  return { fields, setField, isSubmitting, feedback, submitLead };
}
```

Now both `FloatingQuotePanel` and `QuoteSection` consume `useQuoteForm` — eliminating ~80 lines of duplication each. I'll show the trimmed `QuoteSection`:

```tsx
"use client";

import { useId } from "react";
import Image from "next/image";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { useInViewOnce } from "./useInViewOnce";
import {
  useQuoteForm,
  formatPhoneInput,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/hooks/useQuoteForm";
import { cn } from "@/lib/utils";

/* ────────────────────────── Constants ── */
interface QuoteSectionProps {
  onOpenQuote: () => void;
}

const EXPECTATION_CHIPS = ["Direct contact", "Scope review", "Flexible scheduling"] as const;

const EXPECTATION_ITEMS = [
  { title: "What to expect", body: "Direct scope follow-up", icon: "response" as const },
  { title: "Best fit", body: "Commercial + turnover work", icon: "scope" as const },
  { title: "Approach", body: "Clear scope before scheduling", icon: "coverage" as const },
] as const;

/* ─── Shared input class ── */
const FIELD_CLS =
  "w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-sm font-medium text-brand-dark outline-none transition focus:border-brand-dark";

/* ─── FloatingLabel (improved) ── */
function FloatingLabel({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pt-4">
      <label
        htmlFor={id}
        className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.18em] text-slate-500"
      >
        {label}
        {required && <span className="ml-0.5 text-red-400" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ──────── Signal icons (same as before, abbreviated) ── */
function QuoteSignalIcon({ kind }: { kind: "response" | "scope" | "coverage" }) {
  // ... same implementation
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">{ /* paths */ }</svg>;
}

/* ──────────────────── Main Component ── */
export function QuoteSection({ onOpenQuote }: QuoteSectionProps) {
  const uid = useId().replace(/:/g, "");
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });
  const { fields, setField, isSubmitting, feedback, submitLead } = useQuoteForm("quote_section");

  const fadeIn = cn(
    "transition duration-1000 motion-reduce:transition-none",
    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  );

  return (
    <section
      ref={ref}
      id="quote"
      aria-labelledby="quote-heading"
      className="scroll-mt-32 overflow-hidden border-b border-slate-200 bg-white md:scroll-mt-36"
    >
      <div className="flex min-h-[88vh] flex-col md:flex-row">
        {/* ── Left Image Panel ── */}
        <div className="relative h-[42vh] w-full overflow-hidden md:h-auto md:w-1/2">
          <Image
            src="/images/quote-hero.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-brand-dark/20" aria-hidden="true" />

          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.14) 1px,transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />

          <div className={cn(fadeIn, "absolute bottom-10 left-8 right-8 md:bottom-12 md:left-12 md:right-12")}>
            <ul className="mb-5 flex flex-wrap gap-2" aria-label="What to expect">
              {EXPECTATION_CHIPS.map((chip) => (
                <li key={chip} className="info-chip-dark">{chip}</li>
              ))}
            </ul>
            <h2 id="quote-heading" className="font-serif text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">
              Let&apos;s Talk About Your Project
            </h2>
            <a
              href={`tel:${COMPANY_PHONE_E164}`}
              className="mt-5 inline-flex items-center gap-3 text-lg font-medium text-white transition hover:text-slate-200"
              onClick={() => {
                void trackConversionEvent({ eventName: "call_click", source: "quote_section" });
              }}
            >
              <span className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                Call
              </span>
              Or call now: {COMPANY_PHONE}
            </a>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className={cn(fadeIn, "flex w-full items-center justify-center bg-[#F8F7F4] p-8 md:w-1/2 md:p-14 lg:p-20")}>
          <div className="w-full max-w-lg">
            {/* Expectation signals */}
            <div className="surface-panel mb-8 grid gap-3 p-4 md:grid-cols-3">
              {EXPECTATION_ITEMS.map((item, i) => (
                <div key={item.title} className={cn(i > 0 && "border-slate-200 md:border-l md:pl-4")}>
                  <div className="flex items-center gap-3">
                    <span className="icon-tile h-10 w-10 rounded-xl text-sm">
                      <QuoteSignalIcon kind={item.icon} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-700">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-3xl tracking-tight text-brand-dark">Request a Quote</h3>
            <p className="mt-3 max-w-md font-light leading-relaxed text-slate-600">
              Tell us about your project. We review the scope, confirm the right next step, and keep the intake simple.
            </p>

            {/* Form — now powered by useQuoteForm */}
            <form
              className="surface-panel mt-10 space-y-6 p-6 md:p-7"
              aria-busy={isSubmitting}
              noValidate
              onSubmit={(e) => void submitLead(e)}
            >
              <FloatingLabel id={`${uid}-name`} label="Name" required>
                <input
                  id={`${uid}-name`}
                  name="name"
                  autoComplete="name"
                  required
                  aria-required="true"
                  className={FIELD_CLS}
                  value={fields.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </FloatingLabel>

              <FloatingLabel id={`${uid}-company`} label="Company Name">
                <input
                  id={`${uid}-company`}
                  name="companyName"
                  autoComplete="organization"
                  className={FIELD_CLS}
                  value={fields.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                />
              </FloatingLabel>

              <div className="grid gap-6 md:grid-cols-2">
                <FloatingLabel id={`${uid}-phone`} label="Phone" required>
                  <input
                    id={`${uid}-phone`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-required="true"
                    className={FIELD_CLS}
                    value={fields.phone}
                    onChange={(e) => setField("phone", formatPhoneInput(e.target.value))}
                  />
                </FloatingLabel>

                <FloatingLabel id={`${uid}-email`} label="Email">
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={FIELD_CLS}
                    value={fields.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </FloatingLabel>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FloatingLabel id={`${uid}-service`} label="Service Type">
                  <select
                    id={`${uid}-service`}
                    name="serviceType"
                    className={cn(FIELD_CLS, "text-slate-600")}
                    value={fields.serviceType}
                    onChange={(e) => setField("serviceType", e.target.value)}
                  >
                    <option value="">Select…</option>
                    {SERVICE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FloatingLabel>

                <FloatingLabel id={`${uid}-timeline`} label="Timeline">
                  <select
                    id={`${uid}-timeline`}
                    name="timeline"
                    className={cn(FIELD_CLS, "text-slate-600")}
                    value={fields.timeline}
                    onChange={(e) => setField("timeline", e.target.value)}
                  >
                    <option value="">Select…</option>
                    {TIMELINE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FloatingLabel>
              </div>

              <FloatingLabel id={`${uid}-desc`} label="Project Description">
                <textarea
                  id={`${uid}-desc`}
                  name="description"
                  rows={3}
                  className={cn(FIELD_CLS, "min-h-[110px] resize-none")}
                  value={fields.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </FloatingLabel>

              {feedback && (
                <p
                  id={`${uid}-feedback`}
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "rounded px-3 py-2 text-sm",
                    feedback.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  )}
                >
                  {feedback.message}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-describedby={feedback ? `${uid}-feedback` : undefined}
                  className="cta-primary w-full"
                >
                  {isSubmitting ? "Submitting…" : "Request a Quote"}
                </button>
                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  We never share your information.
                </p>
              </div>
            </form>

            {/* Secondary CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onOpenQuote} className="cta-outline-dark">
                Need To Share More Scope?
              </button>
              <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-gold" aria-hidden="true" />
                Prefer to call? {COMPANY_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **`useQuoteForm` shared hook** | Eliminates ~80 lines of duplicated state + submit logic between this and `FloatingQuotePanel` |
| **`SERVICE_OPTIONS` + `TIMELINE_OPTIONS` shared constants** | Single source for dropdown values |
| **`next/image` for background** | Lazy loading, format negotiation |
| **`type="tel"` + `inputMode="tel"`** | Mobile keyboard |
| **`aria-required`, `aria-labelledby`** | Accessibility |
| **Feedback with success/error color** | Visual distinction |
| **`EXPECTATION_CHIPS` / `EXPECTATION_ITEMS` hoisted** | Out of render |
| **`FloatingLabel` with `pt-4` spacing** | Eliminates negative positioning overlap issue |
| **`FIELD_CLS` constant** | DRY for 7 inputs |
| **Brand tokens** | Consistent |

---

## 3. `ServiceAreaSection.tsx`

### Grade: **B−**

| Category | Score | Notes |
|---|---|---|
| Visual Impact | ⭐⭐⭐⭐⭐ | Beautiful typographic hierarchy + SVG metro map — very creative |
| Accessibility | ⭐ | SVG map is `aria-hidden` (correct for decorative) but city names are `<span>` with `cursor-default` and hover effects — should be text, not interactive-looking; no `aria-labelledby`; `h3` should be `h2` |
| Semantics | ⭐⭐ | Heading hierarchy broken (`h3` without `h2` parent in this section); city lists aren't `<ul>` |
| Performance | ⭐⭐⭐ | SVG is inline (good for small); no external images |
| Reduced Motion | ⭐ | Many staggered animations with no `motion-reduce:` |

### Key Issues

1. **`<h3>` as section heading** — should be `<h2>` for proper document outline
2. **City names are bare `<span>` elements** — should be a `<ul>` list for screen readers
3. **`hover:scale-105 hover:text-[#C9A94E]`** on non-interactive text — confusing affordance; suggests clickability
4. **No `aria-labelledby`** on section
5. **No `prefers-reduced-motion`**
6. **SVG `<text>` font size** — `fontSize="4.4"` may render differently across browsers; consider using HTML overlays

### Recommended Upgrade

```tsx
"use client";

import { useInViewOnce } from "./useInViewOnce";
import { cn } from "@/lib/utils";

/* ────────────────────────── Constants ── */
const MAJOR_CITIES = ["Austin", "Round Rock", "Georgetown"] as const;
const SUPPORTING_CITIES = ["Kyle", "Buda", "Pflugerville", "Hutto", "San Marcos"] as const;

interface MapMarker {
  label: string;
  x: number;
  y: number;
  primary?: boolean;
}

const MAP_MARKERS: MapMarker[] = [
  { label: "Austin", x: 45, y: 54, primary: true },
  { label: "Round Rock", x: 58, y: 34 },
  { label: "Georgetown", x: 68, y: 20 },
  { label: "Pflugerville", x: 64, y: 42 },
  { label: "Hutto", x: 76, y: 40 },
  { label: "Buda", x: 42, y: 70 },
  { label: "Kyle", x: 38, y: 80 },
  { label: "San Marcos", x: 34, y: 92 },
];

/* ─────────────── Metro Map ── */
function MetroMap({ isVisible }: { isVisible: boolean }) {
  const fadeIn = cn(
    "transition duration-1000 motion-reduce:transition-none",
    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  );

  return (
    <div
      className={cn(fadeIn, "surface-panel-soft relative mx-auto w-full max-w-3xl overflow-hidden px-6 py-8")}
      role="img"
      aria-label="Map showing A&A service area across the Austin metropolitan region"
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,22,40,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(10,22,40,0.1) 1px,transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Region shapes */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M22 16 34 10 46 15 59 11 70 17 80 29 83 42 79 56 84 69 77 80 63 87 47 89 34 83 27 71 20 62 17 47 19 30Z"
          fill="rgba(37,99,235,0.07)"
          stroke="rgba(10,22,40,0.08)"
          strokeWidth="1.1"
        />
        <path
          d="M32 22 44 19 55 22 65 29 69 40 67 51 60 62 49 67 39 65 32 57 28 46 29 34Z"
          fill="rgba(201,169,78,0.08)"
          stroke="rgba(201,169,78,0.18)"
          strokeWidth="0.9"
        />
      </svg>

      {/* Markers and routes */}
      <svg
        viewBox="0 0 100 100"
        className="relative z-10 mx-auto aspect-[1.3] w-full max-w-[34rem]"
        aria-hidden="true"
      >
        {/* Route lines */}
        <path d="M45 54 L58 34 L68 20" fill="none" stroke="#9FB7D5" strokeLinecap="round" strokeWidth="1.2" />
        <path d="M58 34 L64 42 L76 40" fill="none" stroke="#9FB7D5" strokeLinecap="round" strokeWidth="1.2" />
        <path d="M45 54 L42 70 L38 80 L34 92" fill="none" stroke="#CDB88A" strokeLinecap="round" strokeWidth="1.2" />

        {MAP_MARKERS.map((marker, i) => (
          <g
            key={marker.label}
            className={cn(
              "transition duration-700 motion-reduce:transition-none",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <circle
              cx={marker.x}
              cy={marker.y}
              r={marker.primary ? "3.2" : "2.4"}
              fill={marker.primary ? "#0A1628" : "#C9A94E"}
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r={marker.primary ? "6.4" : "4.6"}
              fill="none"
              stroke={marker.primary ? "rgba(10,22,40,0.18)" : "rgba(201,169,78,0.25)"}
              strokeWidth="1.2"
            />
            <text
              x={marker.x + 3.8}
              y={marker.y - 2.2}
              fill="#334155"
              fontSize="4.4"
              fontWeight="600"
            >
              {marker.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ──────────────────── Main Component ── */
export function ServiceAreaSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });

  const fade = (delayCls?: string) =>
    cn(
      "transition duration-1000 motion-reduce:transition-none",
      delayCls,
      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    );

  return (
    <section
      ref={ref}
      id="service-area"
      aria-labelledby="service-area-heading"
      className="scroll-mt-32 overflow-hidden border-b border-slate-200 bg-[#F1F0EE] py-24 text-center md:scroll-mt-36 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <span className={cn(fade(), "mb-12 block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500")}>
          Where We Work
        </span>

        <div className="flex flex-col items-center justify-center gap-6 md:gap-10">
          {/* Primary city */}
          <h2
            id="service-area-heading"
            className={cn(
              fade(),
              "font-serif text-6xl leading-none tracking-tight text-brand-dark md:text-8xl lg:text-9xl"
            )}
          >
            {MAJOR_CITIES[0].toUpperCase()}
          </h2>

          {/* Major cities */}
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-16" aria-label="Major service cities">
            {MAJOR_CITIES.slice(1).map((city, i) => (
              <li
                key={city}
                className={cn(
                  fade(`delay-[${(i + 1) * 120}ms]`),
                  "font-serif text-3xl tracking-tight text-slate-700 md:text-5xl lg:text-6xl"
                )}
              >
                {city}
              </li>
            ))}
          </ul>

          {/* Supporting cities */}
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-12" aria-label="Additional service cities">
            {SUPPORTING_CITIES.map((city, i) => (
              <li
                key={city}
                className={cn(
                  fade(`delay-[${i * 100 + 260}ms]`),
                  "font-serif text-2xl tracking-tight text-slate-500 md:text-4xl lg:text-5xl"
                )}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 md:mt-14">
          <MetroMap isVisible={isVisible} />
        </div>

        <p className={cn(fade("delay-[520ms]"), "mt-12 text-sm font-light uppercase tracking-[0.2em] text-slate-500 md:mt-14")}>
          Serving the greater Austin metropolitan area
        </p>
      </div>
    </section>
  );
}
```

### What changed & why

| Change | Reason |
|---|---|
| **`h3` → `h2`** | Correct heading level for a section heading |
| **City lists → `<ul>`/`<li>`** | Semantic lists with `aria-label` |
| **Removed `cursor-default` + `hover:scale-105`** | Non-interactive text shouldn't have hover affordance |
| **`role="img"` + `aria-label`** on map container | Screen readers announce the map's purpose |
| **`motion-reduce:transition-none`** | All staggered animations are skippable |
| **`aria-labelledby`** | Section properly announced |
| **Brand tokens** | Consistent |

---

## 4. `ServiceSpreadSection.tsx`

### Grade: **B−**

| Category | Score | Notes |
|---|---|---|
| Visual Design | ⭐⭐⭐⭐⭐ | Stunning alternating layout, overlay chips, staggered entrance |
| Data Architecture | ⭐⭐⭐⭐ | Clean typed service array driving all cards |
| Accessibility | ⭐⭐ | Image alt text is just the title; no `aria-labelledby` on section or articles; bullet list dots are decorative but not hidden |
| Performance | ⭐⭐ | 5 external Unsplash images; hover zoom on all images |
| Maintainability | ⭐⭐ | Massive `ServiceSpreadItem` (~90 lines JSX); many staggered transitions with inline `style` |
| Reduced Motion | ⭐ | Hover zoom, slide entrance, staggered elements — all unconditional |

### Key Issues

1. **5 external Unsplash images** — most critical performance issue; these should be self-hosted
2. **Image `alt` is just the service title** — should describe the image content
3. **Each `ServiceSpreadItem` uses its own `useInViewOnce`** — 5 intersection observers; could use a single parent observer
4. **No `aria-labelledby`** on the parent section
5. **Inline `style` for staggered `transitionDelay`** — could use Tailwind delay utilities
6. **`group-hover:scale-[1.03]` on images** — no `motion-reduce:` guard
7. **Response promise shown twice** — once in the image overlay and once in the panel below

### Recommended Upgrade (key changes — full rewrite would be very long)

```tsx
"use client";

import Image from "next/image";
import { useInViewOnce } from "./useInViewOnce";
import { cn } from "@/lib/utils";

/* ────────────────────────── Types ── */
interface ServiceItem {
  id: string;
  anchor: string;
  index: string;
  icon: "build" | "detail" | "office" | "turn" | "wash";
  titleLines: string[];
  packageLabel: string;
  description: string;
  responsePromise: string;
  proofLine: string;
  image: string;
  imageAlt: string;
  bullets: string[];
  reverse?: boolean;
}

/* ────────────────────── Constants ── */
const SERVICES: ServiceItem[] = [
  {
    id: "post-construction",
    anchor: "service-post-construction",
    index: "01",
    icon: "build",
    titleLines: ["Post-", "Construction", "Clean"],
    packageLabel: "Builder Turnover Package",
    description: "Rough and final clean for new construction projects. We handle debris, dust, and detail so spaces are move-in ready.",
    responsePromise: "Call-back target: under 1 hour during business hours",
    proofLine: "Licensed, insured, and built for GC timelines.",
    image: "/images/services/post-construction.jpg",
    imageAlt: "Construction crew member sweeping dust from a newly built commercial floor",
    bullets: ["Multifamily buildings", "Commercial offices", "Schools & institutional"],
  },
  // ... remaining services with self-hosted images + descriptive alt text
];

/* ─── Icon component (record pattern) ── */
function ServiceIcon({ icon }: { icon: ServiceItem["icon"] }) {
  const paths: Record<ServiceItem["icon"], React.ReactNode> = {
    build: (
      <>
        <path d="M4 18h16M6.5 18V9.5L12 6l5.5 3.5V18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M10 18v-4h4v4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </>
    ),
    detail: <path d="m6 16 3.5-9 1.6 4.2L15 13l3 7-4.2-1.3L11 22l-1.1-4-4.5-2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />,
    office: <path d="M5 20V5.5L12 4l7 1.5V20M9 8.5h.01M9 12h.01M9 15.5h.01M15 8.5h.01M15 12h.01M15 15.5h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />,
    turn: (
      <>
        <path d="M7 10.5 12 6l5 4.5M8.5 9.5V18h7V9.5M4.5 13.5c0 3 2.6 5.5 5.8 5.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="m4.5 18 1.8 1.6L8 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </>
    ),
    wash: <path d="M6 5h10l2 3v3H6V5Zm0 6h13l-2 8H8L6 11Zm4-6 2 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      {paths[icon]}
    </svg>
  );
}

/* ─── Service Item ── */
function ServiceSpreadItem({
  onOpenQuote,
  service,
}: {
  onOpenQuote: () => void;
  service: ServiceItem;
}) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });
  const headingId = `service-${service.id}-heading`;

  const slideDir = service.reverse ? "translate-x-10" : "-translate-x-10";
  const slideOpposite = service.reverse ? "-translate-x-10" : "translate-x-10";

  return (
    <article
      ref={ref}
      id={service.anchor}
      aria-labelledby={headingId}
      className={cn(
        "group flex min-h-[60vh] flex-col overflow-hidden",
        service.reverse ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      {/* Image panel */}
      <div
        className={cn(
          "relative h-[40vh] w-full overflow-hidden transition duration-1000 motion-reduce:transition-none md:h-auto md:w-[56%] lg:w-[58%]",
          isVisible ? "translate-x-0 opacity-100" : cn(slideDir, "opacity-0")
        )}
      >
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 58vw"
          className="object-cover transition duration-[1400ms] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-darker/30 via-transparent to-transparent" aria-hidden="true" />

        {/* Top badges */}
        <div className="pointer-events-none absolute inset-x-8 top-8 flex items-start justify-between" aria-hidden="true">
          <span className="info-chip-dark">{service.packageLabel}</span>
          <span className="rounded-full border border-white/20 bg-brand-darker/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {service.index}
          </span>
        </div>

        {/* Bottom promise */}
        <div className="pointer-events-none absolute inset-x-8 bottom-8" aria-hidden="true">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-brand-darker/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-brand-gold" />
            {service.responsePromise}
          </div>
        </div>
      </div>

      {/* Content panel */}
      <div
        className={cn(
          "flex w-full items-center transition duration-1000 motion-reduce:transition-none md:w-[44%] lg:w-[42%]",
          service.reverse ? "bg-[#FAFAF8]" : "bg-white",
          isVisible ? "translate-x-0 opacity-100" : cn(slideOpposite, "opacity-0")
        )}
      >
        <div className="relative max-w-xl p-10 md:p-12 lg:p-14 xl:p-20">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
            {service.packageLabel}
          </p>

          <div className="mb-5 flex items-center gap-4">
            <span className="icon-tile">
              <ServiceIcon icon={service.icon} />
            </span>
            <span className="signal-line">{service.proofLine}</span>
          </div>

          <h2
            id={headingId}
            className="mb-6 font-serif text-4xl uppercase leading-[1.05] tracking-tight text-brand-dark md:text-5

            # The A&A Website Bible
## A Complete Upgrade Guide — From Good to Exceptional

---

## Table of Contents

1. [Architecture Overhaul](#1-architecture-overhaul)
2. [The "use client" Problem](#2-the-use-client-problem)
3. [Design System & Tailwind Config](#3-design-system--tailwind-config)
4. [Shared Component Library](#4-shared-component-library)
5. [Performance & Core Web Vitals](#5-performance--core-web-vitals)
6. [SEO & Local Search (Critical for a Cleaning Business)](#6-seo--local-search)
7. [Accessibility Audit Checklist](#7-accessibility-audit-checklist)
8. [Forms, Conversion & Spam Prevention](#8-forms-conversion--spam-prevention)
9. [Visual & UX Polish](#9-visual--ux-polish)
10. [Content Strategy & Copy](#10-content-strategy--copy)
11. [Analytics & Tracking](#11-analytics--tracking)
12. [Testing Strategy](#12-testing-strategy)
13. [Legal & Compliance](#13-legal--compliance)
14. [Deployment & Monitoring](#14-deployment--monitoring)
15. [Codex 5.3 Prompt Blueprint](#15-codex-53-prompt-blueprint)
16. [Priority Execution Order](#16-priority-execution-order)

---

## 1. Architecture Overhaul

### Current Problem

Every section is a top-level file in one folder. There's no shared component layer, no clear separation between layout/data/UI, and no server components.

### Recommended Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (Server Component)
│   ├── page.tsx                ← Home page (Server Component shell)
│   ├── careers/
│   │   └── page.tsx
│   ├── api/
│   │   ├── quote-request/
│   │   │   └── route.ts
│   │   └── ai-assistant/
│   │       └── route.ts
│   └── sitemap.ts              ← Dynamic sitemap
│
├── components/
│   ├── ui/                     ← Shared primitives
│   │   ├── Button.tsx
│   │   ├── Chip.tsx
│   │   ├── ChipList.tsx
│   │   ├── IconTile.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── FeedbackMessage.tsx
│   │   ├── FloatingLabel.tsx
│   │   └── StarRating.tsx
│   │
│   ├── icons/                  ← All SVG icons
│   │   ├── ServiceIcons.tsx
│   │   ├── IndustryIcons.tsx
│   │   ├── TrustIcons.tsx
│   │   └── UIIcons.tsx
│   │
│   ├── sections/               ← Page sections
│   │   ├── HeroSection.tsx
│   │   ├── AuthorityBar.tsx
│   │   ├── ServiceSpreadSection.tsx
│   │   └── ...
│   │
│   ├── forms/                  ← Form components
│   │   ├── QuoteForm.tsx       ← Shared form used in both QuoteSection + FloatingQuotePanel
│   │   ├── FloatingQuotePanel.tsx
│   │   └── AIQuoteAssistant.tsx
│   │
│   └── layout/                 ← Structural components
│       ├── PublicHeader.tsx
│       ├── FooterSection.tsx
│       └── MobileStickyBar.tsx
│
├── hooks/
│   ├── useInViewOnce.ts
│   ├── useQuoteForm.ts
│   ├── useScrolled.ts
│   ├── useScrollLock.ts
│   └── usePrefersReducedMotion.ts
│
├── lib/
│   ├── analytics.ts
│   ├── company.ts              ← Company constants
│   ├── utils.ts                ← cn() helper
│   └── schemas.ts              ← Zod schemas for form validation
│
├── data/
│   ├── services.ts             ← Service definitions
│   ├── industries.ts           ← Industry definitions
│   ├── testimonials.ts         ← Testimonial data
│   ├── service-area.ts         ← City lists + map markers
│   └── navigation.ts           ← Nav links
│
├── styles/
│   └── globals.css             ← Minimal global styles
│
└── public/
    └── images/
        ├── hero.jpg
        ├── about-hero.jpg
        ├── careers-hero.jpg
        ├── quote-hero.jpg
        ├── services/
        │   ├── post-construction.jpg
        │   ├── final-clean.jpg
        │   └── ...
        ├── comparisons/
        │   ├── office-before.jpg
        │   ├── office-after.jpg
        │   └── ...
        └── og-image.jpg        ← Open Graph social preview
```

### Key Principle

**Data lives in `/data/`. UI lives in `/components/`. Logic lives in `/hooks/` and `/lib/`.** No component should define its own data arrays inline.

---

## 2. The "use client" Problem

### Current State

**Every single component** has `"use client"` at the top. This means:
- Zero server-side rendering of static content
- Entire page JS bundle ships to the client
- Slower First Contentful Paint
- Worse SEO (search engines prefer server-rendered HTML)

### The Fix

Most of your sections are **purely presentational with an entrance animation**. The animation requires client-side JS, but the content doesn't.

**Strategy: Server Component shells → Client animation wrappers**

```tsx
// components/ui/AnimateOnView.tsx
"use client";

import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/utils";

interface AnimateOnViewProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  threshold?: number;
  /** Direction the element slides from */
  from?: "bottom" | "left" | "right";
  delay?: string;
  id?: string;
}

export function AnimateOnView({
  children,
  className,
  as: Tag = "div",
  threshold = 0.2,
  from = "bottom",
  delay,
  id,
}: AnimateOnViewProps) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold });

  const directionMap = {
    bottom: "translate-y-8",
    left: "-translate-x-10",
    right: "translate-x-10",
  };

  return (
    <Tag
      ref={ref as React.Ref<any>}
      id={id}
      className={cn(
        "transition duration-1000 motion-reduce:transition-none",
        delay,
        isVisible ? "translate-x-0 translate-y-0 opacity-100" : cn(directionMap[from], "opacity-0"),
        className
      )}
    >
      {children}
    </Tag>
  );
}
```

Now sections like `AboutSection`, `CareersSection`, `ServiceAreaSection` can become **Server Components** that wrap their animated parts:

```tsx
// This is a SERVER component — no "use client"
import { AnimateOnView } from "@/components/ui/AnimateOnView";
import { SERVICES } from "@/data/services";

export function ServiceAreaSection() {
  return (
    <section id="service-area" className="...">
      <AnimateOnView>
        <h2>Austin</h2>
        {/* All static content — rendered on the server */}
      </AnimateOnView>
    </section>
  );
}
```

### What stays "use client"

| Must be client | Can be server |
|---|---|
| `PublicHeader` (scroll, menu state) | `AboutSection` (static content + animation wrapper) |
| `HeroSection` (animation orchestration) | `CareersSection` |
| `FloatingQuotePanel` (form state) | `ServiceAreaSection` |
| `QuoteSection` (form state) | `FooterSection` (mostly static) |
| `AIQuoteAssistant` (chat state) | `ServiceSpreadSection` (if items use AnimateOnView) |
| `BeforeAfterSlider` (drag state) | `OfferAndIndustrySection` |
| `TestimonialSection` (carousel state) | `AuthorityBar` (counters need client, but header is static) |

---

## 3. Design System & Tailwind Config

### Current Problem

You have ~15 custom CSS classes (`section-kicker`, `info-chip`, `info-chip-dark`, `cta-primary`, `cta-outline-dark`, `cta-gold`, `cta-light`, `surface-panel`, `surface-panel-soft`, `dark-surface-panel`, `signal-line`, `icon-tile`) that are defined somewhere (presumably `globals.css`) but never documented. Raw hex codes appear in every file.

### Complete `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /* ── Brand Colors ── */
      colors: {
        brand: {
          dark: "#0A1628",
          darker: "#081120",
          navy: "#0f2746",
          blue: "#1D4ED8",
          "blue-hover": "#1948ca",
          gold: "#C9A94E",
          "gold-dark": "#8a6a1c",
          cream: "#FAFAF8",
          warm: "#F8F7F4",
          shell: "#F1F0EE",
        },
      },

      /* ── Typography ── */
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },

      /* ── Spacing Scale Extensions ── */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        128: "32rem",
      },

      /* ── Border Radius ── */
      borderRadius: {
        card: "1.75rem",
        "card-inner": "1.4rem",
        pill: "9999px",
      },

      /* ── Box Shadows ── */
      boxShadow: {
        card: "0 24px 80px rgba(15, 39, 70, 0.12)",
        "card-hover": "0 30px 90px rgba(15, 39, 70, 0.16)",
        panel: "0 8px 30px rgba(15, 23, 42, 0.08)",
        float: "0 18px 50px rgba(29, 78, 216, 0.35)",
        footer: "0 28px 90px rgba(2, 6, 23, 0.35)",
        "mobile-bar": "0 -8px 30px rgba(0, 0, 0, 0.06)",
      },

      /* ── Animations ── */
      keyframes: {
        heroFadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        heroKenBurns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.05)" },
        },
        heroBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        dotBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "hero-fade": "heroFadeUp 880ms cubic-bezier(0.22,1,0.36,1) forwards",
        "hero-ken": "heroKenBurns 15s ease-out forwards",
        "hero-bounce": "heroBounce 2s ease-in-out infinite",
        "slide-in-right": "slideInRight 300ms ease-out",
        "dot-bounce": "dotBounce 600ms ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

### Document Every Custom Class in `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ══════════════════════════════════════════
   A&A Design System — Custom Component Classes
   
   Naming Convention:
   - cta-*       → Call-to-action buttons
   - info-chip*  → Informational tag/badge
   - surface-*   → Background panel containers
   - section-*   → Section-level typography
   - signal-*    → Small accent/indicator lines
   - icon-tile   → Icon container
   ══════════════════════════════════════════ */

@layer components {
  /* ── Section Kicker (eyebrow text) ── */
  .section-kicker {
    @apply text-[10px] font-bold uppercase tracking-[0.22em] text-brand-blue;
  }

  /* ── Info Chips (light background) ── */
  .info-chip {
    @apply rounded-full border border-slate-200 bg-white px-3 py-1.5
           text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600;
  }

  /* ── Info Chips (dark background) ── */
  .info-chip-dark {
    @apply rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5
           text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200
           backdrop-blur-md;
  }

  /* ── Primary CTA Button ── */
  .cta-primary {
    @apply inline-flex items-center justify-center rounded-md bg-brand-dark
           px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white
           shadow-sm transition duration-200
           hover:bg-brand-blue
           disabled:cursor-not-allowed disabled:opacity-60;
  }

  /* ── Outline CTA (dark theme) ── */
  .cta-outline-dark {
    @apply inline-flex items-center justify-center rounded-md border
           border-brand-dark px-6 py-3 text-xs font-bold uppercase
           tracking-[0.18em] text-brand-dark transition duration-200
           hover:bg-brand-dark hover:text-white;
  }

  /* ── Gold CTA ── */
  .cta-gold {
    @apply inline-flex items-center justify-center rounded-md
           bg-brand-gold px-8 py-3.5 text-xs font-bold uppercase
           tracking-[0.18em] text-brand-dark shadow-sm transition
           duration-200 hover:bg-[#b8982f];
  }

  /* ── Light CTA (transparent) ── */
  .cta-light {
    @apply inline-flex items-center justify-center rounded-md border
           border-white/20 bg-white/[0.08] px-6 py-3 text-xs font-bold
           uppercase tracking-[0.18em] text-white backdrop-blur-sm
           transition duration-200 hover:bg-white/15;
  }

  /* ── Surface Panels ── */
  .surface-panel {
    @apply rounded-card border border-slate-200 bg-white shadow-panel;
  }

  .surface-panel-soft {
    @apply rounded-card border border-slate-200 bg-brand-cream;
  }

  .dark-surface-panel {
    @apply rounded-card border border-white/10
           bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
           backdrop-blur-md;
  }

  /* ── Signal Line ── */
  .signal-line {
    @apply text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500;
  }

  /* ── Icon Tile ── */
  .icon-tile {
    @apply inline-flex h-10 w-10 items-center justify-center rounded-xl
           border border-slate-200 bg-white text-slate-600 shadow-sm;
  }
}

/* ══════════════════════════════════════════
   Reduced Motion — Global Safety Net
   ══════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 4. Shared Component Library

### Components to Extract

Instead of every section building its own chips, icons, labels, and feedback messages:

```tsx
// components/ui/Chip.tsx
interface ChipProps {
  variant?: "light" | "dark";
  children: React.ReactNode;
}

export function Chip({ variant = "light", children }: ChipProps) {
  return (
    <span className={variant === "dark" ? "info-chip-dark" : "info-chip"}>
      {children}
    </span>
  );
}

// components/ui/ChipList.tsx
interface ChipListProps {
  items: readonly string[];
  label: string;
  variant?: "light" | "dark";
}

export function ChipList({ items, label, variant = "light" }: ChipListProps) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Chip variant={variant}>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

// components/ui/SectionHeader.tsx
interface SectionHeaderProps {
  kicker?: string;
  heading: string;
  headingId: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  kicker,
  heading,
  headingId,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", align === "center" && "text-center")}>
      {kicker && <p className="section-kicker mb-4">{kicker}</p>}
      <h2
        id={headingId}
        className="font-serif text-4xl tracking-tight text-brand-dark md:text-5xl"
      >
        {heading}
      </h2>
      {description && (
        <p className={cn(
          "mt-4 text-sm leading-relaxed text-slate-600 md:text-base",
          align === "center" && "mx-auto max-w-2xl"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}

// components/ui/FeedbackMessage.tsx
interface FeedbackMessageProps {
  id: string;
  type: "success" | "error";
  message: string;
}

export function FeedbackMessage({ id, type, message }: FeedbackMessageProps) {
  return (
    <p
      id={id}
      role="status"
      aria-live="polite"
      className={cn(
        "rounded px-3 py-2 text-sm",
        type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      )}
    >
      {message}
    </p>
  );
}
```

### Why This Matters

Right now, if you want to change the chip border radius, you'd need to find and edit **~30 instances** across 12 files. With a shared component, you change it in **one place**.

---

## 5. Performance & Core Web Vitals

### Image Strategy (Most Critical)

| Action | Impact |
|---|---|
| **Self-host all images** | Eliminates external dependency; enables `next/image` optimization |
| **Generate WebP/AVIF versions** | 30-50% smaller than JPEG |
| **Add `placeholder

# The A&A Website Bible (Continued)
## Sections 5–16

---

## 5. Performance & Core Web Vitals (Continued)

### Image Strategy (Most Critical)

| Action | Impact |
|---|---|
| **Self-host all images** | Eliminates external dependency; enables `next/image` optimization |
| **Generate WebP/AVIF versions** | 30-50% smaller than JPEG |
| **Add `placeholder="blur"` with `blurDataURL`** | Smooth perceived loading instead of empty space |
| **Right-size source images** | Hero needs max ~2400px wide; service cards need max ~1200px |
| **Use `priority` only on above-fold images** | Hero image only; everything else lazy-loads |
| **Replace CSS `backgroundImage` with `next/image`** | CareersSection, QuoteSection both bypass optimization entirely |

### Image Processing Script

```bash
# Install sharp-cli for batch optimization
npm install -D sharp-cli

# Create an optimization script
# scripts/optimize-images.sh
#!/bin/bash
for file in public/images/originals/*.jpg; do
  filename=$(basename "$file" .jpg)
  
  # WebP at 80% quality
  npx sharp -i "$file" -o "public/images/${filename}.webp" --format webp --quality 80
  
  # AVIF at 65% quality (smaller but slower to encode)
  npx sharp -i "$file" -o "public/images/${filename}.avif" --format avif --quality 65
  
  # Optimized JPEG fallback
  npx sharp -i "$file" -o "public/images/${filename}.jpg" --format jpeg --quality 82 --progressive
  
  # Tiny blur placeholder (10px wide)
  npx sharp -i "$file" -o "public/images/placeholders/${filename}.jpg" --resize 10 --format jpeg --quality 20
done
```

### Generate Blur Data URLs

```ts
// lib/blur.ts
import fs from "fs";
import path from "path";

export function getBlurDataURL(imageName: string): string {
  const placeholderPath = path.join(
    process.cwd(),
    "public/images/placeholders",
    `${imageName}.jpg`
  );
  
  if (!fs.existsSync(placeholderPath)) return "";
  
  const buffer = fs.readFileSync(placeholderPath);
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
```

### Bundle Size Reduction

```ts
// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  /* ── Image Optimization ── */
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // If you MUST keep external images temporarily:
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  /* ── Headers ── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache immutable assets aggressively
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* ── Experimental ── */
  experimental: {
    optimizePackageImports: ["lucide-react"], // if using any icon libs
  },
};

export default config;
```

### Core Web Vitals Targets

| Metric | Target | Current Risk | Fix |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Hero image is external + no priority on some | Self-host + `priority` + `placeholder="blur"` |
| **FID / INP** (Interaction to Next Paint) | < 200ms | All client components = large JS bundle | Server components + code splitting |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Images without dimensions can shift | `next/image` with `fill` + `sizes` handles this |
| **TTFB** (Time to First Byte) | < 800ms | Full client render delays first byte | Server components generate HTML on server |

### Font Optimization

```tsx
// app/layout.tsx
import { Playfair_Display, Inter } from "next/font/google";

const serif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  // Only load the weights you actually use
  weight: ["400", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

### Lazy Load Below-Fold Sections

```tsx
// app/page.tsx (Server Component)
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { AuthorityBar } from "@/components/sections/AuthorityBar";

// Lazy load heavy interactive components
const BeforeAfterSlider = dynamic(
  () => import("@/components/sections/BeforeAfterSlider").then((m) => m.BeforeAfterSlider),
  { loading: () => <SectionSkeleton height="80vh" /> }
);

const AIQuoteAssistant = dynamic(
  () => import("@/components/forms/AIQuoteAssistant").then((m) => m.AIQuoteAssistant),
  { ssr: false }
);

const TestimonialSection = dynamic(
  () => import("@/components/sections/TestimonialSection").then((m) => m.TestimonialSection),
  { loading: () => <SectionSkeleton height="600px" /> }
);

function SectionSkeleton({ height }: { height: string }) {
  return (
    <div
      className="animate-pulse bg-slate-100"
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
}
```

---

## 6. SEO & Local Search (Critical for a Cleaning Business)

This is **the most business-critical section**. Your mom's website lives or dies on whether people in Austin can find it on Google.

### Structured Data (JSON-LD)

```tsx
// components/StructuredData.tsx
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CleaningService",
    name: "A&A Cleaning Services",
    description:
      "Post-construction and commercial cleaning services across the Austin, TX metro area. Licensed and insured.",
    url: "https://www.aacleaningaustin.com",
    telephone: "+15125551234", // replace with real
    email: "info@aacleaningaustin.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      postalCode: "78701",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.2672,
      longitude: -97.7431,
    },
    areaServed: [
      { "@type": "City", name: "Austin", "@id": "https://www.wikidata.org/wiki/Q16559" },
      { "@type": "City", name: "Round Rock" },
      { "@type": "City", name: "Georgetown" },
      { "@type": "City", name: "Kyle" },
      { "@type": "City", name: "Buda" },
      { "@type": "City", name: "Pflugerville" },
      { "@type": "City", name: "Hutto" },
      { "@type": "City", name: "San Marcos" },
    ],
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "14:00",
      },
    ],
    image: "https://www.aacleaningaustin.com/images/og-image.jpg",
    sameAs: [
      // Add social profiles
      "https://www.facebook.com/aacleaningaustin",
      "https://www.instagram.com/aacleaningaustin",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cleaning Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Post-Construction Cleaning",
            description: "Rough and final clean for new construction projects.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Final Clean",
            description: "Detail-level cleaning for move-in readiness.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Cleaning",
            description: "Ongoing cleaning for offices and commercial facilities.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Move-In / Move-Out Cleaning",
            description: "Vacant unit turnover cleaning.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Windows & Power Wash",
            description: "Interior/exterior window cleaning and power washing.",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "47", // Use real numbers
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema — helps win "People Also Ask" boxes
export function FAQSchema() {
  const faqs = [
    {
      question: "What areas does A&A Cleaning serve in Austin?",
      answer:
        "A&A Cleaning serves the greater Austin metropolitan area including Round Rock, Georgetown, Pflugerville, Hutto, Kyle, Buda, and San Marcos.",
    },
    {
      question: "How quickly can A&A Cleaning respond to a quote request?",
      answer:
        "We target a call-back within 1 hour during business hours. Same-day quote delivery is available after scope confirmation.",
    },
    {
      question: "Is A&A Cleaning licensed and insured?",
      answer:
        "Yes, A&A Cleaning Services is fully licensed and insured for commercial and construction site work in Texas.",
    },
    {
      question: "What types of post-construction cleaning does A&A offer?",
      answer:
        "We offer rough cleans, final cleans, and punch-list detail work for multifamily buildings, commercial offices, schools, and institutional facilities.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Metadata Configuration

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0A1628",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aacleaningaustin.com"),
  title: {
    default: "A&A Cleaning Services | Post-Construction & Commercial Cleaning | Austin, TX",
    template: "%s | A&A Cleaning Services",
  },
  description:
    "Licensed & insured post-construction and commercial cleaning across the Austin metro. Rough cleans, final cleans, turnovers, and ongoing facility care. Call for a free quote.",
  keywords: [
    "post construction cleaning Austin",
    "commercial cleaning Austin TX",
    "construction cleanup Austin",
    "final clean service Austin",
    "move out cleaning Austin",
    "office cleaning Austin",
    "power washing Austin",
    "cleaning contractor Austin",
    "apartment turnover cleaning",
    "janitorial service Round Rock",
    "construction cleaning Georgetown TX",
  ],
  authors: [{ name: "A&A Cleaning Services" }],
  creator: "A&A Cleaning Services",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aacleaningaustin.com",
    siteName: "A&A Cleaning Services",
    title: "A&A Cleaning Services | Austin Post-Construction & Commercial Cleaning",
    description:
      "Every surface. Every detail. Every time. Licensed post-construction and commercial cleaning across the Austin metro.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "A&A Cleaning Services — Austin's construction-ready cleaning team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A&A Cleaning Services | Austin, TX",
    description: "Post-construction & commercial cleaning. Licensed, insured, detail-driven.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.aacleaningaustin.com",
  },
};
```

### Dynamic Sitemap

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aacleaningaustin.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Add service-specific landing pages if/when you create them:
    // {
    //   url: `${baseUrl}/services/post-construction-cleaning-austin`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
  ];
}
```

### robots.txt

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://www.aacleaningaustin.com/sitemap.xml",
  };
}
```

### Google Business Profile Checklist

This is **free** and arguably more important than any code change:

- [ ] Claim and verify Google Business Profile
- [ ] Set primary category to "Commercial Cleaning Service"
- [ ] Add secondary categories: "Construction Cleaning Service", "Office Cleaning Service"
- [ ] Upload 10+ high-quality photos (before/after, crew, vehicles, job sites)
- [ ] Write a complete business description with keywords
- [ ] Add all service areas
- [ ] Set business hours
- [ ] Enable messaging
- [ ] Request reviews from every completed project (aim for 30+)
- [ ] Respond to every review within 24 hours
- [ ] Post weekly Google Business updates

### Future SEO Expansion: Service Landing Pages

Each service should eventually have its own URL for search:

```
/services/post-construction-cleaning-austin
/services/final-clean-austin
/services/commercial-cleaning-austin
/services/move-in-move-out-cleaning-austin
/services/window-cleaning-power-washing-austin
/service-areas/round-rock-cleaning
/service-areas/georgetown-cleaning
```

Each page would have unique content, unique title/description, and its own JSON-LD schema. **This is the single biggest SEO growth lever.**

---

## 7. Accessibility Audit Checklist

### Automated (Run These Tools)

| Tool | What It Catches | How to Run |
|---|---|---|
| **axe DevTools** (browser extension) | WCAG 2.1 violations | Install extension → open on any page |
| **Lighthouse Accessibility** | Scoring + specific issues | Chrome DevTools → Lighthouse tab |
| **eslint-plugin-jsx-a11y** | Catches issues at build time | `npm install -D eslint-plugin-jsx-a11y` |
| **Pa11y** | CLI automated testing | `npx pa11y https://localhost:3000` |

### ESLint A11y Plugin Config

```js
// .eslintrc.js (add to extends)
module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:jsx-a11y/strict", // Use "strict" not "recommended"
  ],
  plugins: ["jsx-a11y"],
};
```

### Manual Checklist

#### Keyboard Navigation
- [ ] Every interactive element is reachable with Tab
- [ ] Tab order follows visual reading order
- [ ] Focus indicators are visible (test with `outline: none` removed)
- [ ] Skip-nav link works and targets `#main-content`
- [ ] Dropdown menus support Enter, Escape, Arrow keys
- [ ] Modal dialogs trap focus
- [ ] Modals return focus to trigger on close
- [ ] Before/after slider works with arrow keys (already done ✓)
- [ ] Carousel/testimonials can be controlled with keyboard

#### Screen Reader Testing
- [ ] Install VoiceOver (Mac) or NVDA (Windows)
- [ ] Navigate the entire page with screen reader
- [ ] Every image has meaningful or empty alt text
- [ ] Headings create a logical outline (h1 → h2 → h3)
- [ ] Landmarks are properly labeled (`nav`, `main`, `footer`, `section`)
- [ ] Form fields have associated labels
- [ ] Required fields are announced
- [ ] Form feedback is announced via `aria-live`
- [ ] Decorative elements are hidden (`aria-hidden="true"`)

#### Heading Outline (Target)

```
h1: Every Surface. Every Detail. Every Time.
  h2: Standards You Can Read Fast          (AuthorityBar)
  h2: Post-Construction Clean              (ServiceSpread)
  h2: Final Clean                          (ServiceSpread)
  h2: Commercial Cleaning                  (ServiceSpread)
  h2: Move-In Move-Out                     (ServiceSpread)
  h2: Windows & Power Wash                 (ServiceSpread)
  h2: Built for Demanding Spaces           (OfferAndIndustry)
    h3: General Contractors
    h3: Property Managers
    h3: Commercial Spaces
  h2: See the Difference                   (BeforeAfter)
  h2: What Teams Remember                  (Testimonial)
  h2: How It Works                         (Timeline)
  h2: Built on Standards                   (About)
  h2: AUSTIN                               (ServiceArea)
  h2: Let's Talk About Your Project        (Quote)
  h2: We're Building a Team                (Careers)
  h2: Bring A&A in before the handoff...   (Footer CTA)
```

#### Color Contrast

| Element | Foreground | Background | Ratio Required | Current Risk |
|---|---|---|---|---|
| Body text | `slate-600` | white | 4.5:1 | ✓ Usually fine |
| `section-kicker` | `#1D4ED8` (blue) | white | 4.5:1 | ✓ Passes (~5.7:1) |
| `info-chip` text | `slate-600` | white border | 4.5:1 | ✓ Fine |
| Gold text `#C9A94E` | on `#0A1628` | 4.5:1 | ⚠️ Check — gold on dark can fail |
| `slate-400` text | on white | 4.5:1 | ❌ **Fails** (~3.9:1) — use `slate-500` minimum |
| White text | on image overlays | 4.5:1 | ⚠️ Varies — gradient overlays must be dark enough |
| `text-[10px]` labels | any | any | ❌ Text below 14px needs **7:1** ratio for AAA |

**Action Items:**
- Replace all `text-slate-400` on white backgrounds with `text-slate-500`
- Test gold (#C9A94E) on dark backgrounds — it passes at ~7.4:1 on `#0A1628` ✓
- Ensure image overlay gradients provide sufficient contrast for overlaid text

#### Focus Styles

Add visible focus styles globally:

```css
/* globals.css */
@layer base {
  /* Visible focus ring for keyboard users */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-brand-blue;
  }

  /* Remove default outline only when NOT keyboard-navigating */
  :focus:not(:focus-visible) {
    outline: none;
  }
}
```

---

## 8. Forms, Conversion & Spam Prevention

### Form Validation with Zod

```ts
// lib/schemas.ts
import { z } from "zod";

export const quoteRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  companyName: z.string().max(100).optional().default(""),
  phone: z
    .string()
    .regex(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Please enter a valid 10-digit phone number"
    ),
  email: z
    .union([z.literal(""), z.string().email("Please enter a valid email")])
    .optional()
    .default(""),
  serviceType: z
    .enum([
      "",
      "post_construction",
      "final_clean",
      "commercial",
      "move_in_out",
      "window",
    ])
    .optional()
    .default(""),
  timeline: z
    .enum([
      "",
      "asap",
      "this_week",
      "next_2_weeks",
      "next_month",
      "just_getting_quotes",
    ])
    .optional()
    .default(""),
  description: z.string().max(2000, "Description is too long").optional().default(""),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
```

### Client-Side Validation in `useQuoteForm`

```ts
// In useQuoteForm.ts — add validation before submit
import { quoteRequestSchema } from "@/lib/schemas";

const submitLead = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  setFeedback(null);

  // Client-side validation
  const result = quoteRequestSchema.safeParse(fields);
  if (!result.success) {
    const firstError = result.error.issues[0];
    setFeedback({
      type: "error",
      message: firstError?.message ?? "Please check your entries.",
    });
    return;
  }

  setIsSubmitting(true);
  // ... rest of submit logic
}, [fields, source]);
```

### Server-Side Validation

```ts
// app/api/quote-request/route.ts
import { NextResponse } from "next/server";
import { quoteRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate
    const result = quoteRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Honeypot check (see below)
    // Rate limiting check (see below)
    // Send email / save to DB
    // ...

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Spam Prevention (No CAPTCHA Needed)

```tsx
// 1. Honeypot field — bots fill it, humans don't see it
// Add to QuoteForm:
<div className="absolute -left-[9999px] top-0" aria-hidden="true">
  <label htmlFor="website">Website</label>
  <input
    id="website"
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
    value={honeypot}
    onChange={(e) => setHoneypot(e.target.value)}
  />
</div>

// In submit: if honeypot has value, silently "succeed" without submitting
if (honeypot) {
  setFeedback({ type: "success", message: "Submitted. We'll call you within the hour." });
  return;
}
```

```ts
// 2. Server-side rate limiting
// app/api/quote-request/route.ts

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now - entry.timestamp > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}
```

```ts
// 3. Timing check — forms submitted in < 3 seconds are almost certainly bots
// Add a hidden timestamp field
const formLoadTime = useRef(Date.now());

// In submit:
if (Date.now() - formLoadTime.current < 3000) {
  // Too fast — likely a bot
  setFeedback({ type: "success", message: "Submitted. We'll call you within the hour." });
  return;
}
```

### Email Delivery

```ts
// lib/email.ts
// Use Resend (free tier: 3000 emails/month) or Nodemailer

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQuoteNotification(data: QuoteRequest) {
  await resend.emails.send({
    from: "A&A Website <quotes@aacleaningaustin.com>",
    to: ["info@aacleaningaustin.com"],
    subject: `New Quote Request: ${data.name} — ${data.serviceType || "General"}`,
    html: `
      <h2>New Quote Request</h2>
      <table>
        <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>Company:</strong></td><td>${data.companyName || "N/A"}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${data.email || "N/A"}</td></tr>
        <tr><td><strong>Service:</strong></td><td>${data.serviceType || "Not specified"}</td></tr>
        <tr><td><strong>Timeline:</strong></td><td>${data.timeline || "Not specified"}</td></tr>
        <tr><td><strong>Description:</strong></td><td>${data.description || "N/A"}</td></tr>
      </table>
    `,
  });
}
```

### Conversion Optimization Tips

| Change | Expected Impact |
|---|---|
| **Reduce form fields** — Name + Phone + Service Type is the minimum viable form | +20-30% completion rate |
| **Add "Or text us" option** | Younger demographics prefer texting |
| **Show social proof near form** — "47 quotes sent this month" (even estimated) | +15% submission rate |
| **Success state should give a clear next step** — "We'll call from (512) 555-1234 within the hour" | Reduces anxiety |
| **Mobile sticky bar** (you have this ✓) | +25% mobile conversion |
| **Auto-detect mobile → show phone CTA first** | Phone calls convert higher for services |

---

## 9. Visual & UX Polish

### Micro-Interactions You're Missing

```css
/* globals.css — add these utility classes */
@layer utilities {
  /* Smooth image reveal on load */
  .img-reveal {
    @apply opacity-0 transition-opacity duration-700;
  }
  .img-reveal[data-loaded="true"] {
    @apply opacity-100;
  }

  /* Subtle button press effect */
  .press-effect {
    @apply transition-transform duration-100 active:scale-[0.97];
  }

  /* Link underline animation */
  .link-underline {
    @apply relative after:absolute after:bottom-0 after:left-0 after:h-px
           after:w-0 after:bg-current after:transition-all after:duration-300
           hover:after:w-full;
  }
}
```

### Page Transition Between Routes

```tsx
// components/ui/PageTransition.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-500 motion-reduce:transition-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
```

### Loading State for Page Navigation

```tsx
// components/ui/NavigationProgress.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5">
      <div className="h-full animate-[progress_500ms_ease-out_forwards] bg-brand-gold" />
    </div>
  );
}
```

### Dark Mode Ready (Future-Proofing)

Even if you don't implement dark mode now, structure your colors so you can:

```ts
// In tailwind.config.ts
darkMode: "class", // Enable class-based dark mode

// Then in components, you can add dark variants:
// className="bg-white dark:bg-brand-dark text-brand-dark dark:text-white"
```

### Scroll-to-Top Button

```tsx
// components/ui/ScrollToTop.tsx
"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-40 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 md:inline-flex"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
        <path d="M10 4v12M5 9l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
```

### Smooth Scroll Behavior

```css
/* globals.css */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
}
```

### Current Visual Issues to Fix

| Issue | Where | Fix |
|---|---|---|
| **No 404 page** | App-wide | Create `app/not-found.tsx` with brand styling |
| **No loading states** for route changes | App-wide | Add `loading.tsx` files |
| **Testimonial section minimum height hack** | `TestimonialSection` | Use proper layout with `relative`/`absolute` only for transitions |
| **Mobile bottom bar overlaps content** | `VariantAPublicPage` | Add `pb-24` to `<main>` on mobile |
| **Double scroll lock** | `VariantAPublicPage` + `FloatingQuotePanel` | Remove from page; let panel own its own scroll lock |
| **No error boundary** | App-wide | Add `error.tsx` files |

### 404 Page

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 text-center">
      <p className="section-kicker mb-4">Page Not Found</p>
      <h1 className="font-serif text-6xl tracking-tight text-brand-dark md:text-8xl">
        404
      </h1>
      <p className="mt-6 max-w-md text-lg font-light text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you
        back on track.
      </p>
      <Link href="/" className="cta-primary mt-10">
        Back to Home
      </Link>
    </main>
  );
}
```

---

## 10. Content Strategy & Copy

### Current Copy Issues

| Problem | Example | Fix |
|---|---|---|
| **Marketing jargon** | "Proof Rail", "Signal", "Core signal" | Users don't speak this way. Use plain language. |
| **"Section kicker" visible to users** | "Proof Rail" as an eyebrow | "Our Track Record" or "By the Numbers" |
| **"Finish-Ready Standard"** | Badge on About image | Not a term anyone searches for — "Inspection Ready" is better |
| **Testimonials may be fabricated** | Generic names + generic companies | Use real testimonials or remove section entirely. Google penalizes fake reviews. |
| **"Visible finish quality"** | Repeated 3x | Vague — replace with specific outcomes |
| **Copyright 2026** | Footer | Hardcoded future date looks suspicious |

### Recommended Copy Replacements

| Current | Replacement |
|---|---|
| "Proof Rail" | "Track Record" |
| "Signal" (in card footers) | "Key Benefit" or just remove |
| "Core signal" (badge) | "Licensed & Insured" (the actual signal) |
| "Finish-Ready Standard" | "Inspection-Grade Quality" |
| "Field Notes" (testimonials) | "What Clients Say" |
| "Standards You Can Read Fast" | "Our Numbers Speak" |

### Content That's Actually Missing

| Missing Content | Why It Matters |
|---|---|
| **Real photos of A&A crews at work** | Stock photos destroy trust. Even phone photos are better. |
| **Specific project numbers** (sq ft cleaned, buildings completed) | "500+ projects" is vague. "Over 2 million square feet cleaned" is concrete. |
| **Real client testimonials with permission** | Google and users can tell fake testimonials. One real one beats four fake ones. |
| **A real "About" story** | "Built on a simple principle" is generic. Who is your mom? How did she start? What makes A&A different? |
| **Pricing transparency** | Even "Starting at $X per square foot" or "Free estimates" reduces friction |
| **Response time guarantee** | "Under 1 hour" is mentioned but could be a primary differentiator |
| **Certifications or training** | OSHA 10? Any cleaning certifications? These build trust. |
| **Insurance details** | "Up to $X in coverage" is more specific than "licensed and insured" |

### Blog/Content Marketing Plan (Future)

Create 1-2 posts per month targeting long-tail keywords:

```
/blog/post-construction-cleaning-checklist-austin
/blog/how-to-prepare-for-final-walkthrough-cleaning
/blog/apartment-turnover-cleaning-timeline
/blog/commercial-cleaning-vs-janitorial-service
/blog/power-washing-concrete-austin-tx
```

Each post should:
- Be 800-1500 words
- Target a specific long-tail keyword
- Include 1-2 real photos
- Link to the relevant service page
- Include a CTA for quotes

---

## 11. Analytics & Tracking

### Current `trackConversionEvent` Improvement

Your existing analytics tracking is good in principle, but needs structure:

```ts
// lib/analytics.ts

/* ── Event Types ── */
type ConversionEvent =
  | { eventName: "quote_open_clicked"; source: string }
  | { eventName: "quote_submit_success"; source: string; metadata: { serviceType: string } }
  | { eventName: "quote_submit_failed"; source: string; metadata: { message: string } }
  | { eventName: "call_click"; source: string }
  | { eventName: "careers_click"; source: string }
  | { eventName: "chat_opened"; source: string }
  | { eventName: "chat_message_sent"; source: string; metadata: { locale: string } }
  | { eventName: "service_card_view"; source: string; metadata: { service: string } }
  | { eventName: "scroll_depth"; source: string; metadata: { depth: string } };

export async function trackConversionEvent(event: ConversionEvent): Promise<void> {
  try {
    // Google Analytics 4
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event.eventName, {
        event_category: "conversion",
        event_source: event.source,
        ...("metadata" in event ? event.metadata : {}),
      });
    }

    // Optional: server-side tracking for reliability
    if (event.eventName.includes("submit") || event.eventName === "call_click") {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
        // Use keepalive so it fires even during page navigation
        keepalive: true,
      });
    }
  } catch {
    // Analytics should never break the user experience
  }
}
```

### Google Analytics 4 Setup

```tsx
// components/GoogleAnalytics.tsx
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  );
}
```

### Scroll Depth Tracking

```tsx
// hooks/useScrollDepth.ts
"use client";

import { useEffect, useRef } from "react";
import { trackConversionEvent } from "@/lib/analytics";

const DEPTH_MILESTONES = [25, 50, 75, 100];

export function useScrollDepth() {
  const tracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of DEPTH_MILESTONES) {
        if (percent >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone);
          void trackConversionEvent({
            eventName: "scroll_depth",
            source: "home_page",
            metadata: { depth: `${milestone}%` },
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
```

### Key Events to Track (GA4 Dashboard Setup)

| Event | Trigger | Value |
|---|---|---|
| `quote_open_clicked` | User clicks any "Get a Quote" button | Medium intent |
| `quote_submit_success` | Form submitted successfully | **High value** — set as conversion |
| `call_click` | User clicks phone number | **High value** — set as conversion |
| `chat_opened` | AI assistant opened | Medium intent |
| `scroll_depth` at 75%+ | User engaged deeply | Engagement signal |
| `careers_click` | Careers link clicked | Hiring signal |

### Google Search Console

- [ ] Verify domain ownership
- [ ] Submit sitemap
- [ ] Monitor search queries monthly
- [ ] Fix any crawl errors
- [ ] Monitor Core Web Vitals report

---

## 12. Testing Strategy

### Unit Tests (Vitest + React Testing Library)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```ts
// test/setup.ts
import "@testing-library/jest-dom/vitest";
```

### What to Test

```tsx
// __tests__/hooks/useQuoteForm.test.ts
import { renderHook, act } from "@testing-library/react";
import { useQuoteForm } from "@/hooks/useQuoteForm";

describe("useQuoteForm", () => {
  it("initializes with empty fields", () => {
    const { result } = renderHook(() => useQuoteForm("test"));
    expect(result.current.fields.name).toBe("");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.feedback).toBeNull();
  });

  it("updates fields correctly", () => {
    const { result } = renderHook(() => useQuoteForm("test"));
    act(() => {
      result.current.setField("name", "Jane Doe");
    });
    expect(result.current.fields.name).toBe("Jane Doe");
  });
});

// __tests__/lib/schemas.test.ts
import { quoteRequestSchema } from "@/lib/schemas";

describe("quoteRequestSchema", () => {
  it("accepts valid data", () => {
    const result = quoteRequestSchema.safeParse({
      name: "Jane Doe",
      phone: "(512) 555-1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = quoteRequestSchema.safeParse({
      name: "",
      phone: "(512) 555-1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed phone", () => {
    const result = quoteRequestSchema.safeParse({
      name: "Jane Doe",
      phone: "not-a-phone",
    });
    expect(result.success).toBe(false);
  });
});

// __tests__/components/ChipList.test.tsx
import { render, screen } from "@testing-library/react";
import { ChipList } from "@/components/ui/ChipList";

describe("ChipList", () => {
  it("renders all items as list items", () => {
    render(<ChipList items={["A", "B", "C"]} label="test chips" />);
    const list = screen.getByRole("list", { name: "test chips" });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
```

### E2E Tests (Playwright)

```bash
npm install -D @playwright/test
npx playwright install
```

```ts
// e2e/quote-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Quote submission flow", () => {
  test("user can fill and submit the inline quote form", async ({ page }) => {
    await page.goto("/");

    // Scroll to quote section
    await page.click('a[href="#quote"]');
    await page.waitForSelector("#quote");

    // Fill form
    await page.fill('input[name="name"]', "Jane Doe");
    await page.fill('input[name="phone"]', "5125551234");
    await page.selectOption('select[name="serviceType"]', "post_construction");
    await page.selectOption('select[name="timeline"]', "this_week");

    // Submit
    await page.click('button[type="submit"]');

    // Wait for feedback
    await expect(page.locator('[role="status"]')).toContainText("Submitted");
  });

  test("mobile sticky bar is visible on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const stickyBar = page.locator("text=Get a Quote").last();
    await expect(stickyBar).toBeVisible();
  });

  test("keyboard navigation through header", async ({ page }) => {
    await page.goto("/");

    // Tab to skip-nav
    await page.keyboard.press("Tab");
    const skipNav = page.locator("text=Skip to main content");
    await expect(skipNav).toBeFocused();

    // Press Enter to skip
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
});
```

### Visual Regression Testing (Optional but Recommended)

```bash
npx playwright test --update-snapshots
```

```ts
// e2e/visual.spec.ts
test("homepage matches snapshot", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
```

---

## 13. Legal & Compliance

### Required Pages/Elements

| Item | Status | Priority |
|---|---|---|
| **Privacy Policy** | ❌ Missing | **Required by law** if collecting any data (you are) |
| **Terms of Service** | ❌ Missing | Recommended |
| **Cookie Notice** | ❌ Missing | **Required** if using Google Analytics (you are) |
| **ADA Compliance Statement** | ❌ Missing | Good faith effort; protects against lawsuits |
| **SSL Certificate** | Likely ✓ (Vercel provides) | Verify HTTPS everywhere |
| **Business License Mention** | Partial (says "licensed") | Add license number if applicable |

### Privacy Policy Template

```tsx
// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy",
  description: "A&A Cleaning Services privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl text-brand-dark">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-slate mt-10">
        <h2>Information We Collect</h2>
        <p>
          When you submit a quote request through our website, we collect your name,
          phone number, email address (if provided), company name (if provided), and
          project details you choose to share.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use the information you provide solely to:</p>
        <ul>
          <li>Respond to your quote request</li>
          <li>Contact you about our cleaning services</li>
          <li>Improve our website experience</li>
        </ul>

        <h2>Analytics</h2>
        <p>
          We use Google Analytics to understand how visitors use our site. This
          collects anonymized browsing data. You can opt out by installing the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout">
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to
          third parties. We may share information with trusted service providers who
          assist us in operating our website, as long as they agree to keep your
          information confidential.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this policy, contact us at{" "}
          <a href="mailto:info@aacleaningaustin.com">info@aacleaningaustin.com</a>.
        </p>
      </div>
    </main>
  );
}
```

### Cookie Consent Banner

```tsx
// components/CookieConsent.tsx
"use client";

import { useEffect, useState } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay slightly so it doesn't compete with hero entrance
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-lg md:bottom-6 md:left-6 md:right-auto"
    >
      <p className="text-sm text-slate-600">
        We use cookies to analyze site traffic and improve your experience.{" "}
        <a href="/privacy" className="underline hover:text-brand-dark">
          Privacy Policy
        </a>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={accept}
          className="rounded-md bg-brand-dark px-4 py-2 text-xs font-semibold text-white"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
```

### ADA Compliance Statement

Add to footer navigation:

```tsx
// app/accessibility/page.tsx
export default function AccessibilityPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl text-brand-dark">Accessibility Statement</h1>
      <div className="prose prose-slate mt-10">
        <p>
          A&A Cleaning Services is committed to ensuring digital accessibility for
          people with disabilities. We are continually improving the user experience
          for everyone and applying relevant accessibility standards.
        </p>
        <h2>Standards</h2>
        <p>
          We aim to conform to WCAG 2.1 Level AA guidelines. These guidelines explain
          how to make web content more accessible to people with a wide array of
          disabilities.
        </p>
        <h2>Feedback</h2>
        <p>
          If you encounter any accessibility barriers on our site, please contact us
          at <a href="mailto:info@aacleaningaustin.com">info@aacleaningaustin.com</a>{" "}
          or call <a href="tel:+15125551234">(512) 555-1234</a>.
        </p>
      </div>
    </main>
  );
}
```

---

## 14. Deployment & Monitoring

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "crons": [],
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### Environment Variables Checklist

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxx         # Email delivery
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX         # Google Analytics 4
OPENAI_API_KEY=sk-xxxxxxxxxxxx         # AI Assistant (if using OpenAI)
RATE_LIMIT_SECRET=xxxxx                # Optional rate limit signing

# .env.production (set in Vercel dashboard, never committed)
# Same keys with production values
```

### Monitoring Checklist

| Tool | Purpose | Cost |
|---|---|---|
| **Vercel Analytics** | Core Web Vitals, real user monitoring | Free (with Vercel) |
| **Vercel Speed Insights** | Performance score tracking | Free tier |
| **Google Search Console** | SEO monitoring, crawl errors | Free |
| **UptimeRobot** | Uptime monitoring + alerts | Free (50 monitors) |
| **Sentry** (optional) | Error tracking | Free (5K events/mo) |

### Sentry Setup (Optional but Valuable)

```bash
npx @sentry/wizard@latest -i nextjs
```

```ts
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // Only sample 10% of transactions
  environment: process.env.NODE_ENV,
  // Don't track analytics errors
  beforeSend(event) {
    if (event.exception?.values?.some((v) => v.type === "ChunkLoadError")) {
      return null; // Ignore chunk load errors from deployments
    }
    return event;
  },
});
```

### Pre-Deployment Checklist

```markdown
## Before Every Deploy

- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` passes
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] All images are self-hosted (no external URLs)
- [ ] Environment variables are set in Vercel
- [ ] Test on mobile (Chrome DevTools responsive mode)
- [ ] Test with keyboard-only navigation
- [ ] Run Lighthouse (target: 90+ on all categories)
- [ ] Check all links work (no 404s)
- [ ] Form submission works (test with real submission)
- [ ] Phone number links work on mobile
- [ ] Analytics events are firing (check GA4 real-time)
```

---

## 15. Codex 5.3 Prompt Blueprint

Here's the exact prompt structure to feed into Codex for implementing these changes systematically.

### Master Context Prompt (Feed This First)

```
You are upgrading a Next.js 14+ App Router website for A&A Cleaning Services, 
a post-construction and commercial cleaning company in Austin, TX. 

The codebase uses:
- Next.js App Router with TypeScript
- Tailwind CSS 3.4+
- next/image for all images
- A custom design system documented in globals.css

Key constraints:
1. Use Server Components by default. Only add "use client" when the component 
   needs hooks, event handlers, or browser APIs.
2. All colors must use brand tokens (brand-dark, brand-darker, brand-blue, 
   brand-gold, brand-cream, etc.) defined in tailwind.config.ts — never raw hex.
3. All animations must respect `motion-reduce:` via Tailwind's built-in variant.
4. All images must be self-hosted in /public/images/ with descriptive alt text.
5. All lists of chips/tags must use semantic <ul>/<li> with aria-label.
6. All <section> elements must have aria-labelledby pointing to their heading id.
7. All forms must use Zod validation, honeypot spam protection, and the shared 
   useQuoteForm hook.
8. Follow the file structure in /data/ for content, /hooks/ for logic, 
   /components/ui/ for shared primitives.
```

### Task Prompts (Feed These One at a Time)

```
TASK 1: TAILWIND CONFIG + DESIGN SYSTEM

Create the complete tailwind.config.ts with:
- Brand color tokens (dark, darker, navy, blue, blue-hover, gold, gold-dark, cream, warm, shell)
- Custom animations (heroFadeUp, heroKenBurns, heroBounce, slideInRight, dotBounce)
- Custom shadows (card, card-hover, panel, float, footer, mobile-bar)
- Custom border radius (card: 1.75rem, card-inner: 1.4rem, pill: 9999px)
- Font family variables (--font-serif, --font-sans)

Then create the globals.css with documented @layer components for:
section-kicker, info-chip, info-chip-dark, cta-primary, cta-outline-dark, 
cta-gold, cta-light, surface-panel, surface-panel-soft, dark-surface-panel,
signal-line, icon-tile

Include global focus-visible styles and prefers-reduced-motion safety net.
```

```
TASK 2: SHARED HOOKS

Create these hooks in /hooks/:
1. useInViewOnce.ts — IntersectionObserver that fires once (existing, just clean up)
2. useQuoteForm.ts — Shared form state, Zod validation, submit logic, analytics tracking
3. useScrolled.ts — Throttled scroll position detection with rAF
4. useScrollLock.ts — Body scroll lock for modals
5. usePrefersReducedMotion.ts — Detects prefers-reduced-motion media query

Also create /lib/schemas.ts with Zod schema for quote requests.
Export SERVICE_OPTIONS and TIMELINE_OPTIONS from useQuoteForm.
Export formatPhoneInput from useQuoteForm.
```

```
TASK 3: SHARED UI COMPONENTS

Create these in /components/ui/:
1. AnimateOnView.tsx — Wraps children with useInViewOnce + fade animation
2. Chip.tsx — Single chip (light/dark variant)
3. ChipList.tsx — <ul>/<li> wrapper for chips with aria-label
4. SectionHeader.tsx — Reusable section kicker + heading + description
5. FeedbackMessage.tsx — Success/error feedback with colors + aria-live
6. FloatingLabel.tsx — Form label component with proper positioning
7. StarRating.tsx — Accessible star display with aria-label
8. MenuIcon.tsx — SVG hamburger/close toggle
9. Chevron.tsx — Animated chevron for dropdowns

Each component must:
- Accept className prop for extension
- Use cn() utility for class merging
- Include JSDoc comment explaining usage
- Use brand tokens, never raw hex
```

```


```
TASK 4: DATA LAYER

Move all inline data arrays to /data/:

1. services.ts — All 5 service definitions with self-hosted image paths + descriptive alt text
2. industries.ts — All 3 industry blocks with accentColor keys (not Tailwind classes)
3. testimonials.ts — All 4 testimonials (flag as placeholder until real ones are collected)
4. service-area.ts — Major cities, supporting cities, map markers
5. navigation.ts — serviceLinks, industryLinks, primaryLinks, footerLinks
6. timeline-steps.ts — All 4 process steps with self-hosted image paths

Each file must:
- Export a typed readonly array using `as const` or explicit interface
- Include an `id` field on every item for stable React keys
- Never include Tailwind classes in the data (map those in components)
- Include JSDoc describing the data shape
```

```
TASK 5: SEO + STRUCTURED DATA

1. Create app/layout.tsx with:
   - Complete Metadata export (title template, description, keywords, openGraph, twitter, robots)
   - Google font loading via next/font/google (Playfair_Display + Inter)
   - Viewport export with themeColor
   - LocalBusinessSchema component in <head>
   - FAQSchema component in <head>
   - GoogleAnalytics component (conditional on NEXT_PUBLIC_GA_ID)

2. Create app/sitemap.ts — dynamic sitemap
3. Create app/robots.ts — robots.txt
4. Create app/not-found.tsx — branded 404 page
5. Create components/StructuredData.tsx with LocalBusinessSchema + FAQSchema

Use real CleaningService schema type. Include areaServed for all 8 cities.
Include hasOfferCatalog with all 5 services.
```

```
TASK 6: REFACTOR SECTIONS TO SERVER COMPONENTS

Convert these sections from "use client" to Server Components that 
wrap animated parts with <AnimateOnView>:

1. AboutSection — static content, wrap with AnimateOnView
2. CareersSection — static content + Link, wrap with AnimateOnView
3. ServiceAreaSection — city lists are static, MetroMap stays client
4. FooterSection — almost entirely static; extract only the onOpenQuote 
   button as a tiny client component

For each conversion:
- Remove "use client" directive
- Import AnimateOnView for animated sections
- Keep the exact same visual output
- Ensure all images use next/image with self-hosted paths
```

```
TASK 7: FORMS CONSOLIDATION

1. Refactor FloatingQuotePanel to use useQuoteForm hook
   - Add triggerRef prop for focus restoration
   - Add useScrollLock
   - Return null when closed (remove from DOM)
   - Add honeypot + timing-based spam protection
   - Add proper close button with aria-label + SVG icon
   - Typed feedback with success/error color distinction

2. Refactor QuoteSection to use useQuoteForm hook
   - Replace CSS backgroundImage with next/image
   - Add type="tel" + inputMode="tel" on phone
   - Add aria-required on required fields
   - Share SERVICE_OPTIONS and TIMELINE_OPTIONS from hook

3. Create shared QuoteFormFields component if the field layout 
   is identical enough between the two forms

4. Create app/api/quote-request/route.ts with:
   - Zod validation
   - Honeypot check
   - Rate limiting
   - Resend email delivery
   - Proper error responses
```

```
TASK 8: HEADER + MOBILE NAV REFACTOR

Refactor PublicHeader:
1. Add skip-nav link as first element
2. Extract DesktopDropdown component (DRY — used for both Services and Industries)
3. Extract MobileAccordion component (replaces <details>)
4. Replace ☰ and × with SVG MenuIcon component
5. Add <nav aria-label="Main navigation"> on desktop
6. Add role="dialog" aria-modal on mobile panel
7. Add aria-controls on dropdown trigger buttons
8. Use useScrolled hook instead of inline scroll listener
9. Use <Link> throughout (not raw <a> for hash navigation)
10. Drive both desktop and mobile from shared DROPDOWNS data array
```

```
TASK 9: REMAINING COMPONENT UPGRADES

1. AuthorityBar:
   - Use requestAnimationFrame for count-up (replace setInterval)
   - Add usePrefersReducedMotion — skip animation
   - Reuse useInViewOnce instead of manual observer
   - Add aria-label on star rating
   - Extract DIVIDER_CLASSES constant

2. BeforeAfterSlider:
   - Extract ComparisonSlider sub-component
   - Extract PairInfoPanel sub-component
   - Fix drag listener leak (use document-level with isDragging ref)
   - Add aria-valuetext on slider
   - Add "Drag or use arrow keys" instruction
   - Add descriptive beforeAlt/afterAlt per pair
   - Remove unnecessary useMemo

3. TestimonialSection:
   - Add aria-roledescription="carousel"
   - Add aria-label on navigation dots
   - Pause on focus (already done)
   - Add motion-reduce guard on word-by-word animation

4. TimelineSection:
   - Add aria-labelledby on section
   - Self-host images
   - Add motion-reduce guards

5. HeroSection:
   - Move keyframes to tailwind.config.ts (remove <style jsx global>)
   - Fix "Se Habla Español" accent
   - Use brand tokens throughout
   - Add motion-reduce on all animations
```

```
TASK 10: LEGAL PAGES + COOKIE CONSENT

1. Create app/privacy/page.tsx — Privacy policy covering:
   - Data collected via forms
   - Google Analytics usage
   - No data selling
   - Contact information

2. Create app/accessibility/page.tsx — ADA compliance statement

3. Create components/CookieConsent.tsx:
   - Shows after 3s delay on first visit
   - Stores consent in localStorage
   - Accept + Dismiss buttons
   - Links to privacy policy
   - Does not block interaction

4. Add Privacy Policy, Accessibility, and Terms links to footer navigation
```

```
TASK 11: PERFORMANCE PASS

1. Add placeholder="blur" with blurDataURL to all next/image instances
2. Use dynamic() imports for below-fold heavy components:
   - BeforeAfterSlider
   - AIQuoteAssistant (ssr: false)
   - TestimonialSection
   - TimelineSection
3. Add loading.tsx skeleton for route transitions
4. Ensure only hero image has priority={true}
5. Add Cache-Control headers for /images/* in next.config.ts
6. Verify no layout shift by setting explicit sizes on all images
```

```
TASK 12: TESTING SETUP

1. Install and configure Vitest + React Testing Library
2. Write tests for:
   - useQuoteForm hook (init, field update, validation, submit)
   - quoteRequestSchema (valid data, invalid phone, empty name)
   - formatPhoneInput (edge cases)
   - ChipList component (renders items, aria-label)
   - FeedbackMessage component (success/error variants)
3. Install and configure Playwright
4. Write E2E tests for:
   - Quote form submission flow
   - Mobile sticky bar visibility
   - Keyboard navigation through header
   - Phone link clicks on mobile viewport
```

---

## 16. Priority Execution Order

### Phase 1: Foundation (Do First — Everything Else Depends on This)

| # | Task | Time | Impact |
|---|---|---|---|
| 1 | Tailwind config + globals.css design system | 2 hrs | Every component references this |
| 2 | Shared hooks (useQuoteForm, useScrolled, etc.) | 2 hrs | Forms + header depend on this |
| 3 | Shared UI components (Chip, ChipList, etc.) | 2 hrs | Every section uses these |
| 4 | Data layer (/data/ files) | 1.5 hrs | Components consume this |
| 5 | `cn()` utility in lib/utils.ts | 5 min | Every component uses this |

### Phase 2: SEO & Business Impact (Highest ROI)

| # | Task | Time | Impact |
|---|---|---|---|
| 6 | Self-host all images | 1 hr | Fixes reliability + enables optimization |
| 7 | SEO metadata + structured data + sitemap | 2 hrs | **Directly drives revenue** via Google |
| 8 | Google Business Profile setup | 1 hr | **#1 local search factor** |
| 9 | Privacy policy + accessibility page | 1 hr | Legal protection |
| 10 | Form validation (Zod) + spam protection | 1.5 hrs | Prevents garbage leads |

### Phase 3: Performance & Accessibility

| # | Task | Time | Impact |
|---|---|---|---|
| 11 | Convert static sections to Server Components | 3 hrs | Halves JS bundle size |
| 12 | `placeholder="blur"` on all images | 30 min | Eliminates layout shift |
| 13 | Lazy load below-fold sections | 1 hr | Faster initial load |
| 14 | Focus styles + skip-nav + aria-labelledby | 2 hrs | WCAG compliance |
| 15 | `prefers-reduced-motion` on all animations | 1 hr | Accessibility requirement |

### Phase 4: Component Refactors

| # | Task | Time | Impact |
|---|---|---|---|
| 16 | Header refactor (skip-nav, DRY dropdowns, proper mobile) | 2.5 hrs | Navigation is the #1 UX surface |
| 17 | Forms consolidation (shared QuoteForm) | 2 hrs | Eliminates 80+ lines duplication |
| 18 | FloatingQuotePanel (scroll lock, focus restore, remove from DOM) | 1.5 hrs | Critical conversion surface |
| 19 | BeforeAfterSlider (extract components, fix drag leak) | 1.5 hrs | High-visual-impact section |
| 20 | AuthorityBar (rAF counters, reduced motion) | 1 hr | Polish |
| 21 | TestimonialSection (carousel a11y) | 1 hr | Polish |
| 22 | HeroSection (remove style jsx global) | 1 hr | Cleanest entry point |

### Phase 5: Polish & Monitoring

| # | Task | Time | Impact |
|---|---|---|---|
| 23 | Google Analytics 4 setup | 30 min | Track conversions |
| 24 | Cookie consent banner | 30 min | Legal compliance |
| 25 | 404 page + error boundary | 30 min | Professional impression |
| 26 | Scroll-to-top button | 15 min | UX convenience |
| 27 | Replace placeholder testimonials with real ones | — | **Trust** |
| 28 | Replace stock photos with real job site photos | — | **Trust** |

### Phase 6: Future Growth

| # | Task | Time | Impact |
|---|---|---|---|
| 29 | Individual service landing pages | 4 hrs each | **SEO growth engine** |
| 30 | Service area landing pages | 3 hrs each | Local SEO for each city |
| 31 | Blog setup | 4 hrs | Long-tail keyword capture |
| 32 | Testing suite (Vitest + Playwright) | 4 hrs | Confidence for future changes |
| 33 | Sentry error monitoring | 30 min | Catch issues before users report them |

---

## Final Audit Pass — Items Not Covered Above

### 1. `VariantAPublicPage` Issues

This is the page orchestrator and it has several problems:

```tsx
// CURRENT PROBLEMS:

// 1. Double scroll lock — page sets body.overflow AND FloatingQuotePanel sets it
// FIX: Remove the useEffect from VariantAPublicPage entirely. 
// Let FloatingQuotePanel own its own scroll lock via useScrollLock.

// 2. Mobile sticky bar has no safe-area handling for notched phones
// CURRENT (fragile):
style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
// FIX: Move to Tailwind with a custom utility or use pb-safe plugin

// 3. Main content has no bottom padding — mobile sticky bar covers content
// FIX: Add className="pb-24 md:pb-0" to <main>

// 4. No ErrorBoundary wrapping
// FIX: Create app/error.tsx

// 5. No loading state between route transitions
// FIX: Create app/loading.tsx

// 6. FloatingQuotePanel has no triggerRef for focus restoration
// FIX: Create a ref, pass it to FloatingQuotePanel
```

Fixed version:

```tsx
// app/page.tsx (Server Component)
import { HomePageClient } from "@/components/HomePageClient";

// This is a Server Component shell
export default function HomePage() {
  return <HomePageClient />;
}
```

```tsx
// components/HomePageClient.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";
import { useScrollDepth } from "@/hooks/useScrollDepth";

// ... all section imports

export function HomePageClient() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const quoteButtonRef = useRef<HTMLButtonElement>(null);

  useScrollDepth(); // Track engagement

  const openQuote = useCallback(() => {
    void trackConversionEvent({ eventName: "quote_open_clicked", source: "public_page" });
    setIsQuoteOpen(true);
  }, []);

  const closeQuote = useCallback(() => {
    setIsQuoteOpen(false);
  }, []);

  return (
    <main className="pb-24 md:pb-0">
      <PublicHeader onOpenQuote={openQuote} />
      <HeroSection onOpenQuote={openQuote} />
      <AuthorityBar />
      <ServiceSpreadSection onOpenQuote={openQuote} />
      <OfferAndIndustrySection onOpenQuote={openQuote} />
      <BeforeAfterSlider />
      <TestimonialSection />
      <TimelineSection />
      <AboutSection />
      <ServiceAreaSection />
      <QuoteSection onOpenQuote={openQuote} />
      <CareersSection />
      <FooterSection onOpenQuote={openQuote} />

      <FloatingQuotePanel
        isOpen={isQuoteOpen}
        onClose={closeQuote}
        triggerRef={quoteButtonRef}
      />
      <AIQuoteAssistant />

      {/* Mobile Sticky Bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-slate-200/50 bg-white/95 p-4 shadow-mobile-bar backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)" }}
      >
        <a
          href={`tel:${COMPANY_PHONE_E164}`}
          onClick={() => {
            void trackConversionEvent({ eventName: "call_click", source: "mobile_sticky" });
          }}
          className="cta-outline-dark flex-1 py-3.5 text-center"
        >
          Call
        </a>
        <button
          ref={quoteButtonRef}
          type="button"
          onClick={openQuote}
          className="cta-primary flex-1 py-3.5 press-effect"
        >
          Get a Quote
        </button>
      </div>
    </main>
  );
}
```

### 2. `useInViewOnce` Bug

There's a subtle bug in the current hook:

```tsx
// CURRENT — options is a NEW object every render, causing the 
// useEffect to re-run constantly
const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold: 0.2 });
//                                                     ^^^^^^^^^^^^^^^^
//                                        New object reference every render!

// The hook has `options` in its dependency array:
useEffect(() => {
  // ...
}, [isVisible, options]); // ← options changes every render = observer recreated every render
```

**Fix:**

```tsx
// hooks/useInViewOnce.ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>(
  threshold = 0.25,
  rootMargin = "0px"
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, threshold, rootMargin]); // Primitives — stable references

  return { ref, isVisible };
}

// Usage:
const { ref, isVisible } = useInViewOnce<HTMLElement>(0.2);
// No object allocation on every render!
```

### 3. Missing Error Boundary

```tsx
// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 text-center">
      <p className="section-kicker mb-4">Something Went Wrong</p>
      <h1 className="font-serif text-5xl tracking-tight text-brand-dark">
        Unexpected Error
      </h1>
      <p className="mt-6 max-w-md text-lg font-light text-slate-600">
        We apologize for the inconvenience. Please try refreshing the page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="cta-primary mt-10"
      >
        Try Again
      </button>
    </main>
  );
}
```

### 4. Loading State

```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
```

### 5. The One Thing That Will Matter Most

Everything above is technical. But here's the truth about a local service business website:

> **Real photos and real testimonials will outperform every technical optimization combined.**

| Stock Photo Site | Real Photo Site |
|---|---|
| Looks polished but generic | Looks authentic and trustworthy |
| Users assume it's a template | Users believe this is a real business |
| Google can detect stock photos | Google indexes unique images higher |
| No emotional connection | "That's a real crew, real job site" |

**Action Plan for Real Content:**

1. Next 3 job sites — take 5 before photos and 5 after photos each (phone is fine)
2. Ask 3 existing clients for a 2-sentence testimonial + permission to use their name/company
3. Take one team photo (even casual) for the About section
4. Take one photo of a branded vehicle/uniform/equipment if applicable
5. Write 3 paragraphs about how your mom actually started A&A — the real story

This content, combined with the technical foundation above, will create a site that is **genuinely exceptional** for a local service business — not just well-coded, but **effective at generating leads**.

---

## Summary: What "Exceptional" Looks Like

| Dimension | Current | After This Bible |
|---|---|---|
| **Lighthouse Performance** | ~65-75 | 90+ |
| **Lighthouse Accessibility** | ~70 | 95+ |
| **Lighthouse SEO** | ~80 | 100 |
| **JS Bundle Size** | Everything client-rendered | ~40% reduction via server components |
| **Image Loading** | External, no optimization | Self-hosted, AVIF/WebP, blur placeholders |
| **Form Spam** | Zero protection | Honeypot + timing + rate limiting + Zod |
| **Local SEO** | No structured data | Full JSON-LD + sitemap + Google Business |
| **Legal** | No privacy policy | Privacy + accessibility + cookie consent |
| **Code Duplication** | ~200+ lines duplicated | Shared hooks + components eliminate ~80% |
| **Real Content** | Stock photos + placeholder testimonials | Real crew photos + real client quotes |
| **Conversion Tracking** | Basic | Full funnel: open → submit → call |
| **Error Handling** | Silent failures | Error boundaries + Sentry + console.error |

Feed the Codex prompts in order. Execute the priority phases in sequence. The result will be a website that doesn't just look premium — it **performs** like one.