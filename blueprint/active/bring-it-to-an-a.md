# Roadmap to A-Grade: Every Area → 10/10

---

## Validation Overlay (2026-04-12)

This section validates feasibility and sequencing against current repo state and the active solution control plane.

### Scope Decision
- Keep this roadmap independent from the fix-first control plane.
- Source of truth for fixes and risk closure: `blueprint/active/solutioning-guide.md`.
- Source of truth for upgrades and net-new capabilities: this document.

### Classification Legend
- `Fix-Aligned`: Directly closes currently open validated findings.
- `Upgrade`: Improves UX/quality/performance after stability gates are met.
- `Net-New`: New capability beyond current defect scope.

### Feasibility Snapshot (By Primary Area)

| Area | Classification | Feasibility | Primary Dependencies on Open Findings |
| --- | --- | --- | --- |
| Accessibility | Fix-Aligned | High | C-1, C-25, C-26, C-27, C-31 |
| Mobile UX | Fix-Aligned + Upgrade | High | C-25, C-26, C-27, C-10, C-13, C-39 |
| Admin CRM | Fix-Aligned + Upgrade | Medium-High | C-10, C-12, C-18, C-20, C-21 |
| Data Integrity | Fix-Aligned | High | C-16, C-24, C-28, C-30, C-38 |
| Security | Fix-Aligned | Medium-High | SB-6, C-40, C-70, #1047 |
| Public Site | Fix-Aligned + Upgrade | Medium-High | SB-1, SB-2, SB-3, C-2, C-5/C-17, C-6 |
| Employee Portal | Fix-Aligned + Upgrade | Medium | C-46, C-47 |
| Admin Dashboard | Fix-Aligned + Upgrade | Medium-High | C-11/C-19, C-54 |
| Architecture | Upgrade | Medium | Depends on stabilization of C/SB critical path |
| Infrastructure | Upgrade | High | Mostly independent; verify with deployment/runtime env |

### Second-Pass (35 Items) Triage

Implement in core rollout (high ROI, low rework risk):
- 1 `USER FEEDBACK SYSTEM`
- 2 `DOUBLE SUBMISSION PREVENTION`
- 3 `URL STATE & DEEP LINKING`
- 4 `CURRENCY & DATE FORMATTING CONSISTENCY`
- 6 `LOADING STATES & SKELETONS`
- 7 `EMPTY STATES`
- 8 `ABORTCONTROLLER ON UNMOUNT`
- 9 `STALE CLOSURES & RACE CONDITIONS`
- 11 `Z-INDEX MANAGEMENT`
- 25 `PERFORMANCE OPTIMIZATION`
- 26 `CONTENT SECURITY POLICY`
- 27 `CACHING STRATEGY`
- 30 `STATUS BADGE CONSISTENCY`
- 31 `ADMIN SIDEBAR POLISH`

Implement after core stabilization (valuable, moderate coupling):
- 12 `FORM STATE PERSISTENCE`
- 14 `UNDO PATTERN`
- 15 `REAL-TIME SUBSCRIPTIONS`
- 17 `PRINT & PDF EXPORT`
- 18 `KEYBOARD SHORTCUTS`
- 28 `SHARED UI COMPONENT LIBRARY`
- 32 `NOTIFICATION PREFERENCES`
- 33 `DATA EXPORT & REPORTING`

Defer unless explicit business trigger exists (high effort or strategic capability):
- 10 `GLOBAL SEARCH (COMMAND PALETTE)`
- 13 `BATCH OPERATIONS`
- 16 `MULTI-TAB SYNC`
- 19 `CALENDAR VIEW`
- 20 `MAP VIEW FOR SCHEDULING`
- 21 `RECURRING JOB SCHEDULING`
- 22 `CUSTOMER-FACING PORTAL`
- 23 `SEO FINAL POLISH`
- 34 `PHOTO GALLERY FOR ADMIN`
- 29 `ONBOARDING & HELP`
- 35 `PRIORITY MATRIX — THIS PASS` (planning artifact, not implementation scope)

### Should All Upgrades Be Implemented?
- No. Implementing every upgrade is not required to reach an A-grade operating product.
- Recommended target for this program: complete all fix-aligned work plus high-ROI upgrades; defer capability-heavy items unless tied to active revenue or operations goals.

### Reassessed Grade Trajectory
- Current validated state: `B-` (approximately 78/100).
- After all solution-guide fixes + migration/runtime gates + core rollout upgrades above: `A- to A` (approximately 90-94/100).
- After full roadmap (including strategic net-new capabilities): potential `A/A+` (approximately 94-96/100), with diminishing returns per engineering hour.

### Recommended Execution Order
1. Close fix-critical items from `solutioning-guide.md` first (security, integrity, relation normalization, mobile blockers).
2. Ship core rollout upgrade set from this roadmap.
3. Run full validation pass (lint/type/build + preflight/smoke + runtime evidence capture).
4. Promote only artifact-backed items to `Resolved (Runtime Verified)`.
5. Re-prioritize deferred net-new capability items by business ROI.

---

## Table of Contents

1. [Accessibility (3 → 10)](#1-accessibility)
2. [Mobile UX (4 → 10)](#2-mobile-ux)
3. [Admin CRM (5 → 10)](#3-admin-crm)
4. [Data Integrity (5 → 10)](#4-data-integrity)
5. [Security (6 → 10)](#5-security)
6. [Public Site (7 → 10)](#6-public-site)
7. [Employee Portal (7 → 10)](#7-employee-portal)
8. [Admin Dashboard (7 → 10)](#8-admin-dashboard)
9. [Architecture (8 → 10)](#9-architecture)
10. [Infrastructure (9 → 10)](#10-infrastructure)
11. [Priority Matrix](#11-priority-matrix)
12. [Effort Estimates](#12-effort-estimates)

---

## 1. ACCESSIBILITY (3 → 10) {#1-accessibility}

This is the lowest score and the most work. It matters because: WCAG 2.1 AA compliance is a legal requirement for many government contracts (cleaning companies often bid on these), it's an SEO signal, and it's the right thing to do.

### Why It's a 3

The codebase has **two good implementations** (`BeforeAfterSlider.tsx`, `EmployeePortalTabs.tsx`) proving the team knows how to do accessibility — it just wasn't applied consistently. The remaining ~40+ violations are spread across every surface.

### 1.1 Skip Navigation (WCAG 2.4.1 — Level A)

**Current state:** Skip link in `PublicChrome.tsx` targets `#main-content` but only 6 of 19+ pages set that ID.

**Fix:**

| Task | Detail | Effort |
|---|---|---|
| Add `id="main-content"` to the `<main>` element in `PublicChrome.tsx` layout wrapper | Single point of change covers all public pages | 5 min |
| Add skip link to `AdminShell.tsx` targeting `#admin-content` | Admin portal has no skip navigation at all | 15 min |
| Add skip link to employee portal layout | Same pattern | 15 min |
| Ensure skip link is visible on focus | `:focus` style that positions it on-screen. Currently it may be `sr-only` without a focus override. Use `focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg` | 10 min |

### 1.2 Focus Management (WCAG 2.4.3, 2.4.7 — Level A/AA)

**Current state:** Zero focus management anywhere. When admin modules switch, focus stays on the sidebar button. When modals open, focus isn't trapped. When mutations complete, no focus redirect.

**Fix — Module Switching:**

```typescript
// In AdminShell.tsx, after module switch:
useEffect(() => {
  const heading = document.querySelector('#admin-content h1, #admin-content h2');
  if (heading instanceof HTMLElement) {
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }
}, [activeModule]);
```

**Fix — Modal Focus Trap:**

Create a reusable hook:

```typescript
// src/hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelector);
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstFocusable?.focus();

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus(); // Restore focus on close
    };
  }, [isOpen]);

  return containerRef;
}
```

**Apply to:** Every modal, dialog, slide-over, and overlay in the app. Files:
- `FloatingQuotePanel.tsx`
- `ExitIntentOverlay.tsx`
- Any confirmation dialogs you add (C-24 QA rework, C-12 quote send)
- Admin module modals (quote creation, job creation, etc.)

**Fix — Mutation Completion:**

After any create/update/delete, move focus to:
- The success toast (if you add one)
- The updated row in the list
- The heading of the section

This prevents screen reader users from being stranded after an action.

### 1.3 Form Labels (WCAG 1.3.1, 3.3.2 — Level A)

**Current state:** ~40 inputs across admin modules use placeholder text as the only label. Screen readers announce these as unlabeled fields.

**The pattern to apply everywhere:**

```tsx
// BAD — current pattern across admin
<input
  placeholder="Search leads..."
  className="rounded-md border px-3 py-2 text-sm"
/>

// GOOD — accessible pattern
<div>
  <label htmlFor="lead-search" className="sr-only">Search leads</label>
  <input
    id="lead-search"
    placeholder="Search leads..."
    className="rounded-md border px-3 py-2 text-sm"
  />
</div>
```

**Files that need this (prioritized by user frequency):**

| File | Unlabeled Inputs | Priority |
|---|---|---|
| `LeadPipelineClient.tsx` | Search, status select, all quote form fields | High |
| `TicketManagementClient.tsx` | Search, filter selects, job form fields | High |
| `HiringInboxClient.tsx` | Search input, status filter | High |
| `InventoryMgmtClient.tsx` | All supply form fields, search | Medium |
| `ConfigurationClient.tsx` | All settings fields | Medium |
| `QuoteTemplateManager.tsx` | Template form fields | Medium |
| `NotificationDispatchClient.tsx` | Filter selects | Low |
| `UnifiedInsightsClient.tsx` | Range select | Low |
| All public quote form steps | Step inputs | High |

**Efficient approach:** Create a reusable labeled input component:

```tsx
// src/components/ui/LabeledInput.tsx
interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  srOnly?: boolean;
  error?: string;
}

export function LabeledInput({ label, srOnly = false, error, id, ...props }: LabeledInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label
        htmlFor={inputId}
        className={srOnly ? 'sr-only' : 'block text-sm font-medium text-slate-700 mb-1'}
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

Then do a find-and-replace sweep across all admin components.

### 1.4 ARIA Live Regions (WCAG 4.1.3 — Level A)

**Current state:** Zero `aria-live` regions. When data loads, mutations complete, errors appear, or counts change — screen readers announce nothing.

**What to add:**

```tsx
// src/components/ui/StatusAnnouncer.tsx
"use client";
import { useEffect, useRef, useState } from 'react';

let announceCallback: ((message: string) => void) | null = null;

export function announce(message: string) {
  announceCallback?.(message);
}

export function StatusAnnouncer() {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    announceCallback = (msg) => {
      setMessage(''); // Reset to retrigger
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setMessage(msg), 100);
    };
    return () => { announceCallback = null; };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      role="status"
      className="sr-only"
    >
      {message}
    </div>
  );
}
```

**Mount once in root layout.** Then call `announce()` after:

| Event | Message Example |
|---|---|
| Dashboard loaded | "Dashboard loaded. 3 active jobs, 2 leads need attention." |
| Lead status changed | "Lead status updated to qualified." |
| Quote sent | "Quote sent successfully." |
| Query error | "Error loading leads. Retry available." |
| Mutation error | "Failed to update job status. Please try again." |
| Search results updated | "5 results found." |
| Tab switched | "Now viewing Operations tab." |

### 1.5 Interactive Elements Keyboard Access (WCAG 2.1.1 — Level A)

**Current state:** Multiple files use `<div onClick>` or `<tr onClick>` without keyboard support.

**Known violators:**

| File | Element | Fix |
|---|---|---|
| `HiringInboxClient.tsx` | `<tr onClick>` on application rows | Add `tabIndex={0}`, `role="button"`, `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handler(); }}` |
| `LeadPipelineClient.tsx` | Lead cards in kanban | Same pattern — or use `<button>` wrapper |
| `NotificationCenterClient.tsx` | Notification rows | Same pattern |
| `InventoryMgmtClient.tsx` | Supply rows | Same pattern |

**Better pattern — create a reusable clickable row:**

```tsx
// src/components/ui/ClickableRow.tsx
interface ClickableRowProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ClickableRow({ onClick, children, className = '' }: ClickableRowProps) {
  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${className}`}
    >
      {children}
    </tr>
  );
}
```

### 1.6 Color Contrast (WCAG 1.4.3 — Level AA)

**Current state:** Multiple `text-slate-400` and `text-slate-500` elements on white or light backgrounds fall below the 4.5:1 ratio for normal text.

**Systematic fix:**

| Current Class | Contrast on White | Fix | New Contrast |
|---|---|---|---|
| `text-slate-400` | ~3.0:1 ❌ | `text-slate-500` for decorative, `text-slate-600` for informational | 4.6:1+ ✅ |
| `text-slate-500` | ~4.0:1 ❌ (for <18.7px) | `text-slate-600` for body text smaller than 18.7px | 5.5:1+ ✅ |
| `text-[10px]` anything | Below minimum regardless | Increase to `text-xs` (12px) minimum | — |
| `text-amber-600` on `bg-amber-50` | ~3.8:1 ❌ | `text-amber-800` on `bg-amber-50` | 6.2:1 ✅ |
| `text-green-600` on `bg-green-50` | ~3.5:1 ❌ | `text-green-800` on `bg-green-50` | 5.8:1 ✅ |

**Efficient approach:** Global find-and-replace in admin components:
1. `text-[10px]` → `text-xs` (every instance)
2. `text-[11px]` → `text-xs` (every instance)
3. Audit remaining `text-slate-400` and `text-slate-500` on case-by-case basis

### 1.7 Semantic HTML (WCAG 1.3.1 — Level A)

**Current state:** Missing semantic elements in several areas.

| Location | Current | Should Be |
|---|---|---|
| Admin sidebar | `<div>` with buttons | `<nav aria-label="Admin navigation">` |
| Admin module tabs | `<div>` with buttons | `<div role="tablist">` with `role="tab"` and `role="tabpanel"` (copy from `EmployeePortalTabs.tsx`) |
| Privacy/Terms pages | `<div>` lists | `<section>`, `<article>`, `<blockquote>` where appropriate |
| Dashboard metric groups | Flat `<div>` grid | `<section aria-label="Key metrics">` or `role="group"` |
| Data tables | Already `<table>` ✅ | Add `<caption>` to each table describing what it shows |
| FAQ sections | Has schema ✅ | Add `<details>`/`<summary>` or proper ARIA disclosure pattern |
| Kanban columns | `<div>` columns | `<section aria-label="New leads">` per column |
| Admin forms | No `<fieldset>` | Wrap related fields in `<fieldset>` with `<legend>` |

### 1.8 Reduced Motion (WCAG 2.3.3 — Level AAA)

**Current state:** Animations exist (pulse, transition) with no `prefers-reduced-motion` respect.

**Fix — one Tailwind config addition:**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // ...existing
    },
  },
  plugins: [],
  // This enables motion-reduce: variant
  // Already available in Tailwind v3+
};
```

Then audit animation usage:

```tsx
// Change:
className="animate-pulse"
// To:
className="animate-pulse motion-reduce:animate-none"

// Change:
className="transition duration-300"
// To:
className="transition duration-300 motion-reduce:transition-none"
```

### 1.9 Page Titles (WCAG 2.4.2 — Level A)

**Current state:** Most pages likely have `<title>` via Next.js metadata. Verify each admin module view announces its title to screen readers when switched.

**Fix for admin modules:**

```tsx
// In AdminShell.tsx, add document.title update on module switch:
useEffect(() => {
  const titles: Record<ModuleId, string> = {
    overview: 'Dashboard - Admin',
    leads: 'Lead Pipeline - Admin',
    tickets: 'Job Management - Admin',
    operations: 'Operations - Admin',
    // ... all modules
  };
  document.title = titles[activeModule] || 'Admin';
}, [activeModule]);
```

### 1.10 Error Identification (WCAG 3.3.1 — Level A)

**Current state:** Form errors are either not shown or shown as generic text without programmatic association.

**Pattern:**

```tsx
// Every input with validation needs:
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'field-name-error' : undefined}
/>
{error && (
  <p id="field-name-error" role="alert" className="mt-1 text-sm text-red-600">
    {error}
  </p>
)}
```

### Accessibility Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current (post-S9) | 3/10 | Skip link on public pages |
| + Skip links everywhere + focus management | 5/10 | All three surfaces navigable |
| + All form labels + ARIA live | 7/10 | Screen reader usable |
| + Keyboard access + semantic HTML | 8/10 | WCAG 2.1 A complete |
| + Color contrast + reduced motion + error identification | 9/10 | WCAG 2.1 AA complete |
| + Audit tool zero-error + manual screen reader test | 10/10 | Production accessible |

**Total effort: ~40-60 hours**

---

## 2. MOBILE UX (4 → 10) {#2-mobile-ux}

### Why It's a 4

The report explicitly states the primary user is "mom at a job site" using her phone. The admin portal is essentially unusable on mobile. Session 8 patches 3 files but the problem is systemic.

### 2.1 iOS Auto-Zoom (The #1 Mobile Bug)

**Current state:** Every input below 16px triggers iOS Safari zoom on focus. This affects every admin form, every search input, and every select dropdown.

**Why it matters:** On iOS, when you tap an input with `font-size < 16px`, Safari zooms the viewport to 125-150%. The user then has to pinch-to-zoom-out after every single field interaction. For someone filling out quotes or managing leads on their phone, this is maddening.

**The fix is simple but requires a sweep:**

```css
/* Global minimum — add to globals.css or tailwind base layer */
@layer base {
  input, select, textarea {
    @apply text-base; /* 16px — prevents iOS zoom */
  }
}

/* OR per-component: replace every instance of */
text-xs  /* 12px — triggers zoom */
text-sm  /* 14px — triggers zoom */
/* with */
text-base /* 16px — safe */
/* on ALL input, select, and textarea elements */
```

**Files that need this sweep:**

| File | Affected Elements |
|---|---|
| `LeadPipelineClient.tsx` | All form inputs, search, selects |
| `TicketManagementClient.tsx` | Job form fields, search |
| `HiringInboxClient.tsx` | Search, filters |
| `InventoryMgmtClient.tsx` | Supply forms, quantity inputs |
| `ConfigurationClient.tsx` | All settings fields |
| `QuoteTemplateManager.tsx` | Template fields |
| `UnifiedInsightsClient.tsx` | Range select |
| `NotificationDispatchClient.tsx` | Filters |
| `OverviewDashboard.tsx` | None currently — no form inputs |
| `PostJobAutomation.tsx` | Settings form |
| All public quote form steps | Quote wizard inputs |

**Efficient approach:** The CSS base layer fix handles 80% of cases. Then do one sweep for any inputs that explicitly override with `text-sm` or `text-xs` classes.

### 2.2 Touch Targets (WCAG 2.5.8 — 44px minimum)

**Current state:** Multiple action buttons at ~28px height. Five stacked vertically on lead cards means accidental taps on irreversible actions ("Convert to Client" directly above "Mark Lost").

**The standard:** Apple HIG says 44×44pt minimum. Google Material says 48×48dp. WCAG 2.5.8 says 24×24 CSS pixels minimum (but 44px is best practice).

**Pattern to apply:**

```tsx
// BAD — current
<button className="px-2 py-1 text-xs">Convert to Client</button>
// Renders at approximately 28px height

// GOOD
<button className="min-h-[44px] px-3 py-2 text-sm">Convert to Client</button>
// 44px minimum touch target

// For icon-only buttons:
<button className="flex h-11 w-11 items-center justify-center" aria-label="Delete">
  <TrashIcon className="h-5 w-5" />
</button>
```

**Where this matters most (by risk of accidental tap):**

| File | Element | Risk | Fix |
|---|---|---|---|
| `LeadPipelineClient.tsx` | 5 stacked action buttons per lead card | **High** — irreversible "Convert" next to "Delete" | `min-h-[44px]` + spacing + reorder destructive actions away from safe ones |
| `TicketManagementClient.tsx` | Status change buttons | **High** — status transitions | `min-h-[44px]` + confirmation on destructive changes |
| `HiringInboxClient.tsx` | Status update buttons | **Medium** | `min-h-[44px]` |
| `InventoryMgmtClient.tsx` | Approve/reject buttons | **Medium** | `min-h-[44px]` + spacing |
| Admin sidebar | Module nav buttons | **Low** — not destructive | Already adequate if padding is sufficient |

### 2.3 Kanban on Mobile (The Layout Problem)

**Current state:** Lead pipeline kanban has 7 columns. Below 1280px, they stack vertically. 7 × ~300px = 2100px of scroll. Session 8 queues C-25 to fix this.

**Three approaches (pick one):**

**Option A: Tab/filter pattern (recommended)**

```tsx
// Mobile: Show one column at a time with tab selector
<div className="lg:hidden">
  <div className="flex overflow-x-auto gap-2 pb-2 border-b mb-4">
    {statusColumns.map((col) => (
      <button
        key={col.key}
        onClick={() => setActiveColumn(col.key)}
        className={`min-h-[44px] whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium
          ${activeColumn === col.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
      >
        {col.label} ({col.count})
      </button>
    ))}
  </div>

  {/* Show only active column's leads */}
  <div className="space-y-3">
    {leadsByStatus[activeColumn]?.map((lead) => (
      <LeadCard key={lead.id} lead={lead} />
    ))}
  </div>
</div>

{/* Desktop: Keep existing grid */}
<div className="hidden lg:grid lg:grid-cols-7 gap-4">
  {/* existing kanban columns */}
</div>
```

**Option B: Horizontal scroll**

```tsx
<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-7">
  {statusColumns.map((col) => (
    <div key={col.key} className="min-w-[280px] snap-start flex-shrink-0 lg:min-w-0">
      {/* column content */}
    </div>
  ))}
</div>
```

**Option C: List view on mobile**

```tsx
<div className="lg:hidden">
  {allLeads.map((lead) => (
    <div key={lead.id} className="border-b py-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">{lead.name}</span>
        <StatusBadge status={lead.status} />
      </div>
      <p className="text-sm text-slate-500 mt-1">{lead.company_name}</p>
    </div>
  ))}
</div>
```

**Recommendation:** Option A. It's the most natural mobile pattern (matches iOS Mail, Trello mobile, etc.) and eliminates the scroll problem entirely.

### 2.4 Responsive Data Tables

**Current state:** UnifiedInsightsClient has a good pattern — desktop `<table>` hidden on mobile, card layout shown instead. Most other admin components don't do this.

**Apply the UnifiedInsights pattern to:**

| File | Table Content | Mobile Card Should Show |
|---|---|---|
| `HiringInboxClient.tsx` | Applicant rows | Name, status badge, date, action button |
| `InventoryMgmtClient.tsx` | Supply rows | Name, stock/threshold, urgency indicator |
| `TicketManagementClient.tsx` | Job list | Title, status, date, assigned crew |
| `NotificationCenterClient.tsx` | Notification rows | Type, recipient, status, time |

**Reusable pattern:**

```tsx
// src/components/ui/ResponsiveTable.tsx
interface ResponsiveTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render: (item: T) => React.ReactNode;
    mobileVisible?: boolean; // Show in mobile card
    mobilePrimary?: boolean; // Bold/prominent in card
  }[];
  onRowClick?: (item: T) => void;
  emptyText?: string;
}
```

### 2.5 Bottom Navigation for Admin

**Current state:** Admin sidebar is a left-side panel that either takes full width on mobile (blocking content) or is hidden behind a hamburger menu.

**Industry standard for admin on mobile:** Bottom tab bar with 4-5 most-used modules, "More" button for the rest.

```tsx
// src/components/admin/MobileBottomNav.tsx
const MOBILE_TABS: { id: ModuleId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Home', icon: <HomeIcon /> },
  { id: 'leads', label: 'Leads', icon: <LeadsIcon /> },
  { id: 'tickets', label: 'Jobs', icon: <JobsIcon /> },
  { id: 'operations', label: 'Ops', icon: <OpsIcon /> },
  { id: 'more', label: 'More', icon: <MoreIcon /> },
];

export function MobileBottomNav({ active, onSelect }: Props) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white lg:hidden"
    >
      <div className="flex items-center justify-around py-1">
        {MOBILE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`flex flex-col items-center min-h-[44px] min-w-[44px] px-2 py-1
              ${active === tab.id ? 'text-blue-600' : 'text-slate-500'}`}
          >
            {tab.icon}
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
```

Then add `pb-20 lg:pb-0` to the main content area to prevent bottom nav overlap.

### 2.6 Swipe Gestures for Common Actions

**Current state:** None. All actions require precise tap on small buttons.

**Industry standard on mobile:** Swipe-to-reveal for common actions (swipe left for delete/archive, swipe right for approve).

This is a nice-to-have but would significantly improve the "mom at a job site" experience. Libraries like `react-swipeable` handle this cleanly.

### 2.7 Pull-to-Refresh

**Current state:** The only way to refresh data is to find and tap a "Refresh" button.

**Industry standard:** Pull-to-refresh on list views. Can be implemented with:

```tsx
// Simple pull-to-refresh using touch events
function usePullToRefresh(onRefresh: () => Promise<void>) {
  // Track touch start/move/end
  // When pulled down > 60px and released, call onRefresh
  // Show loading indicator during refresh
}
```

### Mobile UX Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current (post-S8) | 4/10 | 3 files patched for kanban, touch targets, iOS zoom |
| + Global iOS zoom fix + all touch targets 44px | 6/10 | No more zoom, no more mis-taps |
| + Kanban mobile tab pattern + responsive tables | 7/10 | Admin readable on phone |
| + Bottom nav + pull-to-refresh | 8/10 | Admin feels like a mobile app |
| + Swipe gestures + optimized card layouts | 9/10 | Fast to use on phone |
| + Offline indicator + PWA manifest + install prompt | 10/10 | Functions as native-like app |

**Total effort: ~50-70 hours**

---

## 3. ADMIN CRM (5 → 10) {#3-admin-crm}

### Why It's a 5

The lead pipeline works (post-fixes), but it's missing fundamental CRM features that every cleaning business needs. The admin can create leads, send quotes, and convert to jobs — but can't see client history, add notes, schedule follow-ups, or get a complete picture of any relationship.

### 3.1 Activity Log / Timeline

**What's missing:** When you look at a lead, you see the current status and nothing else. There's no history of what happened: when was the quote sent? Who called? What did they say? When was the follow-up?

**What to build:**

```sql
-- New table: activity_log
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL, -- 'lead', 'job', 'client', 'employee'
  entity_id uuid NOT NULL,
  action text NOT NULL, -- 'status_change', 'note_added', 'quote_sent', 'call_logged', 'email_sent'
  description text,
  metadata jsonb DEFAULT '{}', -- { from_status: 'new', to_status: 'quoted' }
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_log_entity ON activity_log (entity_type, entity_id, created_at DESC);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_all_activity_log ON activity_log
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

**UI component:**

```tsx
// src/components/admin/ActivityTimeline.tsx
interface ActivityItem {
  id: string;
  action: string;
  description: string | null;
  createdBy: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
}

function ActivityTimeline({ entityType, entityId }: { entityType: string; entityId: string }) {
  // Query activity_log for this entity
  // Render as vertical timeline with icons per action type
  // Include "Add Note" input at top
}
```

**Where to render it:**
- Lead detail panel (expand a lead card → see full history)
- Client detail page (new, see 3.2)
- Job detail panel (expand a job → see full history)

**Auto-log from existing mutations:**
Every place that currently calls `supabase.from('leads').update({ status: 'quoted' })` should also insert an activity log entry. Wrap in a helper:

```typescript
async function updateLeadStatus(leadId: string, newStatus: string, userId: string) {
  const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
  if (!error) {
    await supabase.from('activity_log').insert({
      entity_type: 'lead',
      entity_id: leadId,
      action: 'status_change',
      description: `Status changed to ${newStatus}`,
      metadata: { to_status: newStatus },
      created_by: userId,
    });
  }
  return { error };
}
```

### 3.2 Client Detail View

**What's missing:** `convertLeadToClient` creates a record in `clients` that no UI ever reads. There is literally no page or component to see client information. These are write-only records.

**What to build:**

| Section | Content |
|---|---|
| Header | Company name, contact info, conversion date |
| Contact | Phone, email, address (from original lead) |
| Jobs | All jobs for this client with status, date, total |
| Quotes | All quotes sent with status and amounts |
| Financial | Total billed, total paid, outstanding balance (from QuickBooks if connected) |
| Activity | Full timeline (3.1) filtered to this client + related leads/jobs |
| Notes | Free-text notes area |

**Data query:**

```typescript
const { data: client } = await supabase
  .from('clients')
  .select(`
    *,
    jobs:jobs(id, title, status, scheduled_date, clean_type),
    leads:leads(id, name, status, created_at)
  `)
  .eq('id', clientId)
  .single();
```

### 3.3 Follow-Up Scheduling

**What's missing:** No way to schedule "call this lead back on Thursday." No reminders. No way to see which leads are overdue for follow-up.

**Minimal implementation:**

```sql
ALTER TABLE leads ADD COLUMN follow_up_at timestamptz;
ALTER TABLE leads ADD COLUMN follow_up_note text;
```

Then in the lead card or detail view:

```tsx
<div>
  <label htmlFor="follow-up">Follow up on</label>
  <input
    id="follow-up"
    type="datetime-local"
    className="text-base" // iOS zoom safe
    value={lead.followUpAt || ''}
    onChange={(e) => updateLead(lead.id, { follow_up_at: e.target.value })}
  />
</div>
```

On the dashboard, add a "Follow-ups Due" section:

```typescript
// Query for leads with follow_up_at <= now
const { data: overdue } = await supabase
  .from('leads')
  .select('id, name, follow_up_at, follow_up_note')
  .lte('follow_up_at', new Date().toISOString())
  .not('status', 'in', '("won","lost","dormant")')
  .order('follow_up_at', { ascending: true });
```

### 3.4 Confirmation Dialogs

**What's missing:** Irreversible actions (convert to client, mark lost, QA rework, delete template) execute immediately on click with zero confirmation.

**Reusable component:**

```tsx
// src/components/ui/ConfirmDialog.tsx
interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
}

export function ConfirmDialog({
  open, onConfirm, onCancel, title, description,
  confirmLabel = 'Confirm', variant = 'default', loading = false,
}: ConfirmDialogProps) {
  const ref = useFocusTrap(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      <div ref={ref} className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="min-h-[44px] rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-white
              ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' :
                variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
                'bg-slate-900 hover:bg-slate-800'}
              disabled:opacity-60`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Apply to:**

| Action | File | Confirm Message |
|---|---|---|
| Convert to Client | `LeadPipelineClient.tsx` | "Convert {name} to a client? This will create a client record and mark the lead as won." |
| Mark Lost | `LeadPipelineClient.tsx` | "Mark {name} as lost? You can reopen later from the Lost column." |
| QA Rework | `OperationsClient.tsx` | "Send back for rework? This will reset completion status. Previous data will be archived." |
| Delete Template | `QuoteTemplateManager.tsx` | "Delete template '{name}'? This cannot be undone." |
| Reject Supply Request | `InventoryMgmtClient.tsx` | "Reject this supply request from {requester}?" |
| Reject Applicant | `HiringInboxClient.tsx` | "Reject {name}'s application?" |

### 3.5 Pagination

**What's missing:** All list views load all rows into the browser. The report identified: 200 leads, 300 supplies, all hiring rows, 500 invoices, 50+ jobs with 4 sub-queries each.

**Reusable pagination hook:**

```typescript
// src/hooks/usePagination.ts
interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({ pageSize = 25, initialPage = 0 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);

  const from = page * pageSize;
  const to = from + pageSize - 1;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNext = page < totalPages - 1;
  const hasPrev = page > 0;

  return {
    page, setPage,
    from, to,
    totalCount, setTotalCount,
    totalPages, hasNext, hasPrev,
    pageSize,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages - 1)),
    prevPage: () => setPage((p) => Math.max(p - 1, 0)),
  };
}
```

**Supabase usage:**

```typescript
const { from, to, setTotalCount } = usePagination({ pageSize: 25 });

const { data, count } = await supabase
  .from('leads')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(from, to);

setTotalCount(count ?? 0);
```

**Pagination UI component:**

```tsx
// src/components/ui/PaginationControls.tsx
export function PaginationControls({ page, totalPages, hasNext, hasPrev, onNext, onPrev }: Props) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
      <p className="text-sm text-slate-600">
        Page {page + 1} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="min-h-[44px] rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="min-h-[44px] rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

**Apply to:** `LeadPipelineClient`, `HiringInboxClient`, `InventoryMgmtClient`, `TicketManagementClient`, `NotificationCenterClient`

### 3.6 State Machine Validation

**What's missing:** Leads, jobs, and QA statuses allow any→any transitions. An admin can go from "new" directly to "completed" or from "lost" to "quoted."

**Define valid transitions:**

```typescript
// src/lib/state-machines.ts
export const LEAD_TRANSITIONS: Record<string, string[]> = {
  new: ['contacted', 'qualified', 'lost', 'dormant'],
  contacted: ['qualified', 'quoted', 'lost', 'dormant'],
  qualified: ['site_visit_scheduled', 'quoted', 'lost', 'dormant'],
  site_visit_scheduled: ['quoted', 'lost', 'dormant'],
  quoted: ['won', 'lost', 'dormant'],
  won: ['converted'],
  lost: ['new'], // reopen
  dormant: ['new', 'contacted'], // reactivate
  converted: [], // terminal
};

export const JOB_TRANSITIONS: Record<string, string[]> = {
  scheduled: ['en_route', 'cancelled'],
  en_route: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [], // terminal — QA handles further
  cancelled: ['scheduled'], // reschedule
};

export function isValidTransition(
  machine: Record<string, string[]>,
  from: string,
  to: string,
): boolean {
  return machine[from]?.includes(to) ?? false;
}
```

**Enforce in UI (disable invalid options):**

```tsx
<select value={lead.status} onChange={handleStatusChange}>
  {Object.entries(LEAD_TRANSITIONS).map(([status, _]) => (
    <option
      key={status}
      value={status}
      disabled={!isValidTransition(LEAD_TRANSITIONS, lead.status, status) && status !== lead.status}
    >
      {status}
    </option>
  ))}
</select>
```

**Enforce server-side** in any API route that updates status.

### 3.7 Quote Preview Before Send

**What's missing (C-12):** "Send Quote" immediately hits the API. No preview of what the customer will see.

**Build a preview modal** that renders the quote exactly as the customer would see it (line items, total, valid-until date, company branding) with "Send" and "Edit" buttons.

### 3.8 Search and Filtering

**What's missing:** Most list views have basic search but no filtering. Leads can't be filtered by date range, source, or value. Jobs can't be filtered by crew member, date, or clean type.

**Add filter bar pattern:**

```tsx
// Reusable filter bar
<div className="flex flex-wrap gap-2 py-3">
  <FilterSelect label="Status" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
  <FilterSelect label="Clean Type" options={cleanTypes} value={typeFilter} onChange={setTypeFilter} />
  <FilterDateRange from={dateFrom} to={dateTo} onChange={setDateRange} />
  <button onClick={clearFilters} className="text-sm text-slate-500 underline">Clear</button>
</div>
```

### Admin CRM Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current (post-S6) | 5/10 | Pipeline works, quotes send, jobs create |
| + Activity log + confirmation dialogs | 6/10 | Actions tracked, mistakes prevented |
| + Client detail view + follow-ups | 7/10 | CRM has relationship context |
| + Pagination + state machines | 8/10 | Scales to real data volume, valid workflows |
| + Search/filter + quote preview | 9/10 | Efficient to use daily |
| + Recurring jobs + calendar view + reports | 10/10 | Complete business operations tool |

**Total effort: ~80-120 hours**

---

## 4. DATA INTEGRITY (5 → 10) {#4-data-integrity}

### Why It's a 5

Multiple multi-step operations happen client-side without transactions. Partial failures leave orphaned records. No audit trail. No undo capability.

### 4.1 Server-Side Transactions

**What's missing:** Operations like "create ticket" (job → assignment → notification → checklist) happen as 4 sequential client-side queries. If query 3 fails, you have a job and assignment with no checklist.

**Fix pattern:** Move multi-step operations to API routes that use Supabase's `rpc()` for transactional writes:

```sql
-- Supabase function for atomic ticket creation
CREATE OR REPLACE FUNCTION create_ticket(
  p_title text,
  p_address text,
  p_clean_type text,
  p_assigned_to uuid,
  p_scheduled_date date,
  p_scheduled_time time,
  p_checklist_template_id uuid DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_job_id uuid;
  v_assignment_id uuid;
BEGIN
  -- Create job
  INSERT INTO jobs (title, address, clean_type, status, scheduled_date, scheduled_time, assigned_to)
  VALUES (p_title, p_address, p_clean_type, 'scheduled', p_scheduled_date, p_scheduled_time, p_assigned_to)
  RETURNING id INTO v_job_id;

  -- Create assignment
  INSERT INTO job_assignments (job_id, employee_id, role, status)
  VALUES (v_job_id, p_assigned_to, 'lead', 'assigned')
  RETURNING id INTO v_assignment_id;

  -- Copy checklist from template if provided
  IF p_checklist_template_id IS NOT NULL THEN
    INSERT INTO job_checklist_items (job_id, item_text, sort_order)
    SELECT v_job_id, item_text, sort_order
    FROM checklist_template_items
    WHERE template_id = p_checklist_template_id
    ORDER BY sort_order;
  END IF;

  RETURN jsonb_build_object(
    'job_id', v_job_id,
    'assignment_id', v_assignment_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Operations that need this treatment:**

| Operation | Current Steps | Risk of Partial Failure |
|---|---|---|
| Create ticket | job → assignment → checklist → notification | Orphan job with no crew |
| Convert lead to client | update lead → create client → update quotes | Client created but lead still shows as "quoted" |
| QA rework | reset completion → update status → notify employee | Status reset but no notification |
| Send quote | create quote → create line items → send email → update lead status | Email sent but lead status not updated |

### 4.2 Optimistic Updates with Rollback

**Current state:** Client-side mutations do full-table refetch after every change. Scroll position is lost. No optimistic UI.

**Pattern:**

```typescript
async function updateLeadStatus(leadId: string, newStatus: string) {
  // 1. Optimistic update
  setLeads((prev) =>
    prev.map((l) => l.id === leadId ? { ...l, status: newStatus } : l)
  );

  // 2. Server mutation
  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus })
    .eq('id', leadId);

  // 3. Rollback on failure
  if (error) {
    setLeads((prev) =>
      prev.map((l) => l.id === leadId ? { ...l, status: oldStatus } : l)
    );
    announce('Failed to update status. Change reverted.');
  }
}
```

### 4.3 Input Validation (Server-Side)

**What's missing:** API routes trust client data without validation.

**Pattern using zod:**

```typescript
import { z } from 'zod';

const QuoteRequestSchema = z.object({
  leadId: z.string().uuid(),
  lineItems: z.array(z.object({
    description: z.string().min(1).max(500),
    quantity: z.number().positive(),
    unitPrice: z.number().min(0),
  })).min(1),
  validUntil: z.string().refine((d) => new Date(d) > new Date(), 'Must be future date'),
  notes: z.string().max(2000).optional(),
});

// In route handler:
const parsed = QuoteRequestSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
}
```

**Routes that need validation:**

| Route | What to Validate |
|---|---|
| `quote-request/route.ts` | Email format, name length, service type enum |
| `quote-create-job/route.ts` | Quote ID exists, address not empty, dates valid |
| `quote-send/route.ts` | Already has validation ✅ — model for others |
| `employment-application/route.ts` | All 17 fields |
| `notification-dispatch/route.ts` | Auth only — no body |

### 4.4 Soft Deletes

**What's missing:** Any deletion is permanent with no recovery path.

```sql
-- Add to tables that support deletion
ALTER TABLE leads ADD COLUMN deleted_at timestamptz;
ALTER TABLE jobs ADD COLUMN deleted_at timestamptz;
ALTER TABLE quotes ADD COLUMN deleted_at timestamptz;

-- Update RLS to exclude deleted
-- Add WHERE deleted_at IS NULL to all SELECT policies
```

### Data Integrity Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current | 5/10 | Basic CRUD works |
| + Server-side transactions for multi-step ops | 7/10 | No orphan records |
| + Zod validation on all API routes | 8/10 | Invalid data rejected |
| + Optimistic updates + soft deletes | 9/10 | Responsive UI, recoverable mistakes |
| + Audit trail (activity log) + idempotency keys | 10/10 | Full traceability |

**Total effort: ~40-60 hours**

---

## 5. SECURITY (6 → 10) {#5-security}

### Why It's a 6

Ship-blockers are fixed. But: no rate limiting, no CSRF, remaining RLS gaps, no input sanitization on some routes.

### 5.1 Rate Limiting

**Current state:** In-memory rate limit on employment application route resets every cold start. No rate limiting anywhere else.

**Fix:** Use Upstash Redis (already in the optional env groups from Session 1):

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiters = {
  // Public form submissions: 5 per minute per IP
  publicForm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'rl:public-form',
  }),

  // API routes: 30 per minute per user
  apiRoute: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    prefix: 'rl:api',
  }),

  // Auth attempts: 10 per 15 minutes per IP
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '15 m'),
    prefix: 'rl:auth',
  }),
};
```

**Apply to:**

| Route | Limiter | Key |
|---|---|---|
| `quote-request/route.ts` | `publicForm` | IP address |
| `employment-application/route.ts` | `publicForm` | IP address |
| `conversion-event/route.ts` | `publicForm` | IP address |
| All admin API routes | `apiRoute` | User ID |
| Login/signup | `auth` | IP address |

### 5.2 CSRF Protection

**Current state:** No CSRF tokens on any mutations.

**For Next.js App Router**, the primary CSRF vector is subdomain cookie theft. Fix:

```typescript
// In API routes, verify Origin header:
function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
  ].filter(Boolean);

  return !!origin && allowedOrigins.includes(origin);
}

// In each mutation route:
if (request.method !== 'GET' && !validateOrigin(request)) {
  return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
}
```

### 5.3 RLS Completion

**Current state (from RLS map):**

| Table | Gap |
|---|---|
| `job_checklist_items` | Employees can rewrite `item_text` and forge `completed_by` |
| `completion_reports` | Employees can SELECT but not INSERT/UPDATE (C-73) |
| `employment_applications` | Unlimited anonymous INSERT — no rate limiting at DB level |
| `jobs` | Multi-crew gap (C-40) — partially fixed |

**Fixes:**

```sql
-- Restrict employee checklist updates to safe columns only
DROP POLICY IF EXISTS employee_update_checklist ON job_checklist_items;
CREATE POLICY employee_update_checklist ON job_checklist_items
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_assignments ja
      WHERE ja.job_id = job_checklist_items.job_id
        AND ja.employee_id = auth.uid()
    )
  )
  WITH CHECK (
    -- Can only update completion status, not item text
    item_text = (SELECT item_text FROM job_checklist_items WHERE id = job_checklist_items.id)
    AND (completed_by IS NULL OR completed_by = auth.uid())
  );

-- Allow employees to INSERT completion reports for their jobs
CREATE POLICY employee_insert_completion_reports ON completion_reports
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_assignments ja
      WHERE ja.job_id = completion_reports.job_id
        AND ja.employee_id = auth.uid()
    )
  );
```

### 5.4 Admin Auth Check on Client Components

**Current state:** 5+ admin client components load data without any role verification, relying entirely on RLS.

**Pattern:** Add at the top of each admin component:

```typescript
// In each admin client component
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return <div>Not authenticated</div>;
}

// Quick role check — RLS is the real guard, this is belt-and-suspenders
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile?.role !== 'admin') {
  return <div>Unauthorized</div>;
}
```

**Or better:** Create a wrapper component:

```tsx
// src/components/admin/AdminGuard.tsx
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }}) => {
      if (!user) return setAuthorized(false);
      supabase.from('profiles').select('role').eq('id', user.id).single()
        .then(({ data }) => setAuthorized(data?.role === 'admin'));
    });
  }, []);

  if (authorized === null) return <LoadingSpinner />;
  if (!authorized) return <UnauthorizedMessage />;
  return <>{children}</>;
}
```

### 5.5 HTML Injection / XSS

**Current state:** Some API routes insert user-provided text directly into email HTML without sanitization.

**Fix:** Sanitize all user input that goes into HTML:

```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Use before inserting into email templates:
const safeNotes = escapeHtml(body.notes || '');
```

### Security Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current (post-S2) | 6/10 | Ship-blockers fixed, SB-6 closed |
| + Rate limiting (Upstash) + CSRF origin check | 7/10 | Abuse prevention |
| + RLS completion (checklist, completion reports) | 8/10 | DB-level data isolation |
| + Admin guard component + HTML sanitization | 9/10 | Defense in depth |
| + Security audit tool (OWASP ZAP scan) + penetration test | 10/10 | Verified secure |

**Total effort: ~30-40 hours**

---

## 6. PUBLIC SITE (7 → 10) {#6-public-site}

### Why It's a 7

Strong SEO foundation, good page structure. Gaps: fake content (fixed in S9), FAQ schema without visible content, service type divergence, hydration mismatch.

### 6.1 Service Type Single Source of Truth

**Current state:** 7 parallel definitions of service types across the codebase. When they diverge, quote forms silently fail to match templates.

**Fix:**

```typescript
// src/lib/service-types.ts — THE ONLY DEFINITION
export const SERVICE_TYPES = [
  { key: 'standard', label: 'Standard Cleaning', description: '...' },
  { key: 'deep', label: 'Deep Cleaning', description: '...' },
  { key: 'move_in_out', label: 'Move In/Out Cleaning', description: '...' },
  { key: 'post_construction', label: 'Post-Construction', description: '...' },
  { key: 'commercial', label: 'Commercial Cleaning', description: '...' },
  { key: 'recurring', label: 'Recurring Service', description: '...' },
] as const;

export type ServiceTypeKey = typeof SERVICE_TYPES[number]['key'];

export const SERVICE_TYPE_KEYS = SERVICE_TYPES.map((s) => s.key);
```

**Then replace all 7 locations:**

| File | Current Pattern | Replace With |
|---|---|---|
| `QuoteSection.tsx` | Local array | Import `SERVICE_TYPES` |
| `FloatingQuotePanel.tsx` | Local array | Import `SERVICE_TYPES` |
| `contact/page.tsx` | Local array | Import `SERVICE_TYPES` |
| `quote-request/route.ts` | No validation | Validate against `SERVICE_TYPE_KEYS` |
| `LeadPipelineClient.tsx` | Local array | Import `SERVICE_TYPES` |
| `ConfigurationClient.tsx` | Local array | Import `SERVICE_TYPES` |
| Service detail pages | Inline strings | Import `SERVICE_TYPES` |

### 6.2 FAQ Schema Alignment

**Current state:** 5 service pages emit `FAQPage` JSON-LD schema without rendering visible FAQ content. Google may penalize for structured data that doesn't match visible content.

**Fix options:**
1. **Remove** the FAQ schema from pages that don't show FAQs
2. **Add** visible FAQ accordion below service content that matches the schema

Option 2 is better for SEO:

```tsx
// src/components/public/FAQAccordion.tsx
export function FAQAccordion({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  return (
    <section aria-label="Frequently asked questions">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-lg border border-slate-200 bg-white">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-slate-900 min-h-[44px]">
              {faq.question}
              <ChevronIcon className="h-5 w-5 transition group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
```

### 6.3 Hero Hydration Fix

**Current state (C-3):** Hero component reads `localStorage` during `useState` initialization → hydration mismatch between server and client.

**Fix:**

```typescript
// BAD
const [dismissed, setDismissed] = useState(localStorage.getItem('hero-dismissed') === 'true');

// GOOD
const [dismissed, setDismissed] = useState(false);
useEffect(() => {
  setDismissed(localStorage.getItem('hero-dismissed') === 'true');
}, []);
```

### 6.4 Analytics Pipeline

**Current state (C-2):** Analytics endpoint uses a r



### 6.4 Analytics Pipeline (continued)

**Current state (C-2):** Analytics endpoint uses a rogue Supabase client (not from the blessed factories), inserts with anon key (likely RLS-blocked), never checks the insert result, and always returns `{ok: true}`. Additionally, a single CTA click fires 3 analytics events (C-4).

**Fix — step by step:**

**Step 1: Fix the endpoint**

```typescript
// src/app/api/conversion-event/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const EventSchema = z.object({
  event_type: z.string().min(1).max(100),
  event_data: z.record(z.unknown()).optional(),
  page_url: z.string().url().optional(),
  session_id: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = EventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
  }

  const supabase = await createServerClient();
  const { error } = await supabase
    .from('conversion_events')
    .insert({
      ...parsed.data,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('[analytics] Insert failed:', error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

**Step 2: Deduplicate client-side event firing**

```typescript
// src/lib/analytics.ts
const firedEvents = new Set<string>();

export function trackEvent(eventType: string, data?: Record<string, unknown>) {
  // Deduplicate within same page lifecycle
  const key = `${eventType}:${JSON.stringify(data ?? {})}`;
  if (firedEvents.has(key)) return;
  firedEvents.add(key);

  // Fire and forget — but at least don't triple-fire
  fetch('/api/conversion-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type: eventType, event_data: data }),
  }).catch(() => {
    // Silent failure is acceptable for analytics
  });
}
```

**Step 3: Fix CTAs to fire exactly one event**

In `CTAButton.tsx` and quote form components, ensure each user action fires exactly one `trackEvent` call — not one per analytics layer.

### 6.5 Real Testimonials

**Current state (SB-2):** 4 fabricated testimonials with fake names and company names. FTC 16 CFR Part 255 violation risk.

**Fix:** This is an owner action, not a code fix. Provide a content template:

```typescript
// src/lib/testimonials.ts
export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  role?: string;
  rating: number; // 1-5
  verified: boolean; // Has permission on file
}

// OWNER: Replace with real customer testimonials
// Each testimonial must have written permission from the customer
export const TESTIMONIALS: Testimonial[] = [
  // {
  //   quote: "...",
  //   author: "Jane Smith",
  //   company: "ABC Property Management",
  //   role: "Operations Manager",
  //   rating: 5,
  //   verified: true,
  // },
];
```

Until real testimonials are provided, the section should show a fallback:

```tsx
{TESTIMONIALS.length > 0 ? (
  <TestimonialCarousel testimonials={TESTIMONIALS} />
) : (
  <section className="py-16 text-center">
    <p className="text-lg text-slate-600">
      We're proud of the relationships we've built with our clients.
    </p>
    <a href="/contact" className="mt-4 inline-block text-blue-600 underline">
      Get in touch to learn more
    </a>
  </section>
)}
```

### 6.6 Image Error Handling

**Current state:** Broken image URLs show empty space with no placeholder.

**Reusable component:**

```tsx
// src/components/ui/SafeImage.tsx
"use client";
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

export function SafeImage({ fallbackSrc = '/images/placeholder.webp', ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : props.src}
      onError={() => setError(true)}
    />
  );
}
```

### Public Site Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current (post-S9) | 7/10 | SEO schema, honest content |
| + Service type single source + FAQ visible content | 8/10 | No silent form failures, schema aligned |
| + Analytics pipeline fixed + hydration fix | 9/10 | Data reliable, no console errors |
| + Real testimonials + image fallbacks + performance audit | 10/10 | Professional, trustworthy |

**Total effort: ~25-35 hours**

---

## 7. EMPLOYEE PORTAL (7 → 10) {#7-employee-portal}

### Why It's a 7

Excellent infrastructure (offline photo queue, checklists, geo-location). Broken data queries fixed in S5. Gaps: no notification back to admin, RLS write gap, no bi-directional communication.

### 7.1 Completion Report Write Path (C-73)

**Current state:** Employees can SELECT completion reports but cannot INSERT or UPDATE. The entire checklist completion → photo upload → completion report flow silently fails when writing through the browser client.

**Fix (SQL):**

```sql
-- Allow employees to insert completion reports for jobs they're assigned to
CREATE POLICY employee_insert_completion_reports ON completion_reports
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_assignments ja
      WHERE ja.job_id = completion_reports.job_id
        AND ja.employee_id = auth.uid()
    )
  );

-- Allow employees to update their own completion reports
CREATE POLICY employee_update_completion_reports ON completion_reports
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_assignments ja
      WHERE ja.job_id = completion_reports.job_id
        AND ja.employee_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_assignments ja
      WHERE ja.job_id = completion_reports.job_id
        AND ja.employee_id = auth.uid()
    )
  );
```

### 7.2 Admin ↔ Employee Notification Loop

**Current state:** 6 of 7 admin→employee action types produce zero notification. When admin reworks a job, changes assignment, or sends a message, the employee has no way to know without checking the app.

**What to build:**

```typescript
// src/lib/notifications/employee-notifications.ts
import { dispatchNotification } from '@/lib/supabase/assignment-notifications';

export type EmployeeNotificationType =
  | 'job_assigned'        // Already works
  | 'job_reworked'        // Admin sent back for rework
  | 'job_reassigned'      // Assignment changed
  | 'job_cancelled'       // Job cancelled
  | 'schedule_changed'    // Date/time changed
  | 'message_received'    // Admin sent a message
  | 'supply_approved';    // Supply request approved

export async function notifyEmployee(
  employeeId: string,
  type: EmployeeNotificationType,
  jobId: string,
  message: string,
) {
  // Insert into notification_dispatch_queue
  const supabase = createAdminClient();

  await supabase.from('notification_dispatch_queue').insert({
    recipient_id: employeeId,
    notification_type: type,
    job_id: jobId,
    message_body: message,
    channel: 'sms', // or 'push' when PWA is implemented
    status: 'queued',
  });
}
```

**Hook into existing admin actions:**

| Admin Action | File | Add Notification Call |
|---|---|---|
| QA rework | Operations/QA component | `notifyEmployee(assignee, 'job_reworked', jobId, 'Job needs rework: ...')` |
| Reassign job | TicketManagement | `notifyEmployee(newAssignee, 'job_reassigned', jobId, 'You've been assigned to ...')` |
| Cancel job | TicketManagement | `notifyEmployee(assignee, 'job_cancelled', jobId, 'Job cancelled: ...')` |
| Reschedule | TicketManagement | `notifyEmployee(assignee, 'schedule_changed', jobId, 'Schedule updated: ...')` |
| Send message | MessageThread | `notifyEmployee(assignee, 'message_received', jobId, '...')` |
| Approve supply | InventoryMgmt | `notifyEmployee(requester, 'supply_approved', null, 'Supply request approved')` |

### 7.3 Employee Notification Inbox

**Current state:** Employees have no way to see past notifications or unread alerts in the portal.

**What to build:**

```tsx
// src/components/employee/EmployeeNotifications.tsx
function EmployeeNotifications({ employeeId }: { employeeId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('notification_dispatch_queue')
      .select('id, notification_type, message_body, status, created_at, job_id')
      .eq('recipient_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setNotifications(data ?? []));
  }, [employeeId]);

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div key={n.id} className={`rounded-lg border p-4 ${n.status === 'sent' ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}>
          <p className="text-sm font-medium">{n.message_body}</p>
          <p className="mt-1 text-xs text-slate-500">
            {new Date(n.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### 7.4 Employee Issue Report Improvements

**Current state:** Submit button allows empty submissions. No photo attachment for issues.

**Fix:**

```tsx
<button
  type="submit"
  disabled={!issueText.trim() || isSubmitting}
  className="min-h-[44px] rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
>
  {isSubmitting ? 'Submitting...' : 'Report Issue'}
</button>
```

Add photo attachment using the existing `client-photo.ts` pipeline — the infrastructure is already production-grade, just needs a UI trigger on the issue form.

### 7.5 Timezone Display

**Current state:** Job times display without timezone indicator. `toLocaleString()` on serverless returns UTC. Employees see wrong times.

**Fix:**

```typescript
// src/lib/format-date.ts
const BUSINESS_TIMEZONE = 'America/Chicago'; // Austin, TX

export function formatJobTime(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(isoString));
}

// Usage in employee components:
// formatJobTime(job.scheduled_start) → "Mon, Jan 6, 9:00 AM"
```

Apply to every date/time display in both admin and employee portals.

### 7.6 PWA / Offline Indicator

**Current state:** The photo upload queue works offline beautifully. But the user has no indication they're offline, and the app doesn't prompt for PWA install.

**Add offline indicator:**

```tsx
// src/components/ui/OfflineIndicator.tsx
"use client";
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    setOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white">
      You&apos;re offline — photos will upload when connection returns
    </div>
  );
}
```

**Add PWA manifest:**

```json
// public/manifest.json
{
  "name": "Cleaning Crew Portal",
  "short_name": "Crew Portal",
  "start_url": "/employee",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0A1628",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Employee Portal Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current (post-S5) | 7/10 | Data loads, photos work, checklists render |
| + Completion report write path + issue validation | 8/10 | Full write cycle works |
| + Notification loop + employee inbox | 9/10 | Bi-directional communication |
| + Timezone fix + offline indicator + PWA | 10/10 | Production-ready mobile tool |

**Total effort: ~30-45 hours**

---

## 8. ADMIN DASHBOARD (7 → 10) {#8-admin-dashboard}

### Why It's a 7

Post-Session 7, real metrics are computed, error handling exists, trends are accurate. Remaining gaps: revenue always 0 in ops tab, `leadsTotal` incomplete, no drill-down.

### 8.1 Fix `leadsTotal` (#825)

**Current state:** Only counts 4 of 9 statuses.

**Find in `UnifiedInsightsClient.tsx`:**

```typescript
function leadsTotal(m: OverviewMetrics): number {
  return m.newLeads + m.wonLeads + m.quotedLeads + m.lostLeads;
}
```

**Replace with:**

```typescript
// #825: Count all lead statuses, not just 4
function leadsTotal(m: OverviewMetrics): number {
  // These 4 are individually tracked; the actual total comes from
  // the full query, but we sum what we have in the metrics.
  // For true accuracy, add totalLeads to OverviewMetrics from leads query length.
  return m.newLeads + m.wonLeads + m.quotedLeads + m.lostLeads;
}
```

Actually, the real fix is to add `totalLeads` to `OverviewMetrics` and set it from `leads.length` in `loadDashboard`:

```typescript
// In OverviewMetrics type:
totalLeads: number;

// In loadDashboard:
totalLeads: leads.length,

// In leadsTotal:
function leadsTotal(m: OverviewMetrics): number {
  return m.totalLeads; // Actual count from query
}
```

### 8.2 Fix `jobsByClient` Revenue (#827)

**Current state:** Revenue column in operations tab is always 0. The `clientMap` accumulates `existing.revenue` but nothing ever adds to it because jobs don't have a revenue column.

**Fix — join quotes to get revenue:**

In the jobs query inside `loadDashboard`, add a quote join:

```typescript
// Change jobs query to include quote total:
supabase
  .from("jobs")
  .select(`
    id, status, qa_status, client_id, scheduled_start, scheduled_end,
    clients:client_id(company_name),
    quotes:quote_id(total),
    created_at
  `)
  .gte("created_at", startIso),
```

Then in the client map accumulation:

```typescript
const quoteData = Array.isArray(job.quotes) ? job.quotes[0] : job.quotes;
existing.revenue += Number(quoteData?.total ?? 0);
```

**Note:** This depends on `jobs` having a `quote_id` column. If it doesn't, you'll need to join through leads:

```typescript
// Alternative: aggregate from quotes directly
const { data: quoteTotals } = await supabase
  .from("quotes")
  .select("lead_id, total, leads:lead_id(client_id)")
  .gte("created_at", startIso)
  .eq("status", "accepted");
```

### 8.3 Drill-Down Navigation

**Current state:** Dashboard cards show numbers but clicking them does nothing.

**Add click handlers to metric cards:**

```tsx
<MetricCard
  label="Active Jobs"
  value={metrics.activeJobs}
  onClick={() => {
    // Navigate to jobs module with pre-applied filter
    onModuleSelect('tickets');
    // Ideally pass filter state via URL params or context
  }}
  clickable
/>
```

**Update MetricCard to support click:**

```tsx
function MetricCard({ label, value, subtitle, variant, onClick, clickable }: MetricCardProps) {
  const Component = clickable ? 'button' : 'article';
  return (
    <Component
      onClick={onClick}
      className={`rounded-lg border p-4 text-left ${VARIANT_STYLES[variant ?? 'default']}
        ${clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      {/* same content */}
    </Component>
  );
}
```

### 8.4 Auto-Refresh

**Current state:** Data only refreshes on manual click or page load.

```typescript
// In OverviewDashboard:
useEffect(() => {
  void fetchMorningBriefing();

  // Auto-refresh every 5 minutes
  const interval = setInterval(() => {
    void fetchMorningBriefing();
  }, 5 * 60 * 1000);

  return () => clearInterval(interval);
}, [fetchMorningBriefing]);
```

Add a visual indicator showing when data was last refreshed:

```tsx
<p className="text-xs text-slate-400">
  Last updated: {lastRefresh ? formatRelativeTime(lastRefresh) : 'Loading...'}
</p>
```

### Admin Dashboard Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current (post-S7) | 7/10 | Real metrics, error handling, trends |
| + leadsTotal fix + revenue fix | 8/10 | All numbers accurate |
| + Drill-down + auto-refresh | 9/10 | Interactive and current |
| + Historical trend charts + KPI targets + alerts | 10/10 | Executive-grade dashboard |

**Total effort: ~20-30 hours**

---

## 9. ARCHITECTURE (8 → 10) {#9-architecture}

### Why It's an 8

Strong fundamentals. Server components, typed throughout, clean separation. Gaps: no shared validation layer, divergent auth patterns, no error boundary strategy.

### 9.1 Unified Validation Layer

**What's missing:** Client and server validate independently with different rules.

**Fix:** Shared zod schemas:

```typescript
// src/lib/schemas/lead.ts
import { z } from 'zod';
import { SERVICE_TYPE_KEYS } from '@/lib/service-types';

export const LeadCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  service_type: z.enum(SERVICE_TYPE_KEYS as [string, ...string[]]),
  message: z.string().max(2000).optional(),
});

// Used in BOTH:
// - Client-side form validation (react-hook-form + zodResolver)
// - Server-side route validation (schema.safeParse(body))
```

### 9.2 Unified Auth Strategy

**Current state:** 4 different auth patterns across the codebase.

| Pattern | Used By | Trust Level |
|---|---|---|
| JWT `app_metadata` | Middleware page guards | Medium — can desync |
| DB profile query | `api-auth.ts` | High — always current |
| Shared secret | `cron-auth.ts` | High — fail-closed |
| None | 5+ client components | None |

**Fix:** Standardize on two patterns:

1. **Page access:** Middleware JWT check (fast, acceptable staleness)
2. **Data mutations:** Always `api-auth.ts` DB check

Create a shared middleware for API routes:

```typescript
// src/lib/middleware/api-guard.ts
import { authorizeAdmin } from '@/lib/supabase/api-auth';

export function withAdminAuth(handler: (req: Request, adminId: string) => Promise<Response>) {
  return async (request: Request) => {
    const auth = await authorizeAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
    }
    return handler(request, auth.userId);
  };
}

// Usage in route:
export const POST = withAdminAuth(async (request, adminId) => {
  // adminId is guaranteed valid admin
  const body = await request.json();
  // ...
});
```

### 9.3 Error Boundary Strategy

**Current state:** Session 6 added `ModuleErrorBoundary` to AdminShell. No other boundaries exist.

**Add boundaries at 3 levels:**

```
App Layout
└── GlobalErrorBoundary (catches routing errors)
    └── Admin Layout
        └── ModuleErrorBoundary (catches per-module — exists from S6)
            └── SectionErrorBoundary (catches per-widget)
```

The section-level boundary lets one broken chart not kill the whole module:

```tsx
// src/components/ui/SectionErrorBoundary.tsx
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; name: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`[${this.props.name}] Widget error:`, error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          This section failed to load.
          <button
            onClick={() => this.setState({ hasError: false })}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 9.4 Consistent Data Fetching Pattern

**Current state:** Some components fetch in `useEffect`, some use `useCallback`, patterns vary.

**Standardize with a custom hook:**

```typescript
// src/hooks/useSupabaseQuery.ts
export function useSupabaseQuery<T>(
  queryFn: (supabase: SupabaseClient) => Promise<{ data: T | null; error: PostgrestError | null }>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const result = await queryFn(supabase);
    if (result.error) {
      setError(result.error.message);
    } else {
      setData(result.data);
    }
    setLoading(false);
  }, deps);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, error, loading, refetch };
}
```

### Architecture Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current | 8/10 | Server components, typed, clean factories |
| + Shared zod schemas + unified auth middleware | 9/10 | Single source of validation and auth |
| + Error boundary hierarchy + data fetching hook | 10/10 | Consistent, resilient patterns |

**Total effort: ~20-30 hours**

---

## 10. INFRASTRUCTURE (9 → 10) {#10-infrastructure}

### Why It's a 9

Already production-grade in most areas. The 1-point gap is operational visibility.

### 10.1 Structured Logging

**Current state:** `console.log` and `console.error` throughout. No structured format, no correlation IDs, no log levels.

**Fix:**

```typescript
// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  // In production, output JSON for log aggregation (Vercel, Datadog, etc.)
  if (process.env.NODE_ENV === 'production') {
    console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
  } else {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[${level.toUpperCase()}] ${message}`,
      context ?? '',
    );
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
};
```

### 10.2 Health Check Endpoint

```typescript
// src/app/api/health/route.ts
export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {};

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    checks.database = error ? 'error' : 'ok';
  } catch {
    checks.database = 'error';
  }

  const allOk = Object.values(checks).every((v) => v === 'ok');

  return NextResponse.json(
    { status: allOk ? 'healthy' : 'degraded', checks },
    { status: allOk ? 200 : 503 },
  );
}
```

### 10.3 Monitoring & Alerting

**Options by budget:**

| Tool | Cost | What It Provides |
|---|---|---|
| Vercel Analytics (built-in) | Free | Web vitals, page load times |
| Sentry | Free tier | Error tracking, stack traces, session replay |
| Upstash QStash | Free tier | Cron job monitoring, dead letter alerts |
| Better Uptime / Checkly | Free tier | Health check pinging, downtime alerts |

**Minimum viable monitoring:**
1. Sentry for error tracking (drop-in Next.js integration)
2. Health check endpoint pinged every 5 minutes
3. Alert on `notification_dispatch_queue` rows stuck in `queued` > 1 hour

### Infrastructure Score Progression

| Milestone | Score | What's Done |
|---|---|---|
| Current | 9/10 | Production-grade email, photo, offline, dispatch |
| + Structured logging + health endpoint + Sentry | 10/10 | Observable, alertable |

**Total effort: ~10-15 hours**

---

## 11. PRIORITY MATRIX {#11-priority-matrix}

Ranked by impact-per-hour:

| Priority | Area | Key Tasks | Hours | Impact |
|---|---|---|---|---|
| **1** | Security | Rate limiting, RLS completion, CSRF | 30-40h | Legal/trust |
| **2** | Accessibility | Skip nav, labels, keyboard, focus, ARIA | 40-60h | Legal/compliance |
| **3** | Mobile UX | iOS zoom, touch targets, kanban mobile, bottom nav | 50-70h | Primary user unblocked |
| **4** | Admin CRM | Activity log, client view, pagination, confirmations | 80-120h | Business operations |
| **5** | Data Integrity | Transactions, validation, soft deletes | 40-60h | Data trust |
| **6** | Public Site | Service types, analytics, testimonials | 25-35h | Sales conversion |
| **7** | Employee Portal | Write path, notifications, timezone, PWA | 30-45h | Crew efficiency |
| **8** | Dashboard | Revenue fix, drill-down, auto-refresh | 20-30h | Decision quality |
| **9** | Architecture | Shared schemas, auth middleware, error boundaries | 20-30h | Developer velocity |
| **10** | Infrastructure | Logging, health check, monitoring | 10-15h | Operational confidence |

---

## 12. EFFORT ESTIMATES {#12-effort-estimates}

### Total to reach 10/10 across the board

| Area | Current | Target | Hours |
|---|---|---|---|
| Accessibility | 3 | 10 | 40-60 |
| Mobile UX | 4 | 10 | 50-70 |
| Admin CRM | 5 | 10 | 80-120 |
| Data Integrity | 5 | 10 | 40-60 |
| Security | 6 | 10 | 30-40 |
| Public Site | 7 | 10 | 25-35 |
| Employee Portal | 7 | 10 | 30-45 |
| Admin Dashboard | 7 | 10 | 20-30 |
| Architecture | 8 | 10 | 20-30 |
| Infrastructure | 9 | 10 | 10-15 |
| **Total** | | | **345-505 hours** |

### Realistic timeline

| Pace | Calendar Time |
|---|---|
| Full-time (40 hr/week) | 9-13 weeks |
| Half-time (20 hr/week) | 17-25 weeks |
| Evenings/weekends (10 hr/week) | 35-50 weeks |

### What gets you to "good enough to sell" (B+ / A-)

Focus on priorities 1-3 plus the highest-impact items from 4-6:

| Task | Hours |
|---|---|
| Security (rate limiting + RLS) | 30 |
| Accessibility (labels + keyboard + skip nav) | 25 |
| Mobile (iOS zoom + touch targets + kanban mobile) | 30 |
| Pagination + confirmations | 15 |
| Service type single source | 5 |
| Real testimonials (owner action) | 2 |
| **"Sellable" total** | **~107 hours** |

That gets you to a solid **B+ / A-** — functional, secure, usable on mobile, honest content, accessible enough. The remaining ~250-400 hours takes you from "good product" to "excellent product."

# Second Pass: B+ → A / A+ — Everything I Missed

---

## Table of Contents

1. [User Feedback System (Toast/Notifications)](#1-user-feedback)
2. [Double Submission Prevention](#2-double-submission)
3. [URL State & Deep Linking](#3-url-state)
4. [Currency & Date Formatting Consistency](#4-formatting)
5. [Icon System (Replace Emoji)](#5-icon-system)
6. [Loading States & Skeletons](#6-loading-states)
7. [Empty States](#7-empty-states)
8. [AbortController on Unmount](#8-abort-controller)
9. [Stale Closures & Race Conditions](#9-stale-closures)
10. [Scroll Position Preservation](#10-scroll-position)
11. [Z-Index Management](#11-z-index)
12. [Form State Persistence](#12-form-persistence)
13. [Batch Operations](#13-batch-operations)
14. [Undo Pattern](#14-undo-pattern)
15. [Real-Time Subscriptions](#15-real-time)
16. [Multi-Tab Sync](#16-multi-tab)
17. [Print & PDF Export](#17-print-pdf)
18. [Keyboard Shortcuts](#18-keyboard-shortcuts)
19. [Admin Search (Global)](#19-global-search)
20. [Calendar View](#20-calendar-view)
21. [Map View for Scheduling](#21-map-view)
22. [Recurring Job Scheduling](#22-recurring-jobs)
23. [Customer-Facing Portal](#23-customer-portal)
24. [SEO Final Polish](#24-seo-polish)
25. [Performance Optimization](#25-performance)
26. [Content Security Policy](#26-csp)
27. [Caching Strategy](#27-caching)
28. [Shared UI Component Library](#28-component-library)
29. [Onboarding & Help](#29-onboarding)
30. [Status Badge Consistency](#30-status-badges)
31. [Admin Sidebar Polish](#31-sidebar-polish)
32. [Notification Preferences](#32-notification-prefs)
33. [Data Export & Reporting](#33-data-export)
34. [Photo Gallery for Admin](#34-photo-gallery)
35. [Priority Matrix — This Pass](#35-priority-matrix)

---

## 1. USER FEEDBACK SYSTEM {#1-user-feedback}

### What's Missing

There is no consistent way to tell the user "that worked" or "that failed." Some mutations have `catch` blocks (post-Session 4) but the user sees... nothing. No toast, no banner, no confirmation. The admin clicks "Send Quote" and the button just stops being disabled. Did it send? Did it fail? You'd have to check your email to find out.

This is the single highest-impact UX gap I didn't cover in the first pass.

### What to Build

```tsx
// src/components/ui/Toaster.tsx
"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void }; // For undo pattern (Section 14)
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, options?: { action?: Toast["action"]; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info", options?: { action?: Toast["action"]; duration?: number }) => {
      const id = crypto.randomUUID();
      const duration = options?.duration ?? (variant === "error" ? 8000 : 4000);

      setToasts((prev) => [...prev, { id, message, variant, action: options?.action, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container — bottom right on desktop, bottom center on mobile */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-sm:inset-x-4 max-sm:right-auto"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium
              animate-in slide-in-from-bottom-2 fade-in duration-200
              ${t.variant === "success" ? "bg-green-600 text-white" : ""}
              ${t.variant === "error" ? "bg-red-600 text-white" : ""}
              ${t.variant === "warning" ? "bg-amber-500 text-white" : ""}
              ${t.variant === "info" ? "bg-slate-800 text-white" : ""}`}
          >
            <span className="flex-1">{t.message}</span>

            {t.action && (
              <button
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className="shrink-0 rounded border border-white/30 px-2 py-1 text-xs font-semibold hover:bg-white/10"
              >
                {t.action.label}
              </button>
            )}

            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-white/60 hover:text-white"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

### Where to Mount

```tsx
// src/app/layout.tsx (or admin layout)
import { ToastProvider } from "@/components/ui/Toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Where to Use (Every Mutation in the App)

| File | Mutation | Toast Message |
|---|---|---|
| `LeadPipelineClient.tsx` | Status change | `"Lead moved to {status}"` / `"Failed to update lead"` |
| `LeadPipelineClient.tsx` | Send quote | `"Quote sent to {name}"` / `"Failed to send quote"` |
| `LeadPipelineClient.tsx` | Convert to client | `"Converted to client"` / `"Conversion failed"` |
| `TicketManagementClient.tsx` | Create job | `"Job created and assigned"` / `"Failed to create job"` |
| `TicketManagementClient.tsx` | Status change | `"Job status updated"` / `"Failed to update"` |
| `HiringInboxClient.tsx` | Status change | `"Application moved to {status}"` / `"Failed"` |
| `InventoryMgmtClient.tsx` | Approve request | `"Supply request approved"` / `"Failed"` |
| `QuoteTemplateManager.tsx` | Save template | `"Template saved"` / `"Failed to save"` |
| `ConfigurationClient.tsx` | Save settings | `"Settings saved"` / `"Failed to save"` |
| `OverviewDashboard.tsx` | Retry load | `"Dashboard refreshed"` / `"Refresh failed"` |
| Employee checklist | Toggle item | `"Checklist updated"` / `"Failed — will retry when online"` |
| Employee photo | Upload queued | `"Photo queued for upload"` |
| Employee issue | Submit | `"Issue reported"` / `"Failed to submit"` |

**Usage pattern:**

```typescript
const { toast } = useToast();

async function handleStatusChange(leadId: string, newStatus: string) {
  try {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) throw error;
    toast(`Lead moved to ${newStatus}`, "success");
  } catch (err) {
    toast("Failed to update lead status", "error");
  }
}
```

**Effort: 4 hours** (component + wiring into all mutations)

---

## 2. DOUBLE SUBMISSION PREVENTION {#2-double-submission}

### What's Missing

Almost no form or mutation button has an `isSubmitting` guard. The user can click "Send Quote" 5 times while waiting and create 5 quotes. This is especially bad on slow mobile connections.

### The Pattern

```tsx
// src/hooks/useAsyncAction.ts
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/Toaster";

export function useAsyncAction() {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const execute = useCallback(
    async (
      action: () => Promise<void>,
      options?: { successMessage?: string; errorMessage?: string },
    ) => {
      if (pending) return; // Guard against double-click
      setPending(true);
      try {
        await action();
        if (options?.successMessage) toast(options.successMessage, "success");
      } catch (err) {
        toast(
          options?.errorMessage || "Something went wrong. Please try again.",
          "error",
        );
      } finally {
        setPending(false);
      }
    },
    [pending, toast],
  );

  return { pending, execute };
}
```

### Usage

```tsx
function LeadActions({ lead }: { lead: Lead }) {
  const { pending, execute } = useAsyncAction();

  return (
    <button
      disabled={pending}
      onClick={() =>
        execute(
          () => sendQuote(lead.id),
          { successMessage: `Quote sent to ${lead.name}`, errorMessage: "Failed to send quote" },
        )
      }
      className="min-h-[44px] rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
    >
      {pending ? "Sending..." : "Send Quote"}
    </button>
  );
}
```

### Where to Apply

Every button that triggers a server mutation. The `useAsyncAction` hook combines:
- Double-click prevention
- Loading state on button
- Toast on success/failure
- Consistent error handling

This replaces the scattered `try/finally` patterns in `LeadPipelineClient.tsx` and the missing `catch` blocks in other components.

**Files that need this:**

| File | Mutation Buttons Count |
|---|---|
| `LeadPipelineClient.tsx` | 5+ (send quote, convert, mark lost, change status, create quote) |
| `TicketManagementClient.tsx` | 4+ (create job, change status, assign, complete) |
| `HiringInboxClient.tsx` | 3+ (change status, schedule interview, hire) |
| `InventoryMgmtClient.tsx` | 4+ (create supply, request, approve, reject) |
| `QuoteTemplateManager.tsx` | 3+ (create, update, delete) |
| `ConfigurationClient.tsx` | 2+ (save settings) |
| `PostJobAutomation.tsx` | 2+ (save settings) |
| Employee portal | 3+ (complete checklist, submit issue, upload photo) |
| Public quote form | 1 (submit quote request) |

**Effort: 3 hours** (hook + sweep through all files)

---

## 3. URL STATE & DEEP LINKING {#3-url-state}

### What's Missing

The admin portal is a single-page app where all state lives in React. This means:

1. **Back button doesn't work** — clicking back exits the admin entirely
2. **Can't bookmark a view** — "show me the quoted leads" has no URL
3. **Can't share a link** — "look at this applicant" requires verbal instructions
4. **Refresh loses position** — F5 goes back to the overview dashboard

For a tool used daily by a business owner, this is a significant friction point.

### What to Build

```typescript
// src/hooks/useAdminRouter.ts
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { ModuleId } from "@/components/admin/AdminShell";

export function useAdminRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeModule = (searchParams.get("module") as ModuleId) || "overview";
  const activeFilter = searchParams.get("filter") || null;
  const activeId = searchParams.get("id") || null;

  const navigate = useCallback(
    (module: ModuleId, params?: Record<string, string>) => {
      const sp = new URLSearchParams();
      sp.set("module", module);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          sp.set(k, v);
        }
      }
      router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  return { activeModule, activeFilter, activeId, navigate };
}
```

### Integration with AdminShell

```tsx
// In AdminShell.tsx
function AdminShell() {
  const { activeModule, activeFilter, navigate } = useAdminRouter();

  // Replace: const [activeModule, setActiveModule] = useState<ModuleId>("overview");
  // With: activeModule comes from URL, navigate() updates URL

  return (
    <div>
      <Sidebar
        activeModule={activeModule}
        onModuleSelect={(id) => navigate(id)}
      />
      <ModuleContent
        module={activeModule}
        filter={activeFilter}
        onModuleSelect={(id) => navigate(id)}
      />
    </div>
  );
}
```

### URL Examples

| User Action | URL |
|---|---|
| View dashboard | `/admin?module=overview` |
| View leads, filtered to quoted | `/admin?module=leads&filter=quoted` |
| View specific lead | `/admin?module=leads&id=abc-123` |
| View hiring inbox | `/admin?module=hiring` |
| View specific applicant | `/admin?module=hiring&id=def-456` |
| View insights, financials tab | `/admin?module=insights&tab=financials&range=quarter` |

### What This Enables

- **Back button works** — go from lead detail → lead list → dashboard
- **Bookmarkable** — save "my quoted leads" as a browser bookmark
- **Shareable** — text your mom "look at this: /admin?module=leads&id=..."
- **Refresh-safe** — F5 returns to exact same view
- **Browser history** — standard navigation expectations met

### Modules to Wire Up

| Module | URL Params |
|---|---|
| Overview | `module=overview` |
| Leads | `module=leads`, `filter={status}`, `id={leadId}` |
| Tickets | `module=tickets`, `filter={status}`, `id={jobId}` |
| Operations | `module=operations`, `tab={qa\|dispatch\|scheduling}` |
| Insights | `module=insights`, `tab={overview\|ops\|...}`, `range={week\|month\|...}` |
| Hiring | `module=hiring`, `filter={status}`, `id={appId}` |
| Inventory | `module=inventory`, `tab={supplies\|requests}` |
| Config | `module=config`, `tab={general\|templates\|automation}` |

**Effort: 6 hours** (hook + AdminShell integration + wire all modules)

---

## 4. CURRENCY & DATE FORMATTING CONSISTENCY {#4-formatting}

### What's Missing

The report identified **6 different currency approaches** and **5 different date approaches** across the codebase. Some files use `toFixed(2)`, others use `toLocaleString()`, others use `Intl.NumberFormat`, and some just concatenate `$` + number.

### What to Build

```typescript
// src/lib/format.ts

// ─── Currency ───────────────────────────────────────────────────────
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const currencyFormatterWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a number as USD currency.
 * - `formatCurrency(1234.5)` → "$1,234.50"
 * - `formatCurrency(1234.5, { whole: true })` → "$1,235"
 * - `formatCurrency(null)` → "—"
 */
export function formatCurrency(
  amount: number | null | undefined,
  options?: { whole?: boolean },
): string {
  if (amount == null || isNaN(amount)) return "—";
  return options?.whole
    ? currencyFormatterWhole.format(amount)
    : currencyFormatter.format(amount);
}

// ─── Dates ──────────────────────────────────────────────────────────
const BUSINESS_TZ = "America/Chicago"; // Austin, TX

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TZ,
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TZ,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TZ,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const relativeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

/**
 * Format an ISO string as a date.
 * - `formatDate("2025-01-06T...")` → "Jan 6, 2025"
 * - `formatDate(null)` → "—"
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

/**
 * Format an ISO string as date + time.
 * - `formatDateTime("2025-01-06T14:30:00Z")` → "Jan 6, 2025, 8:30 AM"
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return dateTimeFormatter.format(d);
}

/**
 * Format an ISO string as time only.
 * - `formatTime("2025-01-06T14:30:00Z")` → "8:30 AM"
 */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return timeFormatter.format(d);
}

/**
 * Format as relative time.
 * - `formatRelative("2025-01-06T...")` → "3 hours ago" or "in 2 days"
 */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";

  const diffMs = d.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (Math.abs(diffMins) < 60) return relativeFormatter.format(diffMins, "minute");
  if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, "hour");
  return relativeFormatter.format(diffDays, "day");
}

// ─── Numbers ────────────────────────────────────────────────────────
/**
 * Format a number with commas.
 * - `formatNumber(12345)` → "12,345"
 */
export function formatNumber(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("en-US");
}

/**
 * Format a percentage.
 * - `formatPercent(0.284)` → "28%"
 * - `formatPercent(94.3, { decimals: 1 })` → "94.3%"
 */
export function formatPercent(
  value: number | null | undefined,
  options?: { decimals?: number; raw?: boolean },
): string {
  if (value == null || isNaN(value)) return "—";
  const v = options?.raw ? value : value; // raw means already 0-100
  const decimals = options?.decimals ?? 0;
  return `${v.toFixed(decimals)}%`;
}

// ─── Phone ──────────────────────────────────────────────────────────
/**
 * Format a phone number for display.
 * - `formatPhone("+15125550199")` → "(512) 555-0199"
 * - `formatPhone("5125550199")` → "(512) 555-0199"
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (national.length !== 10) return phone; // Return as-is if non-standard
  return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
}
```

### Where to Apply

Do a codebase-wide search for these patterns and replace:

| Find | Replace With |
|---|---|
| `$${amount}` | `formatCurrency(amount)` |
| `.toFixed(2)` on currency | `formatCurrency(amount)` |
| `amount.toLocaleString()` for money | `formatCurrency(amount)` |
| `new Date(x).toLocaleDateString()` | `formatDate(x)` |
| `new Date(x).toLocaleString()` | `formatDateTime(x)` |
| `new Date(x).toLocaleTimeString()` | `formatTime(x)` |
| Manual relative time calculations | `formatRelative(x)` |
| Inline `${phone}` formatting | `formatPhone(phone)` |
| `Math.round(x * 100) / 100` for display | `formatPercent(x)` or `formatCurrency(x)` |

**Files affected:** Essentially every admin component, both dashboard files, employee components, and public site components that display dates or prices.

**Effort: 4 hours** (library + sweep)

---

## 5. ICON SYSTEM {#5-icon-system}

### What's Missing

The report flags Systemic Pattern #19: emoji used as UI icons in 4+ files. Problems:
- Cross-platform inconsistent (Android vs iOS vs Windows vs Mac all render differently)
- Screen readers announce emoji names ("clipboard", "money bag") — noise
- Unprofessional appearance
- Can't style (color, size, stroke width)

### What to Build

Don't install a full icon library. Create a small set of SVG icon components for the ~20 icons the app actually uses:

```tsx
// src/components/icons/index.tsx

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

// Default: hidden from screen readers (decorative)
const defaultProps: IconProps = { "aria-hidden": true };

export function ClipboardIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden={props["aria-hidden"] ?? true}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

export function TargetIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden={props["aria-hidden"] ?? true}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function PackageIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden={props["aria-hidden"] ?? true}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

// ... create one for each emoji currently in use
```

### Icons Needed (Complete Inventory from Code)

| Current Emoji | Used In | Replace With |
|---|---|---|
| `📋` | OverviewDashboard Quick Tools | `ClipboardIcon` |
| `🎯` | OverviewDashboard Quick Tools | `TargetIcon` |
| `📦` | OverviewDashboard Quick Tools, UnifiedInsights tab | `PackageIcon` |
| `📊` | UnifiedInsights tab | `ChartBarIcon` |
| `🔧` | UnifiedInsights tab | `WrenchIcon` |
| `✅` | UnifiedInsights tab, supply alerts | `CheckCircleIcon` |
| `💰` | UnifiedInsights tab | `CurrencyIcon` |
| `👥` | UnifiedInsights tab | `UsersIcon` |
| `☀️` | OverviewDashboard greeting | `SunIcon` |
| `⚠` | Crew utilization conflicts | `AlertTriangleIcon` |

### Replacement Example

**Before:**
```tsx
<span className="text-xl">📋</span>
```

**After:**
```tsx
<ClipboardIcon className="h-6 w-6 text-slate-400" />
```

**In UnifiedInsights tabs:**

```tsx
// Before
const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  // ...
];

// After
import { ChartBarIcon, WrenchIcon, CheckCircleIcon, CurrencyIcon, UsersIcon, PackageIcon } from "@/components/icons";

const TABS = [
  { key: "overview", label: "Overview", icon: <ChartBarIcon className="h-4 w-4" /> },
  { key: "operations", label: "Operations", icon: <WrenchIcon className="h-4 w-4" /> },
  { key: "quality", label: "Quality", icon: <CheckCircleIcon className="h-4 w-4" /> },
  { key: "financials", label: "Financials", icon: <CurrencyIcon className="h-4 w-4" /> },
  { key: "hiring", label: "Hiring", icon: <UsersIcon className="h-4 w-4" /> },
  { key: "inventory", label: "Inventory", icon: <PackageIcon className="h-4 w-4" /> },
];
```

**Effort: 3 hours** (create ~15 icon components + sweep replacements)

---

## 6. LOADING STATES & SKELETONS {#6-loading-states}

### What's Missing

`OverviewDashboard` has skeleton loading (good). Almost nothing else does. When data loads in other admin modules, the user sees either a blank screen or a flash of "No data" before content appears.

### Pattern

```tsx
// src/components/ui/Skeleton.tsx
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton layouts
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonMetricGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}
```

### Where to Apply

| File | Current Loading State | Should Be |
|---|---|---|
| `OverviewDashboard.tsx` | ✅ Has skeleton | Already good |
| `UnifiedInsightsClient.tsx` | Text "Loading dashboard..." | `SkeletonMetricGrid` + `SkeletonTable` |
| `LeadPipelineClient.tsx` | Blank/flash | Skeleton cards per column |
| `TicketManagementClient.tsx` | Blank | `SkeletonTable` |
| `HiringInboxClient.tsx` | Blank | `SkeletonTable` |
| `InventoryMgmtClient.tsx` | Blank | `SkeletonTable` |
| `NotificationCenterClient.tsx` | Blank | `SkeletonTable` |
| `QuoteTemplateManager.tsx` | Blank | `SkeletonCard` grid |
| Employee portal tabs | Blank | `SkeletonCard` list |

**Effort: 3 hours** (components + apply to all modules)

---

## 7. EMPTY STATES {#7-empty-states}

### What's Missing

When a list has no data, some components show "No data." or nothing. Good empty states tell the user what the section is for and how to populate it.

### Pattern

```tsx
// src/components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      {icon && <div className="mx-auto mb-4 text-slate-400">{icon}</div>}
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

### Specific Empty States Needed

| Context | Title | Description | Action |
|---|---|---|---|
| Lead pipeline — empty column | "No {status} leads" | "Leads will appear here when their status changes." | — |
| Lead pipeline — no leads at all | "No leads yet" | "Leads from your website quote form will appear here." | "Add Lead Manually" |
| Jobs — no jobs | "No jobs scheduled" | "Create a job from the lead pipeline or add one manually." | "Create Job" |
| Hiring — no applications | "No applications yet" | "Share your careers page to start receiving applications." | "View Careers Page" |
| Inventory — no supplies | "No supplies tracked" | "Add your cleaning supplies to track stock levels." | "Add Supply" |
| Inventory — no low stock | ✅ Already exists | Good — green "All supplies above threshold" | — |
| Notifications — none | "No notifications" | "Notifications will appear when jobs are assigned or messages sent." | — |
| Today's schedule — empty | ✅ Already exists | "No jobs scheduled for today" — could add CTA | "Schedule a Job" |
| Quote templates — none | "No templates yet" | "Create reusable quote templates to speed up your workflow." | "Create Template" |

**Effort: 2 hours** (component + customize for each context)

---

## 8. ABORTCONTROLLER ON UNMOUNT {#8-abort-controller}

### What's Missing

No `useEffect` cleanup aborts in-flight requests. If the user switches modules while data is loading, the old request completes and calls `setState` on an unmounted component. React 18 handles this without crashing, but it wastes bandwidth and can cause brief flash of stale data.

### Pattern

```typescript
// In any component with data fetching:
useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .abortSignal(controller.signal); // Supabase JS v2 supports this

    if (controller.signal.aborted) return; // Don't update state

    if (error) {
      setError(error.message);
    } else {
      setLeads(data);
    }
  }

  void loadData();
  return () => controller.abort();
}, [dependencies]);
```

### Cleaner with the data fetching hook from Section 9.4 of the first pass

```typescript
// Updated useSupabaseQuery to include AbortController
export function useSupabaseQuery<T>(
  queryFn: (supabase: SupabaseClient, signal: AbortSignal) => PromiseLike<{ data: T | null; error: PostgrestError | null }>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const result = await queryFn(supabase, signal ?? new AbortController().signal);
    if (signal?.aborted) return;
    if (result.error) {
      setError(result.error.message);
    } else {
      setData(result.data);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const controller = new AbortController();
    void refetch(controller.signal);
    return () => controller.abort();
  }, [refetch]);

  return { data, error, loading, refetch: () => refetch() };
}
```

### Where to Apply

Every component that fetches data in `useEffect`:

| File | Current Abort Handling |
|---|---|
| `OverviewDashboard.tsx` | None |
| `UnifiedInsightsClient.tsx` | None |
| `LeadPipelineClient.tsx` | None |
| `TicketManagementClient.tsx` | None |
| `HiringInboxClient.tsx` | None |
| `InventoryMgmtClient.tsx` | None |
| `NotificationCenterClient.tsx` | None |
| `EmployeeTicketsClient.tsx` | None |

If you build the `useSupabaseQuery` hook, migration is straightforward.

**Effort: 4 hours** (hook + migrate all components)

---

## 9. STALE CLOSURES & RACE CONDITIONS {#9-stale-closures}

### What's Missing

The report flags this as a systemic pattern: "Fast typing loses values, concurrent mutations overwrite." This happens when:

1. User types in a search input
2. Each keystroke triggers a fetch
3. The fetch from keystroke 3 returns after keystroke 5's fetch
4. Results from keystroke 3 overwrite the more recent results from keystroke 5

### Fix — Debounced Search

```typescript
// src/hooks/useDebounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
}
```

**Usage:**

```tsx
function LeadSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      loadLeads(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search leads..."
    />
  );
}
```

### Fix — Race Condition on Fetches

Combine debounce with AbortController:

```typescript
useEffect(() => {
  const controller = new AbortController();

  async function search() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .ilike("name", `%${debouncedSearch}%`)
      .abortSignal(controller.signal);

    if (!controller.signal.aborted) {
      setResults(data ?? []);
    }
  }

  if (debouncedSearch) {
    void search();
  }

  return () => controller.abort(); // Cancel if new search starts
}, [debouncedSearch]);
```

### Fix — Concurrent Mutation Overwrite

When two status changes fire quickly (e.g., drag two leads to new columns in rapid succession), the second `setLeads` call may use stale state:

```typescript
// BAD — stale closure
setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));

// GOOD — functional update, always uses latest state
setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
```

Do a sweep for all `setState(currentValue.map(...))` patterns and replace with `setState((prev) => prev.map(...))`.

**Files that need functional updates:**

| File | State Updates |
|---|---|
| `LeadPipelineClient.tsx` | Lead status changes, quote creation |
| `TicketManagementClient.tsx` | Job status changes, assignment changes |
| `HiringInboxClient.tsx` | Application status changes |
| `InventoryMgmtClient.tsx` | Stock updates, request status changes |

**Effort: 3 hours** (debounce hook + AbortController integration + functional update sweep)

---

## 10. SCROLL POSITION PRESERVATION {#10-scroll-position}

### What's Missing

After every mutation (status change, quote sent, etc.), the component does a full data refetch. This re-renders the entire list and resets scroll position to the top. On a kanban with 50+ leads, the user loses their place every single time they take an action.

### Fix Strategy

**Option A: Optimistic updates (no refetch needed)**

From Section 4.2 of the first pass — update state locally, refetch only on error. This inherently preserves scroll because the DOM doesn't fully re-render.

**Option B: Scroll restoration on refetch**

```typescript
// src/hooks/useScrollRestore.ts
import { useCallback, useRef } from "react";

export function useScrollRestore(containerRef: React.RefObject<HTMLElement | null>) {
  const scrollTopRef = useRef(0);

  const saveScroll = useCallback(() => {
    if (containerRef.current) {
      scrollTopRef.current = containerRef.current.scrollTop;
    }
  }, [containerRef]);

  const restoreScroll = useCallback(() => {
    if (containerRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        containerRef.current!.scrollTop = scrollTopRef.current;
      });
    }
  }, [containerRef]);

  return { saveScroll, restoreScroll };
}

// Usage:
const containerRef = useRef<HTMLDivElement>(null);
const { saveScroll, restoreScroll } = useScrollRestore(containerRef);

async function handleStatusChange(leadId: string, newStatus: string) {
  saveScroll();
  await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
  await refetchLeads();
  restoreScroll();
}

return <div ref={containerRef} className="overflow-y-auto">{/* content */}</div>;
```

**Option A is strongly preferred.** It's faster, more responsive, and inherently solves the scroll problem.

**Effort: 2 hours** (if doing optimistic updates, it's part of that effort; if scroll-restore only, it's standalone)

---

## 11. Z-INDEX MANAGEMENT {#11-z-index}

### What's Missing

The report mentions `--z-header` is undefined, and 3 components independently manage `overflow: hidden` on the body. When multiple overlays stack (floating quote panel + exit intent + header), z-index collisions occur.

### What to Build

```css
/* src/app/globals.css — add to :root */
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-header: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-toast: 60;
  --z-tooltip: 70;
}
```

```typescript
// src/lib/z-index.ts — for Tailwind arbitrary values
export const Z_INDEX = {
  base: "z-0",
  dropdown: "z-10",
  sticky: "z-20",
  header: "z-30",
  overlay: "z-[40]",
  modal: "z-50",
  toast: "z-[60]",
  tooltip: "z-[70]",
} as const;
```

### Application Map

| Component | Current Z | Should Be |
|---|---|---|
| `PublicHeader` | `z-50` or undefined | `z-30` (header) |
| `FloatingQuotePanel` | varies | `z-40` (overlay) |
| `ExitIntentOverlay` | varies | `z-50` (modal — above floating panel) |
| Admin sidebar | varies | `z-20` (sticky) |
| `MobileBottomNav` (when built) | — | `z-40` (overlay) |
| Confirm dialogs | — | `z-50` (modal) |
| Toast notifications | — | `z-[60]` (toast — above everything) |
| Tooltips | — | `z-[70]` (highest) |

### Body Scroll Lock

Create a single scroll lock manager instead of 3 components competing:

```typescript
// src/hooks/useScrollLock.ts
let lockCount = 0;
let originalOverflow = "";

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [locked]);
}
```

Now multiple overlays can each call `useScrollLock(isOpen)` without fighting.

**Effort: 2 hours** (z-index system + scroll lock + sweep)

---

## 12. FORM STATE PERSISTENCE {#12-form-persistence}

### What's Missing

If the admin is filling out a long quote form and accidentally taps the sidebar (switching modules), all form data is lost. No warning, no recovery.

### Two-Part Fix

**Part 1: Unsaved changes warning**

```typescript
// src/hooks/useUnsavedChanges.ts
import { useEffect } from "react";

export function useUnsavedChanges(hasChanges: boolean) {
  useEffect(() => {
    if (!hasChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);
}
```

**Part 2: Draft persistence to sessionStorage**

```typescript
// src/hooks/useFormDraft.ts
import { useCallback, useEffect, useState } from "react";

export function useFormDraft<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = sessionStorage.getItem(`draft:${key}`);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  // Auto-save to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem(`draft:${key}`, JSON.stringify(value));
  }, [key, value]);

  // Clear draft (call after successful submit)
  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(`draft:${key}`);
  }, [key]);

  return [value, setValue, clearDraft] as const;
}
```

**Usage:**

```tsx
function QuoteForm({ leadId }: { leadId: string }) {
  const [formData, setFormData, clearDraft] = useFormDraft(
    `quote-${leadId}`,
    { lineItems: [], notes: "", validUntil: "" },
  );

  useUnsavedChanges(formData.lineItems.length > 0);

  async function handleSubmit() {
    await sendQuote(formData);
    clearDraft(); // Clean up after successful submit
  }
}
```

**Where this matters most:**
- Quote creation form (line items, notes, pricing)
- Job creation form (address, date, crew, checklist)
- Employment application (long multi-field form)
- Configuration settings (multiple related fields)

**Effort: 2 hours** (hooks + wire into key forms)

---

## 13. BATCH OPERATIONS {#13-batch-operations}

### What's Missing

Every action is one-at-a-time. The admin can't select 5 old leads and mark them all "dormant." Can't select 3 completed jobs and approve QA on all of them. For a business doing 20+ leads/day, this is a real workflow bottleneck.

### What to Build

```tsx
// src/hooks/useSelection.ts
export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedItems = items.filter((i) => selectedIds.has(i.id));
  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0;

  return {
    selectedIds,
    selectedItems,
    toggle,
    selectAll,
    clearSelection,
    allSelected,
    someSelected,
    count: selectedIds.size,
  };
}
```

### Batch Action Bar

```tsx
// src/components/ui/BatchActionBar.tsx
interface BatchAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  requireConfirm?: boolean;
}

export function BatchActionBar({
  count,
  actions,
  onClear,
}: {
  count: number;
  actions: BatchAction[];
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-white shadow-lg">
      <span className="text-sm font-medium">
        {count} selected
      </span>

      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`min-h-[36px] rounded-md px-3 text-sm font-medium
              ${action.variant === "danger"
                ? "bg-red-500 hover:bg-red-400"
                : "bg-white/20 hover:bg-white/30"}`}
          >
            {action.label}
          </button>
        ))}
      </div>

      <button
        onClick={onClear}
        className="ml-auto text-sm text-white/70 hover:text-white"
      >
        Clear selection
      </button>
    </div>
  );
}
```

### Where to Apply

| Module | Batch Actions |
|---|---|
| Lead Pipeline | Mark dormant, mark lost, assign to campaign, export selected |
| Job Management | Approve QA (batch), reassign crew, export |
| Hiring Inbox | Reject multiple, move to review, export |
| Inventory | Bulk reorder, update stock counts |
| Notifications | Retry failed, clear old |

**Effort: 5 hours** (hooks + components + wire into 3-4 modules)

---

## 14. UNDO PATTERN {#14-undo-pattern}

### What's Missing

For non-destructive reversible actions (move lead to different status, change assignment), an undo toast is faster and safer than a confirmation dialog.

### How It Works with the Toast System

```typescript
const { toast } = useToast();

async function handleStatusChange(leadId: string, oldStatus: string, newStatus: string) {
  // 1. Optimistic update
  setLeads((prev) =>
    prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
  );

  // 2. Server mutation
  const { error } = await supabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", leadId);

  if (error) {
    // Revert
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: oldStatus } : l)),
    );
    toast("Failed to update status", "error");
    return;
  }

  // 3. Success toast with undo
  toast(`Lead moved to ${newStatus}`, "success", {
    action: {
      label: "Undo",
      onClick: async () => {
        await supabase.from("leads").update({ status: oldStatus }).eq("id", leadId);
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: oldStatus } : l)),
        );
      },
    },
    duration: 6000, // Give them 6 seconds to undo
  });
}
```

### When to Use Undo vs Confirmation Dialog

| Action | Pattern | Why |
|---|---|---|
| Move lead to different status | **Undo toast** | Easily reversible, frequent action |
| Change job assignment | **Undo toast** | Reversible |
| Archive notification | **Undo toast** | Reversible |
| Convert lead to client | **Confirm dialog** | Creates records, harder to reverse |
| Delete template | **Confirm dialog** | Destructive |
| QA rework | **Confirm dialog** | Resets state, notifies employee |
| Mark lost | **Undo toast** | Reversible (can reopen) |
| Reject applicant | **Confirm dialog** | May send email |

**Effort: 2 hours** (builds on toast system from Section 1)

---

## 15. REAL-TIME SUBSCRIPTIONS {#15-real-time}

### What's Missing

Supabase has built-in real-time via WebSocket subscriptions. The app makes zero use of this. When an employee completes a job, the admin doesn't see it until they manually refresh. When a new lead comes in, nothing happens on the dashboard.

### What to Build

```typescript
// src/hooks/useRealtimeSubscription.ts
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useRealtimeSubscription<T extends { [key: string]: unknown }>(
  table: string,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void,
  options?: {
    event?: "INSERT" | "UPDATE" | "DELETE" | "*";
    filter?: string;
  },
) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event: options?.event ?? "*",
          schema: "public",
          table,
          filter: options?.filter,
        },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, options?.event, options?.filter]);
}
```

### Where to Apply

| Component | Table | Event | Behavior |
|---|---|---|---|
| `OverviewDashboard` | `leads` | INSERT | Show "New lead!" badge, increment counter, play subtle sound |
| `OverviewDashboard` | `jobs` | UPDATE | Update "completed today" counter in real-time |
| `LeadPipelineClient` | `leads` | UPDATE | Move card to new column when status changes (e.g., from email webhook) |
| `TicketManagementClient` | `jobs` | UPDATE | Reflect employee status updates |
| `NotificationCenterClient` | `notification_dispatch_queue` | UPDATE | Show delivery status changes |
| Employee portal | `job_assignments` | UPDATE | Show new assignments immediately |

### New Lead Alert

```tsx
// In OverviewDashboard
use



```tsx
// In OverviewDashboard
useRealtimeSubscription<{ id: string; name: string }>(
  "leads",
  (payload) => {
    if (payload.eventType === "INSERT") {
      const newLead = payload.new;
      toast(`New lead: ${newLead.name}`, "info", { duration: 10000 });

      // Add to lead alerts without full refetch
      setData((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          unclaimedLeads: prev.stats.unclaimedLeads + 1,
        },
        leadAlerts: [
          {
            id: newLead.id,
            name: newLead.name,
            phone: null,
            createdAt: new Date().toISOString(),
          },
          ...prev.leadAlerts,
        ],
      }));
    }
  },
  { event: "INSERT" },
);
```

### Important Caveat

Real-time subscriptions require Supabase real-time to be enabled on each table (it's off by default). Add to migration:

```sql
-- Enable real-time for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE job_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE notification_dispatch_queue;
```

**Effort: 6 hours** (hook + wire into 4-5 components + migration + testing)

---

## 16. MULTI-TAB SYNC {#16-multi-tab}

### What's Missing

If the admin has two browser tabs open (common pattern — one on leads, one on dashboard), changes in one tab don't reflect in the other. They're looking at stale data.

### Fix

```typescript
// src/hooks/useCrossTabSync.ts
import { useEffect } from "react";

const SYNC_CHANNEL = "admin-data-sync";

export function useCrossTabSync(
  key: string,
  onSync: () => void,
) {
  useEffect(() => {
    const channel = new BroadcastChannel(SYNC_CHANNEL);

    // Listen for sync messages from other tabs
    channel.onmessage = (event) => {
      if (event.data?.key === key) {
        onSync(); // Refetch data
      }
    };

    return () => channel.close();
  }, [key, onSync]);
}

export function broadcastSync(key: string) {
  try {
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    channel.postMessage({ key, timestamp: Date.now() });
    channel.close();
  } catch {
    // BroadcastChannel not supported — graceful no-op
  }
}
```

### Usage

```typescript
// In LeadPipelineClient
useCrossTabSync("leads", () => {
  void refetchLeads();
});

// After any lead mutation
async function handleStatusChange(leadId: string, newStatus: string) {
  await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
  broadcastSync("leads"); // Tell other tabs to refetch
}
```

### Sync Keys

| Key | Triggers Refetch In |
|---|---|
| `"leads"` | LeadPipeline, OverviewDashboard (lead count) |
| `"jobs"` | TicketManagement, OverviewDashboard (schedule, active count) |
| `"applications"` | HiringInbox |
| `"inventory"` | InventoryMgmt |
| `"settings"` | ConfigurationClient |

**Effort: 2 hours** (hook + broadcast calls in mutations)

---

## 17. PRINT & PDF EXPORT {#17-print-pdf}

### What's Missing

The admin can't print or export a quote to hand to a customer. Can't print today's schedule to give to a crew. Can't generate a job completion report for a client.

### Print-Friendly Layouts

```css
/* src/app/globals.css */
@media print {
  /* Hide non-printable elements */
  nav, aside, .no-print, button, .toast-container {
    display: none !important;
  }

  /* Reset backgrounds for ink saving */
  body {
    background: white !important;
    color: black !important;
  }

  /* Ensure content fills page */
  main {
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Page break controls */
  .print-break-before {
    page-break-before: always;
  }

  .print-break-inside-avoid {
    page-break-inside: avoid;
  }
}
```

### Printable Views to Build

**1. Quote PDF/Print**

```tsx
// src/components/admin/PrintableQuote.tsx
export function PrintableQuote({ quote, lead, lineItems, company }: PrintableQuoteProps) {
  return (
    <div className="mx-auto max-w-2xl p-8 print:p-0">
      {/* Company header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-sm text-slate-600">{company.phone}</p>
          <p className="text-sm text-slate-600">{company.email}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Quote #{quote.id.slice(0, 8)}</p>
          <p className="text-sm text-slate-600">Date: {formatDate(quote.created_at)}</p>
          <p className="text-sm text-slate-600">Valid until: {formatDate(quote.valid_until)}</p>
        </div>
      </div>

      {/* Customer info */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase">Prepared For</h2>
        <p className="mt-1 font-medium">{lead.name}</p>
        <p className="text-sm">{lead.company_name}</p>
        <p className="text-sm">{lead.email}</p>
        <p className="text-sm">{lead.address}</p>
      </div>

      {/* Line items */}
      <table className="mt-6 w-full">
        <thead>
          <tr className="border-b text-left text-sm font-medium text-slate-600">
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Rate</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => (
            <tr key={i} className="border-b">
              <td className="py-2 text-sm">{item.description}</td>
              <td className="py-2 text-right text-sm">{item.quantity}</td>
              <td className="py-2 text-right text-sm">{formatCurrency(item.unit_price)}</td>
              <td className="py-2 text-right text-sm">{formatCurrency(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td colSpan={3} className="py-3 text-right">Total</td>
            <td className="py-3 text-right">{formatCurrency(quote.total)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Notes */}
      {quote.notes && (
        <div className="mt-6 rounded-lg bg-slate-50 p-4 print:bg-transparent print:border print:border-slate-200">
          <h3 className="text-sm font-semibold">Notes</h3>
          <p className="mt-1 text-sm">{quote.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 border-t pt-4 text-center text-xs text-slate-500">
        <p>Thank you for your business!</p>
        <p>{company.name} · {company.phone} · {company.email}</p>
      </div>
    </div>
  );
}
```

**Print trigger:**

```tsx
<button
  onClick={() => window.print()}
  className="min-h-[44px] rounded-lg border border-slate-300 px-4 py-2 text-sm no-print"
>
  Print / Save as PDF
</button>
```

**2. Daily Schedule Print**

```tsx
// Similar pattern — company header + date + list of jobs with times, addresses, crew, clean type
// Used by admin to hand to crew in the morning
```

**3. Job Completion Report**

```tsx
// Company header + job details + checklist with check marks + photo grid + employee signature area
// Used to show clients what was done
```

### PDF Generation (If print isn't enough)

For generating actual PDF files (email attachment, download), use `@react-pdf/renderer`:

```typescript
// src/lib/pdf/quote-pdf.ts
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

// Build the same layout as PrintableQuote but using react-pdf primitives
// renderToBuffer() returns a Buffer you can attach to emails or download
```

The `quote-send/route.ts` already does PDF generation — extend that pattern for completion reports and schedules.

**Effort: 8 hours** (3 printable views + print CSS + optional PDF generation)

---

## 18. KEYBOARD SHORTCUTS {#18-keyboard-shortcuts}

### What's Missing

For a daily-use admin tool, keyboard shortcuts dramatically speed up common actions. The admin is at their desk in the morning reviewing leads — `j`/`k` to navigate, `q` to create a quote, `n` for new lead.

### What to Build

```typescript
// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from "react";

type ShortcutMap = Record<string, () => void>;

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      // Build key string
      const key = [
        e.metaKey || e.ctrlKey ? "mod" : "",
        e.shiftKey ? "shift" : "",
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join("+");

      const handler = shortcuts[key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, enabled]);
}
```

### Shortcut Map

```typescript
// In AdminShell.tsx
useKeyboardShortcuts({
  // Navigation
  "g": () => {}, // Start of go-to sequence (could use a command palette instead)
  "mod+1": () => navigate("overview"),
  "mod+2": () => navigate("leads"),
  "mod+3": () => navigate("tickets"),
  "mod+4": () => navigate("operations"),
  "mod+5": () => navigate("insights"),

  // Global actions
  "mod+k": () => setCommandPaletteOpen(true), // See Section 19
  "?": () => setShortcutsHelpOpen(true),
  "r": () => refetchCurrentModule(),
});

// In LeadPipelineClient
useKeyboardShortcuts({
  "j": () => selectNextLead(),
  "k": () => selectPrevLead(),
  "q": () => createQuoteForSelected(),
  "c": () => convertSelectedToClient(),
  "l": () => markSelectedAsLost(),
  "escape": () => clearSelection(),
});
```

### Shortcuts Help Modal

```tsx
function ShortcutsHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const sections = [
    {
      title: "Navigation",
      shortcuts: [
        { keys: ["⌘", "1-5"], description: "Switch module" },
        { keys: ["⌘", "K"], description: "Command palette" },
        { keys: ["?"], description: "Show shortcuts" },
      ],
    },
    {
      title: "Lead Pipeline",
      shortcuts: [
        { keys: ["J"], description: "Next lead" },
        { keys: ["K"], description: "Previous lead" },
        { keys: ["Q"], description: "Create quote" },
        { keys: ["Esc"], description: "Clear selection" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog">
      <div className="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
        {sections.map((section) => (
          <div key={section.title} className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">{section.title}</h3>
            <div className="mt-2 space-y-1">
              {section.shortcuts.map((s) => (
                <div key={s.description} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-600">{s.description}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700 border border-slate-200">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={onClose} className="mt-6 w-full rounded-lg bg-slate-100 py-2 text-sm font-medium">
          Close
        </button>
      </div>
    </div>
  );
}
```

**Effort: 4 hours** (hook + AdminShell integration + per-module shortcuts + help modal)

---

## 19. GLOBAL SEARCH (COMMAND PALETTE) {#19-global-search}

### What's Missing

No way to search across all entities from one place. Want to find "Johnson" — is it a lead? A client? An employee? An applicant? Currently you'd have to check 4 different modules.

### What to Build

```tsx
// src/components/admin/CommandPalette.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { ModuleId } from "@/components/admin/AdminShell";

interface SearchResult {
  id: string;
  type: "lead" | "job" | "client" | "employee" | "applicant";
  title: string;
  subtitle: string;
  module: ModuleId;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (module: ModuleId, id?: string) => void;
}

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useFocusTrap(open);
  const debouncedQuery = useDebounce(query, 200);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search across entities
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    async function search() {
      setLoading(true);
      const supabase = createClient();
      const term = `%${debouncedQuery}%`;

      const [leads, jobs, clients, profiles, applications] = await Promise.all([
        supabase
          .from("leads")
          .select("id, name, company_name, status")
          .or(`name.ilike.${term},company_name.ilike.${term},email.ilike.${term}`)
          .limit(5)
          .abortSignal(controller.signal),
        supabase
          .from("jobs")
          .select("id, title, address, status")
          .or(`title.ilike.${term},address.ilike.${term}`)
          .limit(5)
          .abortSignal(controller.signal),
        supabase
          .from("clients")
          .select("id, company_name, contact_name")
          .or(`company_name.ilike.${term},contact_name.ilike.${term}`)
          .limit(5)
          .abortSignal(controller.signal),
        supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .eq("role", "employee")
          .or(`full_name.ilike.${term},email.ilike.${term}`)
          .limit(5)
          .abortSignal(controller.signal),
        supabase
          .from("employment_applications")
          .select("id, first_name, last_name, email, status")
          .or(`first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`)
          .limit(5)
          .abortSignal(controller.signal),
      ]);

      if (controller.signal.aborted) return;

      const mapped: SearchResult[] = [
        ...(leads.data ?? []).map((l) => ({
          id: l.id,
          type: "lead" as const,
          title: l.name,
          subtitle: `Lead · ${l.status} · ${l.company_name || "No company"}`,
          module: "leads" as ModuleId,
        })),
        ...(jobs.data ?? []).map((j) => ({
          id: j.id,
          type: "job" as const,
          title: j.title,
          subtitle: `Job · ${j.status} · ${j.address}`,
          module: "tickets" as ModuleId,
        })),
        ...(clients.data ?? []).map((c) => ({
          id: c.id,
          type: "client" as const,
          title: c.company_name || c.contact_name,
          subtitle: "Client",
          module: "leads" as ModuleId, // Until client view exists
        })),
        ...(profiles.data ?? []).map((p) => ({
          id: p.id,
          type: "employee" as const,
          title: p.full_name || p.email,
          subtitle: "Employee",
          module: "operations" as ModuleId,
        })),
        ...(applications.data ?? []).map((a) => ({
          id: a.id,
          type: "applicant" as const,
          title: `${a.first_name} ${a.last_name}`,
          subtitle: `Applicant · ${a.status}`,
          module: "hiring" as ModuleId,
        })),
      ];

      setResults(mapped);
      setSelectedIndex(0);
      setLoading(false);
    }

    void search();
    return () => controller.abort();
  }, [debouncedQuery]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        const result = results[selectedIndex];
        onNavigate(result.module, result.id);
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, selectedIndex, onNavigate, onClose],
  );

  if (!open) return null;

  const TYPE_COLORS: Record<string, string> = {
    lead: "bg-blue-100 text-blue-800",
    job: "bg-green-100 text-green-800",
    client: "bg-purple-100 text-purple-800",
    employee: "bg-amber-100 text-amber-800",
    applicant: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]" onClick={onClose}>
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="flex items-center border-b px-4">
          <svg className="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search leads, jobs, clients, employees..."
            className="w-full border-0 bg-transparent px-3 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-400 sm:block">
            ESC
          </kbd>
        </div>

        {loading && (
          <div className="px-4 py-3 text-sm text-slate-500">Searching...</div>
        )}

        {!loading && results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2" role="listbox">
            {results.map((result, i) => (
              <li
                key={`${result.type}-${result.id}`}
                role="option"
                aria-selected={i === selectedIndex}
                onClick={() => {
                  onNavigate(result.module, result.id);
                  onClose();
                }}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5
                  ${i === selectedIndex ? "bg-blue-50" : "hover:bg-slate-50"}`}
              >
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${TYPE_COLORS[result.type]}`}>
                  {result.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{result.title}</p>
                  <p className="truncate text-xs text-slate-500">{result.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {!loading && query.length < 2 && (
          <div className="px-4 py-6 text-center text-xs text-slate-400">
            Type at least 2 characters to search
          </div>
        )}
      </div>
    </div>
  );
}
```

### Trigger

```tsx
// In AdminShell header area
<button
  onClick={() => setCommandPaletteOpen(true)}
  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 hover:border-slate-300"
>
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  Search...
  <kbd className="ml-4 hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono sm:block">
    ⌘K
  </kbd>
</button>

<CommandPalette
  open={commandPaletteOpen}
  onClose={() => setCommandPaletteOpen(false)}
  onNavigate={(module, id) => navigate(module, id ? { id } : undefined)}
/>
```

**Effort: 6 hours** (component + search queries + keyboard integration)

---

## 20. CALENDAR VIEW {#20-calendar-view}

### What's Missing

Jobs are scheduled with dates and times but there's no calendar visualization. The admin sees a flat list. For a cleaning business doing 5-15 jobs per day, a visual calendar is essential for spotting gaps, overlaps, and crew distribution.

### What to Build

A weekly view is most useful for cleaning businesses (daily operations planning):

```tsx
// src/components/admin/WeeklyCalendar.tsx
interface CalendarJob {
  id: string;
  title: string;
  address: string;
  scheduledDate: string;
  scheduledTime: string | null;
  assignedTo: string | null;
  assigneeName: string | null;
  status: string;
  cleanType: string;
}

export function WeeklyCalendar({ jobs, onJobClick }: { jobs: CalendarJob[]; onJobClick: (id: string) => void }) {
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1); // Monday
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const jobsByDay = new Map<string, CalendarJob[]>();
  for (const job of jobs) {
    const dateKey = job.scheduledDate; // YYYY-MM-DD
    const existing = jobsByDay.get(dateKey) ?? [];
    existing.push(job);
    jobsByDay.set(dateKey, existing);
  }

  return (
    <div>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            const prev = new Date(weekStart);
            prev.setDate(prev.getDate() - 7);
            setWeekStart(prev);
          }}
          className="min-h-[44px] rounded-lg border px-3 py-2 text-sm"
        >
          ← Previous
        </button>
        <h3 className="text-sm font-semibold text-slate-900">
          {formatDate(weekStart.toISOString())} — {formatDate(days[6].toISOString())}
        </h3>
        <button
          onClick={() => {
            const next = new Date(weekStart);
            next.setDate(next.getDate() + 7);
            setWeekStart(next);
          }}
          className="min-h-[44px] rounded-lg border px-3 py-2 text-sm"
        >
          Next →
        </button>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 gap-2 max-lg:grid-cols-1">
        {days.map((day) => {
          const dateKey = day.toISOString().split("T")[0];
          const dayJobs = jobsByDay.get(dateKey) ?? [];
          const isToday = dateKey === new Date().toISOString().split("T")[0];

          return (
            <div
              key={dateKey}
              className={`rounded-lg border p-2 min-h-[120px]
                ${isToday ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}
            >
              <p className={`text-xs font-semibold mb-2
                ${isToday ? "text-blue-700" : "text-slate-500"}`}>
                {day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </p>

              <div className="space-y-1">
                {dayJobs
                  .sort((a, b) => (a.scheduledTime ?? "").localeCompare(b.scheduledTime ?? ""))
                  .map((job) => (
                    <button
                      key={job.id}
                      onClick={() => onJobClick(job.id)}
                      className="w-full rounded bg-slate-100 px-2 py-1.5 text-left text-xs hover:bg-slate-200 transition"
                    >
                      <p className="font-medium text-slate-800 truncate">
                        {job.scheduledTime ? `${job.scheduledTime} ` : ""}{job.title}
                      </p>
                      <p className="text-slate-500 truncate">{job.assigneeName ?? "Unassigned"}</p>
                    </button>
                  ))}
              </div>

              {dayJobs.length === 0 && (
                <p className="text-[10px] text-slate-400 italic">No jobs</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Integration

Add as a view toggle in TicketManagement or as a sub-tab:

```tsx
<div className="flex gap-2 mb-4">
  <button
    onClick={() => setView("list")}
    className={view === "list" ? "bg-slate-900 text-white" : "bg-slate-100"}
  >
    List
  </button>
  <button
    onClick={() => setView("calendar")}
    className={view === "calendar" ? "bg-slate-900 text-white" : "bg-slate-100"}
  >
    Calendar
  </button>
</div>

{view === "list" ? <JobList /> : <WeeklyCalendar jobs={jobs} onJobClick={handleJobClick} />}
```

**Effort: 6 hours** (component + data query + mobile responsiveness)

---

## 21. MAP VIEW FOR SCHEDULING {#21-map-view}

### What's Missing

Cleaning businesses are route-based. Scheduling 3 jobs on the same day that are all 45 minutes apart wastes drive time. A map view of today's jobs shows clustering and routing opportunities.

### What to Build

Use Google Maps (or free alternative like Leaflet) to plot job locations:

```tsx
// src/components/admin/JobMapView.tsx
// Using Google Maps JavaScript API (already referenced in EmployeeAssignmentCard)
export function JobMapView({ jobs }: { jobs: Array<{ id: string; address: string; assigneeName: string; scheduledTime: string }> }) {
  // Geocode addresses → lat/lng
  // Plot pins on map with job info tooltips
  // Color-code by assignee
  // Draw route lines for same-assignee jobs in chronological order
}
```

This is a larger feature but extremely valuable for a cleaning business. Even a simple pin map without routing would be useful.

**Effort: 8-12 hours** (geocoding + map integration + clustering + mobile)

---

## 22. RECURRING JOB SCHEDULING {#22-recurring-jobs}

### What's Missing

Most cleaning clients are recurring — weekly, biweekly, or monthly. Currently every job is manually created one at a time. This is the biggest operational inefficiency for a real cleaning business.

### What to Build

```sql
-- New table
CREATE TABLE recurring_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  title text NOT NULL,
  address text NOT NULL,
  clean_type text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'custom')),
  day_of_week integer, -- 0=Sun, 1=Mon, etc.
  preferred_time time,
  assigned_to uuid REFERENCES profiles(id),
  checklist_template_id uuid REFERENCES checklist_templates(id),
  is_active boolean NOT NULL DEFAULT true,
  next_occurrence date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

Then a cron job (or Supabase Edge Function) that runs nightly:

```typescript
// Generate next week's jobs from recurring schedules
async function generateRecurringJobs() {
  const { data: schedules } = await supabase
    .from("recurring_schedules")
    .select("*")
    .eq("is_active", true)
    .lte("next_occurrence", oneWeekFromNow);

  for (const schedule of schedules) {
    // Create job from schedule template
    await supabase.rpc("create_ticket", {
      p_title: schedule.title,
      p_address: schedule.address,
      p_clean_type: schedule.clean_type,
      p_assigned_to: schedule.assigned_to,
      p_scheduled_date: schedule.next_occurrence,
      p_scheduled_time: schedule.preferred_time,
      p_checklist_template_id: schedule.checklist_template_id,
    });

    // Advance next_occurrence
    const next = calculateNextOccurrence(schedule);
    await supabase
      .from("recurring_schedules")
      .update({ next_occurrence: next })
      .eq("id", schedule.id);
  }
}
```

**Effort: 12-16 hours** (schema + cron + admin UI for managing schedules + skip/reschedule individual occurrences)

---

## 23. CUSTOMER-FACING PORTAL {#23-customer-portal}

### What's Missing

After a quote is accepted and jobs are being done, the customer has zero visibility. They don't know when the crew is coming, can't see completion photos, can't approve work, can't view invoices. Everything goes through phone calls.

### Minimal Viable Customer Portal

Using the existing public token from `quote-send/route.ts`:

```
/client/[token] → Customer dashboard
  - Upcoming jobs (date, time, crew name)
  - Job history with completion photos
  - Invoices and payment status (from QuickBooks)
  - Request service changes
  - Leave feedback after job completion
```

This leverages all the infrastructure that already exists:
- Photos are already uploaded and stored
- Completion reports already exist
- QuickBooks invoice data is already cached

It just needs a read-only view layer.

**Effort: 12-16 hours** (routing + 4-5 page components + token auth)

---

## 24. SEO FINAL POLISH {#24-seo-polish}

### Remaining Items

| Item | What to Do | Effort |
|---|---|---|
| `JobPosting` schema on careers page | Add structured data for employment listings — helps Google Jobs | 1 hour |
| `sameAs` and `logo` on `Organization` schema | Add social links and logo URL to main site schema | 30 min |
| Single `@graph` for all schema objects | Combine `LocalBusiness`, `WebSite`, etc. into one `@graph` array | 1 hour |
| Breadcrumb visual + schema alignment | 3 pages have breadcrumb schema without visual breadcrumbs — add visual or remove schema | 1 hour |
| `og:image` for all pages | Ensure every page has a social share image | 2 hours |
| Canonical URLs | Ensure every page has `<link rel="canonical">` | 30 min |
| `sitemap.xml` dynamic generation | Auto-include all service pages, industry pages, blog posts | 2 hours |
| Image `alt` text audit | Some images may have generic or missing alt text | 1 hour |

**Effort: 8-10 hours total**

---

## 25. PERFORMANCE OPTIMIZATION {#25-performance}

### What to Measure

```typescript
// src/lib/performance.ts
export function measureQueryTime(name: string) {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      if (duration > 1000) {
        console.warn(`[perf] ${name} took ${duration.toFixed(0)}ms`);
      }
    },
  };
}
```

### Known Performance Issues

| Issue | Fix | Impact |
|---|---|---|
| 7+ parallel queries in OverviewDashboard | Already optimized via `Promise.all` ✅ | — |
| 14 parallel queries in UnifiedInsights | Already `Promise.all` ✅ but could be lazy-loaded per tab | Medium — only load data for visible tab |
| Full table refetch after every mutation | Optimistic updates (Section 10) | High |
| No pagination — 200+ leads loaded at once | Pagination (first pass Section 3.5) | High |
| No image lazy loading on public site | Add `loading="lazy"` to below-fold images | Low |
| Large bundle size from admin components | Dynamic imports per module | Medium |

### Lazy-Load Admin Modules

```tsx
// In AdminShell.tsx
import dynamic from "next/dynamic";

const modules: Record<ModuleId, React.ComponentType<ModuleProps>> = {
  overview: dynamic(() => import("./OverviewDashboard").then((m) => ({ default: m.OverviewDashboard }))),
  leads: dynamic(() => import("./LeadPipelineClient").then((m) => ({ default: m.LeadPipelineClient }))),
  tickets: dynamic(() => import("./TicketManagementClient").then((m) => ({ default: m.TicketManagementClient }))),
  insights: dynamic(() => import("./UnifiedInsightsClient").then((m) => ({ default: m.UnifiedInsightsClient }))),
  // ...
};
```

This means the hiring module code isn't downloaded until the user actually clicks "Hiring."

### Lazy-Load Insights Tabs

```tsx
// In UnifiedInsightsClient — only run queries for the active tab
useEffect(() => {
  if (activeTab === "financials") {
    void loadFinancialData();
  } else if (activeTab === "hiring") {
    void loadHiringData();
  }
  // Don't load all 14 queries upfront
}, [activeTab, range]);
```

**Effort: 6 hours** (dynamic imports + lazy tab loading + image optimization)

---

## 26. CONTENT SECURITY POLICY {#26-csp}

### What's Missing

No CSP headers. This means any XSS vulnerability can load arbitrary scripts.

### What to Add

```typescript
// In next.config.js or middleware
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js needs these unfortunately
  "style-src 'self' 'unsafe-inline'", // Tailwind needs inline
  `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL} https://*.supabase.co`,
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");
```

**Effort: 2 hours** (header configuration + testing)

---

## 27. CACHING STRATEGY {#27-caching}

### What's Missing

No caching anywhere. Every page load hits Supabase fresh.

### What to Add

```typescript
// For admin data — short cache with stale-while-revalidate
// src/hooks/useSupabaseQuery.ts — add caching layer

const queryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds

export function useSupabaseQuery<T>(
  cacheKey: string,
  queryFn: (supabase: SupabaseClient) => Promise<{ data: T | null; error: PostgrestError | null }>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(() => {
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  });

  // ... fetch logic, then:
  // queryCache.set(cacheKey, { data: result.data, timestamp: Date.now() });
}
```

For public pages, use Next.js built-in:

```typescript
// In server components or route handlers
export const revalidate = 3600; // Revalidate every hour

// Or per-request:
fetch(url, { next: { revalidate: 3600 } });
```

**Effort: 3 hours** (client cache hook + Next.js revalidation config)

---

## 28. SHARED UI COMPONENT LIBRARY {#28-component-library}

### What's Missing

The codebase builds the same patterns repeatedly: cards, tables, badges, buttons, inputs. No shared component library means inconsistency.

### Core Components to Extract

Based on everything I've seen in the two files plus the report's description of other files:

```
src/components/ui/
  ├── Badge.tsx           # Status badges (consistent colors per status)
  ├── BatchActionBar.tsx  # Batch selection toolbar
  ├── Button.tsx          # Primary, secondary, danger, ghost variants
  ├── Card.tsx            # Consistent border, padding, shadow
  ├── ClickableRow.tsx    # Accessible table row with keyboard support
  ├── CommandPalette.tsx  # Global search
  ├── ConfirmDialog.tsx   # Confirmation modal
  ├── EmptyState.tsx      # Empty list placeholder
  ├── LabeledInput.tsx    # Input with label, error, aria
  ├── LabeledSelect.tsx   # Select with label, error, aria
  ├── LabeledTextarea.tsx # Textarea with label, error, aria
  ├── MetricCard.tsx      # Dashboard metric display
  ├── OfflineIndicator.tsx # Connection status
  ├── PaginationControls.tsx # Page navigation
  ├── ResponsiveTable.tsx # Desktop table + mobile cards
  ├── SafeImage.tsx       # Image with error fallback
  ├── SectionErrorBoundary.tsx # Per-widget error boundary
  ├── Skeleton.tsx        # Loading placeholders
  ├── StatusAnnouncer.tsx # Screen reader announcements
  ├── Toaster.tsx         # Toast notifications
  └── TrendIndicator.tsx  # Up/down/flat with arrow and color
```

### Status Badge Consistency (Also Section 30)

Every module displays statuses differently. Create one `Badge` component:

```tsx
// src/components/ui/Badge.tsx
const STATUS_STYLES: Record<string, string> = {
  // Lead statuses
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-cyan-100 text-cyan-800",
  qualified: "bg-indigo-100 text-indigo-800",
  site_visit_scheduled: "bg-violet-100 text-violet-800",
  quoted: "bg-amber-100 text-amber-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
  dormant: "bg-slate-100 text-slate-800",
  converted: "bg-emerald-100 text-emerald-800",

  // Job statuses
  scheduled: "bg-blue-100 text-blue-800",
  en_route: "bg-cyan-100 text-cyan-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",

  // QA statuses
  approved: "bg-green-100 text-green-800",
  flagged: "bg-amber-100 text-amber-800",
  needs_rework: "bg-red-100 text-red-800",

  // Assignment statuses
  assigned: "bg-blue-100 text-blue-800",
  complete: "bg-green-100 text-green-800",

  // Application statuses
  reviewed: "bg-cyan-100 text-cyan-800",
  interview_scheduled: "bg-violet-100 text-violet-800",
  interviewed: "bg-indigo-100 text-indigo-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-slate-100 text-slate-800",

  // Notification statuses
  queued: "bg-slate-100 text-slate-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  permanently_failed: "bg-red-200 text-red-900",

  // Generic
  active: "bg-green-100 text-green-800",
  inactive: "bg-slate-100 text-slate-800",
  pending: "bg-amber-100 text-amber-800",
  open: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

const LABEL_OVERRIDES: Record<string, string> = {
  site_visit_scheduled: "Site Visit",
  needs_rework: "Needs Rework",
  en_route: "En Route",
  in_progress: "In Progress",
  interview_scheduled: "Interview",
  permanently_failed: "Perm. Failed",
};

export function Badge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-800";
  const label = LABEL_OVERRIDES[status] ?? status.replace(/_/g, " ");

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}
```

Now every status display across the entire app uses the same colors and labels. Import `Badge` everywhere that currently has inline status styling.

**Effort: 8 hours** (component library + sweep to replace inline patterns)

---

## 29. ONBOARDING & HELP {#29-onboarding}

### What's Missing

When an admin first logs in, they see a dashboard with all zeros and no guidance. No tutorial, no tooltips, no documentation.

### First-Run Experience

The codebase already has a `FirstRunWizard` (mentioned in the report as XF-32). Build on it:

```tsx
// Contextual help tooltips
// src/components/ui/HelpTooltip.tsx
export function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-300"
        aria-label="Help"
      >
        ?
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg max-w-xs">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </span>
  );
}
```

### Where to Add Help Tooltips

| Location | Help Text |
|---|---|
| Lead Pipeline title | "Leads from your website appear here automatically. Drag or update their status as you work through them." |
| "Send Quote" button | "This will email a professional quote to the lead. You can preview it first." |
| "Convert to Client" button | "Creates a client record and marks this lead as won. Do this after they accept a quote." |
| QA Approval section | "Review completion photos and checklist. Approve to close the job, or flag for rework." |
| Weekly Pulse metrics | "These numbers are computed from your actual data over the past 7 days." |
| Financial section | "Revenue data comes from QuickBooks. Connect QB in Settings to enable real-time sync." |

**Effort: 3 hours** (tooltip component + placement across key areas)

---

## 30. STATUS BADGE CONSISTENCY {#30-status-badges}

Covered in Section 28 as part of the shared `Badge` component. The key insight: currently each component builds its own status color mapping inline with different Tailwind classes. Centralizing into one `Badge` component ensures:

- Same color for "completed" everywhere
- Human-readable labels (not raw `snake_case`)
- New statuses only need to be added in one place

---

## 31. ADMIN SIDEBAR POLISH {#31-sidebar-polish}

### What's Missing

The report mentions C-10: `dispatch` and `scheduling` modules exist but have no sidebar nav entry. Also, the sidebar has no visual hierarchy — all modules look equally important.

### What to Build

```tsx
// Grouped sidebar with sections
const SIDEBAR_SECTIONS = [
  {
    title: null, // No header for primary section
    items: [
      { id: "overview", label: "Dashboard", icon: <HomeIcon /> },
    ],
  },
  {
    title: "Sales",
    items: [
      { id: "leads", label: "Lead Pipeline", icon: <LeadsIcon />, badge: unclaimedLeads },
      { id: "quotes", label: "Quotes", icon: <QuoteIcon /> }, // If separate from leads
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "tickets", label: "Jobs", icon: <JobIcon />, badge: activeJobs },
      { id: "scheduling", label: "Schedule", icon: <CalendarIcon /> }, // C-10: was missing
      { id: "dispatch", label: "Dispatch", icon: <TruckIcon /> },     // C-10: was missing
      { id: "operations", label: "QA & Reports", icon: <CheckIcon /> },
    ],
  },
  {
    title: "Team",
    items: [
      { id: "hiring", label: "Hiring", icon: <UsersIcon />, badge: newApplications },
    ],
  },
  {
    title: "Resources",
    items: [
      { id: "inventory", label: "Inventory", icon: <PackageIcon />, badge: lowStockCount },
      { id: "insights", label: "Insights", icon: <ChartIcon /> },
    ],
  },
  {
    title: null,
    items: [
      { id: "config", label: "Settings", icon: <GearIcon /> },
    ],
  },
];
```

### Live Badges

The sidebar should show real-time counts for actionable items:

```tsx
// Badge on sidebar item
{item.badge != null && item.badge > 0 && (
  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
    {item.badge > 99 ? "99+" : item.badge}
  </span>
)}
```

| Module | Badge Shows |
|---|---|
| Leads | Unclaimed leads (status = "new") |
| Jobs | Active jobs today |
| Hiring | New applications |
| Inventory | Low stock items |

These counts can come from the existing dashboard queries or a lightweight dedicated query.

**Effort: 4 hours** (sidebar restructure + badges + missing module entries)

---

## 32. NOTIFICATION PREFERENCES {#32-notification-prefs}

### What's Missing

No way for admin or employees to control what notifications they receive. When the notification loop is built (first pass Section 7.2), you need preferences or you'll overwhelm people.

### What to Build

```sql
CREATE TABLE notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  notification_type text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('sms', 'email', 'in_app', 'push')),
  enabled boolean NOT NULL DEFAULT true,
  UNIQUE (user_id, notification_type, channel)
);
```

### Settings UI

```tsx
// In employee portal settings or admin config
const NOTIFICATION_TYPES = [
  { key: "job_assigned", label: "New job assignment", defaultChannels: ["sms", "in_app"] },
  { key: "job_reworked", label: "Job sent back for rework", defaultChannels: ["sms", "in_app"] },
  { key: "schedule_changed", label: "Schedule changes", defaultChannels: ["sms"] },
  { key: "message_received", label: "New messages", defaultChannels: ["in_app"] },
  { key: "supply_approved", label: "Supply request approved", defaultChannels: ["in_app"] },
];

// Render as a grid of toggles:
// Type         | SMS | Email | In-App
// Job Assigned | ✅  | ❌    | ✅
// Rework       | ✅  | ❌    | ✅
// Schedule     | ✅  | ❌    | ❌
// Messages     | ❌  | ❌    | ✅
```

**Effort: 4 hours** (schema + preferences UI + check preferences before dispatching)

---

## 33. DATA EXPORT & REPORTING {#33-data-export}

### What's Done

UnifiedInsightsClient already has CSV export per tab. Good.

### What's Missing

- **No scheduled reports** — admin can't get a weekly email summary
- **No custom date range exports** — tied to the tab's selected range
- **No combined report** — can't export everything in one file
- **No PDF reports** — for sharing with accountants, partners

### What to Build

**Weekly email summary** using existing `resilient-email.ts`:

```typescript
// Cron job: runs Monday 7 AM
async function sendWeeklyReport() {
  const admin = await getAdminProfile();
  const metrics = await computeWeeklyMetrics(); // Reuse dashboard query logic

  await sendEmail({
    to: admin.email,
    subject: `Weekly Report — ${formatDate(new Date())}`,
    html: renderWeeklyReportEmail(metrics),
  });
}
```

The email template includes:
- Jobs completed this week
- Revenue collected
- New leads + conversion rate
- Open issues
- Schedule for next week
- Low stock alerts

**Effort: 4 hours** (cron job + email template + metrics aggregation)

---

## 34. PHOTO GALLERY FOR ADMIN {#34-photo-gallery}

### What's Missing

Employees upload before/after photos for every job. The infrastructure is excellent (offline queue, compression, geo-location). But the admin has no centralized way to view these photos. They'd have to click into each individual job to see its photos.

### What to Build

```tsx
// src/components/admin/PhotoGallery.tsx
// Grid view of all job photos with:
// - Filter by date range
// - Filter by employee
// - Filter by job/client
// - Before/after comparison view
// - Full-screen lightbox on click
// - Download originals
// - Use in marketing (flag favorites)
```

This leverages the existing `job_photos` table which already has `job_id`, `uploaded_by`, `photo_type` (before/after), `geo_lat`, `geo_lng`, and `created_at`.

The admin could use these photos for:
- Marketing / social media
- Client-facing completion reports
- Quality assurance review
- Training new employees

**Effort: 6 hours** (gallery grid + filters + lightbox + download)

---

## 35. PRIORITY MATRIX — THIS PASS {#35-priority-matrix}

Everything in this second pass ranked by impact-per-hour:

### Tier 1: "Why isn't this already there?" (High impact, low effort)

| # | Item | Hours | Why It Matters |
|---|---|---|---|
| 1 | Toast notification system | 4 | Every mutation is silent — user has zero feedback |
| 2 | Double submission prevention | 3 | Creates duplicate records on slow connections |
| 3 | `useDebounce` + functional setState | 3 | Stale data and race conditions |
| 4 | Formatting library (currency/date/phone) | 4 | 6 currency formats, 5 date formats — inconsistent |
| 5 | Icon system (replace emoji) | 3 | Unprofessional, inaccessible |
| 6 | Loading skeletons | 3 | Blank flash on every module switch |
| 7 | Empty states | 2 | "No data" tells the user nothing |
| 8 | Status Badge component | 2 | Different colors for same status across modules |
| **Subtotal** | | **24** | |

### Tier 2: "Professional admin tool" (High impact, medium effort)

| # | Item | Hours | Why It Matters |
|---|---|---|---|
| 9 | URL state + deep linking | 6 | Back button, bookmarks, sharing, refresh |
| 10 | Command palette (global search) | 6 | Find anything in 2 keystrokes |
| 11 | AbortController on unmount | 4 | Wasted requests, potential state bugs |
| 12 | Scroll position preservation | 2 | Lost context after every action |
| 13 | Z-index management + scroll lock | 2 | Overlay stacking conflicts |
| 14 | Form draft persistence | 2 | Lost work on accidental navigation |
| 15 | Undo pattern | 2 | Faster than confirmation dialogs for reversible actions |
| 16 | Keyboard shortcuts | 4 | Power user productivity |
| 17 | Sidebar polish + missing modules | 4 | C-10 fix + visual hierarchy + badges |
| 18 | Shared UI component library | 8 | Consistency across all modules |
| **Subtotal** | | **40** | |

### Tier 3: "Best-in-class" (High impact, higher effort)

| # | Item | Hours | Why It Matters |
|---|---|---|---|
| 19 | Real-time subscriptions | 6 | See new leads instantly without refreshing |
| 20 | Calendar view | 6 | Visual schedule planning |
| 21 | Batch operations | 5 | Handle 20+ leads/day efficiently |
| 22 | Print / PDF export | 8 | Printable quotes, schedules, reports |
| 23 | Weekly email report | 4 | Passive monitoring without logging in |
| 24 | Multi-tab sync | 2 | Consistent data across tabs |
| 25 | Performance (dynamic imports + lazy tabs) | 6 | Faster initial load + less bandwidth |
| 26 | CSP headers | 2 | XSS protection layer |
| 27 | Caching strategy | 3 | Fewer redundant API calls |
| 28 | Onboarding + help tooltips | 3 | New user guidance |
| 29 | Photo gallery for admin | 6 | Use employee photos for QA + marketing |
| 30 | Notification preferences | 4 | Don't overwhelm with notifications |
| **Subtotal** | | **55** | |

### Tier 4: "Competitive advantage" (Business features)

| # | Item | Hours | Why It Matters |
|---|---|---|---|
| 31 | Recurring job scheduling | 12-16 | Most cleaning clients are recurring |
| 32 | Customer-facing portal | 12-16 | Self-service reduces phone calls |
| 33 | Map view for scheduling | 8-12 | Route optimization saves drive time |
| 34 | SEO final polish | 8-10 | More organic leads |
| 35 | Data export + reporting | 4 | Accountant/partner sharing |
| **Subtotal** | | **44-58** | |

---

### Grand Total (Both Passes)

| Category | Hours |
|---|---|
| **First pass** (10 areas: accessibility → infrastructure) | 345-505 |
| **Second pass** Tier 1 ("Why isn't this already there?") | 24 |
| **Second pass** Tier 2 ("Professional admin tool") | 40 |
| **Second pass** Tier 3 ("Best-in-class") | 55 |
| **Second pass** Tier 4 ("Competitive advantage") | 44-58 |
| **Combined total** | **508-682** |

### Realistic "A / A+" Path

To get from current B- to A/A+, you don't need all 682 hours. Here's the efficient path:

| Phase | What | Hours | Result |
|---|---|---|---|
| **Phase 1** | Finish 10-session fixes + Tier 1 from this pass | 24 | **B+** — functional, honest, user gets feedback |
| **Phase 2** | Security (first pass) +

