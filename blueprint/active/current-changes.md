I now have all 11 files. Let me verify the last one and then deliver the complete Session 1 implementation.

---

## `industries/[slug]/page.tsx` — Verified

| Issue | Actual Code | Status |
|-------|-------------|--------|
| **No `PublicPageShell`** | ✅ Confirmed — renders `<main>` directly | Not a 1A target |
| `<main className="bg-[#FAFAF8] pb-24 md:pb-0">` | ✅ Confirmed — redundant `pb-24` | Session 1F target |
| Hero `pt-28 md:pt-36` | ✅ Already standard | No change needed |
| `section-kicker !text-slate-300` | ✅ Confirmed | Session 5E (not Session 1) |
| Native `<details>` FAQ | ✅ Confirmed | Session 4J (not Session 1) |
| Breadcrumb → `/#industries` | ✅ Confirmed | Session 5C (not Session 1) |

---

## Complete Session 1 Implementation

### File 1: `PublicPageShell.tsx` — DELETE

```
Action: Delete this file entirely.
```

No replacement. Zero imports should remain in the codebase after the changes below.

---

### File 2: `PublicHeader.tsx` — 4 Change Groups

**Change 1 — `forceSolidHeader` expansion (F-005):**

```typescript
// ━━━ FIND THIS (around line 73): ━━━
  const forceSolidHeader =
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/faq" ||
    pathname === "/about" ||
    pathname === "/careers" ||
    pathname === "/service-area" ||
    pathname.startsWith("/service-area/");

// ━━━ REPLACE WITH: ━━━
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
```

**Change 2 — Mobile nav touch targets (F-011):**

There are 6 locations to change. I'll mark each:

**2a — Services `<summary>` (Explore section):**
```typescript
// ━━━ FIND: ━━━
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-white">
                    <span>Services</span>

// ━━━ REPLACE WITH: ━━━
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-white">
                    <span>Services</span>
```

**2b — Services dropdown sub-links:**
```typescript
// ━━━ FIND (inside Services <details>): ━━━
                        className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/7 hover:text-white"

// ━━━ REPLACE WITH: ━━━
                        className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-slate-200 transition hover:bg-white/7 hover:text-white"
```

**2c — Industries `<summary>`:**
```typescript
// ━━━ FIND: ━━━
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-white">
                    <span>Industries</span>

// ━━━ REPLACE WITH: ━━━
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-white">
                    <span>Industries</span>
```

**2d — Industries dropdown sub-links:**
```typescript
// ━━━ FIND (inside Industries <details>): ━━━
                        className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/7 hover:text-white"

// ━━━ REPLACE WITH: ━━━
                        className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-slate-200 transition hover:bg-white/7 hover:text-white"
```

**2e — "Explore" standalone links (About, Service Area):**
```typescript
// ━━━ FIND (the .filter for About, Service Area): ━━━
                      className="block rounded-xl px-4 py-3 text-[13px] font-medium text-white/95 transition hover:bg-white/6"

// ━━━ REPLACE WITH: ━━━
                      className="flex min-h-[44px] items-center rounded-xl px-4 py-3 text-[13px] font-medium text-white/95 transition hover:bg-white/6"
```

**2f — "Resources" standalone links (FAQ, Careers):**
```typescript
// ━━━ FIND (the .filter for FAQ, Careers): ━━━
                      className="block rounded-xl px-4 py-3 text-[13px] font-medium text-white/95 transition hover:bg-white/6"

// ━━━ REPLACE WITH: ━━━
                      className="flex min-h-[44px] items-center rounded-xl px-4 py-3 text-[13px] font-medium text-white/95 transition hover:bg-white/6"
```

Note: 2e and 2f use identical class strings — they're separate `.filter().map()` blocks but the replacement is the same.

**Change 3 — Desktop button heights (F-013):**

**3a — Desktop call button:**
```typescript
// ━━━ FIND: ━━━
                className="hidden min-h-[40px] items-center rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:border-white/35 hover:bg-white/8 lg:inline-flex"

// ━━━ REPLACE WITH: ━━━
                className="hidden min-h-[44px] items-center rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:border-white/35 hover:bg-white/8 lg:inline-flex"
```

**3b — Desktop quote button (consistency fix — same rationale):**
```typescript
// ━━━ FIND: ━━━
              <QuoteCTA ctaId="header_nav_quote" className="min-h-[40px] rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-sm transition hover:bg-slate-100">

// ━━━ REPLACE WITH: ━━━
              <QuoteCTA ctaId="header_nav_quote" className="min-h-[44px] rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0A1628] shadow-sm transition hover:bg-slate-100">
```

**Change 4 — Dynamic copyright year (F-034):**
```typescript
// ━━━ FIND: ━━━
              <p className="mt-1 text-slate-400">© 2026 {COMPANY_SHORT_NAME}</p>

// ━━━ REPLACE WITH: ━━━
              <p className="mt-1 text-slate-400">© {new Date().getFullYear()} {COMPANY_SHORT_NAME}</p>
```

---

### File 3: `PublicChrome.tsx` — 1 Change

**Sticky bar semantics (F-014):**

```typescript
// ━━━ FIND: ━━━
      <div
        className={`floating-widget fixed bottom-0 left-0 z-[30] flex w-full gap-3 border-t border-slate-200/50 bg-white/95 px-4 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-transform duration-300 md:hidden ${
          showStickyBar && !isQuoteOpen
            ? "translate-y-0"
            : "translate-y-full"
        }`}
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
        }}
      >

// ━━━ REPLACE WITH: ━━━
      <div
        role="toolbar"
        aria-label="Quick actions"
        className={`floating-widget fixed bottom-0 left-0 z-[30] flex w-full gap-3 border-t border-slate-200/50 bg-white/95 px-4 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-transform duration-300 md:hidden ${
          showStickyBar && !isQuoteOpen
            ? "translate-y-0"
            : "translate-y-full"
        }`}
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
        }}
      >
```

---

### File 4: `faq/page.tsx` — Shell Removal + Padding Fix + pt Normalization

**Remove import:**
```typescript
// ━━━ DELETE THIS LINE: ━━━
import { PublicPageShell } from "@/components/public/PublicPageShell";
```

**Remove wrapper and fix `<main>`:**
```typescript
// ━━━ FIND: ━━━
      <PublicPageShell>
        <main className="pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
        <main>
```

```typescript
// ━━━ FIND (end of file, before closing </>): ━━━
        </main>
      </PublicPageShell>

// ━━━ REPLACE WITH: ━━━
        </main>
```

**Normalize hero padding (light hero — no dark bg, less content):**
```typescript
// ━━━ FIND: ━━━
          <section className="relative overflow-hidden border-b border-slate-200 bg-white pb-20 pt-32 md:pb-24 md:pt-40">

// ━━━ REPLACE WITH: ━━━
          <section className="relative overflow-hidden border-b border-slate-200 bg-white pb-20 pt-28 md:pb-24 md:pt-36">
```

---

### File 5: `contact/page.tsx` — Shell Removal + Padding Fix

**Remove import:**
```typescript
// ━━━ DELETE THIS LINE: ━━━
import { PublicPageShell } from "@/components/public/PublicPageShell";
```

**Remove wrapper and fix `<main>`:**
```typescript
// ━━━ FIND: ━━━
      <PublicPageShell>
        <main className="pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
        <main>
```

```typescript
// ━━━ FIND (end of file, before closing </>): ━━━
        </main>
      </PublicPageShell>

// ━━━ REPLACE WITH: ━━━
        </main>
```

Hero `pt-32 md:pt-40` **kept as-is** — dark hero with substantial content (breadcrumb + kicker + h1 + body + 3 contact cards).

---

### File 6: `service-area/page.tsx` — Shell Removal + Padding Fix

**Remove import:**
```typescript
// ━━━ DELETE THIS LINE: ━━━
import { PublicPageShell } from "@/components/public/PublicPageShell";
```

**Remove wrapper and fix `<main>`:**
```typescript
// ━━━ FIND: ━━━
      <PublicPageShell>
        <main className="pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
        <main>
```

```typescript
// ━━━ FIND (end of file, before closing </>): ━━━
        </main>
      </PublicPageShell>

// ━━━ REPLACE WITH: ━━━
        </main>
```

Hero `pt-32 md:pt-40` **kept as-is** — dark hero with substantial content (breadcrumb + kicker + h1 + body + stats grid + region legend).

---

### File 7: `terms/page.tsx` — Shell Removal + Padding Fix + pt Normalization

**Remove import:**
```typescript
// ━━━ DELETE THIS LINE: ━━━
import { PublicPageShell } from "@/components/public/PublicPageShell";
```

**Remove wrapper and fix `<main>`:**
```typescript
// ━━━ FIND: ━━━
      <PublicPageShell>
        <main className="pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
        <main>
```

```typescript
// ━━━ FIND (end of file, before closing </>): ━━━
        </main>
      </PublicPageShell>

// ━━━ REPLACE WITH: ━━━
        </main>
```

**Normalize hero padding (light hero — `bg-[#FAFAF8]`, text page):**
```typescript
// ━━━ FIND: ━━━
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] pb-14 pt-32 md:pb-18 md:pt-40">

// ━━━ REPLACE WITH: ━━━
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] pb-14 pt-28 md:pb-18 md:pt-36">
```

---

### File 8: `privacy/page.tsx` — Shell Removal + Padding Fix + pt Normalization

**Remove import:**
```typescript
// ━━━ DELETE THIS LINE: ━━━
import { PublicPageShell } from "@/components/public/PublicPageShell";
```

**Remove wrapper and fix `<main>`:**
```typescript
// ━━━ FIND: ━━━
      <PublicPageShell>
        <main className="pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
        <main>
```

```typescript
// ━━━ FIND (end of file, before closing </>): ━━━
        </main>
      </PublicPageShell>

// ━━━ REPLACE WITH: ━━━
        </main>
```

**Normalize hero padding:**
```typescript
// ━━━ FIND: ━━━
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] pb-14 pt-32 md:pb-18 md:pt-40">

// ━━━ REPLACE WITH: ━━━
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] pb-14 pt-28 md:pb-18 md:pt-36">
```

---

### File 9: `about/page.tsx` — Padding Fix Only

```typescript
// ━━━ FIND: ━━━
      <main className="bg-[#FAFAF8] pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
      <main className="bg-[#FAFAF8]">
```

No other Session 1 changes. No shell removal needed (page doesn't use `PublicPageShell`).

---

### File 10: `careers/page.tsx` — Padding Fix Only

```typescript
// ━━━ FIND: ━━━
    <main className="bg-[#FAFAF8] pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
    <main className="bg-[#FAFAF8]">
```

No other Session 1 changes.

---

### File 11: `industries/[slug]/page.tsx` — Padding Fix Only

```typescript
// ━━━ FIND: ━━━
      <main className="bg-[#FAFAF8] pb-24 md:pb-0">

// ━━━ REPLACE WITH: ━━━
      <main className="bg-[#FAFAF8]">
```

No other Session 1 changes.

---

## Session 1 Change Summary

| File | Changes | Lines Changed |
|------|---------|---------------|
| `PublicPageShell.tsx` | **DELETE** | -3 |
| `PublicHeader.tsx` | forceSolidHeader +2 conditions, 6 touch target fixes, 2 button height bumps, 1 copyright fix | ~12 |
| `PublicChrome.tsx` | +2 attributes on sticky bar | 2 |
| `faq/page.tsx` | Remove import, remove wrapper, remove `pb-24`, normalize `pt` | 5 |
| `contact/page.tsx` | Remove import, remove wrapper, remove `pb-24` | 4 |
| `service-area/page.tsx` | Remove import, remove wrapper, remove `pb-24` | 4 |
| `terms/page.tsx` | Remove import, remove wrapper, remove `pb-24`, normalize `pt` | 5 |
| `privacy/page.tsx` | Remove import, remove wrapper, remove `pb-24`, normalize `pt` | 5 |
| `about/page.tsx` | Remove `pb-24 md:pb-0` from `<main>` | 1 |
| `careers/page.tsx` | Remove `pb-24 md:pb-0` from `<main>` | 1 |
| `industries/[slug]/page.tsx` | Remove `pb-24 md:pb-0` from `<main>` | 1 |

**Total: 1 file deleted, 10 files modified, ~43 line-level edits.**

---

## Verification Checklist

After applying all changes:

```
□ grep -r "PublicPageShell" src/     → Zero results
□ grep -r "pb-24" src/app/           → Zero results in page files
   (PublicChrome.tsx should be the ONLY file with pb-24)
□ Visit /faq at 375px                → No double padding, hero fills width
□ Visit /contact at 375px            → Dark hero extends edge-to-edge
□ Visit /service-area at 375px       → Dark hero extends edge-to-edge
□ Visit /services                    → Solid navy header before scroll
□ Visit /services/post-construction  → Solid navy header before scroll
□ Mobile menu → inspect any link     → All ≥ 44px height
□ Desktop → inspect Call button      → ≥ 44px height
□ Desktop → inspect Free Quote btn   → ≥ 44px height
□ VoiceOver on sticky bar            → "Quick actions toolbar"
□ Mobile menu footer                 → Shows current year (not 2026)
□ Visit /privacy                     → Correct header clearance (no overlap)
□ Visit /terms                       → Correct header clearance (no overlap)
□ No content hidden behind header on any page
□ Sticky bar doesn't overlap content at 375px on any page
```

---

