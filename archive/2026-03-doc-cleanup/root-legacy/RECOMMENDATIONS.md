# A&A Cleaning — Recommendations Log

This file is a living implementation + optimization log.

## Process Rule
- After each implementation pass, run a short review and append any new gaps, upgrades, or service/offer improvements.
- Keep completed recommendations in this file (mark as implemented when done) so nothing is lost.

## Current Recommendations (2026-03-18)
- Add explicit package cards on the public homepage: Builder Turnover, Final Clean, Recurring Site Care, Vacant Unit Turnover, Exterior Detail Upgrade.
- Add a trust stack near primary quote CTAs: licensing/insurance proof, QA sign-off mention, completion-photo evidence, reliability response-time promise.
- Add offer laddering tiers: Standard, Priority Turnaround, Enterprise/Portfolio to improve average contract value.
- Add industry-specific sections/landing blocks for GCs, Property Managers, and Office Operations with role-specific outcomes.
- Add automatic follow-up content after quote requests: scope recap + next steps via email/SMS.

## Implemented from Recommendations
- Service/offer section upgraded with package positioning, response-time cues, service anchors, and stronger service-specific CTA language in Production workspace.
- Added public offer ladder section with Standard / Priority Turnaround / Enterprise Portfolio packaging.
- Added industry-focused positioning blocks for GCs, Property Managers, and Office Operations.
- Added automatic post-submit follow-up content path in quote intake API (SMS acknowledgment + optional email when configured).
- Added unified insights dashboard module (overview/operations/quality/financials/inventory tabs) to support Phase 4 reporting workflows.
- Added scheduling + availability module and reassignment history tracking for Phase 5 operational resilience.
- Added inventory management module with low-stock alerts and supply request actioning.
- Added public AI quote assistant widget and backend session logging with bilingual fallback responses.
- Added admin notification queue panel with queued/sent/failed visibility, manual dispatch trigger, and retry action.
- Added employee-side inventory flows for supply usage logging and supply request submission.
- Added drag-and-drop crew reassignment lanes in scheduling for faster daily assignment adjustments.
- Added admin-facing notification preferences editor UI so quiet hours and timezone can be changed without SQL.
- Added assignment SMS dispatch path when jobs are assigned so quiet-hours logic applies to crew notifications too.
- Added first-run wizard completion tracking so setup state survives after sample cleanup.
- Added quote delivery flow with public review/accept/decline route and create-job-from-quote handoff.
- Added public employment application flow and admin hiring inbox.

## New Recommendations Added (Phase 4/5 Pass — 2026-03-18)
- Add QuickBooks OAuth token exchange + refresh workflow so `/api/quickbooks-sync` can perform live pull/push (currently scaffold + simulated fallback).
- Add visual charts and true `.xlsx` export layer for analytics views (current export is CSV).
- Add drag-and-drop weekly calendar UI for reassignment (current scheduling module uses structured list + reassignment controls).
- Add employee-facing supply request + supply usage logging UI in portal (admin side is now complete).
- Add AI assistant lead handoff action: one-click convert chat session to lead record with captured project metadata.

## New Recommendations Added (Final Completion Batch — 2026-03-18)
- Add worker-side view for request status history (requested/approved/delivered) to close inventory feedback loop.
- Add drag-and-drop by time-slot calendar grid (hour/day) to complement current employee-lane reassignment board.
- Add notification queue filters (status/date/type) and bulk retry action for larger dispatch volumes.
- Add auto-decrement stock calculations from `supply_usage_logs` to keep `supplies.current_stock` continuously updated.
- Add QuickBooks invoice pull parser + normalization mapping once OAuth connection is completed.

## New Recommendations Added (2026-03-18)
- Add admin-facing notification preferences editor UI so quiet hours and timezone can be changed without SQL.
- Add queued-notification status panel in admin dashboard (queued/sent/failed visibility with retry actions).
- Add assignment SMS dispatch path when jobs are assigned so quiet-hours logic applies to crew notifications too.
- Add bilingual copy toggle for package/industry sections to keep Spanish-first support consistent.
- Add first-run wizard completion tracking flag in profile settings so setup state survives if sample data is later removed.

## Next Review Append Template
- Date:
- What was implemented:
- New gaps found:
- New recommendation(s):
- Priority (High/Medium/Low):
