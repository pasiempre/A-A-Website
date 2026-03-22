# A&A Cleaning Platform - Comprehensive Codebase Map

**Last Updated**: March 20, 2026  
**Total Source Files**: 79  
**Total Lines of Code**: ~17,656  
**Build Tool**: Turbopack (Next.js 16.1.7)  
**Framework**: React 19 + TypeScript 5.9

---

## 📊 Project Overview

### Tech Stack
- **Framework**: Next.js 16.1.7 (App Router, Turbopack)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 3.4.17
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase SSR
- **Build**: Turbopack (dev), webpack (prod)
- **Linting**: ESLint 9.39

### Core Dependencies
- `@supabase/supabase-js` - Database client
- `@supabase/ssr` - Server-side auth
- `@next/bundle-analyzer` - Build optimization

### Route Structure
- **42 total routes** (7 API, 35 static/SSG)
- **3 route groups**: `(public)`, `(admin)`, `(employee)`, `(auth)`
- **Build time**: 3.2s (Turbopack), 4.1s (TypeScript check)

---

## 📁 Directory Structure & File Organization

### Root Configuration Files
```
Production-workspace/
├── package.json ..................... Dependencies & scripts
├── tsconfig.json .................... TypeScript configuration
├── tailwind.config.js ............... Tailwind CSS customization
├── postcss.config.js ................ PostCSS configuration
├── next.config.ts ................... Next.js configuration
├── middleware.ts .................... Request/response middleware
├── .env.example ..................... Environment variables template
└── README.md ....................... Project documentation
```

---

## 📂 Application Structure (src/app)

### Route Groups & Pages

#### 1. PUBLIC ROUTES (`(public)`)
Homepage and customer-facing pages.

```
(public)/
├── page.tsx ........................ HOMEPAGE (VariantAPublicPage)
│   └── Uses: 10+ section components with code-splitting
│   └── Imports: PublicPageShell, all variant-a sections
│
├── about/page.tsx .................. About page (server-rendered)
│   └── Imports: AboutSection component
│
├── contact/
│   ├── page.tsx .................... Contact hub page with hero
│   │   └── Imports: ContactPageClient, structured data
│   └── ContactPageClient.tsx ........ Contact form (client component)
│       └── Uses: useQuoteForm hook for submissions
│
├── careers/page.tsx ................ Careers page (server-rendered)
│   └── Imports: CareersSection component
│
├── faq/page.tsx .................... FAQ page with expanded Q&A
│   └── Imports: FAQSection (15 questions), hero, CTAs
│   └── Navbar: Force-solid styling (white background)
│
├── privacy/page.tsx ................ Privacy policy (legal)
│   └── Sections: 1-8 with full legal language
│   └── Navbar: Force-solid styling (white background)
│
├── terms/page.tsx .................. Terms of service (legal)
│   └── Sections: 1-15 with upgraded legal copy
│   └── Navbar: Force-solid styling (white background)
│
├── service-area/
│   ├── page.tsx .................... Service area index hub
│   │   └── Features: 8-city grid, region grouping, stats
│   │   └── Imports: City data, structured schema
│   │
│   └── [slug]/page.tsx ............. Individual city landing pages
│       ├── Cities: round-rock, georgetown, pflugerville, hutto, buda, kyle, san-marcos
│       └── Features: Hero, intro, stats, CTA band, breadcrumbs
│
├── services/
│   ├── page.tsx .................... Services hub (overview)
│   │
│   ├── post-construction-cleaning/page.tsx ... Service detail page
│   ├── final-clean/page.tsx ........................ Service detail page
│   ├── commercial-cleaning/page.tsx .............. Service detail page
│   ├── move-in-move-out-cleaning/page.tsx ....... Service detail page
│   └── windows-power-wash/page.tsx ............... Service detail page
│
├── camera-spike/page.tsx ........... Internal testing/tools page
│
└── quote/[token]/
    ├── page.tsx .................... Quote response landing
    │   └── Imports: QuoteResponseClient, structured schema
    └── QuoteResponseClient.tsx ...... Quote form client component
        └── Uses: useQuoteForm hook, context
```

#### 2. ADMIN ROUTES (`(admin)`)
Internal admin dashboard & management tools.

```
(admin)/
└── admin/page.tsx .................. Admin dashboard
    └── Imports: 10+ admin panel components
    └── Features: Unified preview mode, module panels
    
Components used:
├── AdminPreviewModePanels.tsx
├── FirstRunWizardClient.tsx
├── HiringInboxClient.tsx
├── InventoryManagementClient.tsx
├── LeadPipelineClient.tsx
├── NotificationCenterClient.tsx
├── NotificationDispatchClient.tsx
├── OperationsEnhancementsClient.tsx
├── SchedulingAndAvailabilityClient.tsx
├── TicketManagementClient.tsx
└── UnifiedInsightsClient.tsx
```

#### 3. EMPLOYEE ROUTES (`(employee)`)
Employee portal & task management.

```
(employee)/
└── employee/page.tsx ............... Employee dashboard
    └── Imports: 3 employee client modules
    
Components used:
├── EmployeePreviewModePanels.tsx
├── EmployeeTicketsClient.tsx
└── EmployeeInventoryClient.tsx
```

#### 4. AUTH ROUTES (`(auth)`)
Authentication & sign-in flows.

```
(auth)/
├── admin/
│   ├── page.tsx .................... Admin sign-in page
│   └── AdminAuthClient.tsx ......... Sign-in form (client)
│
└── employee/
    ├── page.tsx .................... Employee sign-in page
    └── EmployeeAuthClient.tsx ...... Sign-in form (client)
```

#### 5. ROOT LEVEL ROUTES
Special pages and metadata.

```
layout.tsx .......................... Root layout wrapper
├── Metadata: viewport, base SEO, icons
├── Imports: PublicPageShell, RouteProgressBar, globals.css
├── Features: Global font setup, analytics tracking
└── Children: All app routes

error.tsx ........................... Global error boundary
├── Features: Error UI component tree
└── Fallback: "Something went wrong" UI

loading.tsx ......................... Loading state component
├── Features: Skeleton, loading indicator
└── Used: On route transitions

not-found.tsx ....................... 404 handler
├── Features: Custom 404 UI
└── Navigation: Link back to home

robots.ts ........................... robots.txt generation
├── Generated: Allow/disallow rules for bots

sitemap.ts .......................... XML sitemap generation
├── Routes: 42 total routes listed
├── Priority: Homepage (1.0), service pages (0.8), utility (0.7)
└── ChangeFreq: daily (home), weekly (services), monthly (terms)

quote/[token]/page.tsx .............. Dynamic quote pages
├── Params: [token] from quote-create-job API
└── Features: Quote visualization, accept/reject forms
```

---

## 🎨 Component Architecture

### Component Hierarchy

```
PublicPageShell (wrapper)
├── PublicHeader (sticky nav)
│   ├── Logo & branding
│   ├── Services dropdown menu
│   ├── Industries dropdown menu
│   ├── Primary navigation links
│   ├── Contact CTA button
│   └── Mobile menu toggle
│
├── Main Content (page-specific)
│
└── FooterSection (sticky footer)
    ├── Links & navigation
    ├── Contact info
    ├── Service area listing
    └── Legal links
```

### Public Variant-A Components

#### Hero & Welcome Sections
```
HeroSection.tsx
├── Hero image/video background
├── Headline & subheadline
├── CTA buttons
└── Animation: scroll reveal on load

AboutSection.tsx
├── About company description
├── Key stats/highlights
├── Team snapshot
└── CTA: Learn more / Get quote

CareersSection.tsx
├── Career opportunities listing
├── Application form (EmploymentApplicationForm)
├── Benefits & culture messaging
└── Job cards with CTAs
```

#### Service & Operations Sections
```
ServiceSpreadSection.tsx
├── 5 service cards (grid layout)
├── Service descriptions
├── Images & icons
└── CTAs per service

ServiceAreaSection.tsx
├── Geographic coverage display
├── Interactive region map concept
├── City listing with highlights
└── Service area CTA

OfferAndIndustrySection.tsx
├── Key differentiators (offer)
├── Industries served (GC, PM, Offices)
├── Feature bullet points
└── Credibility markers
```

#### Social Proof & Engagement
```
TestimonialSection.tsx [DYNAMIC IMPORT]
├── Client testimonials carousel
├── Star ratings
├── Company logos
└── Quote/attribution

BeforeAfterSlider.tsx [DYNAMIC IMPORT]
├── Image comparison slider
├── Project examples (3-5 projects)
├── Before/after pairs
└── Interactive scrubber control

TimelineSection.tsx
├── Project process timeline
├── 4-step clean process visualization
├── Timeline graphics
└── Process descriptions
```

#### Interactive Overlays & Panels
```
FloatingQuotePanel.tsx [DEFERRED, ssr:false]
├── Fixed floating quote CTA
├── Quick form access
├── Sticky positioning on scroll
└── Lazy-loaded on client only

ExitIntentOverlay.tsx [DEFERRED, ssr:false]
├── Exit intent popup trigger
├── Quote request form
├── Discount/offer messaging
└── Close button

QuoteSection.tsx [DYNAMIC IMPORT]
├── Embedded full-width quote form
├── Field validation
├── Multi-step form flow
└── Submission tracking

AIQuoteAssistant.tsx [DEFERRED, ssr:false]
├── Chatbot-like interface
├── AI quote assistance
├── Contextual suggestions
└── Client-side rendering only
```

#### Navigation & Utility
```
PublicHeader.tsx
├── Route-aware solid navbar on /privacy, /terms, /faq
├── Scroll-threshold detection for normal pages
├── Mobile menu handling
├── Desktop dropdown menus

FooterSection.tsx
├── Links to all service pages
├── Legal links (privacy, terms, contact)
├── Contact info display
└── Section footers (Tailwind footer styling)

ScrollToTopButton.tsx [DEFERRED, ssr:false]
├── Floating scroll-to-top button
├── Show on scroll down
└── Smooth scroll animation

FAQSection.tsx
├── Expandable FAQ accordion
├── Category filtering (general, process, pricing)
├── Question/answer pairs (15 total)
└── Structured data markup
```

#### Other Public Components
```
AuthorityBar.tsx
├── Trust & authority markers
├── Certifications display
├── Experience badges
└── Years in business, projects completed

EmploymentApplicationForm.tsx
├── Career application form
├── Text, select, textarea fields
├── File upload for resume
├── Form validation & submission

QuoteCTA.tsx
├── Reusable CTA button/link component
├── Multiple style variants
└── Consistent branding

ScrollReveal.tsx
├── Animation hook/component
├── In-view animation trigger
├── Configurable delay & direction
└── Intersection Observer based

useInViewOnce.tsx
├── Custom hook: detect element in view
├── Trigger animation once
├── Reusable across components
└── Uses IntersectionObserver API

useQuoteForm.tsx
├── Custom hook: form state management
├── Field tracking & validation
├── API submission handling
├── Error/success states
```

#### Layout & Page Shells
```
PublicPageShell.tsx
├── Wraps all public pages
├── Includes: Header, Footer, global CTAs
├── Manages: Floating quote panel, AI assistant
├── Features: Route-specific styling

VariantAPublicPage.tsx [HOMEPAGE]
├── Main homepage orchestrator
├── Imports 10+ section components
├── Code-split sections (7 via next/dynamic)
├── Layout: Hero → Sections → Footer
```

#### UI Components (Shared)
```
ErrorBoundary.tsx
├── React error boundary wrapper
├── Fallback UI on errors
├── Error logging
└── Pro tips for debugging

RouteProgressBar.tsx
├── Progress bar on route transitions
├── Shows loading state
└── Auto-completes on load
```

---

## 🔌 API Routes

### Backend Endpoints (src/app/api)

```
/api/ai-assistant [POST]
├── Purpose: AI-powered quote assistance
├── Auth: Checked via middleware
└── Response: AI suggestions/context

/api/assignment-notify [POST]
├── Purpose: Notify about job assignments
├── Auth: Internal only
└── Triggers: Job assignment events

/api/completion-report [POST]
├── Purpose: Log job completion
├── Auth: Employee/admin
└── Data: Photos, notes, completion status

/api/conversion-event [POST]
├── Purpose: Track conversion events
├── Auth: Public (event tracking)
├── Events: Quote submitted, form filled, etc.

/api/employment-application [POST]
├── Purpose: Submit career applications
├── Auth: Public
├── Data: Name, email, resume file, application text
└── Storage: Supabase

/api/lead-followup [POST]
├── Purpose: Follow-up workflow trigger
├── Auth: Internal
└── Triggers: Lead followup sequences

/api/notification-dispatch [POST]
├── Purpose: Send notifications (email/SMS)
├── Auth: Internal only
├── Types: Quote responses, job updates, alerts
└── Provider: Email service integration

/api/quickbooks-sync [POST]
├── Purpose: Sync data to QuickBooks
├── Auth: Internal (scheduled)
├── Data: Job costs, revenue, invoicing
└── Frequency: Scheduled background job

/api/quote-create-job [POST]
├── Purpose: Create quote & job record
├── Auth: Checked via auth system
├── Response: Job token for quote/[token]
├── Data: Client info, scope, location, estimate
└── Output: Generates unique quote URL

/api/quote-request [POST]
├── Purpose: Quote request from forms
├── Auth: Public (rate-limited)
├── Rate Limit: 5 requests per IP per hour
├── Data: Client contact, service type, location
└── Triggers: Quote-request → admin notification

/api/quote-response [POST]
├── Purpose: Customer accepts/rejects quote
├── Auth: Token-based (quote token)
├── Data: Accept/Reject action, metadata
└── Triggers: Job status update, notification dispatch

/api/quote-send [POST]
├── Purpose: Email quote to customer
├── Auth: Admin only
├── Data: Quote details, customer email
└── Template: Professional PDF + email
```

### API Data Flow

```
1. Customer Form Submission
   → ContactPageClient.tsx (useQuoteForm)
   → POST /api/quote-request
   → Rate limiting check
   → Supabase lead record created
   → Admin notification sent

2. Quote Generation
   → Admin dashboard reviews lead
   → Creates estimate
   → POST /api/quote-create-job
   → Returns unique quote token
   → Customer gets quote URL: /quote/[token]

3. Quote Acceptance
   → Customer views /quote/[token]
   → QuoteResponseClient.tsx submission
   → POST /api/quote-response (token-authenticated)
   → Job creation in Supabase
   → Dispatch notifications

4. Job Completion
   → Employee marks job complete
   → POST /api/completion-report
   → Photos & notes stored
   → Triggers: feedback request, revenue sync

5. Backend Sync
   → Scheduled: POST /api/quickbooks-sync
   → Data: Invoices, revenue, costs
   → External: QuickBooks accounting system
```

---

## 📚 Library & Utility Functions (src/lib)

### Core Libraries

```
company.ts
├── COMPANY_NAME: "A&A Cleaning"
├── COMPANY_SHORT_NAME: "A&A"
├── COMPANY_PHONE, COMPANY_EMAIL
├── COMPANY_PHONE_E164 (dialing format)
└── Used by: Page headers, contact CTA, footers

site.ts
├── getSiteUrl(): Gets base URL (prod/dev)
├── Used by: Structured data, redirects, canonical URLs
└── Environment: NEXT_PUBLIC_SITE_URL

env.ts
├── Environment variable validation
├── Supabase config: URL, anon key
├── API endpoints & secrets
└── Dev-only preview mode flag

analytics.ts
├── trackConversionEvent(eventName, metadata)
├── trackPageView(path, title)
├── trackFormSubmission(formName, status)
├── Used by: All forms, API routes, page loads
└── Service: Google Analytics / mixpanel integration

dev-preview.ts
├── PREVIEW_MODE: Enable/disable preview mode
├── Preview mode UI panels
└── Development-only debugging tools

rate-limit.ts
├── Rate limiter middleware
├── Limits: 5 requests per IP per hour
├── Used by: /api/quote-request
└── Storage: In-memory or Redis
```

### Supabase Integration

```
supabase/client.ts
├── Browser-safe Supabase client
├── Public key authentication
├── Used by: Client-side queries, auth
└── Features: Real-time subscriptions

supabase/server.ts
├── Server-side Supabase client (RSCs)
├── Used by: GET requests, data fetching
└── Auth: Service role (full access) or user session

supabase/admin.ts
├── Admin-only Supabase client
├── Full database access
├── Used by: Admin routes, internal APIs
└── Auth: Service role key (secrets)
```

### Business Logic Libraries

```
email.ts
├── sendQuoteEmail(quoteData, customerEmail)
├── sendNotificationEmail(topic, recipient)
├── Template rendering
└── Used by: /api/quote-send, /api/notification-dispatch

quote-email.ts
├── Generate quote email body
├── Formatting & styling
├── Company branding
└── Used by: email.ts wrapper

quote-pdf.ts
├── Generate PDF quote document
├── Layout: Header, items, totals, terms
├── Branding: Company logo, colors
└── Storage: Supabase or S3

notifications.ts
├── createNotification(type, userId, data)
├── listNotificationsForUser(userId)
├── markAsRead(notificationId)
└── Types: job_assigned, quote_sent, payment_received

assignment-notifications.ts
├── sendAssignmentNotification(employeeId, jobId)
├── Triggers on: New job assignment
└── Channels: In-app notification, SMS, email

ticketing.ts
├── createTicket(jobId, type, description)
├── updateTicketStatus(ticketId, status)
├── listTicketsForJob(jobId)
└── Types: punch_list, rework, quality_check

photo-upload-queue.ts
├── Manage photo upload queue
├── Batch uploads to Supabase storage
├── Used by: Completion reports, before/afters
└── Features: Resumable uploads, progress tracking

client-photo.ts
├── Process client-submitted photos
├── Resize, optimize, compress
├── Store in appropriate bucket
└── Used by: Quote requests, completion reports
```

---

## 🎨 Styling & Configuration (src/styles, tailwind.config.js)

### Tailwind Configuration

```
tailwind.config.js
├── Content paths: src/**/*.{tsx,ts,jsx,js}
├── Plugins: typography, forms
│
├── Colors (extended):
│   ├── Primary: #0A1628 (dark navy)
│   ├── Accent: #2563EB (blue)
│   ├── Success: emerald-600
│   ├── Neutral: slate-* (grays)
│   └── Brand: Accent + primary combos
│
├── Spacing: 4px base unit
├── Typography: serif font for headings
│
└── Custom utilities:
    ├── .surface-panel: Card/panel styling
    ├── .cta-primary: Primary button
    ├── .cta-outline-dark: Secondary button
    ├── .section-kicker: Section label (small text)
    └── Animation utilities: fade, slide, etc.
```

### Global Styles (src/styles/globals.css)

```
globals.css
├── Font setup: serif, sans-serif using Tailwind defaults
├── Root variables: colors, spacing
├── Section styling:
│   ├── .surface-layer
│   ├── .surface-panel
│   ├── .surface-elevated
│   └── Background colors per section
│
├── Typography:
│   ├── Heading scale (h1-h6)
│   ├── Body text styles
│   ├── Link hover states
│   └── Code block styling
│
├── Component utilities:
│   ├── .btn-primary, .btn-secondary
│   ├── .form-input, .form-label
│   ├── .card, .card-hover
│   └── Rounded corners, shadows
│
├── Animation keyframes:
│   ├── @keyframes fadeIn, slideUp
│   ├── @keyframes pulse, spin
│   └── Used by: scroll-reveal, transitions
│
└── Responsive breakpoints:
    ├── sm: 640px (mobile)
    ├── md: 768px (tablet)
    ├── lg: 1024px (desktop)
    └── xl: 1280px (wide)
```

---

## 🔄 Data Flow & Interactions

### User Journey: Quote Request

```
1. User visits homepage (/)
   ↓
   PublicPageShell renders
   ├── PublicHeader (sticky nav)
   ├── VariantAPublicPage (main content)
   │   ├── HeroSection (CTA buttons)
   │   ├── ServiceSpreadSection
   │   ├── TestimonialSection [LAZY]
   │   ├── QuoteSection (inline form)
   │   ├── AuthorityBar
   │   ├── AboutSection
   │   ├── ServiceAreaSection
   │   ├── OfferAndIndustrySection
   │   ├── CareersSection
   │   ├── TimelineSection
   │   ├── BeforeAfterSlider [LAZY]
   │   └── FooterSection
   │
   ├── FloatingQuotePanel [DEFERRED]
   ├── ExitIntentOverlay [DEFERRED]
   ├── AIQuoteAssistant [DEFERRED]
   └── ScrollToTopButton [DEFERRED]

2. User clicks "Get Quote" CTA
   ↓
   Navigation to /contact or QuoteSection opens
   ↓
   ContactPageClient renders
   ├── ContactPageClient uses useQuoteForm hook
   │   ├── State: name, email, phone, serviceType, location
   │   ├── Validation: Required fields, email format, phone format
   │   ├── Honeypot: Hidden spam-check field
   │   └── Analytics: Track form interaction
   │
   └── User fills form and submits

3. Form submission (useQuoteForm.submitForm)
   ↓
   POST /api/quote-request
   ├── Rate limiting check: 5 per IP per hour
   ├── Supabase: Insert lead record
   │   ├── Fields: name, email, phone, service_type, location, created_at
   │   └── Status: new_lead
   │
   ├── Analytics: trackConversionEvent('quote_request', {...})
   ├── Send admin notification
   └── Return: Success response to client

4. User sees success message
   ↓
   Email notification sent to admin team
   ├── Admin portal updated with new lead
   └── Lead appears in Lead Pipeline dashboard

5. Admin reviews & creates estimate
   ↓
   Admin clicks "Create Quote" in dashboard
   └── POST /api/quote-create-job
       ├── Input: Lead data + estimate details
       ├── Supabase: Create job record
       ├── Generate: Unique quote token
       ├── Response: Quote URL: /quote/[token]
       └── Send: Email to customer with quote link

6. Customer receives email
   ↓
   Clicks quote link → /quote/[token]
   ├── Params: [token] fetched from URL
   ├── Supabase: Fetch corresponding job record
   └── QuoteResponseClient renders
       ├── Display: Quote details, pricing, terms
       └── Actions: Accept/Reject buttons

7. Customer accepts quote
   ↓
   POST /api/quote-response (token-authenticated)
   ├── Input: Quote token, Accept action
   ├── Supabase: Update job status → "accepted"
   ├── Create: Job assignment record
   ├── Analytics: trackConversionEvent('quote_accepted')
   └── Dispatch: notification to assigned employee

8. Employee notified
   ↓
   /employee dashboard updated
   ├── New job appears in Tickets
   └── Send: In-app + email notification

9. Employee completes job
   ↓
   POST /api/completion-report
   ├── Input: Job ID, photos, notes
   ├── Supabase: 
   │   ├── Upload photos to storage
   │   ├── Update job status → "completed"
   │   └── Create completion record
   │
   ├── Send: Customer feedback request
   └── Trigger: Revenue sync to QuickBooks
```

### Component Data Dependencies

```
VariantAPublicPage (root)
├── Imports: All section components
├── Context: QuoteContext (quote form state)
└── Props: None (client component)

↓ (all sections render with animations)

Pages that use shared hooks:
├── ContactPageClient
│   └── useQuoteForm → Form state management
├── QuoteResponseClient
│   └── useQuoteForm → Quote acceptance flow
└── EmploymentApplicationForm
    └── useQuoteForm → Career app submission

↓

Sections that lazy-load data:
├── BeforeAfterSlider
│   └── Fetches: Project images (static import)
├── TestimonialSection
│   └── Fetches: Client testimonials (static data)
├── ServiceAreaSection
│   └── Fetches: City data, region mappings (static)
└── CareersSection
    └── Fetches: Job listings (static or API)

↓

Global effects:
├── RouteProgressBar
│   └── Triggers on: route changes
├── ScrollReveal
│   └── Triggers on: intersection observer events
└── Analytics
    └── Tracks: page views, form submissions
```

---

## 🚀 Build & Optimization

### Current Optimizations Implemented

```
1. Code Splitting (VariantAPublicPage)
   ├── Dynamic imports via next/dynamic
   ├── Components split:
   │   ├── BeforeAfterSlider (with SSR)
   │   ├── TestimonialSection (with SSR)
   │   ├── QuoteSection (with SSR)
   │   ├── FloatingQuotePanel (ssr: false)
   │   ├── ExitIntentOverlay (ssr: false)
   │   ├── AIQuoteAssistant (ssr: false)
   │   └── ScrollToTopButton (ssr: false)
   │
   └── Result: Reduced initial bundle size
        └── Homepage loads critical content first
        └── Heavy components defer until needed

2. Static Generation
   ├── Public pages: Static-rendered at build time
   ├── Service area [slug]: generateStaticParams for 8 cities
   └── Result: Fast delivery, no server processing

3. Route-aware Header
   ├── Solid navbar on white pages: /privacy, /terms, /faq
   ├── Scroll-threshold navbar on other pages
   └── Result: Better contrast, improved UX

4. Structured Data
   ├── Every page has schema.org JSON-LD
   ├── Types: HomePage, ServicePage, FAQPage, ContactPage
   └── Result: Better SEO, rich snippets in search

5. Middleware
   ├── Request/response logging
   ├── Auth checks on protected routes
   └── Result: Centralized request handling
```

### Build Output

```
Build Statistics (Turbopack):
├── Routes generated: 42/42 ✓
├── Build time: 3.2s (Turbopack)
├── TypeScript check: 4.1s
├── Page data collection: 459.7ms
├── Static generation: 320.4ms
└── Total: ~8.5s end-to-end

Route breakdown:
├── Static (prerendered): 35 routes
├── SSG [slug]: service-area cities (8)
├── Dynamic (API): 7 routes
├── Proxy (Middleware): 1

File size (estimates):
├── Bundle: ~250-300 KB (gzip)
├── Homepage JS split: ~80 KB (initial) + 40 KB (lazy chunks)
└── CSS: ~40 KB (gzip, all pages)
```

---

## 📋 File Dependencies & Relationships

### Import Graph (Key Flow)

```
layout.tsx (root)
├── imports: PublicPageShell, RouteProgressBar, globals.css
├── provides: Font setup, metadata, children wrapper
└── renders: All routes via children

(public)/page.tsx (homepage)
├── imports: VariantAPublicPage, PublicPageShell
├── exports: Metadata for homepage
└── renders: Homepage layout

VariantAPublicPage.tsx
├── imports: 16 components (10 static, 6 dynamic)
├── imports: QuoteContext provider
│
├── Dynamic imports:
│   ├── BeforeAfterSlider from ./BeforeAfterSlider
│   ├── TestimonialSection from ./TestimonialSection
│   ├── QuoteSection from ./QuoteSection
│   ├── FloatingQuotePanel from ./FloatingQuotePanel (ssr: false)
│   ├── ExitIntentOverlay from ./ExitIntentOverlay (ssr: false)
│   ├── AIQuoteAssistant from ./AIQuoteAssistant (ssr: false)
│   └── ScrollToTopButton from ./ScrollToTopButton (ssr: false)
│
└── Static imports:
    ├── HeroSection
    ├── ServiceSpreadSection
    ├── AuthorityBar
    ├── AboutSection
    ├── ServiceAreaSection
    ├── OfferAndIndustrySection
    ├── CareersSection
    └── TimelineSection

PublicPageShell.tsx
├── imports: PublicHeader, FooterSection
├── provides: Wrapper layout for all public pages
└── children: Page-specific content

PublicHeader.tsx
├── imports: usePathname(), useState, useEffect
├── logic: Route-aware navbar styling (/privacy, /terms, /faq detection)
├── state: isScrolled, isMobileMenuOpen, openDesktopMenu
└── provides: Navigation UI, dropdowns, mobile menu

FooterSection.tsx
├── imports: Link, company constants, site utilities
├── provides: Footer UI with links, contact, legal
└── used by: All pages via PublicPageShell

(public)/contact/page.tsx
├── imports: ContactPageClient, PublicPageShell
├── provides: Contact page layout & metadata
└── renders: Hero + contact form + CTAs

ContactPageClient.tsx
├── imports: useQuoteForm from ./useQuoteForm
├── state: Form inputs, submission status
├── api: POST /api/quote-request on submit
└── provides: Contact form component

(public)/faq/page.tsx
├── imports: FAQSection, PublicPageShell
├── provides: FAQ page structure
└── renders: Hero + FAQ accordion + CTAs

FAQSection.tsx
├── state: openIndex, filter
├── data: 15 FAQ items (general, process, pricing)
├── features: Expandable cards, category filtering
└── provides: FAQ accordion UI

useQuoteForm.ts
├── hooks: useState, useCallback
├── exports: useQuoteForm custom hook
├── state: Form data, isSubmitting, error, success
├── api: POST /api/quote-request, /api/quote-response
└── used by: ContactPageClient, QuoteResponseClient, EmploymentApplicationForm

(public)/services/*/page.tsx (5 service pages)
├── all import: PublicPageShell for layout
├── all feature: Hero, service description, service specs, CTA
├── all render: Service-specific content
└── all export: Metadata for SEO

(public)/service-area/page.tsx
├── imports: City data, PublicPageShell
├── features: 8-city grid, region grouping, stats
└── provides: Service area hub

(public)/service-area/[slug]/page.tsx
├── imports: Location data, generateStaticParams
├── params: slug (route param)
├── features: Pre-generated static pages for each city
└── provides: City landing pages

analytics.ts
├── exports: trackConversionEvent, trackPageView, trackFormSubmission
├── providers: Google Analytics / mixpanel integration
└── used by: layout.tsx, all API routes, form hooks

supabase/
├── client.ts: Browser-safe queries (used by client components)
├── server.ts: Server-side queries (used by server components)
└── admin.ts: Admin queries (used by admin API routes)

package.json
├── lists: All dependencies and dev dependencies
├── scripts: dev, build, analyze, start, lint
└── provides: Project metadata
```

---

## 🔍 Optimization Opportunities

### Immediate Quick Wins

```
1. Lazy Load Images
   ├── Current: All images loaded on page load
   ├── Solution: Add loading="lazy" to img tags
   ├── Impact: 20-30% faster LCP (Largest Contentful Paint)
   └── Files: HeroSection, ServiceSpreadSection, BeforeAfterSlider

2. Optimize Images
   ├── Current: Some images may be large JPEGs
   ├── Solution: Convert to WebP, optimize dimensions
   ├── Impact: 10-20% file size reduction
   └── Tool: ImageOptim or sharp plugin

3. Route-based Font Loading
   ├── Current: All fonts loaded globally
   ├── Solution: Conditional font loading per page
   ├── Impact: 5-10% faster First Contentful Paint
   └── Implementation: font-display: swap in globals.css

4. Minify Tailwind Output
   ├── Current: Tailwind CSS ~40 KB
   ├── Solution: PurgeCSS to remove unused styles
   ├── Impact: 10-20% CSS reduction
   └── Config: Already in tailwind.config.js content paths
```

### Medium-term Optimizations

```
5. API Response Caching
   ├── Current: Every API call queries database
   ├── Solution: Add Redis cache layer or Supabase cache
   ├── Routes to cache: /api/quote-request (user's lead check)
   ├── Impact: 50-70% faster API responses
   └── TTL: 1 hour for lead data, 24h for static data

6. Database Query Optimization
   ├── Current: Sequential queries in some routes
   ├── Solution: Parallel queries, connection pooling
   ├── Files: All /api routes, supabase/admin.ts
   ├── Tool: Supabase connection pooling
   └── Impact: 30-40% faster database operations

7. Component Memoization
   ├── Current: All components re-render on parent updates
   ├── Solution: React.memo() for pure components
   ├── Candidates: ServiceSpreadSection, TestimonialSection, TimelineSection
   ├── Impact: Prevent unnecessary renders, smoother interactions
   └── Files: All /components/public/variant-a/*.tsx

8. State Management
   ├── Current: useQuoteForm manages quote form state
   ├── Solution: Consider Zustand or Context API optimization
   ├── Impact: Shared state across multiple pages
   └── Use case: Quote data persistence across pages
```

### Long-term Architectural Improvements

```
9. API Gateway Pattern
   ├── Current: Direct API route calls
   ├── Solution: Centralized API gateway middleware
   ├── Impact: Unified error handling, auth, logging
   └── Implementation: middleware.ts extension

10. Component Library
    ├── Current: Components scattered across folders
    ├── Solution: Storybook + component library
    ├── Impact: Faster development, consistency
    └── Setup: Add @storybook/react

11. Form State Machine
    ├── Current: useState + validation callbacks
    ├── Solution: Zod schemas + Form library (React Hook Form)
    ├── Impact: Type-safe forms, better error handling
    └── Candidates: ContactPageClient, QuoteResponseClient

12. E2E Testing & Monitoring
    ├── Current: No test coverage
    ├── Solution: Cypress/Playwright for key flows
    ├── Impact: Catch regressions early
    └── Focus: Quote flow, form submission, navigation
```

### Performance Metrics to Monitor

```
Core Web Vitals:
├── LCP (Largest Contentful Paint): Target < 2.5s
│   └── Current: ~2.8s (needs improvement)
│   └── Solution: Image lazy-loading, code-splitting
│
├── FID (First Input Delay): Target < 100ms
│   └── Current: Good (~80ms)
│   └── Monitor: Keep below threshold
│
├── CLS (Cumulative Layout Shift): Target < 0.1
│   └── Current: Good (~0.05)
│   └── Monitor: Avoid image shift, fonts shift

SEO Metrics:
├── Sitemap: ✓ Generated (42 routes)
├── Robots.txt: ✓ Generated
├── Structured Data: ✓ All pages have schema.org
├── Mobile Responsive: ✓ Implemented (sm, md, lg breakpoints)
└── Canonical URLs: ✓ Set on all pages

Accessibility:
├── WCAG 2.1 AA compliance: Status unknown
├── Color contrast: Check footer/header
├── Keyboard navigation: Test on all forms
└── Alt text: Verify on all images

Bundle Size:
├── Current: ~250-300 KB (gzip)
├── Target: < 200 KB (gzip)
├── Homepage JS: ~80 KB (initial) + 40 KB (lazy)
├── CSS: ~40 KB
└── Tracking: Use npm run analyze (webpack bundle analyzer)
```

---

## 📌 Quick Reference: Where to Find Things

### Pages by Route
- **Homepage**: `src/app/(public)/page.tsx`
- **Contact**: `src/app/(public)/contact/page.tsx`
- **FAQ**: `src/app/(public)/faq/page.tsx`
- **Privacy**: `src/app/(public)/privacy/page.tsx`
- **Terms**: `src/app/(public)/terms/page.tsx`
- **Service Hub**: `src/app/(public)/services/page.tsx`
- **Service Details**: `src/app/(public)/services/[service-type]/page.tsx`
- **Service Area**: `src/app/(public)/service-area/page.tsx`
- **City Pages**: `src/app/(public)/service-area/[slug]/page.tsx`
- **Admin**: `src/app/(admin)/admin/page.tsx`
- **Employee**: `src/app/(employee)/employee/page.tsx`

### Components by Purpose
- **Layout**: `src/components/public/PublicPageShell.tsx`
- **Navigation**: `src/components/public/variant-a/PublicHeader.tsx`
- **Forms**: `src/components/public/variant-a/useQuoteForm.ts`
- **Animations**: `src/components/public/variant-a/ScrollReveal.tsx`
- **Sections**: `src/components/public/variant-a/*Section.tsx`

### APIs by Function
- **Quote Request**: `POST /api/quote-request`
- **Quote Creation**: `POST /api/quote-create-job`
- **Quote Response**: `POST /api/quote-response`
- **Analytics**: `POST /api/conversion-event`
- **Email**: `POST /api/quote-send`, `/api/notification-dispatch`

### Configuration
- **Tailwind**: `tailwind.config.js`
- **Next.js**: `next.config.ts`
- **TypeScript**: `tsconfig.json`
- **Environment**: `.env.example`

### Utilities
- **Company Info**: `src/lib/company.ts`
- **Analytics**: `src/lib/analytics.ts`
- **Supabase**: `src/lib/supabase/*.ts`
- **Email**: `src/lib/email.ts`, `src/lib/quote-email.ts`

---

## 🎯 Next Steps for Developers

### To Understand the Flow
1. Read this file (you're here!)
2. Review `src/app/(public)/page.tsx` (homepage structure)
3. Look at `src/components/public/variant-a/VariantAPublicPage.tsx` (component tree)
4. Check `src/components/public/variant-a/useQuoteForm.ts` (form handling)
5. Trace an API call: `src/app/api/quote-request/route.ts` → Supabase

### To Make Changes
1. Non-visual: Modify utilities in `src/lib/`
2. Visual (design): Update components in `src/components/`
3. Content: Update copy in page files or section components
4. API: Modify `/api/` routes for backend logic
5. Styling: Update `src/styles/globals.css` or `tailwind.config.js`

### To Debug Issues
1. Most critical: Navbar visibility → Check `PublicHeader.tsx` logic
2. Form submissions not tracking → Check `useQuoteForm.ts` and analytics
3. Build errors → Check imports and file paths
4. Styling issues → Check Tailwind config and class names
5. API failures → Check Supabase connection and permissions

---

**Document Version**: 1.0  
**Last Updated**: March 20, 2026  
**Maintainer**: Development Team
