# Tech Stack Snapshot

**Last Updated**: March 20, 2026  
**Environment**: Production workspace for A&A Cleaning platform  
**Frame**: Next.js 16 w/ React 19, Turbopack, TypeScript, Tailwind

---

## Runtime & Build

| Package | Version | Role | Notes |
|---------|---------|------|-------|
| **Node.js** | 18+ (required) | Runtime | Use `node --version` to verify |
| **Next.js** | 16.1.7 | Framework | Includes Turbopack (fast builds), App Router |
| **React** | 19.2.4 | UI Library | Latest with concurrent features |
| **TypeScript** | 5.9.3 | Language | Full type safety enabled |
| **Turbopack** | Built-in | Build Tool | `npm run dev --turbopack` (default) |

---

## Frontend Stack

| Package | Version | Purpose |
|---------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS, responsive design |
| **PostCSS** | 8.5.8 | CSS processing (autoprefixer, etc.) |
| **Autoprefixer** | 10.4.27 | Browser prefix auto-injection |
| **React DOM** | 19.2.4 | React rendering engine |

---

## Backend & Database

| Package | Version | Purpose | Configuration |
|---------|---------|---------|---|
| **Supabase** | 2.79.0 | Database + Auth | PostgreSQL with RLS policies |
| **Supabase SSR** | 0.7.0 | Server-side auth | Handles auth in middleware |
| **PostgreSQL** | 15+ (Supabase) | Database | 8 migrations applied, RLS configured |

---

## External Services (Integration Points)

| Service | Status | Auth Type | Used For |
|---------|--------|-----------|----------|
| **Twilio** | Credentials pending | API Key | SMS notifications (assignment, leads, reminders) |
| **Resend** | Configured | API Key | Email delivery (quotes, notifications) |
| **QuickBooks Online** | Simulated / Pending | OAuth2 | Financial sync (invoices, customers, vendors) |
| **Stripe** (optional) | Not integrated | API Key | Future: Payment processing |

---

## Development Tools

| Package | Version | Role |
|---------|---------|------|
| **ESLint** | 9.39.4 | Code linting |
| **ESLint Config (Next.js)** | 16.1.7 | Next.js-specific linting rules |
| **@types/node** | 25.5.0 | Node types |
| **@types/react** | 19.2.14 | React types |
| **@types/react-dom** | 19.2.3 | React DOM types |

---

## Build & Development Scripts

```json
{
  "dev": "next dev --turbopack",        // Start dev server with Turbopack
  "build": "next build",                  // Production build
  "analyze": "ANALYZE=true next build --webpack", // Analyze bundle size
  "start": "next start",                  // Start production server
  "lint": "eslint ."                      // Run ESLint
}
```

### Running Locally

**Development**:
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

**Production Build**:
```bash
npm run build
npm start
```

**Analyze Bundle**:
```bash
npm run analyze
# Shows bundle size breakdown
```

---

## Key Architecture Decisions

### 1. **Next.js App Router**
- All routes in `src/app/` directory
- Route groups (parentheses) for logical organization without affecting URL
- Server components by default, client components marked with `'use client'`

### 2. **TypeScript Everywhere**
- `tsconfig.json` configured for strict mode
- All components and utilities fully typed
- No `any` types (enforced via linting)

### 3. **Tailwind for Styling**
- `tailwind.config.js` defines color scheme, spacing, dark mode
- No custom CSS files (utility-first approach)
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

### 4. **Supabase for Backend**
- PostgreSQL database with Row Level Security (RLS)
- Auth managed via Supabase (email/password for admin, OTP for employees)
- Migrations tracked in `supabase/migrations/` folder

### 5. **SSR Authentication**
- `middleware.ts` handles auth checks on every request
- `@supabase/ssr` for secure server-side session management
- Client/server auth utilities in `src/lib/supabase/`

### 6. **Static Site Generation**
- All public pages generated at build time (static HTML)
- Dynamic routes use `generateStaticParams` for pre-generation
- Admin/employee pages server-rendered (require auth)

---

## Environment & Deployment

### Deployment Platform
- **Hosting**: Vercel (optimized for Next.js)
- **Database**: Supabase (hosted PostgreSQL)
- **CDN**: Vercel Edge Network (automatic)

### Environment Variables (See CONFIG-ESSENTIALS.md)
- `NEXT_PUBLIC_*` — Browser-accessible (public)
- `*` — Server-only (private)

### Build Output
- Static HTML/CSS/JS in `.next/static/`
- Server functions in `.next/server/`
- Deployment: `npm run build` → Vercel

---

## Performance Notes

### Turbopack (Faster Builds)
- Development: ~5-10s cold start (vs. Webpack 30-60s)
- Incremental rebuilds: Near-instant
- Enabled by default in `npm run dev`

### Code Splitting
- Each route gets its own JavaScript bundle
- Unused code excluded from pages that don't need it
- Client components lazy-loaded on demand

### Static Generation
- Public pages: HTML generated at build time
- Cache-Control headers optimized for edge caching
- Revalidation: `revalidateTag()` for on-demand revalidation

---

## Package.json Structure

```
Dependencies (Required for runtime):
├── @supabase/ssr ........... Server-side auth middleware
├── @supabase/supabase-js ... Database client
├── next .................... App framework
├── react ................... UI library
└── react-dom ............... DOM rendering

DevDependencies (Build & development tools):
├── @next/bundle-analyzer .. Bundle analysis
├── @types/* ................ TypeScript types
├── autoprefixer ............ CSS vendor prefixes
├── eslint .................. Linting
├── postcss ................. CSS processing
├── tailwindcss ............. Utility CSS
└── typescript .............. Type checking
```

---

## Typical Workflow for Implementation

1. **Clone repo** → `git clone <repo> && cd Production-workspace`
2. **Install deps** → `npm install`
3. **Setup env** → Copy env vars from CONFIG-ESSENTIALS.md
4. **Run locally** → `npm run dev`
5. **Make changes** → Edit files in `src/`
6. **Build & test** → `npm run build && npm start`
7. **Deploy** → Push to main branch (Vercel auto-deploys)

---

## Debugging Tips

### Next.js Dev Server
- Logs appear in terminal running `npm run dev`
- Browser console: `F12` or Cmd+Option+I
- Server errors: Check terminal output

### TypeScript Errors
- Run `npm run build` to see full type errors
- IDE should show errors in editor if configured

### CSS Issues
- Tailwind classes not applying? Check if component marked `'use client'` or in special folder
- Cache: Hard refresh (Cmd+Shift+R or equivalent)

---

**See Also**:
- [CONFIG-ESSENTIALS.md](CONFIG-ESSENTIALS.md) — Environment variable setup
- [DB-SCHEMA-SUMMARY.md](DB-SCHEMA-SUMMARY.md) — Database tables and relationships
- [API-CONTRACTS.md](API-CONTRACTS.md) — API endpoint specifications
- [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md) — Testing & verification steps
