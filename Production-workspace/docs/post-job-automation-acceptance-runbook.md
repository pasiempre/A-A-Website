# Post-Job Automation Acceptance Runbook (F-07)

Last Updated: 2026-04-02
Owner: Admin Ops + Engineering
Scope: Validate post-job sequence end-to-end with production-equivalent credentials and store evidence for closure.

## 1) Preconditions

1. Environment variables are set and valid:
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `GOOGLE_REVIEW_URL` (or DB settings override)

2. Post-job settings are configured in admin UI:
- `/admin` -> Settings -> Post-Job Automation
- Confirm expected delays and low-rating threshold.

3. At least one admin profile has:
- `role = admin`
- valid phone number

4. Test job has:
- QA approved/completed status
- customer phone
- optional client email (for completion notice)

5. Run the focused automation smoke precheck:

```bash
npm run preflight:f07
```

Then run smoke checks:

```bash
npm run smoke:f07
```

Expected:
- All tests pass for schema/settings/due-step/idempotency foundations.

If this fails with `fetch failed`:
- Verify `.env.local` points to reachable Supabase project URL.
- Verify network/VPN/firewall allows outbound access.
- Continue with manual API-based checks only after connectivity is restored.

## 2) Evidence Capture Requirements

Capture all of the following artifacts:

1. API response payloads (JSON) for each run step.
2. Twilio dashboard screenshots for sent messages (or equivalent provider evidence).
3. Supabase row snapshots showing sequence state transitions.
4. Final checklist entry with timestamps and links to artifacts.

Suggested evidence folder: `Production-workspace/docs/evidence/f07-<date>/`

## 3) Seed/Locate a Candidate Job

Use SQL editor in Supabase to identify an eligible job:

```sql
select id, title, qa_status, completed_at, client_id, customer_phone, payment_status
from public.jobs
where qa_status in ('approved', 'completed')
order by updated_at desc
limit 5;
```

Record selected `job_id`.

## 4) Start Sequence (Admin Trigger)

Trigger sequence:

```bash
curl -sS -X POST http://localhost:3000/api/post-job-sequence \
  -H 'content-type: application/json' \
  -H 'cookie: <admin-session-cookie>' \
  -d '{"jobId":"<job_id>"}'
```

Expected:
- `success: true`
- non-null `sequenceId`
- admin notification and customer email status flags in payload

Evidence:
- Save API payload
- Save `post_job_sequence` row

```sql
select *
from public.post_job_sequence
where job_id = '<job_id>'
order by updated_at desc
limit 1;
```

## 5) Execute Scheduler Due Steps

For validation, either wait for due timestamps or temporarily reduce delays via settings.

Run scheduler:

```bash
curl -sS -X POST http://localhost:3000/api/post-job-scheduler \
  -H 'authorization: Bearer <CRON_SECRET>' \
  -H 'content-type: application/json' \
  -d '{"dryRun":false,"limit":50}'
```

Expected:
- Non-zero `processed` when due steps exist
- `sent` and/or `queued` increments
- No unexpected failures

Evidence:
- Save scheduler payload
- Save updated sequence row

## 6) Validate Inbound Rating Webhook

Submit a simulated inbound rating payload (form-encoded):

```bash
curl -sS -X POST http://localhost:3000/api/post-job-rating \
  -H 'content-type: application/x-www-form-urlencoded' \
  --data-urlencode 'Body=5' \
  --data-urlencode 'From=<customer_phone>' \
  --data-urlencode 'To=<twilio_number>' \
  --data-urlencode 'MessageSid=SM_TEST_<timestamp>'
```

Expected for high rating:
- `ok: true`
- `parsed: true`
- `routed: review_invite`

Repeat with low rating (e.g., `Body=2`) to verify admin alert path:
- expected `routed: low_rating_alert`

Idempotency check:
- Re-send the same `MessageSid`
- expected `ignored: true` with duplicate reason

Evidence:
- Save each API payload
- Save Twilio send evidence
- Save sequence updates after each branch

## 7) Payment Reminder Path Validation

Set payment status unpaid on candidate job (if needed), then run scheduler when payment reminder step is due.

Expected:
- Reminder sent to admin phone
- Sequence `next_step = awaiting_payment_record`
- Sequence remains `status = active`

If payment status set to paid and scheduler rerun:
- sequence completes (`status = completed`, `next_step = done`)

## 8) Security Validation

1. Missing cron auth:
- call `/api/post-job-scheduler` without bearer token
- expect `401`

2. Production unsigned webhook behavior:
- when `NODE_ENV=production` and `TWILIO_ALLOW_UNSIGNED_WEBHOOK!=true`
- missing signature should return `401`

3. Admin settings endpoint auth:
- unauthenticated GET/PATCH on `/api/post-job-settings` should return auth error

## 9) Closure Checklist

Mark F-07 closure-ready when all pass:

1. Sequence start path validated.
2. Scheduler due-step path validated.
3. High-rating and low-rating inbound branches validated.
4. MessageSid idempotency validated.
5. Payment reminder behavior validated for unpaid and paid outcomes.
6. Security controls validated (cron auth + webhook policy).
7. Evidence artifacts attached and linked in active checklist.

## 10) Active Checklist Update Template

Add this block to active checklist when completed:

```md
F-07 acceptance evidence (YYYY-MM-DD):
- Sequence start payload: <link>
- Scheduler execution payload: <link>
- High-rating inbound proof: <link>
- Low-rating inbound proof: <link>
- Duplicate MessageSid proof: <link>
- Payment reminder unpaid->awaiting_payment_record proof: <link>
- Paid completion transition proof: <link>
- Twilio delivery screenshots/logs: <link>
- Security rejection proofs (unauthorized cron / unsigned webhook): <link>
```
