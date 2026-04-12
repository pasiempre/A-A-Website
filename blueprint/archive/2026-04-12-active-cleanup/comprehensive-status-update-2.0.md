# A&A Cleaning Services — Full Project Review Guide

## Approach & Recommendations

**Three things I'd recommend before we start:**

1. **Rolling Context Document** — After each chat session, I'll produce a compact "Session Summary" block you paste into the next chat along with the original Context Transfer Document. This keeps continuity without re-reviewing files.

2. **Standardized Review Checklist** — Every file gets evaluated against the same criteria so nothing is subjective or inconsistent across sessions.

3. **Batch by Domain, Not Alphabet** — Files that interact get reviewed together. Reviewing `useQuoteForm.ts` without seeing `FloatingQuotePanel.tsx` in the same session wastes context.

---

## Review Checklist (Per File)

Every file gets scored on these dimensions:

| # | Dimension | What We're Looking For |
|---|---|---|
| 1 | **Correctness** | Bugs, logic errors, broken edge cases |
| 2 | **Security** | Exposed secrets, missing auth checks, injection vectors, RLS gaps |
| 3 | **Performance** | Unnecessary re-renders, missing memoization, bundle impact, N+1 queries |
| 4 | **Error Handling** | Missing try/catch, silent failures, user-facing error states |
| 5 | **Type Safety** | `any` usage, missing types, unsafe casts |
| 6 | **Accessibility** | Missing aria, keyboard traps, focus management, screen reader gaps |
| 7 | **Code Quality** | Dead code, duplication, naming clarity, separation of concerns |
| 8 | **UX/Copy** | Placeholder content, broken links, inconsistent messaging |
| 9 | **Integration Risk** | Coupling to external services, missing fallbacks, timeout handling |
| 10 | **Launch Readiness** | Is this file production-safe as-is? |

Each file gets a verdict: **✅ Ship-Ready**, **⚠️ Ship with Known Issues**, or **🔴 Needs Fix Before Launch**.

---

## Session Plan (10 Sessions Estimated)

### Session 1 — Core Conversion Flow (THIS session, after guide)
**Files (5):**
1. `useQuoteForm.ts`
2. `FloatingQuotePanel.tsx`
3. `QuoteContext.tsx`
4. `api/quote-request/route.ts`
5. `quote/success/page.tsx`

**Why first:** This is the money path. Every lead flows through here.

---

### Session 2 — Public Chrome & Homepage Composition
**Files (6):**
1. `PublicChrome.tsx`
2. `VariantAPublicPage.tsx`
3. `HeroSection.tsx`
4. `AuthorityBar.tsx`
5. `CTAButton.tsx`
6. `QuoteCTA.tsx`

---

### Session 3 — Homepage Sections (Above-the-Fold Trust)
**Files (5):**
1. `ServiceSpreadSection.tsx`
2. `OfferAndIndustrySection.tsx`
3. `TimelineSection.tsx`
4. `BeforeAfterSlider.tsx`
5. `TestimonialSection.tsx`

---

### Session 4 — Homepage Sections (Lower) + Overlays
**Files (6):**
1. `AboutSection.tsx`
2. `ServiceAreaSection.tsx`
3. `QuoteSection.tsx`
4. `FAQSection.tsx`
5. `ExitIntentOverlay.tsx`
6. `AIQuoteAssistant.tsx`

---

### Session 5 — Public Header, Footer, Shared Infrastructure
**Files (6):**
1. `PublicHeader.tsx`
2. `FooterSection.tsx`
3. `ServicePageHardening.tsx`
4. `analytics.ts`
5. `service-type-map.ts`
6. `api/ai-assistant/route.ts`

---

### Session 6 — Service & Industry Pages
**Files (8):**
1. `services/page.tsx` (index)
2. `services/post-construction-cleaning/page.tsx`
3. `services/final-clean/page.tsx`
4. `services/commercial-cleaning/page.tsx`
5. `services/move-in-move-out-cleaning/page.tsx`
6. `services/windows-power-wash/page.tsx`
7. `industries/page.tsx`
8. `industries/[slug]/page.tsx`

---

### Session 7 — Remaining Public Pages
**Files (8):**
1. `about/page.tsx`
2. `contact/page.tsx`
3. `faq/page.tsx`
4. `careers/page.tsx`
5. `privacy/page.tsx`
6. `terms/page.tsx`
7. `service-area/page.tsx`
8. `service-area/[slug]/page.tsx`

---

### Session 8 — Admin System
**Files (6):**
1. `AdminShell.tsx`
2. `AdminSidebarNav.tsx`
3. `LeadPipelineClient.tsx`
4. `TicketManagementClient.tsx`
5. `OverviewDashboard.tsx`
6. `FirstRunWizardClient.tsx`

---

### Session 9 — Admin Modules + Employee Portal
**Files (8):**
1. `DispatchModule.tsx`
2. `SchedulingAndAvailabilityClient.tsx`
3. `InventoryManagementClient.tsx`
4. `UnifiedInsightsClient.tsx`
5. `NotificationCenterClient.tsx`
6. `HiringInboxClient.tsx`
7. `EmployeePortalTabs.tsx`
8. `EmployeeTicketsClient.tsx`

---

### Session 10 — API Routes, Infrastructure, Security
**Files (10+):**
1. `api/quote-send/route.ts`
2. `api/quote-response/route.ts`
3. `api/quote-create-job/route.ts`
4. `api/assignment-notify/route.ts`
5. `api/completion-report/route.ts`
6. `api/quickbooks-sync/route.ts`
7. `middleware.ts`
8. `lib/supabase/client.ts`
9. `lib/supabase/admin.ts`
10. `lib/idempotency.ts`
11. `lib/resilient-email.ts`
12. `lib/notifications.ts`
13. `quote/[token]/page.tsx`
14. `camera-spike/page.tsx`

---

## What I Need From You Per Session

For each session, paste:
1. **The original Context Transfer Document** (top of this chat)
2. **The Rolling Session Summary** (I'll generate after each session)
3. **The file contents** for that session's batch — paste them one or two at a time as we work through

---

## Rolling Session Summary Template

After each session I'll produce this block for you to carry forward:

```
## Rolling Review Summary (Updated after Session X)

### Sessions Completed: X/10
### Files Reviewed: XX/50+
### Critical Issues Found: X
### Ship-Blockers Found: X

### Issue Log:
| # | File | Severity | Issue | Status |
|---|------|----------|-------|--------|

### Key Patterns Noted:
- [cross-cutting observations]

### Next Session: [Session N — Topic]
### Files Needed: [list]
```

---

