# API Contracts & Specifications

**Last Updated**: March 20, 2026  
**Framework**: Next.js API Routes (`src/app/api/`)  
**Database**: Supabase (see DB-SCHEMA-SUMMARY.md)  
**Authentication**: Supabase Auth (via middleware.ts)

Session context references: `SESSION-LOG.md`, `PICKUP-GUIDE.md`

---

## Complete API Inventory

| Endpoint | Method | Purpose | Status | Key File |
|----------|--------|---------|--------|----------|
| `/api/quote-request` | POST | Capture lead from public form | ✅ Complete | `quote-request/route.ts` |
| `/api/quote-send` | POST | Send quote PDF to lead | ✅ Complete | `quote-send/route.ts` |
| `/api/quote-response` | POST | Lead accepts/declines quote | ✅ Complete | `quote-response/route.ts` |
| `/api/quote-create-job` | POST | Convert quote to job (admin) | 🟡 Works, needs test | `quote-create-job/route.ts` |
| `/api/assignment-notify` | POST | Notify crew of job assignment | ✅ Complete | `assignment-notify/route.ts` |
| `/api/lead-followup` | POST | Send follow-up reminders (cron) | 🟡 Partial | `lead-followup/route.ts` |
| `/api/completion-report` | POST | Generate job completion report | 🟡 Template ready, not auto-triggered | `completion-report/route.ts` |
| `/api/employment-application` | POST | Submit job application form | 🟡 Rate-limited, no email delivery | `employment-application/route.ts` |
| `/api/notification-dispatch` | POST | Batch send queued notifications | ✅ Complete | `notification-dispatch/route.ts` |
| `/api/conversion-event` | POST | Track conversion metrics | ✅ Complete | `conversion-event/route.ts` |
| `/api/ai-assistant` | POST | AI chatbot (basic fallback) | 🟡 Fallback only | `ai-assistant/route.ts` |
| `/api/quickbooks-sync` | POST | Sync to QuickBooks financials | 🔴 Simulated | `quickbooks-sync/route.ts` |

---

## Core Flows: Request/Response Shapes

### 1️⃣ Quote Request (Public → Lead Capture)

**Endpoint**: `POST /api/quote-request`  
**Auth**: None (public page)  
**Rate Limit**: 10 per IP per hour

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+15551234567",
  "company_name": "XYZ Corp",  // optional
  "service_type": "post-construction-cleaning",
  "timeline": "within_1_week",
  "description": "Need post-renovation cleaning for 2-bedroom apartment"
}
```

**Validation**:
- ✅ `name` — non-empty string
- ✅ `phone` — E.164 format (e.g., +1234567890)
- ✅ `email` — valid email
- ✅ `service_type` — one of: post-construction, commercial, move-in-move-out, final-clean, windows-power-wash
- ✅ Honeypot field (invisible form field that should be empty)

**Response** (200 OK):
```json
{
  "success": true,
  "lead_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Lead captured. We'll contact you shortly."
}
```

**Side Effects**:
- Creates `leads` row with status = 'new'
- Queues SMS to admin phone: "New lead: John Smith (john@example.com)"
- Tracks conversion event

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Phone number format invalid. Use +1 format.",
  "field": "phone"
}
```

---

### 2️⃣ Quote Send (Admin → Lead Gets PDF)

**Endpoint**: `POST /api/quote-send`  
**Auth**: Admin only (middleware checks)  
**Rate Limit**: 50 per day per admin

**Request Body**:
```json
{
  "quote_id": "660e8400-e29b-41d4-a716-446655440001",
  "lead_id": "550e8400-e29b-41d4-a716-446655440000",
  "subtotal": 450.00,
  "total": 495.00,
  "notes": "Includes carpet cleaning and hardwood refinish"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Quote sent to john@example.com",
  "quote_token": "eye...token...",
  "quote_redirect_url": "https://aa-cleaning.com/quote/eye...token..."
}
```

**Side Effects**:
- Generates PDF using `src/lib/quote-pdf.ts`
- Sends email via Resend with branded template
- Updates lead status to 'quoted'
- Queues SMS to lead if phone on file

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Lead not found",
  "lead_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 3️⃣ Quote Response (Lead → Accept or Decline)

**Endpoint**: `POST /api/quote-response`  
**Auth**: Token-based (quote token from email)  
**Rate Limit**: None (one-time token)

**Request Body**:
```json
{
  "token": "eye...token...",
  "action": "accept"  // or "decline"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Quote accepted! We'll contact you to schedule.",
  "next_steps": "Areli will call within 24 hours to confirm."
}
```

**Side Effects**:
- If "accept": Updates lead status to 'won', queues SMS to admin
- If "decline": Updates lead status to 'lost', tracks analytics

---

### 4️⃣ Job Assignment (Admin → Crew Gets SMS)

**Endpoint**: `POST /api/assignment-notify`  
**Auth**: Admin only  
**Rate Limit**: 100 per day

**Request Body**:
```json
{
  "job_id": "770e8400-e29b-41d4-a716-446655440002",
  "employee_ids": ["001", "002"],  // Can assign multiple crew
  "scheduled_start": "2024-03-25T09:00:00Z",
  "scheduled_end": "2024-03-25T14:00:00Z",
  "address": "123 Main St, Austin TX 78704"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "assigned": 2,
  "message": "Crews notified via SMS"
}
```

**Side Effects**:
- Creates `job_assignments` rows
- Queues SMS to each employee phone (Spanish-first message)
- Example SMS: "Nuevo trabajo: 123 Main St. Hora: 9am-2pm. @aa-app"
- Stores in `notification_queue` if SMS service down

**Error Response** (400):
```json
{
  "success": false,
  "error": "Employee 003 not found or inactive",
  "employee_id": "003"
}
```

---

### 5️⃣ Employment Application (Public → Hiring)

**Endpoint**: `POST /api/employment-application`  
**Auth**: None (public careers page)  
**Rate Limit**: 5 per IP per day

**Request Body**:
```json
{
  "name": "Maria Rodriguez",
  "email": "maria@example.com",
  "phone": "+15559876543",
  "experience_years": 3,
  "previous_companies": "ABC Cleaning, DEF Services",
  "availability": "weekends_only",
  "english_proficiency": "conversational"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "application_id": "app-550e8400-e29b-41d4-a716",
  "message": "Application submitted. We'll review and contact you."
}
```

**Side Effects**:
- Creates `employment_applications` row
- Sends confirmation email to applicant
- Queues admin notification (currently missing)
- Status: 🟡 Email delivery not yet wired; see WORK-BACKLOG.md

---

### 6️⃣ Lead Follow-Up (Cron → Admin Gets Reminders)

**Endpoint**: `POST /api/lead-followup`  
**Auth**: Cron secret header  
**Rate Limit**: 1x per day (scheduled)

**Request Body**:
```json
{
  "hours_since_creation": [1, 4]  // Check 1h and 4h after lead submission
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "reminders_sent": 3,
  "message": "Sent 3 follow-up reminders to admin"
}
```

**Side Effects**:
- Queries leads created 1h ago (status = 'new')
- Sends SMS/email: "Follow up on John Smith's estimate request?"
- Later, queries leads created 4h ago (second reminder)

---

### 7️⃣ Notification Dispatch (Background → Send Queued)

**Endpoint**: `POST /api/notification-dispatch`  
**Auth**: Service-role only (CRON_SECRET bearer token)  
**Purpose**: Background job to dispatch queued SMS/email  
**Status**: ✅ Complete (dedup, retry, dead letter, telemetry)

**Request Body**:
```json
{
  "batch_size": 50,
  "retry_failed": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "queuedCount": 42,
  "sent": 38,
  "failed": 1,
  "telemetry": {
    "processed": 42,
    "sent": 38,
    "retried": 2,
    "deadLettered": 0,
    "deduped": 1,
    "failed": 1
  },
  "message": "Dispatched 42 notifications: 38 sent, 2 retrying, 1 deduped, 1 failed."
}
```

**Dispatch Pipeline Per Item**:
1. Dedup check — skip if same `dedup_key` sent within 5 minutes
2. Send via Twilio with 2 quick retry attempts (500ms backoff)
3. Success → mark `sent`
4. Transient failure + under 5 total attempts → schedule retry (5m / 10m / 20m / 40m)
5. Transient failure + 5+ attempts → dead letter (`permanently_failed`)
6. Permanent failure (invalid number, unsubscribed) → mark `failed` (no retry)

**Queue Statuses**: `pending`, `queued`, `sent`, `failed`, `permanently_failed`, `deduped`

---

### 8️⃣ Completion Report (Admin → PDF Summary)

**Endpoint**: `POST /api/completion-report`  
**Auth**: Admin only  
**Status**: 🟡 Template ready, not auto-triggered

**Request Body**:
```json
{
  "job_id": "770e8400-e29b-41d4-a716-446655440002"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "report_pdf_url": "https://storage.supabase.co/reports/job-770e...pdf",
  "message": "Report generated with photos and timestamps"
}
```

**What's Included**:
- Job title, address, date
- Before/after photos from `job_photos` table
- Crew names and signatures
- Cost breakdown

---

### 9️⃣ QuickBooks Sync (Backend → Financial Data)

**Endpoint**: `POST /api/quickbooks-sync`  
**Auth**: Service-role only  
**Status**: 🔴 Currently simulated; not implemented

**Request Body** (when implemented):
```json
{
  "entity": "customers",  // or "invoices", "vendors"
  "action": "sync"
}
```

**Expected Response**:
```json
{
  "success": true,
  "synced": 5,
  "message": "Synced 5 customers to QuickBooks"
}
```

**Not Yet Implemented**:
- OAuth2 token exchange
- Customer/vendor creation in QB
- Invoice generation
- Revenue reporting

See CONFIG-ESSENTIALS.md for setup when ready.

---

### 🔟 AI Assistant (Employee → Fallback Support)

**Endpoint**: `POST /api/ai-assistant`  
**Auth**: Employee (optional for public)  
**Status**: 🟡 Basic fallback only

**Request Body**:
```json
{
  "message": "How do I report a problem with the job?",
  "context": {
    "employee_id": "001",
    "language": "es"  // Spanish-first
  }
}
```

**Current Response** (hardcoded fallback):
```json
{
  "success": true,
  "reply": "Por favor contacta a Areli: +1-512-555-1212",
  "confidence": 0.1  // Low confidence = fallback only
}
```

---

## Error Handling Patterns

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Description of what went wrong",
  "error_code": "VALIDATION_ERROR",  // Consumable by clients
  "field": "phone",  // If field-specific
  "details": {  // Optional debug info
    "received": "+15551234567",
    "expected_format": "E.164"
  }
}
```

### HTTP Status Codes

| Code | Scenario |
|------|----------|
| 200 | Success |
| 400 | Validation error (bad input) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (logged in, but no permission) |
| 404 | Resource not found |
| 429 | Rate limited |
| 500 | Server error (unexpected) |

---

## Testing These Endpoints

### Using `curl`

**Create Lead**:
```bash
curl -X POST http://localhost:3000/api/quote-request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+15551234567",
    "service_type": "post-construction-cleaning",
    "timeline": "within_1_week",
    "description": "Test quote"
  }'
```

**Send Quote** (admin):
```bash
curl -X POST http://localhost:3000/api/quote-send \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-auth=your-admin-token" \
  -d '{
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "subtotal": 450.00,
    "total": 495.00,
    "notes": "Test quote"
  }'
```

### Using Postman

1. Create `.env.local` with Supabase credentials
2. In Postman, set `Authorization: Bearer your-admin-token`
3. POST to `http://localhost:3000/api/[endpoint]`

---

## See Also

- [DB-SCHEMA-SUMMARY.md](DB-SCHEMA-SUMMARY.md) — Tables these endpoints read/write
- [CONFIG-ESSENTIALS.md](CONFIG-ESSENTIALS.md) — Required environment variables
- [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md) — Testing procedures for each endpoint
- [WORK-BACKLOG.md](WORK-BACKLOG.md) — Known gaps in endpoints
- [SESSION-LOG.md](SESSION-LOG.md) — Implementation summary and decisions
- [PICKUP-GUIDE.md](PICKUP-GUIDE.md) — Resume checklist and next priorities
