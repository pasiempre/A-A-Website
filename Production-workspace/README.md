# A&A Cleaning Platform (Production Workspace)

Next.js App Router workspace powering:

- Public website (Variant A componentized)
- Admin dashboard (leads → quotes → jobs, ops/quality/notifications/inventory)
- Employee portal (tickets + assignments, Spanish-first)
- API routes for lead capture, quote delivery/acceptance, post-job automation, notifications, and QuickBooks sync

This folder is the “real app” (see `Production-workspace/src`). Other top-level folders in the repo include legacy HTML variants and planning/blueprint docs.

## Tech stack

- Next.js 16 (App Router) + Turbopack dev server
- React 19 + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth)
- Sentry (optional)
- Upstash Redis rate limiting (optional; degraded allow-all if unset)

## Docs / maps (recommended reading)

- `CODEBASE-MAP.md` — comprehensive route/component map
- `CRITICAL CHECKS BEFORE DEPLOYMENT.md` — deployment-critical validation checklist
- `docs/post-job-automation-acceptance-runbook.md` — F-07 end-to-end acceptance runbook + evidence requirements
- `docs/sprint-0-1-plan.md` — foundation/MVP delivery plan

## Quick start (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then:

- Public: `http://localhost:3000/`
- Admin login: `http://localhost:3000/auth/admin`
- Employee login: `http://localhost:3000/auth/employee`

### Useful scripts

- `npm run dev` — start dev server (Turbopack)
- `npm run build` / `npm run start` — production build + server
- `npm run lint` — ESLint
- `npm run analyze` — build with bundle analyzer (`ANALYZE=true`)
- `npm run preflight:f07` — preflight for post-job automation (F-07)
- `npm run smoke:f07` — focused smoke tests for F-07 foundations

## Environment variables

Start by copying `.env.example` to `.env.local`.

Notes:

- The server performs startup validation (see `src/lib/env.ts`). Missing variables will be logged early.
- Some integrations are optional and have safe fallbacks (e.g., QuickBooks sync runs in simulated mode until configured).

### Required (core app)

Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side admin client)

Lead enrichment token signing (required for `/api/quote-request` step2):

- `ENRICHMENT_TOKEN_SECRET`

Cron / internal endpoints (fail-closed if missing):

- `CRON_SECRET`

Notifications (SMS + email):

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

App URLs:

- `NEXT_PUBLIC_APP_URL` (defaults to `http://localhost:3000`)

### Optional (feature / production hardening)

- `ADMIN_ALERT_PHONE` — default admin phone for lead alerts (recommended)
- `ADMIN_NOTIFICATION_EMAIL` — admin inbox for employment application email notifications
- `GOOGLE_REVIEW_URL` — used by post-job review invite automation
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — distributed rate limiting (recommended in production)
- `ANTHROPIC_API_KEY` — enables Anthropic-backed AI assistant (otherwise uses a rules-based fallback)
- `SENTRY_DSN` or `NEXT_PUBLIC_SENTRY_DSN` — enable Sentry (server/client)
- `NEXT_PUBLIC_SITE_URL` — used for SEO/canonical URL generation in some places

QuickBooks Online (optional; enabled when configured):

- `QUICKBOOKS_CLIENT_ID`
- `QUICKBOOKS_CLIENT_SECRET`
- `QUICKBOOKS_REDIRECT_URI`
- `QUICKBOOKS_ENCRYPTION_KEY`
- `QUICKBOOKS_ENVIRONMENT` (default `sandbox`)

### Development-only

- `NEXT_PUBLIC_DEV_PREVIEW_MODE=true` — bypasses *all* auth guards for `/admin` + `/employee` routes.
  - Only takes effect when `NODE_ENV != production`.
  - Must never be enabled in production.

## Database (Supabase) and migrations

SQL migrations live in `supabase/migrations/`.

Typical workflow:

1. Create / select the Supabase project.
2. Apply any migrations your project is missing via the Supabase SQL editor.

Notes:

- The migration set includes a schema bootstrap (`0018_core_schema_bootstrap.sql`) intended to reconcile environments that are missing foundational tables.
- Several migrations are written to be idempotent (`IF NOT EXISTS`) so they can be re-run safely, but you should still apply changes in numeric order when possible.

### Roles / auth model (important)

There are two places “role” matters:

- **Route middleware** (`middleware.ts`) gates `/admin` and `/employee` using Supabase Auth `raw_app_meta_data.role`.
- **Admin-protected API routes** use `public.profiles.role` (queried via `src/lib/auth.ts`).

The signup trigger `handle_new_user()` writes `profiles.role` from `raw_app_meta_data.role` (see migration `0024_fix_handle_new_user_role_source.sql`).

Practical implication:

- To grant admin access, set a user’s **Auth app metadata** role to `admin` (not user metadata), and ensure `public.profiles.role` is `admin`.

## Routes (high-level)

Route groups:

- `src/app/(public)` — public site + service pages + quote response pages
- `src/app/(admin)` — admin dashboard
- `src/app/(employee)` — employee portal
- `src/app/(auth)` — login flows

Useful pages:

- `/camera-spike` — internal camera/testing page
- `/quote/[token]` — quote response landing (accept/reject)

## API surface (selected)

Lead + quote pipeline:

- `POST /api/quote-request` — lead intake (dedup + multi-step enrichment token)
- `POST /api/quote-send` — send quote
- `POST /api/quote-response` — accept/reject quote
- `POST /api/quote-create-job` — convert quote → job

Notifications + follow-up (cron/internal):

- `POST|GET /api/lead-followup` — sends 1h/4h/24h “uncalled lead” alerts (requires `Authorization: Bearer <CRON_SECRET>`)
- `POST /api/notification-dispatch` — flush queued SMS with dedup + retry (supports cron + admin auth)

Post-job automation (F-07):

- `POST /api/post-job-sequence` — starts post-job sequence (admin)
- `POST /api/post-job-scheduler` — processes due steps (cron-protected)
- `POST /api/post-job-rating` — Twilio inbound rating webhook
- `GET|PATCH /api/post-job-settings` — admin automation settings

QuickBooks:

- `GET /api/quickbooks-callback` — OAuth callback
- `GET|POST /api/quickbooks-sync` — sync preview/confirm + safe simulation fallback

Other:

- `POST /api/employment-application` — careers application intake (Resend email)
- `POST /api/ai-assistant` — public AI quote assistant (Anthropic w/ fallback)
- `POST /api/ticket-create` — ticket creation (admin)
- `POST /api/conversion-event` — conversion telemetry

## Ops / validation

Deployment-critical notes are tracked in:

- `CRITICAL CHECKS BEFORE DEPLOYMENT.md`
- `docs/post-job-automation-acceptance-runbook.md`

Recommended pre-deploy validation (see the critical checks doc):

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Security model (overview)

- `middleware.ts` applies: auth gates (admin/employee), rate limiting, structured request logging, and security headers.
- Cron endpoints are fail-closed: if `CRON_SECRET` is missing, they reject all requests (see `src/lib/cron-auth.ts`).
- Twilio webhooks enforce signature verification in production unless explicitly overridden (`TWILIO_ALLOW_UNSIGNED_WEBHOOK=true` is for debugging only).

## Redirects / compatibility

- `/admin.html` → `/admin`
- `/employee.html` → `/employee`
