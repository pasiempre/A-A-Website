# Config Essentials: Environment Variables & Setup

**Last Updated**: March 20, 2026  
**Purpose**: Quick reference for all configuration variables needed for local development and deployment

---

## Quick Start: Copy-Paste Template

Create a `.env.local` file in the `Production-workspace` root with these variables:

```bash
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Twilio (SMS Notifications)
NEXT_PUBLIC_TWILIO_SID=AC...
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Resend (Email)
RESEND_API_KEY=re_your_resend_api_key

# QuickBooks (Pending Implementation)
QUICKBOOKS_CLIENT_ID=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij
QUICKBOOKS_CLIENT_SECRET=your-qb-secret
QUICKBOOKS_REALM_ID=1234567890

# Site Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000 (dev) / https://your-domain.com (prod)
NEXT_PUBLIC_DEV_PREVIEW_MODE=true (dev only)
```

---

## Environment Variables by Category

### 📦 Supabase (Database & Authentication)

**Status**: ✅ Required for running locally and production

| Variable | Type | Description | Example | Where to Get |
|----------|------|-------------|---------|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | PostgreSQL database URL | `https://project-id.supabase.co` | Supabase Dashboard → Settings → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anonymous ("client") API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API Keys → `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Service role key (admin operations) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API Keys → `service_role` |

**Usage**:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Frontend client (browser can see these)
- `SUPABASE_SERVICE_ROLE_KEY`: Backend API routes only (admin operations, database writes, email sending)

**Setup**:
1. Create Supabase project at https://supabase.com
2. Create new organization & project
3. Go to Settings → API
4. Copy all three keys

---

### 📱 Twilio (SMS Notifications)

**Status**: 🟡 Configured but credentials pending

| Variable | Type | Description | Example | Note |
|----------|------|-------------|---------|------|
| `NEXT_PUBLIC_TWILIO_SID` | Public | Account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Used in frontend for context (optional) |
| `TWILIO_AUTH_TOKEN` | Secret | Authentication token | `your-auth-token-here` | Backend only (DO NOT expose in browser) |
| `TWILIO_PHONE_NUMBER` | Public | Twilio number for outbound SMS | `+18005551234` | The "from" number on SMS messages |

**Usage**:
- `src/lib/notifications.ts` — Uses these to send SMS via Twilio API
- `src/app/api/assignment-notify/route.ts` — Sends crew assignment SMS
- `src/app/api/quote-request/route.ts` — Sends lead alerts to admin

**Setup**:
1. Create Twilio account at https://www.twilio.com/console
2. Buy a phone number (under Console → Phone Numbers → Manage → Buy)
3. Get credentials from Console → Account Info
4. Save `TWILIO_AUTH_TOKEN` and phone number to `.env.local`

**Test Locally**:
```bash
# In terminal, you'll see SMS getting queued (not actually sent)
# Check Supabase: notification_queue table for queued messages
```

---

### 📧 Resend (Email Delivery)

**Status**: ✅ Configured

| Variable | Type | Description | Example | Note |
|----------|------|-------------|---------|------|
| `RESEND_API_KEY` | Secret | API key for email sending | `re_1234567890abcdefghij` | Backend only |

**Usage**:
- `src/lib/email.ts` — Sends emails via Resend
- `src/app/api/quote-send/route.ts` — Sends quote PDFs to leads
- `src/app/api/employment-application/route.ts` — Sends confirmation emails

**Setup**:
1. Create Resend account at https://resend.com
2. Go to Settings → API Keys
3. Create new API key, copy it

**Test Locally**:
```bash
# Resend API key should allow testing without billing
# Check Resend Dashboard → Emails to see sent messages
```

---

### 💰 QuickBooks (Financial Integration)

**Status**: 🔴 Not yet configured (currently simulated)

| Variable | Type | Description | Note |
|----------|------|-------------|------|
| `QUICKBOOKS_CLIENT_ID` | Secret | OAuth app ID | Get from QB Developer Console |
| `QUICKBOOKS_CLIENT_SECRET` | Secret | OAuth app secret | Store securely (never in git) |
| `QUICKBOOKS_REALM_ID` | Public | Company/organization ID | Set after OAuth flow |

**Setup** (When ready):
1. Register app at https://developer.intuit.com
2. Get OAuth credentials (Client ID & Secret)
3. Set redirect URI to: `https://your-domain.com/api/quickbooks-callback`
4. Implement OAuth 2.0 flow in `src/app/api/quickbooks-sync/route.ts`

**Not Required Yet**: Skip for initial MVP launch

---

### 🌐 Site Configuration

| Variable | Type | Value | Where Used |
|----------|------|-------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Public | `http://localhost:3000` (dev) or `https://your-domain.com` (prod) | SEO metadata, schema.org links, email templates |
| `NEXT_PUBLIC_DEV_PREVIEW_MODE` | Public | `true` (dev only) | Shows admin/employee preview panels (hidden in prod) |

**Setup**:
- **Local**: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- **Production**: `NEXT_PUBLIC_SITE_URL=https://aa-cleaning.com` (update in Vercel)

---

## Environment-Specific Setup

### Local Development (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Twilio (optional for testing)
NEXT_PUBLIC_TWILIO_SID=[your-sid]
TWILIO_AUTH_TOKEN=[your-auth-token]
TWILIO_PHONE_NUMBER=+1234567890

# Resend (optional for testing)
RESEND_API_KEY=[your-resend-key]

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_PREVIEW_MODE=true
```

**Run**:
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Production (Vercel Deployment)

Set these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
RESEND_API_KEY
QUICKBOOKS_CLIENT_ID (when ready)
QUICKBOOKS_CLIENT_SECRET (when ready)
QUICKBOOKS_REALM_ID (when ready)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

**Deploy**:
```bash
git push origin main  # Vercel auto-deploys
```

---

## Checking Your Setup

### 1. Test Supabase Connection

**File**: `src/lib/supabase/client.ts`

```bash
# Run:
npm run dev

# In browser console:
fetch('http://localhost:3000/api/debug/supabase')
```

### 2. Test Twilio Setup

**File**: `src/app/api/assignment-notify/route.ts`

Manually trigger via:
```bash
curl -X POST http://localhost:3000/api/assignment-notify \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"...", "job_id":"..."}'

# Check supabase.notification_queue for queued message
```

### 3. Test Resend Setup

**File**: `src/lib/email.ts`

```bash
curl -X POST http://localhost:3000/api/quote-send \
  -H "Content-Type: application/json" \
  -d '{"lead_id":"...", "pdf_url":"..."}'

# Check Resend Dashboard → Emails
```

---

## Variable Visibility

### Public Variables (Browser Can See - Safe)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TWILIO_SID`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_DEV_PREVIEW_MODE`

### Secret Variables (Server Only - Never Expose)
- `SUPABASE_SERVICE_ROLE_KEY` ← Admin access to DB
- `TWILIO_AUTH_TOKEN` ← Can send SMS on your bill
- `RESEND_API_KEY` ← Can send emails on your bill
- `QUICKBOOKS_CLIENT_SECRET` ← OAuth credentials

**Rule**: Never prefix secret keys with `NEXT_PUBLIC_`, or they'll be visible in browser network tab.

---

## Troubleshooting

### "Invalid Supabase credentials"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Ensure `.env.local` is in the right folder (Production-workspace root)
- Restart dev server after updating `.env.local`

### "Twilio SMS not sending"
- Check `TWILIO_AUTH_TOKEN` is correct
- Ensure phone number is in `TWILIO_PHONE_NUMBER` (with +1 prefix for US)
- Check `/supabase/notification_queue` table for queued messages
- Set up Twilio webhook if using queued delivery

### "Resend email fails"
- Check `RESEND_API_KEY` is valid
- Check Resend Dashboard → API Keys (key may be revoked)
- Ensure `from` email is verified in Resend (settings)

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (never commit secrets)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never prefixed with `NEXT_PUBLIC_`
- [ ] All secret keys stored securely (not in chat, email, or public repo)
- [ ] Vercel environment variables set for production
- [ ] Supabase RLS policies enforced (admin/employee role-based)

---

**See Also**:
- [TECH-STACK-SNAPSHOT.md](TECH-STACK-SNAPSHOT.md) — Package versions and architecture
- [DB-SCHEMA-SUMMARY.md](DB-SCHEMA-SUMMARY.md) — Database tables this config connects to
- [API-CONTRACTS.md](API-CONTRACTS.md) — API endpoints using these configs
- [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md) — Testing these configs
