# CRITICAL CHECKS BEFORE DEPLOYMENT

## Cron Security (Required)

- Confirm `CRON_SECRET` is set in deployment environment variables.
- Confirm external cron services (Vercel Cron, Railway, etc.) send `Authorization: Bearer <secret>`.
- Test cron endpoints in staging before production:
  - `POST /api/lead-followup`
  - `GET /api/lead-followup`
  - `POST /api/notification-dispatch`

## Batch C Runtime Behavior Checks

- `quote-request`: verify duplicate submissions (same name + phone within 60s) return success with dedup behavior and do not insert a second lead.
- `quote-request`: verify email timeout path does not fail lead creation.
- `ai-assistant`: verify Anthropic timeout path falls back gracefully.
- `lead-followup` and `notification-dispatch`: verify unauthorized requests return `401` when auth header is missing/invalid.

## Validation Commands

Run these before deploy:

```bash
npx tsc --noEmit
npx eslint src/app/api/quote-request/route.ts src/app/api/ai-assistant/route.ts src/app/api/lead-followup/route.ts src/app/api/notification-dispatch/route.ts
npx next build
```

## Ongoing Additions

Add any newly discovered deployment-critical checks here as future hardening work is completed.
