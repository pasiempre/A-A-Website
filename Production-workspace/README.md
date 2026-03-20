# A&A Cleaning Platform (Next.js Workspace)

This is the new implementation workspace for the A&A Cleaning platform using Next.js App Router + TypeScript + Tailwind.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- ESLint

## Run
1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev
3. Build production:
   npm run build
4. Start production server:
   npm run start

## Environment
Copy `.env.example` to `.env.local` and fill in keys for Supabase, Twilio, Resend, and QuickBooks.

## Sprint 1 Foundation Added
- Supabase client wiring in `src/lib/supabase`
- Auth route guards via `middleware.ts` for `/admin` and `/employee`
- Admin login route: `/auth/admin`
- Employee OTP route: `/auth/employee`
- Camera spike route: `/camera-spike`
- MVP schema migration: `supabase/migrations/0001_mvp_core.sql`
- Lead pipeline + quote workflow migration: `supabase/migrations/0004_lead_pipeline_and_quotes.sql`
- Phase 2 quality + messaging migration: `supabase/migrations/0005_phase2_quality_and_messaging.sql`
- Notification preferences + queue migration: `supabase/migrations/0006_notification_preferences_and_queue.sql`
- Phase 4/5 foundations migration: `supabase/migrations/0007_phase4_phase5_foundations.sql`
- Quote delivery + hiring migration: `supabase/migrations/0008_quote_delivery_and_hiring.sql`
- Lead intake API with Twilio admin alerts: `/api/quote-request`
- Lead follow-up reminder endpoint (1h/4h uncalled): `/api/lead-followup`
- Queued notification dispatch endpoint: `/api/notification-dispatch`
- QuickBooks sync scaffold endpoint: `/api/quickbooks-sync`
- AI quote assistant endpoint: `/api/ai-assistant`
- Quote send / accept / create-job endpoints: `/api/quote-send`, `/api/quote-response`, `/api/quote-create-job`
- Employment application endpoint: `/api/employment-application`

## Apply Database Migration
1. Open Supabase SQL editor for your project.
2. Run `supabase/migrations/0001_mvp_core.sql`.
3. Run `supabase/migrations/0002_ticketing_enhancements.sql`.
4. Run `supabase/migrations/0003_ops_and_conversion.sql`.
5. Run `supabase/migrations/0004_lead_pipeline_and_quotes.sql`.
6. Run `supabase/migrations/0005_phase2_quality_and_messaging.sql`.
7. Run `supabase/migrations/0006_notification_preferences_and_queue.sql`.
8. Run `supabase/migrations/0007_phase4_phase5_foundations.sql`.
9. Run `supabase/migrations/0008_quote_delivery_and_hiring.sql`.
10. Create users in Supabase Auth and set profile roles (`admin` / `employee`) in `public.profiles`.

## Supabase + Twilio Linking Checklist
1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project.
3. Set Twilio variables (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`) and `ADMIN_ALERT_PHONE`.
4. Start app with `npm run dev` and submit a quote from `/` to verify lead insert + admin SMS alert.
5. (Optional) Protect follow-up endpoint with `CRON_SECRET`, then configure cron to `POST /api/lead-followup` every 15 minutes.
6. (Optional) Configure cron to `POST /api/notification-dispatch` every 10-15 minutes to flush queued quiet-hours notifications.
7. (Optional) Configure `ANTHROPIC_API_KEY` to switch AI assistant responses from fallback mode to Claude-backed replies.

## Phase 4/5 Modules Added
- Unified insights dashboard (operations, quality, financials, inventory) in admin.
- Scheduling & availability module with reassignment history logging.
- Inventory module with stock alerts and supply request review actions.
- QuickBooks sync endpoint with safe simulation fallback when QB credentials are not connected.
- Public AI quote assistant widget with bilingual mode and persistent chat sessions.
- Notification center with preference editing, queue visibility, and assignment SMS retry.
- Public about, services, careers, and quote-response routes.
- Employment application intake with admin hiring inbox.

## First-Run Onboarding (Admin)
- First admin session now includes a setup wizard on `/admin` when there are no clients/jobs.
- Wizard steps: create first client, create sample job, assign to self or crew member.
- The sample job title defaults to `Sample — Delete or edit me` so Areli can edit or remove it after setup.

## Sprint 0/1 Checklist
- [ ] Confirm blocking dependencies from master spec
- [ ] Complete camera/photo spike on real crew Android devices
- [ ] Build public Variant A sections as React components
- [ ] Wire quote form to leads + SMS notifications
- [ ] Build admin lead pipeline + quote workflow
- [ ] Build employee portal status + photo upload flow
- [ ] Add smoke tests for critical MVP paths

## Route Groups
- `src/app/(public)`
- `src/app/(admin)`
- `src/app/(employee)`

## Dev Preview Mode (No Supabase/Auth Required)
To preview `/admin` and `/employee` layout shells without configuring Supabase yet:

1. Set `NEXT_PUBLIC_DEV_PREVIEW_MODE=true` in `.env.local`
2. Run `npm run dev`
3. Visit `/admin` and `/employee`

Notes:
- Preview mode is guarded to non-production environments only.
- This mode shows module layout and structure only (no live data, no auth, no writes).

## Notes
This workspace is intentionally scaffolded for Phase 1 MVP delivery and componentization of Variant A.
