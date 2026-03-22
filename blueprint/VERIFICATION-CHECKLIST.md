# Verification Checklist & Testing Guide

**Last Updated**: March 20, 2026  
**Purpose**: Step-by-step testing procedures to validate each feature works  
**Target Users**: QA, developers, or anyone before production launch

Session context references: `SESSION-LOG.md`, `PICKUP-GUIDE.md`

---

## Quick Start: Basic Smoke Test (15 min)

```bash
cd Production-workspace
npm install
npm run dev
# Visit http://localhost:3000
```

### Checklist

- [ ] Homepage loads, no console errors
- [ ] Public navigation works (header dropdown menus)
- [ ] Quote form on homepage submits
- [ ] Services page lists all 5 services
- [ ] FAQ expands/collapses correctly
- [ ] Contact form appears
- [ ] Mobile view (F12 → toggle device toolbar) is responsive

**Result**: If all pass, basic build is healthy.

---

## Feature Validation Tests

### 1. Public Quote Flow (Frontend → Backend)

**Duration**: 10 min  
**Files Involved**: `page.tsx` (homepage), `quote-request/route.ts`, Supabase

**Steps**:

1. Open http://localhost:3000
2. Scroll to "Get a Free Quote" section
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+15551234567`
   - Service: `Post-Construction Cleaning`
   - Description: `Test request`
4. Check honeypot field is empty (should be invisible)
5. Click "Send Quote Request"
6. See success message: "Thank you! We received your request."

**Backend Verification**:

```bash
# In another terminal, check Supabase:
psql <your-supabase-url>
SELECT * FROM leads ORDER BY created_at DESC LIMIT 1;
# Should see row with name='Test User', status='new'
```

**Passes If**:
- ✅ Form submits without error
- ✅ Lead row created in Supabase
- ✅ No SMS/email errors in Twilio/Resend (if service keys available)

**Fails If**:
- ❌ Form throws validation error (check console)
- ❌ Lead not appearing in Supabase (check middleware auth)
- ❌ Honeypot catches (form validation blocking)

---

### 2. Admin Dashboard Access & Job Creation

**Duration**: 15 min  
**Files Involved**: Middleware, AdminAuthClient, TicketManagementClient  
**Auth**: Email/password (admin)

**Steps**:

1. Open http://localhost:3000 in private/incognito browser
2. Create test admin account:
   - In Supabase Dashboard → SQL Editor:
   ```sql
   INSERT INTO auth.users (email, password) 
   VALUES ('admin@test.com', crypt('password123', gen_salt('bf')));
   
   UPDATE auth.users 
   SET role = 'authenticated' WHERE email = 'admin@test.com';
   
   INSERT INTO profiles (id, role, full_name)
   SELECT id, 'admin', 'Test Admin'
   FROM auth.users WHERE email = 'admin@test.com';
   ```
3. Go to http://localhost:3000/auth/admin
4. Login: `admin@test.com` / `password123`
5. Should redirect to http://localhost:3000/admin (admin dashboard)
6. See components: FirstRunWizard, LeadPipeline, etc.

**Passes If**:
- ✅ Admin page loads without permission error
- ✅ Can see multiple components (leads, jobs, notifications)
- ✅ No console 401/403 errors

**Fails If**:
- ❌ Redirect to login (auth issue)
- ❌ Page shows blank/error (component issue)

---

### 3. Employee Portal & Photo Upload

**Duration**: 20 min  
**Files Involved**: EmployeeTicketsClient, photo-upload-queue, IndexedDB  
**Auth**: Phone OTP (employee)

**Steps**:

1. In Supabase, create test employee:
   ```sql
   INSERT INTO auth.users (phone, raw_phone_input) 
   VALUES ('+15551234567', '+1-555-123-4567');
   
   INSERT INTO profiles (id, role, locale)
   SELECT id, 'employee', 'es'
   FROM auth.users WHERE phone = '+15551234567';
   ```

2. Go to http://localhost:3000/auth/employee
3. Enter phone: `+15551234567` (matches test employee)
4. Twilio OTP sent (check Twilio logs or dummy response)
5. Enter OTP (from log or dashboard if available)
6. Should redirect to http://localhost:3000/employee
7. See job card with "View Details" and "Update Status"
8. Click job → see "Upload Photos" section
9. Select photo file from computer
10. **Offline Test**:
    - Close DevTools (F12) or go offline (DevTools → Network → Offline)
    - Select photo again
    - Should queue in IndexedDB (check DevTools → Storage → IndexedDB → `aa-cleaning`)
    - Go back online
    - Photo should auto-sync

**Passes If**:
- ✅ Employee page accessible without admin privileges
- ✅ Job list appears (if jobs assigned to this employee)
- ✅ Photo upload works in browser
- ✅ Offline queue shows in DevTools
- ✅ Auto-sync when online restored

**Fails If**:
- ❌ OTP not received (Twilio config needed)
- ❌ Employee page shows error 403 (RLS policy issue)
- ❌ Photo upload hangs (check storage bucket permissions)

---

### 4. SMS Notifications (Assignment)

**Duration**: 10 min  
**Files Involved**: assignment-notify route, Twilio  
**Requires**: TWILIO_AUTH_TOKEN set in .env.local

**Steps**:

1. Admin dashboard → Lead Pipeline
2. Create/find a job in "Scheduled" status
3. Click "Assign Crew" buttton
4. Select employee phone from dropdown
5. Click "Send Assignment"
6. See success message: "Crews notified via SMS"

**Verification**:

**Option A**: Twilio Test
- Go to Twilio Console → Monitor → SMS SMS
- Should see outbound SMS to employee phone
- Status: "accepted" or "queued"

**Option B**: Check Queue
- In Supabase: `SELECT * FROM notification_queue ORDER BY created_at DESC LIMIT 1;`
- Should see row with `type='sms'`, `recipient='+15551234567'`, `status='sent'` or `'pending'`

**Passes If**:
- ✅ Success message shown
- ✅ SMS appears in Twilio logs OR notification_queue shows status='sent'

**Fails If**:
- ❌ Error: "Invalid TWILIO_AUTH_TOKEN" (check .env)
- ❌ SMS status: "failed" (check Twilio account balance, phone validity)
- ❌ Queue entry has `status='failed'` (check error_message field)

---

### 5. Quote PDF Generation & Email

**Duration**: 15 min  
**Files Involved**: quote-send route, quote-pdf lib, Resend  
**Requires**: RESEND_API_KEY in .env.local

**Steps**:

1. Create a lead (via public form or manually in Supabase)
2. Admin dashboard → Lead Pipeline → Select lead
3. Click "Send Quote"
4. Modal appears: Enter price and notes
5. Click "Generate Quote"
6. See success: "Quote sent to john@example.com"

**Verification**:

**Option A**: Email Received
- Check email inbox for `john@example.com`
- Should have branded A&A Cleaning email with PDF attachment
- PDF clickable/downloadable

**Option B**: Check Resend Logs
- Go to Resend Dashboard → Emails
- Should see email with subject containing quote
- Status: "sent" and open status tracked

**Option C**: Check PDF Generation
- In browser DevTools → Network tab
- Should see request to `/api/quote-send` returning 200
- Response includes `quote_redirect_url`

**Passes If**:
- ✅ Email received OR Resend shows "sent" status
- ✅ PDF attachment present in email
- ✅ Quote token link works (lead can view/respond)

**Fails If**:
- ❌ Email address invalid (check lead email format)
- ❌ Resend error: "Invalid API key" (check .env)
- ❌ PDF generation fails (check PDF library errors in console)

---

### 6. Lead Follow-Up Reminders

**Duration**: 5 min (or wait 1+ hours)  
**Files Involved**: lead-followup route, notification-dispatch  
**Requires**: Cron job or manual trigger

**Manual Test**:

```bash
# Manually trigger in Supabase SQL Editor:
SELECT pg_sleep(3600);  # Wait 1 hour

# Then call API:
curl -X POST http://localhost:3000/api/lead-followup \
  -H "Content-Type: application/json" \
  -d '{"hours_since_creation": [1]}'

# Response should include: "reminders_sent": 1
```

**Automated Test** (if cron setup):
- Create lead now
- Wait 1 hour
- Check notification_queue for reminder SMS/email
- Should have 1h follow-up message

**Passes If**:
- ✅ Lead followup API responds with `reminders_sent > 0`
- ✅ Notification queue shows reminder entries
- ✅ (Optional) SMS/email received on crew phone

---

### 7. Mobile Responsiveness (Kanban, Drag-Drop)

**Duration**: 10 min  
**Files Involved**: LeadPipelineClient, SchedulingAndAvailabilityClient

**Steps**:

1. Admin dashboard → Lead Pipeline
2. Open DevTools (F12) → Toggle device toolbar (Cmd+Shift+M)
3. Set width to iPhone 12 (390px)
4. Kanban board should stack vertically (columns visible)
5. Try dragging lead card between columns (if supported)

**For Scheduling**:
1. Admin → Scheduling & Availability
2. Same mobile test
3. Calendar should be scrollable, not cut off

**Passes If**:
- ✅ Layout adapts to mobile (no horizontal scroll)
- ✅ Tabs or accordion for calendar (not all columns at once)
- ✅ Touch interactions work (or note as not implemented)

**Fails If**:
- ❌ Horizontal scroll needed (UI overflow)
- ❌ Text unreadable (font too small or container too tight)

---

### 8. Employment Application Form

**Duration**: 10 min  
**Files Involved**: EmploymentApplicationForm, employment-application route

**Steps**:

1. Go to http://localhost:3000/careers
2. Fill employment form:
   - Name: `Maria Rodriguez`
   - Email: `maria@example.com`
   - Phone: `+15559876543`
   - Experience: `3 years`
   - Previous companies: `ABC Cleaning`
   - Availability: `Weekends`
3. Click "Submit Application"
4. See success message

**Verification**:

In Supabase:
```sql
SELECT * FROM employment_applications 
WHERE email = 'maria@example.com' 
ORDER BY created_at DESC LIMIT 1;
```

Should see row with submitted data.

**Passes If**:
- ✅ Form submits
- ✅ Row created in Supabase
- ✅ (Optional) Confirmation email sent

**Note**: 🟡 Email delivery not yet wired (see WORK-BACKLOG.md)

---

### 9. Rate Limiting

**Duration**: 5 min  
**Files Involved**: rate-limit.ts, quote-request route  
**Purpose**: Prevent spam

**Steps**:

1. Create lead form → Submit 10 times rapidly from same IP
2. After limit (10/hour), should see error: "Too many requests"

**Verification**:

```bash
# Rapid test:
for i in {1..12}; do
  curl -X POST http://localhost:3000/api/quote-request \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","phone":"+15551234567","service_type":"post-construction","timeline":"within_1_week","description":"Test"}'
  sleep 0.5
done

# Last 2 should fail with 429
```

**Passes If**:
- ✅ Succeeds for first 10
- ✅ Fails with 429 on 11th+

---

### 10. Error Handling & Recovery

**Duration**: 10 min  
**Files Involved**: error.tsx (global error boundary)

**Test Cases**:

1. **Route Not Found**:
   - Visit http://localhost:3000/nonexistent-page
   - Should see 404 page with navigation options

2. **Server Error** (simulate):
   - In quote-request route, add `throw new Error("Test")`
   - Try to submit form
   - Should see error boundary page (not white screen)

3. **Unhandled Promise Rejection**:
   - Open console, paste: `throw new Error("Test Error")`
   - Page should not crash (error logged)

**Passes If**:
- ✅ 404 shows graceful page (not blank)
- ✅ Error boundary catches and displays error
- ✅ "Reset" button works to recover

---

### 11. Notification Retry & Dedup

**Duration**: 10 min  
**Files Involved**: notifications.ts, notification-dispatch/route.ts  
**Purpose**: Verify messages aren't lost on transient failure

**Steps**:

1. Insert a test notification directly:
   ```sql
   INSERT INTO notification_dispatch_queue
   (to_phone, body, status, send_after, dedup_key, attempts)
   VALUES ('+15551234567', 'Test retry', 'queued', now(), 'test-dedup-key', 0);
   ```

2. Trigger dispatch:
   ```bash
   curl -X POST http://localhost:3000/api/notification-dispatch \
     -H "Content-Type: application/json" \
     -d '{"batch_size": 10}'
   ```

3. Check response includes `telemetry` object with counts

4. For dedup test: insert same `dedup_key` again, trigger dispatch:
   - Should see `"deduped": 1` in telemetry

5. For dead letter test: set `attempts=5` on a queued row, trigger dispatch:
   - Should see `"deadLettered": 1` in telemetry
   - Row status should be `permanently_failed`

**Passes If**:
- ✅ Telemetry response includes all count fields
- ✅ Duplicate messages are skipped (deduped count > 0)
- ✅ Items at max attempts are dead-lettered
- ✅ Failed items get increasing `send_after` (backoff)

---

## Database Integrity Checks

### Check RLS Policies

```sql
-- Employee can see only their own profile
SELECT * FROM profiles 
WHERE id = current_user_id();
-- Should return only own row

-- Admin can see all
SELECT COUNT(*) FROM profiles;
-- Should return all rows
```

### Check Constraints

```sql
-- No duplicate job assignments
SELECT job_id, employee_id, COUNT(*)
FROM job_assignments
GROUP BY job_id, employee_id
HAVING COUNT(*) > 1;
-- Should return 0 rows
```

### Check Data Consistency

```sql
-- Every job has a valid client
SELECT COUNT(*) FROM jobs 
WHERE client_id IS NOT NULL AND client_id NOT IN (SELECT id FROM clients);
-- Should return 0
```

---

## Performance Checks

### Page Load Time

```bash
# Using curl:
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000

# Format output:
cat curl-format.txt
    time_namelookup:  %{time_namelookup}\n
    time_connect:     %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
    time_pretransfer: %{time_pretransfer}\n
    time_redirect:    %{time_redirect}\n
    time_starttransfer: %{time_starttransfer}\n
    ------
    time_total:       %{time_total}\n
```

**Target**: < 2s total time

### Bundle Size

```bash
npm run analyze
# Shows breakdown by component/library size
```

---

## Security Checks

- [ ] No secrets in console output (API keys, tokens)
- [ ] environment variables not exposed in bundle (prefix non-NEXT_PUBLIC_)
- [ ] CORS headers appropriate (Supabase allows authenticated requests only)
- [ ] Rate limiting active (prevents brute force)
- [ ] No hardcoded passwords or tokens in repo

---

## Pre-Production Checklist

Before deploying to production:

- [ ] All listed feature tests pass locally (including #11 Notification Retry & Dedup)
- [ ] Database constraints verified
- [ ] Environment variables set correctly in Vercel
- [ ] Twilio phone number production-ready
- [ ] Resend email sender config updated (custom domain if applicable)
- [ ] QuickBooks OAuth setup (if proceeding to Phase 4)
- [ ] Error tracking (Sentry) configured
- [ ] Analytics tags firing
- [ ] Performance baseline captured
- [ ] Security audit completed
- [ ] Team walkthroughs completed

---

## Troubleshooting Common Issues

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### "Invalid SUPABASE_ANON_KEY"
```bash
# Check .env.local:
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
# Should be ~140 char JWT

# Verify in Supabase Dashboard → Settings → API Keys → anon
```

### "Middleware redirect loop"
- Check `middleware.ts` for infinite redirect logic
- Verify auth.users table has test user

### "CSS not applying"
- Hard refresh: Cmd+Shift+R
- Check Tailwind `content` in `tailwind.config.js` covers `src/` paths

---

**See Also**:
- [API-CONTRACTS.md](API-CONTRACTS.md) — Endpoint specifications
- [CONFIG-ESSENTIALS.md](CONFIG-ESSENTIALS.md) — Environment variable specifics
- [DB-SCHEMA-SUMMARY.md](DB-SCHEMA-SUMMARY.md) — Database structure
