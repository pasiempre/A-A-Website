# F-07 Acceptance Evidence Template

Date: 2026-04-03
Owner: <pending>
Environment: local (remote Supabase)

## 1) Preflight

- Command: `npm run preflight:f07`
- Result: PASS
- Notes: DNS and HTTPS checks passed for `ktqufntwzeumhcnjiqcd.supabase.co`.

## 2) Smoke Foundations

- Command: `npm run smoke:f07`
- Result: PASS
- Notes: 8 passed, 0 failed. Prior schema issues were resolved by applying migrations `0021`, `0022`, `0023`, and compatibility migration `0024_jobs_title_compatibility.sql`.

## 3) Sequence Start

- Endpoint: `POST /api/post-job-sequence`
- Job ID:
- Response payload file/link:
- DB snapshot file/link:

## 4) Scheduler Execution

- Endpoint: `POST /api/post-job-scheduler`
- Request payload:
- Response payload file/link:
- DB snapshot file/link:

## 5) Inbound Rating (High)

- Endpoint: `POST /api/post-job-rating`
- MessageSid:
- Response payload file/link:
- Twilio evidence file/link:
- DB snapshot file/link:

## 6) Inbound Rating (Low)

- Endpoint: `POST /api/post-job-rating`
- MessageSid:
- Response payload file/link:
- Twilio evidence file/link:
- DB snapshot file/link:

## 7) Idempotency

- Replayed MessageSid:
- Response payload file/link:
- Confirmation note:

## 8) Payment Reminder Path

- Unpaid reminder evidence:
- Awaiting payment record evidence:
- Paid completion transition evidence:

## 9) Security Controls

- Unauthorized cron call (`/api/post-job-scheduler`) evidence:
- Unsigned webhook behavior evidence:
- Unauthorized `/api/post-job-settings` access evidence:

## 10) Final Result

- F-07 acceptance status: PASS/FAIL
- Open issues:
- Approver:
