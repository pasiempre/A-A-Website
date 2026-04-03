# Master Spec Status Check

Date: March 20, 2026  
Source of truth: `Gameplan Docs/AA-Cleaning-Master-Spec.md` (Sections 1.5 and 3.0)

Session context references: `SESSION-LOG.md`, `PICKUP-GUIDE.md`

## Overall Snapshot

- Estimated completion against Phase 1 MVP scope: **~80%**
- Public-facing website: **mostly complete, polish remaining**
- Largest remaining effort: **admin/employee production hardening, QA, and integrations/ops validation**

---

## A) Phase 1 MVP Scope (Section 3.0)

Legend: ✅ Done · 🟡 Partial · ⬜ Not Started

| MVP Requirement | Status | Evidence | Notes / Gap |
|---|---|---|---|
| Public website (landing, quote request, employment application, about) | ✅ | `src/app/(public)/page.tsx`, `src/app/(public)/about/page.tsx`, `src/app/(public)/contact/page.tsx`, `src/app/(public)/careers/page.tsx`, `src/app/api/quote-request/route.ts`, `src/app/api/employment-application/route.ts` | Broad public surface implemented and expanded. |
| Booking + quote pipeline (lead capture → SMS → lead list → quote create → PDF → lead-to-client conversion) | ✅ | `src/app/api/quote-request/route.ts`, `src/components/admin/LeadPipelineClient.tsx`, `src/app/api/quote-send/route.ts`, `src/lib/quote-pdf.ts`, `src/app/api/quote-create-job/route.ts`, `src/app/api/quote-response/route.ts`, `src/app/quote/[token]/page.tsx` | Core flow exists end-to-end. Remaining work is reliability/testing and UX polish. |
| Admin dashboard (create jobs, assign crew, status-filtered job list, lead pipeline, notification center) | 🟡 | `src/app/(admin)/admin/page.tsx`, `src/components/admin/TicketManagementClient.tsx`, `src/components/admin/LeadPipelineClient.tsx`, `src/components/admin/NotificationCenterClient.tsx` | Implemented, but still needs production hardening and verification against "under 2 min" target. |
| Employee portal (Spanish-first jobs, status updates, timestamped photo upload, issue reporting) | 🟡 | `src/app/(employee)/employee/page.tsx`, `src/components/employee/EmployeeTicketsClient.tsx`, `src/lib/client-photo.ts`, `src/lib/photo-upload-queue.ts` | Core flow implemented incl. offline queue, but needs real-device validation + full smoke tests. |
| SMS notifications (assignment + new lead alerts) | ✅ | `notifications.ts` now has retry, dedup, queue-on-failure. `notification-dispatch/route.ts` has dedup, exponential backoff, dead letter, telemetry. | Twilio production credential verification still needed. |
| Crew auth with Phone OTP (Twilio-compatible) | ✅ | `src/app/(auth)/auth/employee/EmployeeAuthClient.tsx`, `middleware.ts` | OTP flow and role-guard routing are in place. |
| Follow-up reminders for uncalled leads (1h + 4h) | 🟡 | `src/app/api/lead-followup/route.ts`, `src/app/api/notification-dispatch/route.ts` | API/queue logic implemented; cron scheduling/ops proof is remaining. |

---

## B) MVP Launch Criteria (Section 1.5)

| Launch Criterion | Status | Why |
|---|---|---|
| Areli can create work order in under 2 minutes | 🟡 | Workflow exists, but no measured benchmark evidence captured yet. |
| Work order assigned + crew receives SMS | ✅ (code complete) | Assignment + SMS dispatch implemented with retry, dedup, and failure recovery. Needs Twilio production credentials to verify live delivery. |
| Crew can view details, update status, upload timestamped photos | ✅ | Implemented in employee portal with status updates and photo capture/upload pipeline. |
| Areli can view completed job with photos in admin dashboard | ✅ | Admin ticketing and completion report data paths are present. |
| Public site live with working quote form (every page CTA) | 🟡 | Quote flow works; CTA consistency still has polish items from public-page audit. |
| New leads trigger immediate SMS to Areli | 🟡 | Implemented in quote-request route; environment-dependent verification still required. |
| Areli can view leads, send branded quote, and convert to client/job | ✅ | End-to-end route + UI flow exists through lead pipeline and quote APIs. |

---

## C) Explicitly Deferred Features (Section 3.0 Table)

These were *not required* for MVP, but some are already partially started.

| Deferred Feature | Planned Phase | Current State |
|---|---|---|
| QA review queue | Phase 2 | 🟡 Partial foundations (QA status fields/controls exist in ticketing). |
| Checklist templates | Phase 2 | 🟡 Partially started (template linkage and checklist item creation appear in admin flow). |
| Location-based messaging | Phase 2 | 🟡 Basic job messaging present in employee ticket flow; not a full location messaging module yet. |
| Client portal | Phase 3 (if validated) | ⬜ Not started as dedicated portal. |
| Resource library CMS | Phase 3 | ⬜ Not started (CMS not implemented). |
| Onboarding module (crew training) | Phase 3 | ⬜ Not started as full training system. |
| Financial dashboard | Phase 4 | 🟡 Partial (`quickbooks-sync` exists but currently simulated/queued). |
| Analytics dashboard | Phase 4 | 🟡 Partial scaffolding (`UnifiedInsightsClient`), likely not full KPI pipeline yet. |
| Calendar drag-and-drop | Phase 5 | 🟡 Partial: Scheduling module now includes week/day time-grid plus drag/drop desktop and tap-to-assign mobile interactions. |
| Inventory management | Phase 5 | 🟡 Partial modules visible in admin/employee components. |
| AI chatbot | Phase 5 | 🟡 Early API endpoint exists (`api/ai-assistant`), not full production assistant feature. |

---

## D) What This Means Right Now

- Your intuition is correct: **public-facing work is mostly in polish/refinement mode**.
- The remaining heavy effort is primarily:
  1. **Admin/employee robustness + speed validation** (real usage targets, fewer edge-case failures)
  2. **Operational readiness** (cron jobs, Twilio/Resend/QuickBooks env, runbooks)
  3. **Testing + real-device verification** (especially mobile capture/upload and job lifecycle)

---

## E) High-Leverage Next 7 Tasks

1. Execute and document real-device camera/photo test on at least 3 crew phones.
2. Run end-to-end smoke suite for: auth → job create/assign → employee completion → admin QA review.
3. Verify Twilio delivery in production-like env for assignment + lead alerts + 1h/4h follow-ups.
4. Close homepage/public CTA consistency issues from `GRADING-AUDIT.md` Phase 3 findings.
5. Add minimal observability for API failures (quote-request, assignment-notify, quote-send).
6. Confirm and document cron schedule for `lead-followup` and `notification-dispatch`.
7. Tighten QuickBooks path from simulated/queued to real sync once credentials are finalized.
