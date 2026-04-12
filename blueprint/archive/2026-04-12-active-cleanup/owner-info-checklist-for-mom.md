# Owner Info Checklist for Mom

Purpose: collect the real business information and assets still needed so the website can move from working demo content to production-ready trust content.

## Priority 1 - Needed Before Public Launch

- Business phone number (public-facing), in display format and E.164 format.
- Primary business email for customer contact.
- Legal business name confirmation (exact registered spelling).
- Full business address for schema/legal pages:
  - street
  - suite/unit (if any)
  - city
  - state
  - ZIP
- Official business hours (weekday, Saturday, Sunday, and after-hours policy).
- Final service area confirmation (which cities are actively marketed).
- License/insurance proof details for claim validation:
  - license type/number(s), if applicable
  - insured status proof
  - COI request contact email/phone

## Priority 2 - Trust and Conversion Content

- Real testimonials (minimum set):
  - target: 8-12 total written testimonials
  - include permission to publish first name + role/company preference
  - include city and service type per testimonial
- Review proof alignment:
  - current site schema shows 5.0 rating and 4 reviews
  - provide exact matching source/wording or approve replacement copy
- Before/after project examples:
  - target: at least 2 before/after sets per core service
  - include location, project type, and scope summary
- Service photos:
  - post-construction
  - final clean
  - commercial
  - move-in/move-out
  - windows/power wash
  - team-in-action shots
- About/careers photos:
  - team photos
  - on-site operational photos
  - optional leadership/headshot photos

## Priority 2B - Stats Substantiation Pack (New)

- Please validate every numeric claim currently shown on public pages.
- For each stat, provide:
  - approved value
  - time period (lifetime, last 12 months, weekly average, etc.)
  - source (QuickBooks, CRM, manual records, estimate)
  - confidence level (exact vs marketing estimate)
  - review date (when we should refresh it)

Current stat claims to validate now:
- Company-level claims:
  - 500+ projects delivered
  - 15+ years field experience
  - 1hr response target
  - 100% standards/on-time claims
- Review/reputation claims:
  - 5.0 rating
  - review count = 4
  - "Rated 5 stars across 200+ completed projects"
- Industry claims:
  - General Contractors: 200+ closeouts completed on schedule
  - Property Managers: 48hr average turnaround
  - Commercial Spaces: 15+ active facilities served weekly
- Service-area hub claims:
  - 30mi max radius
  - 1hr response target
  - 500+ projects delivered
- City page proof claims (for each city profile):
  - annual projects
  - response window
  - average turnaround
  - recurring accounts

Where these claims currently live:
- [Production-workspace/src/lib/company.ts](Production-workspace/src/lib/company.ts)
- [Production-workspace/src/components/public/variant-a/AuthorityBar.tsx](Production-workspace/src/components/public/variant-a/AuthorityBar.tsx)
- [Production-workspace/src/components/public/variant-a/AboutSection.tsx](Production-workspace/src/components/public/variant-a/AboutSection.tsx)
- [Production-workspace/src/data/industries.ts](Production-workspace/src/data/industries.ts)
- [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)
- [Production-workspace/src/app/(public)/service-area/page.tsx](Production-workspace/src/app/(public)/service-area/page.tsx)
- [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts)
- [Production-workspace/src/app/(public)/industries/[slug]/page.tsx](Production-workspace/src/app/(public)/industries/[slug]/page.tsx)

## Priority 3 - Platform and Integration Credentials

- QuickBooks Online credentials/config:
  - QUICKBOOKS_CLIENT_ID
  - QUICKBOOKS_CLIENT_SECRET
  - QUICKBOOKS_REDIRECT_URI
  - QUICKBOOKS_ENVIRONMENT (sandbox or production)
  - company realm connection approval flow (OAuth connect step)
- Twilio account values for SMS operations:
  - account SID
  - auth token
  - sending number
  - admin alert phone destination
- Resend/API sender setup:
  - RESEND_API_KEY
  - RESEND_FROM_EMAIL
- Google Review URL (for post-job review requests).

## Priority 4 - Brand and Social Presence

- Social profiles (if active) with canonical URLs:
  - Facebook
  - Instagram
  - LinkedIn company page
  - YouTube/TikTok (if used)
- Preferred policy for social links if some channels are not active yet.
- Brand assets package:
  - primary logo (SVG + PNG)
  - white/reversed logo variant
  - favicon set (optional upgrade beyond single ico)

## Priority 5 - Optional High-Impact Additions

- Short videos for trust and conversion:
  - 3-6 vertical clips (10-30 seconds) showing active work
  - 1 short owner intro clip
  - 1 before/after walkthrough clip
- Case-study snippets:
  - project objective
  - challenge
  - turnaround time
  - result
- Bilingual messaging approval:
  - final Spanish copy preferences
  - language tone rules for customer communication

---

## Why these are on the list (current implementation signals)

- Placeholder phone/email still present in company constants:
  - [Production-workspace/src/lib/company.ts](Production-workspace/src/lib/company.ts)
- Home structured data includes hardcoded review count/rating and named review authors:
  - [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)
- Testimonial carousel currently uses named testimonials that should be validated/replaced with approved real ones:
  - [Production-workspace/src/components/public/variant-a/TestimonialSection.tsx](Production-workspace/src/components/public/variant-a/TestimonialSection.tsx)
- Business address schema currently only includes locality/region/country (no street/zip):
  - [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)
- QuickBooks integration is implemented but requires env credentials and OAuth connection:
  - [Production-workspace/src/lib/quickbooks.ts](Production-workspace/src/lib/quickbooks.ts)
  - [Production-workspace/.env.example](Production-workspace/.env.example)
- Public media currently consists of static image set (no video files found):
  - [Production-workspace/public](Production-workspace/public)

---

## Quick Intake Format You Can Send Her

Please send back the following in one reply:

1. Contact and legal
- Official company name:
- Best public phone:
- Best public email:
- Business address:
- Business hours:

2. Trust content
- Number of testimonials you approve to publish now:
- Names/roles (or anonymous role-only) for each testimonial:
- Real review rating/count to display:

3. Media assets
- Number of before/after sets available now:
- Number of service photos available now:
- Any videos available now (yes/no, count):

4. Stats validation
- Are these approved today: 500+ projects, 15+ years, 1hr response, 100% standards (yes/no per item):
- Are these approved today: 5.0 rating, review count 4, "200+ completed projects" statement (yes/no per item):
- Industry stats approved (200+ closeouts, 48hr turnaround, 15+ active facilities) (yes/no per item):
- City-level proof stats approved for each city page (yes/no):
- Source of truth for stats (QuickBooks/CRM/manual):
- Refresh cadence for stats (monthly/quarterly):

5. Integrations
- QuickBooks credentials ready (yes/no):
- Twilio credentials ready (yes/no):
- Resend sender email ready (yes/no):
- Google review link ready (yes/no):

6. Social and brand
- Facebook URL:
- Instagram URL:
- LinkedIn URL:
- YouTube/TikTok URLs:
- Logo package ready (yes/no):
