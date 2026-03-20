

You're right on all three points. Here's the correction addendum:

---

## Addendum: Corrections to Final Report

**Date:** Post-review update based on additional files provided

### 1. ❌ "No `robots.txt` or `sitemap.xml` visible" → **CORRECTED**

Both exist as Next.js App Router metadata files:
- `robots.ts` — Generates proper `robots.txt` with universal allow and sitemap reference
- `sitemap.ts` — Generates `sitemap.xml` covering `/`, `/about`, `/services`, `/careers`

**Updated SEO assessment:** The sitemap is functional but minimal. It only covers 4 static routes and uses `new Date()` for `lastModified` on every build (meaning search engines can't detect actual content changes). This is a minor issue — the existence of both files is solid.

### 2. ❌ UX Critiques for ServiceAreaSection → **UNCHANGED**

After comparing the originally reviewed `ServiceAreaSection` with the "upgraded" version provided, **the code is identical**. The same component was sent in both batches. All original observations (schematic map positioning, hover synchronization, etc.) remain accurate. No corrections needed.

### 3. ❌ UX Critiques for BeforeAfterSlider → **UNCHANGED**

Same situation — the "upgraded" `BeforeAfterSlider` code is identical to the version in the original report. All critiques (width-based clipping, global event listeners, auto-demo animation, keyboard support) remain accurate.

### 4. ❌ UX Critiques for CareersSection → **UNCHANGED**

Same — the `CareersSection` code is identical across both batches. The concerns about unverifiable claims ("4.8★ Glassdoor Rating", "20+ Team Members") and the overall assessment remain accurate.

### Summary of Report Validity

| Original Claim | Status |
|---|---|
| "No robots.txt or sitemap.xml" | **Incorrect — both exist. Removed from recommendations.** |
| ServiceAreaSection critiques | Unchanged — code is identical |
| BeforeAfterSlider critiques | Unchanged — code is identical |
| CareersSection critiques | Unchanged — code is identical |
| All other findings | Remain accurate |

**Net impact on scorecard:** SEO rating moves from ★★★☆☆ to ★★★¼☆ (minor bump for robots/sitemap existence). All other ratings unchanged.

---

Now let's work through the highest-impact improvements in order.

---

## Improvement #1: Server Component Refactoring (Highest Impact)

**Impact:** Performance (LCP, FCP, TTI) + SEO (crawlable content) + Bundle size
**Estimated improvement:** LCP reduction of 1-2 seconds, 30-50% JS bundle reduction, immediate full-text indexability

This is by far the single most impactful change. The entire page is client-rendered despite most content being static text and images.

### Strategy

The challenge is the `onOpenQuote` callback that threads through every section. We solve this with a lightweight React context so that static sections can be Server Components while only the interactive parts (buttons, animations) are Client Components.

### File 1: Quote Context (New File)

**`src/components/public/variant-a/QuoteContext.tsx`**

```tsx
"use client";

import { createContext, useContext } from "react";

type QuoteContextValue = {
  openQuote: () => void;
};

export const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuoteAction() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error("useQuoteAction must be used within a QuoteProvider");
  }
  return ctx.openQuote;
}
```

### File 2: Quote-Aware CTA Button (New File)

This is a thin client component that any Server Component can render for CTA buttons:

**`src/components/public/variant-a/QuoteCTA.tsx`**

```tsx
"use client";

import { useQuoteAction } from "./QuoteContext";

type QuoteCTAProps = {
  children: React.ReactNode;
  className?: string;
};

export function QuoteCTA({ children, className }: QuoteCTAProps) {
  const openQuote = useQuoteAction();

  return (
    <button type="button" onClick={openQuote} className={className}>
      {children}
    </button>
  );
}
```

### File 3: Scroll Animation Wrapper (New File)

This extracts the `useInViewOnce` animation pattern into a reusable client wrapper, so the content inside can remain server-rendered:

**`src/components/public/variant-a/ScrollReveal.tsx`**

```tsx
"use client";

import { useInViewOnce } from "./useInViewOnce";

type ScrollRevealProps = {
  children: React.ReactNode;
  as?: "section" | "div" | "article";
  id?: string;
  className?: string;
  visibleClassName?: string;
  hiddenClassName?: string;
  threshold?: number;
  "aria-labelledby"?: string;
};

export function ScrollReveal({
  children,
  as: Tag = "div",
  id,
  className = "",
  visibleClassName = "translate-y-0 opacity-100",
  hiddenClassName = "translate-y-10 opacity-0",
  threshold = 0.15,
  ...rest
}: ScrollRevealProps) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>({ threshold });

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      id={id}
      className={`transition-all duration-700 ease-out ${className} ${isVisible ? visibleClassName : hiddenClassName}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```

### File 4: Refactored VariantAPublicPage

**`src/components/public/variant-a/VariantAPublicPage.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

import { QuoteContext } from "./QuoteContext";
import { AIQuoteAssistant } from "./AIQuoteAssistant";
import { FloatingQuotePanel } from "./FloatingQuotePanel";
import { PublicHeader } from "./PublicHeader";
import { ScrollToTopButton } from "./ScrollToTopButton";
import { trackConversionEvent } from "@/lib/analytics";
import { COMPANY_PHONE_E164 } from "@/lib/company";

// These remain "use client" because they have significant internal state:
import { HeroSection } from "./HeroSection";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { TestimonialSection } from "./TestimonialSection";
import { QuoteSection } from "./QuoteSection";

// These can become Server Components once refactored:
import { AuthorityBar } from "./AuthorityBar";
import { ServiceSpreadSection } from "./ServiceSpreadSection";
import { OfferAndIndustrySection } from "./OfferAndIndustrySection";
import { TimelineSection } from "./TimelineSection";
import { AboutSection } from "./AboutSection";
import { ServiceAreaSection } from "./ServiceAreaSection";
import { CareersSection } from "./CareersSection";
import { FooterSection } from "./FooterSection";

export function VariantAPublicPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isQuoteOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isQuoteOpen]);

  const openQuote = () => {
    void trackConversionEvent({ eventName: "quote_open_clicked", source: "public_page" });
    setIsQuoteOpen(true);
  };
  const closeQuote = () => setIsQuoteOpen(false);

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      <main className="pb-24 md:pb-0">
        <PublicHeader onOpenQuote={openQuote} />
        <HeroSection onOpenQuote={openQuote} />
        <AuthorityBar />
        <ServiceSpreadSection onOpenQuote={openQuote} />
        <OfferAndIndustrySection onOpenQuote={openQuote} />
        <BeforeAfterSlider />
        <TestimonialSection />
        <TimelineSection />
        <AboutSection onOpenQuote={openQuote} />
        <ServiceAreaSection onOpenQuote={openQuote} />
        <QuoteSection onOpenQuote={openQuote} />
        <CareersSection />
        <FooterSection onOpenQuote={openQuote} />

        <FloatingQuotePanel isOpen={isQuoteOpen} onClose={closeQuote} />
        <AIQuoteAssistant />
        <ScrollToTopButton />

        <div
          className="fixed bottom-0 left-0 z-40 flex w-full gap-3 border-t border-slate-200/50 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:hidden"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
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
            type="button"
            onClick={openQuote}
            className="cta-primary flex-1 py-3.5 active:bg-[#1e293b]"
          >
            Get a Quote
          </button>
        </div>
      </main>
    </QuoteContext.Provider>
  );
}
```

**Note:** This file stays as `"use client"` because it manages the quote panel state. The key change is the `QuoteContext.Provider` wrapper. The next step is progressively converting child sections — starting with the ones that have the most static content.

### Codex Prompt for Progressive Conversion

Use this prompt to have Codex convert individual sections. Start with `FooterSection` and `CareersSection` as they're simplest:

> **Codex prompt:**
> Refactor `CareersSection` to remove `"use client"`. Extract any interactive elements (scroll animations, click handlers) into thin Client Component wrappers imported from existing files (`ScrollReveal` for animations, `QuoteCTA` for buttons). The section's static text, images, and layout should render as a Server Component. Import `QuoteCTA` from `./QuoteCTA` and `ScrollReveal` from `./ScrollReveal`. Remove the `onOpenQuote` prop — use `QuoteCTA` instead. Keep all existing CSS classes, ARIA attributes, and visual behavior identical.

---

## Improvement #2: Rate Limiting on API Routes

**Impact:** Security — prevents SMS bombing, database flooding, cost explosion
**Effort:** Low

### File: Rate Limiting Middleware (New File)

**`src/lib/rate-limit.ts`**

```ts
type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

type RateLimitOptions = {
  windowMs?: number;
  max?: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { windowMs = 3_600_000, max = 5 } = options;
  const now = Date.now();

  cleanup();

  const existing = store.get(key);

  if (!existing || now > existing.resetAt) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, remaining: max - 1, resetAt: entry.resetAt };
  }

  existing.count += 1;

  if (existing.count > max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  return {
    allowed: true,
    remaining: max - existing.count,
    resetAt: existing.resetAt,
  };
}
```

### File: Updated Quote Request API

**`src/app/api/quote-request/route.ts`** — add these lines at the top of the `POST` handler:

```ts
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { dispatchSmsWithQuietHours, sendSms } from "@/lib/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

type QuoteRequestBody = {
  name?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  description?: string;
  timeline?: string;
  website?: string; // honeypot field
};

export async function POST(request: Request) {
  // --- Rate limiting ---
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`quote:${ip}`, { windowMs: 3_600_000, max: 5 });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: QuoteRequestBody;

  try {
    body = (await request.json()) as QuoteRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // --- Honeypot check ---
  if (body.website) {
    // Bot filled the hidden field — silently accept to avoid detection
    return NextResponse.json({ success: true, leadId: "ok" }, { status: 201 });
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  // --- Phone validation ---
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return NextResponse.json({ error: "Please provide a valid 10-digit phone number." }, { status: 400 });
  }

  // --- Sanitize for SMS/email ---
  const sanitize = (str: string) => str.replace(/[<>&"']/g, "");
  const safeName = sanitize(name);
  const safeCompany = sanitize(body.companyName?.trim() || "Unknown company");
  const safeServiceType = sanitize(body.serviceType?.trim() || "General inquiry");

  try {
    const supabase = createAdminClient();

    const { data: insertedLead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name,
        company_name: body.companyName?.trim() || null,
        phone,
        email: body.email?.trim() || null,
        service_type: body.serviceType?.trim() || null,
        timeline: body.timeline?.trim() || null,
        description: body.description?.trim() || null,
        source: "website_form",
      })
      .select("id, name, company_name, phone, service_type")
      .single();

    if (insertError || !insertedLead) {
      return NextResponse.json({ error: insertError?.message ?? "Unable to create lead." }, { status: 500 });
    }

    const { data: adminProfiles } = await supabase
      .from("profiles")
      .select("id, phone, notification_preferences")
      .eq("role", "admin")
      .order("created_at", { ascending: true })
      .limit(1);

    const adminProfile = adminProfiles?.[0] ?? null;
    const adminAlertPhone = process.env.ADMIN_ALERT_PHONE || adminProfile?.phone;

    if (adminAlertPhone) {
      const message = `New lead: ${safeName} from ${safeCompany}. ${safeServiceType}. Call ${phone}.`;

      const smsResult = await dispatchSmsWithQuietHours({
        supabase,
        to: adminAlertPhone,
        body: message,
        profileId: adminProfile?.id,
        preferences: (adminProfile?.notification_preferences as Record<string, unknown> | null) ?? null,
        queuedReason: "lead_alert_quiet_hours",
        context: {
          type: "lead_alert",
          leadId: insertedLead.id,
        },
      });

      if (!smsResult.sent && !smsResult.queued) {
        console.warn("Lead created, but SMS alert failed:", smsResult.error);
      }
    }

    const leadAckText =
      "Thanks for contacting A&A Cleaning. We received your quote request and will call you within the hour during business hours.";
    const leadAckSms = await sendSms(phone, leadAckText);
    if (!leadAckSms.sent) {
      console.warn("Lead acknowledgment SMS failed:", leadAckSms.error);
    }

    const recipientEmail = body.email?.trim();
    if (recipientEmail && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: [recipientEmail],
          subject: "A&A Cleaning quote request received",
          html: `
            <p>Hi ${safeName},</p>
            <p>Thanks for requesting a quote from A&amp;A Cleaning.</p>
            <p>We will call you within the hour during business hours to confirm scope and next steps.</p>
            <p><strong>Request summary:</strong> ${safeServiceType}</p>
            <p>Best,<br />A&amp;A Cleaning</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.warn("Lead acknowledgment email failed:", errorText);
      }
    }

    return NextResponse.json({ success: true, leadId: insertedLead.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
```

### Codex Prompt for Honeypot Field in Forms

> **Codex prompt:**
> Add a honeypot anti-spam field to both `QuoteSection` and `FloatingQuotePanel`. Add a hidden input field with `name="website"`, `type="text"`, `tabIndex={-1}`, `autoComplete="off"`, and `className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"` with an associated `aria-hidden="true"` wrapper. Track its value in state as `website` and include it in the JSON body sent to `/api/quote-request`. Do NOT add a visible label. The field should be invisible to humans but fillable by bots.

---

## Improvement #3: Fix `useInViewOnce` Options Instability

**Impact:** Reliability — prevents unnecessary IntersectionObserver recreation on every render
**Effort:** Very low

**`src/components/public/variant-a/useInViewOnce.ts`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>(threshold: number = 0.25) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { threshold },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, threshold]);

  return { ref, isVisible };
}
```

### Codex Prompt for Call Site Updates

> **Codex prompt:**
> Update all call sites of `useInViewOnce` across the codebase. The hook signature changed from `useInViewOnce<T>(options?: IntersectionObserverInit)` to `useInViewOnce<T>(threshold?: number)`. Replace every instance of `useInViewOnce<HTMLElement>({ threshold: 0.15 })` with `useInViewOnce<HTMLElement>(0.15)`, `useInViewOnce<HTMLElement>({ threshold: 0.2 })` with `useInViewOnce<HTMLElement>(0.2)`, `useInViewOnce<HTMLElement>({ threshold: 0.25 })` with `useInViewOnce<HTMLElement>(0.25)`, and `useInViewOnce<HTMLElement>({ threshold: 0.35 })` with `useInViewOnce<HTMLElement>(0.35)`. Also update `useInViewOnce<HTMLDivElement>({ threshold: 0.25 })` to `useInViewOnce<HTMLDivElement>(0.25)`. Files to check: `AboutSection.tsx`, `AuthorityBar.tsx`, `BeforeAfterSlider.tsx`, `CareersSection.tsx`, `OfferAndIndustrySection.tsx`, `QuoteSection.tsx`, `ServiceAreaSection.tsx`, `ServiceSpreadSection.tsx` (inside `ServiceSpreadItem`), `TestimonialSection.tsx`, `TimelineSection.tsx` (both the section and `TimelineStep`).

---

## Improvement #4: Extract Shared Quote Form Logic

**Impact:** Code quality — eliminates ~120 lines of duplication, ensures consistent behavior
**Effort:** Medium

**`src/components/public/variant-a/useQuoteForm.ts`**

```tsx
"use client";

import { useState } from "react";
import { trackConversionEvent } from "@/lib/analytics";

type FeedbackState = {
  message: string;
  type: "success" | "error";
};

export function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type UseQuoteFormOptions = {
  source: string;
};

export function useQuoteForm({ source }: UseQuoteFormOptions) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const resetForm = () => {
    setName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
    setServiceType("");
    setTimeline("");
    setDescription("");
    setWebsite("");
  };

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quote-request", {
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
          website,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback({
          message: "Unable to submit right now. Please call us directly.",
          type: "error",
        });
        await trackConversionEvent({
          eventName: "quote_submit_failed",
          source,
          metadata: { message: body?.error || `HTTP ${response.status}` },
        });
        return;
      }

      await trackConversionEvent({
        eventName: "quote_submit_success",
        source,
        metadata: { serviceType },
      });

      setFeedback({
        message: "Submitted. We'll call you within the hour.",
        type: "success",
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields: {
      name,
      companyName,
      phone,
      email,
      serviceType,
      timeline,
      description,
      website,
    },
    setters: {
      setName,
      setCompanyName,
      setPhone: (value: string) => setPhone(formatPhoneInput(value)),
      setEmail,
      setServiceType,
      setTimeline,
      setDescription,
      setWebsite,
    },
    isSubmitting,
    feedback,
    submitLead,
  };
}
```

### Codex Prompt for Form Refactoring

> **Codex prompt:**
> Refactor `FloatingQuotePanel` and `QuoteSection` to use the new `useQuoteForm` hook from `./useQuoteForm`. Remove all duplicate state declarations (`name`, `companyName`, `phone`, `email`, `serviceType`, `timeline`, `description`), the duplicate `formatPhoneInput` function, and the duplicate `submitLead` function. Import `useQuoteForm` and destructure `{ fields, setters, isSubmitting, feedback, submitLead }`. Replace all `value={name}` with `value={fields.name}`, all `onChange={(e) => setName(e.target.value)}` with `onChange={(e) => setters.setName(e.target.value)}`, and the `onSubmit` handler with `(event) => void submitLead(event)`. Use `source: "floating_quote_panel"` for `FloatingQuotePanel` and `source: "quote_section"` for `QuoteSection`. Also add the honeypot field (hidden input for `website`) to both forms. Keep all existing UI, CSS classes, labels, and ARIA attributes identical.

---

## Improvement #5: Color Contrast Fix

**Impact:** Accessibility — fixes WCAG AA failures across the entire site
**Effort:** Low

### Codex Prompt

> **Codex prompt:**
> Across all files in `src/components/public/variant-a/`, make the following Tailwind class replacements for WCAG AA color contrast compliance:
>
> 1. Replace `text-slate-400` with `text-slate-500` in ALL instances where the background is white, `#FAFAF8`, `bg-white`, `bg-[#FAFAF8]`, or `bg-slate-50`. Do NOT change `text-slate-400` when it appears on dark backgrounds (`bg-[#0A1628]`, `bg-[#081120]`, or dark overlays) — those pass contrast.
>
> 2. Replace `text-slate-500` with `text-slate-600` specifically in these contexts: form labels (`text-[10px] uppercase tracking-[0.18em] text-slate-500`), stat labels, and "Avg. response" / "We never share your information" text on light backgrounds.
>
> 3. Do NOT change: `text-slate-400` inside dark sections (footer, service area, careers, testimonials, hero trust bar), `text-slate-500` used for body paragraph text (these are already at acceptable size), or any color that's used on a dark (`bg-[#0A1628]`) background.
>
> Files to check: `AboutSection.tsx`, `AuthorityBar.tsx`, `BeforeAfterSlider.tsx`, `FloatingQuotePanel.tsx`, `FooterSection.tsx`, `OfferAndIndustrySection.tsx`, `QuoteSection.tsx`, `ServiceSpreadSection.tsx`, `TimelineSection.tsx`.

---

## Improvement #6: Fix Mobile Menu `aria-modal`

**Impact:** Accessibility — screen readers won't incorrectly treat the menu as a modal
**Effort:** Very low

In `PublicHeader.tsx`, change the mobile menu panel:

```tsx
// BEFORE:
<div
  id="mobile-nav-panel"
  role="dialog"
  aria-modal="true"
  aria-label="Mobile navigation"

// AFTER:
<div
  id="mobile-nav-panel"
  role="region"
  aria-label="Mobile navigation"
```

This correctly represents it as an expanded region rather than a modal dialog (since there's no focus trap or `inert` on background content).

---

## Improvement #7: Scope Testimonial Keyboard Listeners

**Impact:** Accessibility — prevents arrow keys from rotating testimonials while user is focused elsewhere
**Effort:** Low

In `TestimonialSection.tsx`, replace the global keyboard listener:

```tsx
// BEFORE:
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToTestimonial((active - 1 + testimonials.length) % testimonials.length);
    } else if (e.key === "ArrowRight") {
      goToTestimonial((active + 1) % testimonials.length);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [active, goToTestimonial]);

// AFTER: (remove this entire useEffect — keyboard navigation is already handled
// by the prev/next buttons which are focusable and clickable)
```

The prev/next `<button>` elements already handle click events. Users can `Tab` to them and press `Enter`/`Space`. The global arrow key listener is redundant and potentially harmful. Remove it entirely.

---

## Improvement #8: Move Hero Keyframes to globals.css

**Impact:** Performance — prevents repeated style injection into `<head>`
**Effort:** Very low

Add to **`src/styles/globals.css`** (before the `@layer components` block):

```css
@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroKenBurns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

@keyframes heroBounceSubtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

.hero-bounce-subtle {
  animation: heroBounceSubtle 2s ease-in-out infinite;
}
```

Then remove the entire `<style jsx global>` block from `HeroSection.tsx`.

---



## Improvement #9: Populate Tailwind Config with Design Tokens

**Impact:** Developer experience + consistency — single source of truth, IDE autocomplete, catches typos
**Effort:** Medium (one-time setup, then Codex can migrate references)

**`tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1628",
          light: "#162742",
          overlay: "#081120",
        },
        gold: {
          DEFAULT: "#C9A94E",
          hover: "#d4b85e",
          muted: "#8a6a1c",
        },
        royal: {
          DEFAULT: "#2563EB",
          bright: "#1D4ED8",
          "bright-hover": "#1948ca",
        },
        warm: {
          DEFAULT: "#FAFAF8",
          panel: "#F1F0EE",
        },
        "dark-panel": "#1a2a44",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        micro: ["10px", { lineHeight: "1.4", letterSpacing: "0.22em" }],
        kicker: ["11px", { lineHeight: "1.4", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        kicker: "0.24em",
        wide: "0.18em",
        wider: "0.22em",
        label: "0.20em",
        chips: "0.16em",
      },
      borderRadius: {
        panel: "1.75rem",
        card: "1.5rem",
      },
      boxShadow: {
        "panel-soft": "0 8px 30px rgba(15,23,42,0.08)",
        "panel-dark": "0 24px 80px rgba(2,6,23,0.26)",
        "hero-glow": "0 18px 60px rgba(2,6,23,0.16)",
        "cta-blue": "0 18px 50px rgba(29,78,216,0.35)",
      },
      backgroundImage: {
        "dot-pattern":
          "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        "gold-radial":
          "radial-gradient(circle at top, rgba(201,169,78,0.14), transparent 34%)",
      },
      backgroundSize: {
        dots: "40px 40px",
        "dots-sm": "32px 32px",
        "dots-lg": "48px 48px",
      },
      animation: {
        "fade-up": "heroFadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "ken-burns": "heroKenBurns 15s ease-out forwards",
        "bounce-subtle": "heroBounceSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        heroFadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        heroKenBurns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.05)" },
        },
        heroBounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
    },
  },
  plugins: [],
};
```

Now update **`globals.css`** — remove the duplicate keyframes you moved to globals.css in Improvement #8 since they're now in the Tailwind config, and update CSS custom properties to reference the same values:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-navy: theme("colors.navy.DEFAULT");
  --color-slate: #1E293B;
  --color-royal: theme("colors.royal.DEFAULT");
  --color-gold: theme("colors.gold.DEFAULT");
  --color-warm: theme("colors.warm.panel");
  --color-white: theme("colors.warm.DEFAULT");
}

body {
  @apply bg-warm text-navy antialiased;
}

*:focus-visible {
  outline: 2px solid theme("colors.gold.DEFAULT");
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

@layer components {
  .cta-primary {
    @apply inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition duration-300 hover:bg-navy-light hover:-translate-y-0.5;
  }

  .cta-light {
    @apply inline-flex items-center justify-center rounded-md border border-white/30 bg-white bg-opacity-10 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur transition duration-300 hover:bg-white hover:text-navy hover:-translate-y-0.5;
  }

  .cta-gold {
    @apply inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-xs font-bold uppercase tracking-wide text-navy shadow-sm transition duration-300 hover:bg-gold-hover hover:-translate-y-0.5;
  }

  .cta-outline-dark {
    @apply inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition duration-300 hover:border-navy hover:bg-white hover:text-navy hover:-translate-y-0.5;
  }

  .section-kicker {
    @apply text-micro font-bold uppercase text-royal;
  }

  .surface-panel {
    @apply rounded-2xl border border-slate-200 bg-white shadow-sm;
  }

  .surface-panel-soft {
    @apply rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur;
  }

  .dark-surface-panel {
    @apply rounded-2xl border border-white/10 bg-white bg-opacity-5 shadow-panel-dark backdrop-blur;
  }

  .info-chip {
    @apply inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-micro font-semibold uppercase text-slate-600 backdrop-blur;
  }

  .info-chip-dark {
    @apply inline-flex items-center gap-2 rounded-full border border-white/10 bg-white bg-opacity-10 px-3 py-1.5 text-micro font-semibold uppercase text-slate-100 backdrop-blur;
  }

  .icon-tile {
    @apply inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-navy shadow-sm;
  }

  .signal-line {
    @apply inline-flex items-center gap-3 text-kicker font-semibold uppercase text-slate-500;
  }

  .signal-line::before {
    content: "";
    @apply block h-px w-12 bg-gradient-to-r from-gold via-royal/45 to-transparent;
  }

  .ghost-index {
    @apply pointer-events-none select-none font-serif text-[4.25rem] leading-none tracking-tight text-slate-200/80 md:text-[5.5rem];
  }
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

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

### Codex Prompt for Migrating Arbitrary Values

> **Codex prompt:**
> Across all files in `src/components/public/variant-a/`, migrate hardcoded color references to the new Tailwind config tokens. Make these replacements:
>
> - `text-[#0A1628]` → `text-navy`
> - `bg-[#0A1628]` → `bg-navy`
> - `hover:bg-[#162742]` → `hover:bg-navy-light`
> - `bg-[#081120]` or `bg-[#07101d]` → `bg-navy-overlay` (where used as overlay base)
> - `text-[#C9A94E]` → `text-gold`
> - `bg-[#C9A94E]` → `bg-gold`
> - `hover:bg-[#d4b85e]` or `hover:bg-[#d4b666]` → `hover:bg-gold-hover`
> - `text-[#2563EB]` → `text-royal`
> - `bg-[#2563EB]` → `bg-royal`
> - `bg-[#1D4ED8]` → `bg-royal-bright`
> - `hover:bg-[#1948ca]` → `hover:bg-royal-bright-hover`
> - `bg-[#FAFAF8]` → `bg-warm`
> - `bg-[#1a2a44]` → `bg-dark-panel`
> - `tracking-[0.18em]` → `tracking-wide`
> - `tracking-[0.24em]` → `tracking-kicker`
> - `tracking-[0.22em]` → `tracking-wider`
> - `tracking-[0.20em]` or `tracking-[0.2em]` → `tracking-label`
> - `tracking-[0.16em]` → `tracking-chips`
>
> Do NOT change: colors used inside `style={{}}` JSX attributes (those are for SVG strokes, dynamic backgrounds, etc.), gradient stops that use rgba/transparency variants, or `border-[#C9A94E]/30` type opacity modifiers (keep those as-is since Tailwind handles the opacity correctly with the token).
>
> Also replace `text-[10px]` with `text-micro` and `text-[11px]` with `text-kicker` where they appear alongside uppercase tracking labels/kickers.
>
> Files to update: all `.tsx` files in `src/components/public/variant-a/`.

---

## Improvement #10: Delete Redundant `lib/colors.ts`

**Impact:** Code hygiene — removes a dead/barely-used abstraction now that Tailwind config is the source of truth
**Effort:** Very low

The `COLORS` object is only imported by `AboutSection.tsx`. With the Tailwind config now holding all tokens, this file is redundant.

### Codex Prompt

> **Codex prompt:**
> Delete the file `src/lib/colors.ts`. In `src/components/public/variant-a/AboutSection.tsx`, remove the `import { COLORS } from "../../../lib/colors"` statement. Replace all usages:
>
> - `style={{ color: COLORS.dark }}` → remove the style prop, add `className` `text-navy` instead
> - `style={{ backgroundColor: COLORS.lightNeutral }}` → remove the style prop, add `bg-warm` to className
> - `style={{ borderLeftColor: COLORS.gold }}` → remove the style prop, add `border-l-gold` to className (may need `border-l-[3px] border-gold` pattern)
> - `style={{ backgroundColor: COLORS.gold }}` on the small span → remove style, add `bg-gold`
>
> Verify the component renders identically after changes.

---

## Improvement #11: Error Boundary

**Impact:** Reliability — prevents full-page crash if a single component throws
**Effort:** Low

**`src/components/ui/ErrorBoundary.tsx`**

```tsx
"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center px-6 py-16 text-center">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Something went wrong loading this section.
              </p>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="mt-3 text-xs font-semibold uppercase tracking-wide text-royal transition hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

Now wrap the high-risk interactive components in `VariantAPublicPage.tsx`:

```tsx
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// In the JSX, wrap components that have complex state/interactions:
<ErrorBoundary>
  <BeforeAfterSlider />
</ErrorBoundary>
<ErrorBoundary>
  <TestimonialSection />
</ErrorBoundary>

// The AI assistant especially — it makes API calls and manages sessions:
<ErrorBoundary fallback={null}>
  <AIQuoteAssistant />
</ErrorBoundary>
```

### Codex Prompt

> **Codex prompt:**
> In `src/components/public/variant-a/VariantAPublicPage.tsx`, import `ErrorBoundary` from `@/components/ui/ErrorBoundary`. Wrap the following components with `<ErrorBoundary>`: `BeforeAfterSlider`, `TestimonialSection`, `AIQuoteAssistant`, `QuoteSection`, and `FloatingQuotePanel`. For `AIQuoteAssistant`, use `<ErrorBoundary fallback={null}>` so the page doesn't show a visible error if the chat widget fails. For all others, use the default fallback. Do not wrap static sections like `FooterSection`, `CareersSection`, `AboutSection`, etc.

---

## Improvement #12: BeforeAfterSlider Performance — `clip-path` Instead of `width`

**Impact:** Performance — eliminates layout reflow during drag interaction (60fps improvement)
**Effort:** Low

In `BeforeAfterSlider.tsx`, change the "before" image container from width-based clipping to `clip-path`:

```tsx
// BEFORE:
<div
  className="absolute inset-y-0 left-0 overflow-hidden"
  style={{
    width: `${position}%`,
    transition: isDragging ? "none" : "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
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

// AFTER:
<div
  className="absolute inset-0 overflow-hidden"
  style={{
    clipPath: `inset(0 ${100 - position}% 0 0)`,
    transition: isDragging ? "none" : "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
    WebkitClipPath: `inset(0 ${100 - position}% 0 0)`,
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
```

The key changes:
- Container is now `inset-0` (full size) instead of `inset-y-0 left-0` with dynamic width
- Clipping is done via `clipPath: inset(0 ${100-position}% 0 0)` — this clips from the right
- `clip-path` is GPU-composited and doesn't trigger layout recalculation
- Added `-webkit-clip-path` for Safari compatibility

Also update the slider line's transition to match:

```tsx
// The divider line remains the same — it uses `left` which is also compositor-friendly
// when the element has no layout dependencies (it's absolutely positioned)
```

---

## Improvement #13: Lazy-Load Inactive Before/After Image Pairs

**Impact:** Performance — prevents loading 4 offscreen images on initial render
**Effort:** Low

In `BeforeAfterSlider.tsx`, only render images for the active pair plus preload the next pair on hover:

```tsx
// Add state for preloaded index
const [preloadIndex, setPreloadIndex] = useState<number | null>(null);

// Modify switchSlide to preload on hover instead of click:
// Add to each tab button:
{pairs.map((pair, idx) => (
  <button
    key={pair.tag}
    type="button"
    onClick={() => switchSlide(idx)}
    onMouseEnter={() => setPreloadIndex(idx)}
    className={/* ... existing classes ... */}
  >
    {pair.tag}
  </button>
))}

// Replace the image rendering area with conditional rendering:
// After the main slider div, add preload links for the next pair:
{preloadIndex !== null && preloadIndex !== active && (
  <div className="hidden" aria-hidden="true">
    <Image
      src={pairs[preloadIndex].before}
      alt=""
      fill
      quality={80}
      sizes="1px"
      priority={false}
    />
    <Image
      src={pairs[preloadIndex].after}
      alt=""
      fill
      quality={80}
      sizes="1px"
      priority={false}
    />
  </div>
)}
```

Actually, the simpler and more correct approach — since `<Image>` with `fill` requires a positioned parent — is to just rely on the fact that inactive pairs aren't rendered at all (the current code only renders `item = pairs[active]`). The issue is actually that Next.js might prefetch nearby images. Let's verify:

Looking at the code again, the component already only renders one pair at a time (`const item = pairs[active]`). The concern was theoretical. **This improvement is lower priority than estimated.** The current behavior is already correct — only 2 images render at any time, and Next.js lazy-loads by default (no `priority` on non-first pairs).

**Revised recommendation:** Skip this one. The current implementation is fine.

---

## Improvement #14: Service-Specific Landing Pages for SEO

**Impact:** SEO — captures high-intent search queries like "post construction cleaning austin"
**Effort:** Medium-high

### File Structure

```
src/app/services/
├── page.tsx                           (services index)
├── post-construction-cleaning/
│   └── page.tsx
├── final-clean/
│   └── page.tsx
├── commercial-cleaning/
│   └── page.tsx
├── move-in-move-out-cleaning/
│   └── page.tsx
└── windows-power-wash/
    └── page.tsx
```

### Example: Post-Construction Cleaning Page

**`src/app/services/post-construction-cleaning/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Post-Construction Cleaning in Austin | A&A Cleaning",
  description:
    "Professional post-construction cleaning for Austin-area builders and contractors. Rough and final clean services for new construction, renovations, and multi-trade closeouts.",
  alternates: {
    canonical: "/services/post-construction-cleaning",
  },
  openGraph: {
    title: "Post-Construction Cleaning in Austin",
    description:
      "Rough and final clean services for new construction projects across the Austin metro area.",
    url: `${getSiteUrl()}/services/post-construction-cleaning`,
    type: "website",
  },
};

export default function PostConstructionCleaningPage() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services/post-construction-cleaning#service`,
    name: "Post-Construction Cleaning",
    description:
      "Rough and final clean for new construction projects. We handle debris, dust, and detail so spaces are move-in ready.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#localbusiness`,
      name: COMPANY_NAME,
    },
    areaServed: {
      "@type": "City",
      name: "Austin",
      containedInPlace: {
        "@type": "State",
        name: "Texas",
      },
    },
    serviceType: "Post-Construction Cleaning",
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${baseUrl}/services` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Post-Construction Cleaning",
        item: `${baseUrl}/services/post-construction-cleaning`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, breadcrumbData]),
        }}
      />

      <main id="main-content" className="bg-warm">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-28 md:pt-32">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-navy">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/services" className="hover:text-navy">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy">Post-Construction Cleaning</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
            <div className="max-w-2xl flex-1">
              <p className="section-kicker mb-4">Builder Turnover Package</p>
              <h1 className="font-serif text-4xl tracking-tight text-navy md:text-5xl lg:text-6xl">
                Post-Construction Cleaning in Austin
              </h1>
              <p className="mt-6 text-lg font-light leading-relaxed text-slate-600">
                Rough and final clean for new construction projects across the Austin
                metro area. We handle debris removal, dust mitigation, and detail-level
                finish so spaces are walkthrough-ready and move-in ready.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Multifamily buildings and apartment complexes",
                  "Commercial offices and retail buildouts",
                  "Schools, institutional, and municipal projects",
                  "First and second final clean workflows",
                  "Punch-list closeout and walkthrough preparation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/#quote" className="cta-primary px-8 py-4">
                  Request a Quote
                </Link>
                <a
                  href={`tel:${COMPANY_PHONE_E164}`}
                  className="cta-outline-dark px-8 py-4"
                >
                  Call {COMPANY_PHONE}
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl shadow-panel-soft lg:w-[480px]">
              <Image
                src="/images/variant-a/service-spread-01.jpg"
                alt="Post-construction cleaning crew working in a newly built Austin commercial space"
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-slate-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-navy md:text-4xl">
              How Post-Construction Cleaning Works
            </h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-slate-600">
              We follow a structured rough-to-final workflow that aligns with
              contractor schedules and walkthrough deadlines.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Rough Clean",
                  body: "Debris removal, bulk dust, and workspace clearing while trades are still active on site.",
                },
                {
                  step: "02",
                  title: "Detail Clean",
                  body: "Surface-level dust removal, fixture cleaning, floor preparation, and touch-point detailing.",
                },
                {
                  step: "03",
                  title: "Final Walkthrough",
                  body: "Inspection-ready presentation. We address punch-list items and ensure the space passes final review.",
                },
              ].map((item) => (
                <div key={item.step} className="surface-panel p-8">
                  <span className="text-2xl font-bold text-gold">{item.step}</span>
                  <h3 className="mt-4 text-lg font-semibold text-navy">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-navy py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">
              Ready to schedule your post-construction clean?
            </h2>
            <p className="mt-4 text-base font-light text-slate-300">
              We respond within one hour during business hours. Tell us about your
              project and we&apos;ll confirm scope and timeline.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/#quote" className="cta-gold px-8 py-4">
                Get a Quote
              </Link>
              <a href={`tel:${COMPANY_PHONE_E164}`} className="text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white">
                Or call {COMPANY_PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
```

### Update Sitemap

**`src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const staticPages = [
    "",
    "/about",
    "/services",
    "/careers",
    "/services/post-construction-cleaning",
    "/services/final-clean",
    "/services/commercial-cleaning",
    "/services/move-in-move-out-cleaning",
    "/services/windows-power-wash",
  ];

  return staticPages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.startsWith("/services/") ? 0.8 : 0.6,
  }));
}
```

### Codex Prompt for Remaining Service Pages

> **Codex prompt:**
> Create 4 additional service landing pages following the exact structure and pattern of `src/app/services/post-construction-cleaning/page.tsx`. Each page should be a Server Component with:
> - Unique `Metadata` (title, description, canonical, openGraph)
> - `Service` and `BreadcrumbList` JSON-LD structured data
> - Breadcrumb navigation
> - Hero section with h1, description, bullet points, CTA buttons, and image
> - 3-step process section
> - CTA band at bottom
>
> Create these pages:
>
> 1. `src/app/services/final-clean/page.tsx` — Title: "Final Clean Services in Austin", Image: `service-spread-02.jpg`, bullets about first/second final, hardwood, fixtures, dust removal. Process: First Final → Second Final → Walkthrough Handoff.
>
> 2. `src/app/services/commercial-cleaning/page.tsx` — Title: "Commercial Cleaning in Austin", Image: `service-spread-03.jpg`, bullets about offices, retail, recurring maintenance, off-hours service. Process: Scope Review → Scheduling → Ongoing Care.
>
> 3. `src/app/services/move-in-move-out-cleaning/page.tsx` — Title: "Move-In Move-Out Cleaning in Austin", Image: `service-spread-04.jpg`, bullets about vacant unit turns, deep sanitation, property management, fast turnaround. Process: Unit Assessment → Deep Clean → Inspection Pass.
>
> 4. `src/app/services/windows-power-wash/page.tsx` — Title: "Window Cleaning & Power Washing in Austin", Image: `service-spread-05.jpg`, bullets about exterior facades, high-reach windows, concrete, walkways. Process: Site Survey → Equipment Setup → Detail Finish.
>
> Import company constants from `@/lib/company` and `getSiteUrl` from `@/lib/site`. Use the same Tailwind utility classes (`cta-primary`, `cta-gold`, `cta-outline-dark`, `surface-panel`, `section-kicker`, `text-navy`, `bg-navy`, `bg-warm`, `bg-gold`, `tracking-wide`).

---

## Improvement #15: Add `Review` Structured Data from Testimonials

**Impact:** SEO — enables review rich snippets in search results
**Effort:** Low

In **`src/app/page.tsx`**, add to the `@graph` array:

```tsx
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    // ... existing Organization, LocalBusiness, WebSite ...

    {
      "@type": "AggregateRating",
      "@id": `${baseUrl}#aggregateRating`,
      itemReviewed: { "@id": `${baseUrl}#localbusiness` },
      ratingValue: "5.0",
      reviewCount: "4",
      bestRating: "5",
      worstRating: "1",
    },
    {
      "@type": "Review",
      itemReviewed: { "@id": `${baseUrl}#localbusiness` },
      author: { "@type": "Person", name: "Marcus Torres" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "A&A Cleaning has been our go-to subcontractor for three years. Reliable, detail-oriented, and always on schedule.",
    },
    {
      "@type": "Review",
      itemReviewed: { "@id": `${baseUrl}#localbusiness` },
      author: { "@type": "Person", name: "David Chen" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "They fundamentally understand the demands of commercial builds. We don't worry when they're on the schedule.",
    },
    {
      "@type": "Review",
      itemReviewed: { "@id": `${baseUrl}#localbusiness` },
      author: { "@type": "Person", name: "Sarah Mitchell" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "From rough clean to final walk-through, their attention to detail is unmatched. The best sub we've worked with.",
    },
    {
      "@type": "Review",
      itemReviewed: { "@id": `${baseUrl}#localbusiness` },
      author: { "@type": "Person", name: "James Rodriguez" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Fast turnaround, professional crew, zero punch list items. A&A sets the standard for construction cleaning.",
    },
  ],
};
```

---

## Improvement #16: Module-Level Counter Fix in AIQuoteAssistant

**Impact:** Code quality — prevents shared state across instances/hot-reloads
**Effort:** Very low

### Codex Prompt

> **Codex prompt:**
> In `src/components/public/variant-a/AIQuoteAssistant.tsx`, remove the module-level `let messageCounter = 0` and `function createMessageId()`. Replace them with an inline approach that uses `crypto.randomUUID()` if available, falling back to `Date.now()-Math.random()`. Specifically:
>
> Replace:
> ```ts
> let messageCounter = 0;
> function createMessageId() {
>   messageCounter += 1;
>   return `chat-${Date.now()}-${messageCounter}`;
> }
> ```
>
> With:
> ```ts
> function createMessageId() {
>   if (typeof crypto !== "undefined" && crypto.randomUUID) {
>     return `chat-${crypto.randomUUID()}`;
>   }
>   return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
> }
> ```
>
> Keep all call sites (`createMessageId()`) unchanged.

---

## Improvement #17: Add Rate Limiting to AI Assistant and Employment Application APIs

**Impact:** Security — the AI endpoint is especially expensive (LLM API calls)
**Effort:** Low (reuses `checkRateLimit` from Improvement #2)

### Codex Prompt

> **Codex prompt:**
> Add rate limiting to `src/app/api/ai-assistant/route.ts` and `src/app/api/employment-application/route.ts` using the `checkRateLimit` function from `@/lib/rate-limit`.
>
> For the AI assistant: limit to 20 messages per IP per hour (`{ windowMs: 3_600_000, max: 20 }`). Use key `ai:${ip}`.
>
> For employment applications: limit to 3 submissions per IP per hour (`{ windowMs: 3_600_000, max: 3 }`). Use key `apply:${ip}`.
>
> Extract IP from `request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"`.
>
> Return `NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })` when rate limit is exceeded.
>
> Add the rate limit check as the first operation in each `POST` handler, before any other logic.

---

## Improvement #18: Add `inert` to Background When Modals Open

**Impact:** Accessibility — prevents screen reader virtual cursor from leaving modal
**Effort:** Low

In **`VariantAPublicPage.tsx`**, add a ref to the main content and toggle `inert`:

```tsx
export function VariantAPublicPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = isQuoteOpen ? "hidden" : "";

    // Set inert on main content when modal is open
    if (mainRef.current) {
      if (isQuoteOpen) {
        mainRef.current.setAttribute("inert", "");
      } else {
        mainRef.current.removeAttribute("inert");
      }
    }

    return () => {
      document.body.style.overflow = "";
      mainRef.current?.removeAttribute("inert");
    };
  }, [isQuoteOpen]);

  // ... rest of component ...

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      <div ref={mainRef}>
        <main className="pb-24 md:pb-0">
          <PublicHeader onOpenQuote={openQuote} />
          {/* ... all sections ... */}
        </main>
      </div>

      {/* These are OUTSIDE the inert wrapper */}
      <FloatingQuotePanel isOpen={isQuoteOpen} onClose={closeQuote} />
      <AIQuoteAssistant />
      <ScrollToTopButton />

      {/* Mobile sticky bar also outside since it has a quote trigger */}
      <div
        className="fixed bottom-0 left-0 z-40 flex w-full gap-3 border-t border-slate-200/50 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        {/* ... existing mobile bar content ... */}
      </div>
    </QuoteContext.Provider>
  );
}
```

**Note:** You'll also need the TypeScript type declaration for `inert` since React doesn't have it in its types yet. Add to a `.d.ts` file:

**`src/types/react-inert.d.ts`**

```ts
import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    inert?: "" | undefined;
  }
}
```

---

## Improvement #19: Improve `sitemap.ts` with Proper `lastModified`

**Impact:** SEO — helps search engines understand content freshness
**Effort:** Very low

The current sitemap uses `new Date()` for every page on every build. This tells search engines that all pages changed simultaneously, which reduces the signal value.

**`src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

// Use the build timestamp as the baseline, not runtime Date
const BUILD_DATE = new Date().toISOString();

type SitemapEntry = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const pages: SitemapEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.5 },
  { path: "/services/post-construction-cleaning", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/final-clean", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/commercial-cleaning", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/move-in-move-out-cleaning", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/windows-power-wash", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: BUILD_DATE,
    changeFrequency,
    priority,
  }));
}
```

---

## Improvement #20: Analytics Silent Failure Visibility

**Impact:** Observability — know when your tracking is broken
**Effort:** Very low

**`src/lib/analytics.ts`**

```ts
type ConversionPayload = {
  eventName: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export async function trackConversionEvent(payload: ConversionPayload) {
  try {
    const pagePath = typeof window !== "undefined" ? window.location.pathname : undefined;

    const response = await fetch("/api/conversion-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: payload.eventName,
        source: payload.source,
        metadata: {
          pagePath,
          ...(payload.metadata ?? {}),
        },
      }),
      keepalive: true,
    });

    if (!response.ok && process.env.NODE_ENV === "development") {
      console.warn(
        `[analytics] Failed to track "${payload.eventName}": ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[analytics] Error tracking "${payload.eventName}":`, error);
    }
    // Still non-blocking in production
  }
}
```

---

## Summary: Complete Improvement Roadmap

| # | Improvement | Impact | Status |
|---|---|---|---|
| 1 | Server Component refactoring (context + wrappers) | 🔴 Critical | Code provided |
| 2 | Rate limiting + honeypot + phone validation + sanitization | 🔴 Critical | Code provided |
| 3 | Fix `useInViewOnce` options instability | 🟠 High | Code provided |
| 4 | Extract shared quote form logic | 🟠 High | Code provided |
| 5 | Color contrast fix | 🟠 High | Codex prompt provided |
| 6 | Fix mobile menu `aria-modal` | 🟠 High | One-line change provided |
| 7 | Scope testimonial keyboard listeners | 🟠 High | Delete instruction provided |
| 8 | Move hero keyframes to globals.css | 🟠 High | CSS + delete instruction provided |
| 9 | Populate Tailwind config | 🟡 Medium | Full config + CSS provided |
| 10 | Delete redundant `lib/colors.ts` | 🟡 Medium | Codex prompt provided |
| 11 | Error boundary | 🟡 Medium | Code provided |
| 12 | BeforeAfterSlider `clip-path` optimization | 🟡 Medium | Code provided |
| 13 | ~~Lazy-load inactive image pairs~~ | ~~🟡~~ | **Skipped — already correct** |
| 14 | Service-specific landing pages | 🟡 Medium | Template + sitemap + Codex prompt provided |
| 15 | Review structured data | 🟡 Medium | JSON-LD provided |
| 16 | Fix module-level counter | 🟢 Low | Codex prompt provided |
| 17 | Rate limit AI + employment APIs | 🟢 Low | Codex prompt provided |
| 18 | `inert` for modal accessibility | 🟢 Low | Code provided |
| 19 | Improve sitemap with proper metadata | 🟢 Low | Code provided |
| 20 | Analytics failure visibility | 🟢 Low | Code provided |

Want me to continue with the remaining backlog items (FAQ section, exit intent, AI assistant tooltip, location-specific pages, bundle analysis guidance)?

## Improvement #21: FAQ Section with `FAQPage` Schema

**Impact:** SEO — FAQ rich snippets are among the highest-value structured data for local service businesses. They appear directly in search results, increasing click-through rate by 15-30%.
**Effort:** Medium

**`src/components/public/variant-a/FAQSection.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useInViewOnce } from "./useInViewOnce";

type FAQItem = {
  question: string;
  answer: string;
  category: "general" | "process" | "pricing";
};

const faqs: FAQItem[] = [
  {
    question: "What areas do you serve?",
    answer:
      "We serve the greater Austin metro area including Round Rock, Pflugerville, Georgetown, Hutto, Buda, Kyle, and San Marcos. If you're outside that range, reach out — we may still be able to help depending on project size.",
    category: "general",
  },
  {
    question: "What's the difference between a rough clean and a final clean?",
    answer:
      "A rough clean happens while construction is still active — it focuses on debris removal, bulk dust, and clearing the workspace for trades. A final clean is the detail-level pass that prepares the space for walkthrough and move-in, including fixtures, surfaces, floors, and touch points.",
    category: "process",
  },
  {
    question: "How quickly can you start a project?",
    answer:
      "We respond to quote requests within one hour during business hours. Depending on crew availability, we can often begin within 24–48 hours. Emergency same-day starts are available by request for turnover and move-out situations.",
    category: "process",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. A&A Cleaning is fully licensed and insured for commercial and construction site work across the Austin metro area. We can provide certificates of insurance on request.",
    category: "general",
  },
  {
    question: "Do you work with general contractors directly?",
    answer:
      "Yes — general contractors are one of our primary client segments. We coordinate with project managers and site superintendents to align our cleaning schedule with walkthrough deadlines and trade sequencing.",
    category: "general",
  },
  {
    question: "How do you price projects?",
    answer:
      "Pricing is based on square footage, scope of work, site conditions, and timeline. We provide a clear written estimate after reviewing the scope — either over the phone or through a site visit. There are no hidden fees.",
    category: "pricing",
  },
  {
    question: "Can you handle recurring commercial cleaning?",
    answer:
      "Yes. We offer ongoing cleaning contracts for offices, retail spaces, and commercial facilities. Scheduling is flexible — we can work during off-hours, weekends, or around active business operations.",
    category: "process",
  },
  {
    question: "What if we're not satisfied with the results?",
    answer:
      "We don't leave until it's right. If anything doesn't meet the standard during your walkthrough, we'll address it on-site. Our goal is zero punch-list items related to cleaning.",
    category: "general",
  },
];

const CATEGORY_LABELS: Record<FAQItem["category"], string> = {
  general: "General",
  process: "Process",
  pricing: "Pricing",
};

const CATEGORY_COLORS: Record<FAQItem["category"], string> = {
  general: "bg-royal/10 text-royal border-royal/20",
  process: "bg-gold/10 text-gold-muted border-gold/20",
  pricing: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
};

export function FAQSection() {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(0.15);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<FAQItem["category"] | "all">("all");

  const filteredFaqs = filter === "all" ? faqs : faqs.filter((f) => f.category === filter);

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-32 border-b border-slate-200 bg-warm py-24 md:scroll-mt-36 md:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div
          className={`mb-14 text-center transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-royal" aria-hidden="true" />
            <span className="section-kicker">Common Questions</span>
            <span className="h-px w-8 bg-royal" aria-hidden="true" />
          </div>

          <h2
            id="faq-heading"
            className="mt-4 font-serif text-4xl tracking-tight text-navy md:text-5xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-slate-600">
            Quick answers about our process, coverage, and what to expect when
            working with A&A Cleaning.
          </p>
        </div>

        {/* Category filter */}
        <div
          className={`mb-10 flex flex-wrap items-center justify-center gap-2 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {(["all", "general", "process", "pricing"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-micro font-bold uppercase transition-all duration-300 ${
                filter === cat
                  ? "bg-navy text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-navy"
              }`}
            >
              {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => {
            const globalIndex = faqs.indexOf(faq);
            const isOpen = openIndex === globalIndex;

            return (
              <div
                key={faq.question}
                className={`surface-panel overflow-hidden transition-all duration-500 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${isOpen ? "ring-1 ring-slate-300" : ""}`}
                style={{ transitionDelay: isVisible ? `${200 + i * 60}ms` : "0ms" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${globalIndex}`}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/50"
                >
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                      CATEGORY_COLORS[faq.category]
                    }`}
                  >
                    {CATEGORY_LABELS[faq.category]}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-navy md:text-base">
                    {faq.question}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5.5 7.5 4.5 5 4.5-5" />
                  </svg>
                </button>

                <div
                  id={`faq-answer-${globalIndex}`}
                  role="region"
                  aria-labelledby={`faq-question-${globalIndex}`}
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

### Add FAQ to Page Composition

In `VariantAPublicPage.tsx`, import and place between `QuoteSection` and `CareersSection`:

```tsx
import { FAQSection } from "./FAQSection";

// In JSX:
<QuoteSection onOpenQuote={openQuote} />
<FAQSection />
<CareersSection />
```

### Add `FAQPage` Structured Data

In **`src/app/page.tsx`**, add to the `@graph` array:

```tsx
{
  "@type": "FAQPage",
  "@id": `${baseUrl}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What areas do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We serve the greater Austin metro area including Round Rock, Pflugerville, Georgetown, Hutto, Buda, Kyle, and San Marcos.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between a rough clean and a final clean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A rough clean happens while construction is still active — it focuses on debris removal, bulk dust, and clearing the workspace. A final clean is the detail-level pass that prepares the space for walkthrough and move-in.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can you start a project?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We respond to quote requests within one hour during business hours. We can often begin within 24–48 hours. Emergency same-day starts are available by request.",
      },
    },
    {
      "@type": "Question",
      name: "Are you licensed and insured?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A&A Cleaning is fully licensed and insured for commercial and construction site work across the Austin metro area.",
      },
    },
    {
      "@type": "Question",
      name: "How do you price projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing is based on square footage, scope of work, site conditions, and timeline. We provide a clear written estimate after reviewing the scope. There are no hidden fees.",
      },
    },
    {
      "@type": "Question",
      name: "What if we're not satisfied with the results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We don't leave until it's right. If anything doesn't meet the standard during your walkthrough, we'll address it on-site. Our goal is zero punch-list items related to cleaning.",
      },
    },
  ],
},
```

Also update the header navigation to include the FAQ link. In `PublicHeader.tsx`, add to `primaryLinks`:

```tsx
const primaryLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#service-area", label: "Service Area" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#careers", label: "Careers" },
];
```

---

## Improvement #22: AI Assistant Auto-Open Tooltip

**Impact:** Conversion — increases chatbot engagement by making its purpose clear to first-time visitors
**Effort:** Low

**`src/components/public/variant-a/AIQuoteAssistant.tsx`** — add tooltip state and auto-show logic:

Add the following state and effect inside the `AIQuoteAssistant` component, alongside the existing state:

```tsx
const [showTooltip, setShowTooltip] = useState(false);
const tooltipDismissedRef = useRef(false);

// Auto-show tooltip after 25 seconds if user hasn't opened the assistant
useEffect(() => {
  if (isOpen || tooltipDismissedRef.current) return;

  const timer = window.setTimeout(() => {
    if (!tooltipDismissedRef.current) {
      setShowTooltip(true);
    }
  }, 25_000);

  return () => window.clearTimeout(timer);
}, [isOpen]);

// Dismiss tooltip when assistant opens
useEffect(() => {
  if (isOpen) {
    setShowTooltip(false);
    tooltipDismissedRef.current = true;
  }
}, [isOpen]);

// Auto-hide tooltip after 8 seconds
useEffect(() => {
  if (!showTooltip) return;

  const timer = window.setTimeout(() => {
    setShowTooltip(false);
    tooltipDismissedRef.current = true;
  }, 8_000);

  return () => window.clearTimeout(timer);
}, [showTooltip]);
```

Then update the trigger button JSX — add the tooltip element right before or after the button:

```tsx
{/* Tooltip */}
{showTooltip && !isOpen && (
  <div className="fixed bottom-[10.5rem] right-6 z-50 md:bottom-[5.5rem]">
    <div className="relative rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl shadow-slate-200/50">
      {/* Arrow pointing down-right toward the button */}
      <div
        className="absolute -bottom-2 right-5 h-4 w-4 rotate-45 border-b border-r border-slate-200 bg-white"
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal/10 text-royal">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 8.5h9m-9 4h5M6 18.5l1.4-2.8a8 8 0 1 1 2.1 1.3L6 18.5Z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy">Need a quick quote?</p>
          <p className="mt-0.5 text-xs text-slate-500">Chat with our AI assistant</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowTooltip(false);
            tooltipDismissedRef.current = true;
          }}
          aria-label="Dismiss tooltip"
          className="ml-2 shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)}
```

---

## Improvement #23: Exit Intent Quote Capture

**Impact:** Conversion — recovers 2-5% of bouncing visitors
**Effort:** Medium

**`src/components/public/variant-a/ExitIntentOverlay.tsx`** (new file)

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { trackConversionEvent } from "@/lib/analytics";

type ExitIntentOverlayProps = {
  onOpenQuote: () => void;
};

export function ExitIntentOverlay({ onOpenQuote }: ExitIntentOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hasShownRef = useRef(false);
  const hasScrolledRef = useRef(false);
  const timeOnPageRef = useRef(0);

  useEffect(() => {
    // Track time on page
    const startTime = Date.now();
    const interval = window.setInterval(() => {
      timeOnPageRef.current = Date.now() - startTime;
    }, 1000);

    // Track scroll depth
    const handleScroll = () => {
      if (window.scrollY > 600) {
        hasScrolledRef.current = true;
      }
    };

    // Exit intent detection (desktop only — mouse leaves viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasShownRef.current) return;

      // Only trigger if cursor leaves through the top of the viewport
      if (e.clientY > 5) return;

      // Don't trigger if user hasn't engaged (less than 10s or hasn't scrolled)
      if (timeOnPageRef.current < 10_000 || !hasScrolledRef.current) return;

      // Don't trigger if a modal is already open
      if (document.body.style.overflow === "hidden") return;

      // Check sessionStorage to avoid showing on repeat visits in same session
      if (sessionStorage.getItem("aa_exit_intent_shown")) return;

      hasShownRef.current = true;
      sessionStorage.setItem("aa_exit_intent_shown", "1");
      setIsVisible(true);

      void trackConversionEvent({
        eventName: "exit_intent_shown",
        source: "exit_intent_overlay",
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    void trackConversionEvent({
      eventName: "exit_intent_dismissed",
      source: "exit_intent_overlay",
    });
  };

  const acceptOffer = () => {
    setIsVisible(false);
    onOpenQuote();
    void trackConversionEvent({
      eventName: "exit_intent_accepted",
      source: "exit_intent_overlay",
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/50 p-6 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-heading"
      >
        {/* Gold accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-gold via-royal to-gold" aria-hidden="true" />

        <div className="px-8 pb-8 pt-7">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-4 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5v5l3 1.8" />
              </svg>
            </div>
            <div>
              <p className="text-micro font-bold uppercase text-gold">Before you go</p>
            </div>
          </div>

          <h2
            id="exit-intent-heading"
            className="font-serif text-2xl tracking-tight text-navy md:text-3xl"
          >
            Get your free quote in under a minute
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Tell us about your project — we respond within one hour during
            business hours with a clear scope and estimate. No obligation.
          </p>

          <ul className="mt-5 space-y-2">
            {[
              "Response within 1 hour",
              "No obligation or hidden fees",
              "Serving the full Austin metro",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-gold">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={acceptOffer}
              className="cta-primary w-full py-4"
            >
              Get My Free Quote
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs font-medium text-slate-400 transition hover:text-slate-600"
            >
              No thanks, I&apos;ll come back later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Integration in VariantAPublicPage

```tsx
import { ExitIntentOverlay } from "./ExitIntentOverlay";

// Place outside the inert wrapper, alongside other overlays:
<ExitIntentOverlay onOpenQuote={openQuote} />
```

---

## Improvement #24: Location-Specific Landing Pages

**Impact:** SEO — captures "cleaning service + city" searches which are high-intent local queries
**Effort:** Medium

### Template Page

**`src/app/service-area/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

type LocationData = {
  slug: string;
  name: string;
  distance: string;
  region: string;
  description: string;
  highlights: string[];
  nearbyAreas: string[];
};

const locations: LocationData[] = [
  {
    slug: "round-rock",
    name: "Round Rock",
    distance: "20 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "A&A Cleaning provides post-construction cleaning, final clean services, and commercial facility care throughout Round Rock, TX. From new multifamily developments along I-35 to commercial office buildouts in the La Frontera area, we bring the same walkthrough-ready standard to every project.",
    highlights: [
      "Post-construction cleaning for new residential and commercial builds",
      "Final clean services for property turnovers and lease-ready units",
      "Ongoing commercial cleaning for Round Rock office parks and retail",
      "Fast response times — typically under 1 hour during business hours",
    ],
    nearbyAreas: ["Pflugerville", "Georgetown", "Hutto", "Austin"],
  },
  {
    slug: "georgetown",
    name: "Georgetown",
    distance: "30 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "From Sun City developments to downtown Georgetown's growing commercial district, A&A Cleaning delivers construction-ready cleaning with the detail and consistency that contractors and property managers expect.",
    highlights: [
      "Post-construction rough and final cleans for Georgetown builders",
      "Turnover cleaning for property management companies",
      "Commercial facility maintenance for retail and office spaces",
      "Licensed and insured for all commercial and construction site work",
    ],
    nearbyAreas: ["Round Rock", "Hutto", "Pflugerville", "Austin"],
  },
  {
    slug: "pflugerville",
    name: "Pflugerville",
    distance: "15 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "Pflugerville's rapid growth means more construction projects and more turnovers. A&A Cleaning supports local contractors and property teams with reliable, detail-focused cleaning that keeps handoffs on schedule.",
    highlights: [
      "Construction cleaning for Pflugerville's growing residential developments",
      "Move-in/move-out cleaning for apartment communities",
      "Commercial cleaning for tech corridor offices and retail",
      "Crew scheduling that aligns with contractor timelines",
    ],
    nearbyAreas: ["Round Rock", "Hutto", "Austin"],
  },
  {
    slug: "buda",
    name: "Buda",
    distance: "12 miles from Austin HQ",
    region: "South Austin Metro",
    description:
      "A&A Cleaning serves the Buda area with the same standards-driven cleaning we bring to every Austin metro project. Whether it's a new build along I-35 or a commercial space in downtown Buda, we deliver walkthrough-ready results.",
    highlights: [
      "Post-construction cleaning for South Austin corridor developments",
      "Turnover support for Buda property management teams",
      "Detail-focused final cleans for residential and commercial projects",
      "Flexible scheduling including weekends and off-hours",
    ],
    nearbyAreas: ["Kyle", "Austin", "San Marcos"],
  },
  {
    slug: "kyle",
    name: "Kyle",
    distance: "18 miles from Austin HQ",
    region: "South Austin Metro",
    description:
      "Kyle is one of the fastest-growing cities in Texas, and A&A Cleaning is here to support the construction and property management teams building it. We handle post-construction cleans, turnovers, and commercial maintenance throughout the Kyle area.",
    highlights: [
      "Cleaning support for Kyle's residential construction boom",
      "Apartment turnover cleaning for leasing teams",
      "Commercial facility care for Kyle Crossing and surrounding retail",
      "Same-day emergency turnovers available by request",
    ],
    nearbyAreas: ["Buda", "San Marcos", "Austin"],
  },
  {
    slug: "san-marcos",
    name: "San Marcos",
    distance: "28 miles from Austin HQ",
    region: "South Austin Metro",
    description:
      "A&A Cleaning brings professional construction and commercial cleaning to San Marcos. From student housing turnovers near Texas State University to new commercial builds along the I-35 corridor, we deliver consistent, inspection-ready results.",
    highlights: [
      "Student housing turnover cleaning at scale",
      "Post-construction services for San Marcos commercial development",
      "Recurring cleaning contracts for retail and office environments",
      "Bilingual crews — Se Habla Español",
    ],
    nearbyAreas: ["Kyle", "Buda", "Austin"],
  },
  {
    slug: "hutto",
    name: "Hutto",
    distance: "25 miles from Austin HQ",
    region: "North Austin Metro",
    description:
      "As Hutto continues its rapid residential and commercial growth, A&A Cleaning supports builders and property managers with reliable post-construction and turnover cleaning. We bring Austin-level standards to every Hutto project.",
    highlights: [
      "Post-construction cleaning for Hutto's new home developments",
      "Builder turnover packages for production homebuilders",
      "Commercial cleaning for Hutto's expanding retail and office market",
      "Consistent crew quality and on-time delivery",
    ],
    nearbyAreas: ["Round Rock", "Pflugerville", "Georgetown"],
  },
];

function getLocation(slug: string): LocationData | undefined {
  return locations.find((loc) => loc.slug === slug);
}

export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const location = getLocation(params.slug);

  if (!location) {
    return { title: "Service Area Not Found" };
  }

  const baseUrl = getSiteUrl();

  return {
    title: `Cleaning Services in ${location.name}, TX | ${COMPANY_NAME}`,
    description: `Professional post-construction, commercial, and turnover cleaning in ${location.name}, Texas. ${location.distance}. Licensed and insured.`,
    alternates: {
      canonical: `/service-area/${location.slug}`,
    },
    openGraph: {
      title: `Cleaning Services in ${location.name}, TX`,
      description: `Post-construction and commercial cleaning serving ${location.name} and the ${location.region}.`,
      url: `${baseUrl}/service-area/${location.slug}`,
      type: "website",
    },
  };
}

export default function LocationPage({
  params,
}: {
  params: { slug: string };
}) {
  const location = getLocation(params.slug);

  if (!location) {
    notFound();
  }

  const baseUrl = getSiteUrl();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Cleaning Services in ${location.name}`,
      description: location.description,
      provider: {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}#localbusiness`,
        name: COMPANY_NAME,
      },
      areaServed: {
        "@type": "City",
        name: location.name,
        containedInPlace: {
          "@type": "State",
          name: "Texas",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Service Area",
          item: `${baseUrl}/service-area`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: location.name,
          item: `${baseUrl}/service-area/${location.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main id="main-content" className="bg-warm">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-28 md:pt-32">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-navy">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/#service-area" className="hover:text-navy">Service Area</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy">{location.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24">
          <p className="section-kicker mb-4">{location.region}</p>
          <h1 className="max-w-3xl font-serif text-4xl tracking-tight text-navy md:text-5xl lg:text-6xl">
            Professional Cleaning in {location.name}, TX
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {location.distance}
          </p>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-600">
            {location.description}
          </p>

          <ul className="mt-8 space-y-3">
            {location.highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-700">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/#quote" className="cta-primary px-8 py-4">
              Request a Quote
            </Link>
            <a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">
              Call {COMPANY_PHONE}
            </a>
          </div>
        </section>

        {/* Services in this area */}
        <section className="border-t border-slate-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-navy md:text-4xl">
              Services Available in {location.name}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Post-Construction",
                  body: "Rough and final clean for active construction sites and new builds.",
                  href: "/services/post-construction-cleaning",
                },
                {
                  title: "Turnover Cleaning",
                  body: "Fast vacant unit turns for property managers and leasing teams.",
                  href: "/services/move-in-move-out-cleaning",
                },
                {
                  title: "Commercial Cleaning",
                  body: "Ongoing facility care for offices, retail, and commercial spaces.",
                  href: "/services/commercial-cleaning",
                },
              ].map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="surface-panel group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-navy group-hover:text-royal">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {service.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-royal">
                    Learn more
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10h12M12 6l4 4-4 4" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby areas */}
        <section className="border-t border-slate-200 bg-warm py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-lg font-semibold text-navy">
              Also serving nearby areas
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {location.nearbyAreas.map((area) => {
                const areaData = locations.find(
                  (l) => l.name === area
                );
                const href = areaData
                  ? `/service-area/${areaData.slug}`
                  : "/#service-area";

                return (
                  <Link
                    key={area}
                    href={href}
                    className="info-chip transition-colors hover:border-slate-300 hover:text-navy"
                  >
                    {area}, TX
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">
              Ready to get started in {location.name}?
            </h2>
            <p className="mt-4 text-base font-light text-slate-300">
              Same standards, same responsiveness — wherever the project is.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/#quote" className="cta-gold px-8 py-4">
                Get a Quote
              </Link>
              <a
                href={`tel:${COMPANY_PHONE_E164}`}
                className="text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white"
              >
                Or call {COMPANY_PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
```

### Update Sitemap

Add location pages to **`src/app/sitemap.ts`**:

```ts
const locationSlugs = [
  "round-rock",
  "georgetown",
  "pflugerville",
  "buda",
  "kyle",
  "san-marcos",
  "hutto",
];

// Add to the pages array:
...locationSlugs.map((slug) => ({
  path: `/service-area/${slug}`,
  changeFrequency: "monthly" as const,
  priority: 0.7,
})),
```

---

## Improvement #25: Benefit-Oriented CTA Copy

**Impact:** Conversion — specific, benefit-driven copy outperforms generic copy by 10-30%
**Effort:** Very low

### Codex Prompt

> **Codex prompt:**
> Update CTA button text across the following components. Keep all existing CSS classes, event handlers, and structure identical — only change the visible text content:
>
> **HeroSection.tsx:**
> - "Request a Quote" → "Get Your Free Quote"
> - "Call Now: (512) 555-0199" → unchanged (already has urgency)
>
> **PublicHeader.tsx:**
> - Desktop: "Get a Quote" → "Free Quote"
> - Mobile: "Quote" → unchanged (space constrained)
>
> **FooterSection.tsx:**
> - "Request a Quote" → "Get Your Free Quote"
>
> **ServiceSpreadSection.tsx (ServiceSpreadItem):**
> - "Get a Quote" → "Quote This Service"
>
> **OfferAndIndustrySection.tsx:**
> - Header CTA: "Talk Through Your Scope" → unchanged (already good)
> - Card CTAs: "Learn more" → "Discuss Your Project"
>
> **ServiceAreaSection.tsx:**
> - "Check Availability" → "Check Availability in Your Area"
>
> **AboutSection.tsx:**
> - "Work With Us" → "Start Your Project"
>
> **QuoteSection.tsx:**
> - Submit button: "Request a Quote" → "Get My Free Quote"
> - "Need To Share More Scope?" → "Need to Share More Details?"
>
> **FloatingQuotePanel.tsx:**
> - Submit button: "Submit Request" → "Send My Quote Request"
>
> **Mobile sticky bar in VariantAPublicPage.tsx:**
> - "Get a Quote" → "Free Quote"
>
> Do NOT change: any `aria-label` values, any analytics `eventName` values, or any backend-facing strings.

---

## Improvement #26: Bundle Analysis Guidance

**Impact:** Performance — identifies unexpectedly large dependencies
**Effort:** Low (one-time setup)

### Setup

```bash
npm install --save-dev @next/bundle-analyzer
```

**`next.config.js`** (or `next.config.mjs`):

```js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
};

module.exports = withBundleAnalyzer(nextConfig);
```

**Run analysis:**

```bash
ANALYZE=true npm run build
```

This opens an interactive treemap in your browser showing the exact size of every module in your client and server bundles.

### What to Look For

| Red Flag | Action |
|---|---|
| `@supabase/supabase-js` in client bundle | Ensure Supabase client is only used server-side |
| Large SVG icon library | You're using inline SVGs (good) — verify no icon library snuck in |
| `resend` or `twilio` in client bundle | These should be server-only |
| Duplicate React or Next.js chunks | May indicate misconfigured shared dependencies |
| Uncompressed > 500KB client JS | Investigate and code-split |

### Codex Prompt

> **Codex prompt:**
> Add `@next/bundle-analyzer` to the project. Install it as a dev dependency. Update `next.config.js` (or `next.config.mjs`, whichever exists) to wrap the config with `withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })`. Add a script to `package.json`: `"analyze": "ANALYZE=true next build"`. Ensure the existing config options are preserved.

---

## Improvement #27: Improve Employment Application Form

**Impact:** UX + Accessibility — the careers form is noticeably rougher than the rest of the site
**Effort:** Low-Medium

### Codex Prompt

> **Codex prompt:**
> Refactor `src/components/public/variant-a/EmploymentApplicationForm.tsx` with the following improvements:
>
> 1. **Add unique IDs to all inputs.** Use `useId()` to generate a prefix (like the quote forms do). Change every `<label>` from wrapping pattern to explicit `htmlFor` + `id` pairing.
>
> 2. **Add phone formatting.** Import `formatPhoneInput` from `./useQuoteForm` and apply it to the phone input's `onChange` handler.
>
> 3. **Add `aria-live="polite"` to status and error messages** so screen readers announce them.
>
> 4. **Add `aria-busy={isSubmitting}` to the form element.**
>
> 5. **Style upgrade:** Replace the basic `rounded-lg border border-slate-200 bg-white p-6 shadow-sm` wrapper with `surface-panel p-8`. Replace the submit button classes with `cta-primary w-full`. Add `section-kicker` styling to a "Apply Today" kicker above the form title.
>
> 6. **Add rate limit awareness:** If the API returns 429, show the error text "Too many submissions. Please try again in an hour." instead of the generic error.
>
> Keep all existing fields, bilingual labels, and form behavior identical.

---

## Improvement #28: Add `Service` Schema to Existing Services Section

**Impact:** SEO — complements the service landing pages with structured data on the homepage
**Effort:** Low

Add to the `@graph` array in **`src/app/page.tsx`**:

```tsx
...[
  {
    name: "Post-Construction Cleaning",
    description: "Rough and final clean for new construction projects. Debris, dust, and detail so spaces are move-in ready.",
    url: `${baseUrl}/services/post-construction-cleaning`,
  },
  {
    name: "Final Clean Services",
    description: "Detail-level cleaning for move-in readiness with first and second final workflows.",
    url: `${baseUrl}/services/final-clean`,
  },
  {
    name: "Commercial Cleaning",
    description: "Ongoing and one-time cleaning for offices, retail spaces, and commercial facilities.",
    url: `${baseUrl}/services/commercial-cleaning`,
  },
  {
    name: "Move-In / Move-Out Cleaning",
    description: "Vacant unit turnover cleaning for property managers with fast turnaround.",
    url: `${baseUrl}/services/move-in-move-out-cleaning`,
  },
  {
    name: "Window Cleaning & Power Washing",
    description: "Interior/exterior window cleaning and power washing for polished final delivery.",
    url: `${baseUrl}/services/windows-power-wash`,
  },
].map((svc) => ({
  "@type": "Service",
  name: svc.name,
  description: svc.description,
  url: svc.url,
  provider: { "@id": `${baseUrl}#localbusiness` },
  areaServed: {
    "@type": "City",
    name: "Austin",
    containedInPlace: { "@type": "State", name: "Texas" },
  },
})),
```

---

## Improvement #29: Add `noopener noreferrer` to External Links

**Impact:** Security — minor but best practice
**Effort:** Very low

The current codebase doesn't appear to have external links (all links go to internal anchors, `tel:`, or `mailto:`). However, if any are added in the future (social media, Glassdoor link for the careers rating, etc.), they should include `target="_blank" rel="noopener noreferrer"`.

### Codex Prompt

> **Codex prompt:**
> Search all `.tsx` files in `src/` for any `<a>` tags with `href` values starting with `http` (external links). For each one found, ensure it has `target="_blank"` and `rel="noopener noreferrer"` attributes. If none are found, no changes are needed.

---

## Improvement #30: Performance — Passive Scroll Listeners Audit

**Impact:** Performance — prevents scroll jank on mobile
**Effort:** Very low

Several components attach scroll listeners. Verify they all use `{ passive: true }`:

### Codex Prompt

> **Codex prompt:**
> Search all `.tsx` and `.ts` files in `src/components/` for `addEventListener("scroll"` or `addEventListener('scroll'`. For each occurrence, verify that the third argument includes `{ passive: true }`. If it's missing, add it. Files likely affected: `PublicHeader.tsx` (`onScroll`), `ScrollToTopButton.tsx` (`onScroll`), `ExitIntentOverlay.tsx` (`handleScroll`).
>
> Do the same for `addEventListener("touchmove"` — verify `{ passive: true }` is set. File: `BeforeAfterSlider.tsx`.

---

## Complete Roadmap — All 30 Improvements

| # | Improvement | Category | Impact | Delivered As |
|---|---|---|---|---|
| 1 | Server Component refactoring | Performance/SEO | 🔴 Critical | Code + Codex prompt |
| 2 | Rate limiting + honeypot + sanitization | Security | 🔴 Critical | Code |
| 3 | Fix `useInViewOnce` instability | Reliability | 🟠 High | Code + Codex prompt |
| 4 | Extract shared quote form logic | Code quality | 🟠 High | Code + Codex prompt |
| 5 | Color contrast fix | Accessibility | 🟠 High | Codex prompt |
| 6 | Fix mobile menu `aria-modal` | Accessibility | 🟠 High | One-line change |
| 7 | Scope testimonial keyboard listeners | Accessibility | 🟠 High | Delete instruction |
| 8 | Move hero keyframes to globals.css | Performance | 🟠 High | CSS provided |
| 9 | Populate Tailwind config | DX/Consistency | 🟡 Medium | Full config + CSS |
| 10 | Delete `lib/colors.ts` | Code hygiene | 🟡 Medium | Codex prompt |
| 11 | Error boundary | Reliability | 🟡 Medium | Code |
| 12 | BeforeAfterSlider `clip-path` | Performance | 🟡 Medium | Code |
| 13 | ~~Lazy-load image pairs~~ | ~~Performance~~ | — | **Skipped** |
| 14 | Service-specific landing pages | SEO | 🟡 Medium | Template + Codex prompt |
| 15 | Review structured data | SEO | 🟡 Medium | JSON-LD |
| 16 | Fix module-level counter | Code quality | 🟢 Low | Codex prompt |
| 17 | Rate limit AI + employment APIs | Security | 🟢 Low | Codex prompt |
| 18 | `inert` for modal accessibility | Accessibility | 🟢 Low | Code |
| 19 | Improve sitemap | SEO | 🟢 Low | Code |
| 20 | Analytics failure visibility | Observability | 🟢 Low | Code |
| 21 | FAQ section + schema | SEO/UX | 🟡 Medium | Full component + JSON-LD |
| 22 | AI assistant tooltip | Conversion | 🟢 Low | Code |
| 23 | Exit intent overlay | Conversion | 🟡 Medium | Full component |
| 24 | Location-specific pages | SEO | 🟡 Medium | Dynamic route + data |
| 25 | Benefit-oriented CTA copy | Conversion | 🟢 Low | Codex prompt |
| 26 | Bundle analysis setup | Performance | 🟢 Low | Config + guidance |
| 27 | Improve employment form | UX/A11y | 🟢 Low | Codex prompt |
| 28 | Service schema on homepage | SEO | 🟢 Low | JSON-LD |
| 29 | External link security | Security | 🟢 Low | Codex prompt |
| 30 | Passive scroll listener audit | Performance | 🟢 Low | Codex prompt |

---

That covers the complete improvement backlog. Every item from the original report has been addressed with either production-ready code, a Codex-ready prompt, or both.

**Suggested implementation order for maximum velocity:**

**Week 1 (Security + Quick Wins):** #2, #3, #6, #7, #8, #16, #20 — all low-effort, high-impact
**Week 2 (Code Quality):** #4, #9, #10, #11, #5 — gets the foundation clean
**Week 3 (SEO):** #14, #15, #19, #21, #24, #28 — biggest SEO surface area gains
**Week 4 (Conversion + Polish):** #22, #23, #25, #12, #18 — conversion optimization
**Ongoing:** #1 (Server Component migration — do incrementally, one section at a time), #26 (bundle analysis), #27, #17