# Phase 2B: MOBILE & COMPONENT REDESIGN SPECIFICATION
## Visual System Refinement + Component Design Specs

**Status:** Planning Phase (Pre-Implementation)  
**Date:** March 19, 2026  
**Base References:** Phase 4A UX/UI Review + Phase 2A Navigation IA + Master Spec Visual Identity

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Design System Refinements](#design-system-refinements)
3. [Public Site Component Specs](#public-site-component-specs)
4. [Admin Dashboard Component Specs](#admin-dashboard-component-specs)
5. [Mobile Component Strategy](#mobile-component-strategy)
6. [Motion & Animation System](#motion--animation-system)
7. [Loading & Error States](#loading--error-states)
8. [Component Library Inventory](#component-library-inventory)
9. [Implementation Checklist](#implementation-checklist)

---

## EXECUTIVE SUMMARY

### Current State (Phase 4A Finding)
- Color system defined but not fully unified (slate palette)
- Typography scale established but icon system inconsistent
- Form patterns functional but validation UX needs enhancement
- Animations present but not choreographed
- Shadows/depth minimal
- Mobile experience responsive but needs gesture support

### Target State (Phase 2B)
- **Unified Design Language:** Consistent component library across all user types
- **Enhanced Motion:** Choreographed animations with clear entrance/exit flows
- **Complete Form System:** Validation, error, success, loading states all designed
- **Mobile-Optimized:** Bottom navigation, gesture support, touch targets
- **Accessibility:** Complete ARIA implementation, keyboard navigation
- **Icon System:** Unified SVG icons (24x24px, consistent stroke weight)
- **Shadow & Depth:** 3-4 levels applied consistently

### What This Spec Covers
✅ Design system token updates (colors, spacing, shadows, icons)  
✅ Complete component specs (Public + Admin)  
✅ Mobile-specific components (bottom nav, slide-out menu)  
✅ Loading and error state templates  
✅ Animation choreography timing  
✅ Touch interaction guidelines  

### What This Spec Does NOT Cover
❌ QA module specific components (Phase 2C)  
❌ Detailed visual mockups (design tool output)  
❌ CSS implementation details (phase 3 code)  
❌ Brand identity refresh (outside scope)  

---

## DESIGN SYSTEM REFINEMENTS

### Color System - Unified Palette

#### **Primary Palette** (Update from Phase 4A)
```
Slate-900 (Navy):     #1E293B  → Headings, primary text, dark CTAs
Slate-700 (Dark):     #475569  → Secondary text, descriptions
Slate-600 (Muted):    #64748B  → Tertiary text, labels, hints
Slate-500 (Light):    #94A3B8  → Disabled states, light borders
Slate-300 (Lighter):  #CBD5E1  → Light borders, dividers
Slate-200 (Very Light): #E2E8F0 → Card backgrounds, hover states
Slate-100 (Almost):   #F1F5F9  → Page background accent
Off-white (Base):     #FAFAF8  → Primary page background
Pure-white (Surface): #FFFFFF  → Card surfaces
```

#### **Accent Colors** (Finalized)
```
Success (Green):    #16A34A  → Checkmarks, approvals, confirmations
Warning (Amber):    #EA580C  → Caution, alerts, pending states
Error (Red):        #DC2626  → Errors, rejections, critical issues
Info (Blue):        #2563EB  → Informational messages (optional)
Neutral (Gray):     #64748B  → Disabled, pending, neutral actions
```

#### **Glass/Frosted Effect**
```
Background:   rgba(255, 255, 255, 0.06)    [Very subtle transparency]
Border:       rgba(255, 255, 255, 0.12)    [Slightly more visible]
Backdrop:     blur(10px)                   [CSS filter]
Shadow:       rgba(0, 0, 0, 0.05)          [Subtle elevation]

Usage: Floating elements (quote panel, status badges, floating buttons)
```

### Typography System - Finalized

#### **Font Stack**
```css
/* Primary: System UI sans-serif */
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* For headings (Premium, optional): Serif alternates */
/* Future: Cormorant Garamond (opt-in for premium sections) */

/* Monospace (for code/status) */
font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace;
```

#### **Scale - Finalized with Usage**
| Size | Tag | Weight | Line Height | Usage | Example |
|------|-----|--------|-------------|-------|---------|
| 48px | h1 | 600 | 1.2 | Page title, hero headline | "Quality Control for Jobsites" |
| 36px | h2 | 600 | 1.25 | Section headline | "Our Services" |
| 28px | h3 | 600 | 1.3 | Subsection title | "Post-Construction Cleaning" |
| 24px | h4 | 600 | 1.35 | Card title | "Service Area: Austin Metro" |
| 20px | p.lead | 500 | 1.5 | Intro paragraphs, subheadings | "Professional cleaning for construction..." |
| 16px | p | 400 | 1.6 | Body text | Default paragraph |
| 14px | p.small | 400 | 1.5 | Secondary text | "Last updated: March 19, 2026" |
| 12px | label | 600 | 1.5 | Form labels, badges | "FULL NAME *" |
| 11px | caption | 500 | 1.4 | Timestamps, hints | "Valid until: March 22, 2026" |

### Spacing System - Finalized

#### **Tailwind Scale Mapping**
```
4px  (p-1)  = Micro spacing (gap between icon + text)
8px  (p-2)  = Tight spacing (icon + label)
12px (p-3)  = Small spacing (badge internals)
16px (p-4)  = Button padding (interior)
24px (p-6)  = Card padding (standard)
32px (p-8)  = Section gaps
48px (p-12) = Major gaps (between sections)
64px (p-16) = Hero spacing
```

#### **Layout Constraints**
```
Container (desktop):   max-w-4xl (56rem) with px-6 padding
Hero section:          py-16 md:py-20 (tall, breathing room)
Card grid:             gap-6 md:gap-8 (8-24px)
Form fields:           gap-4 per field (16px)
Button spacing:        space-x-3 (12px between actions)
List items:            space-y-3 md:space-y-4 (12-16px)
```

### Shadow System - NEW (Phase 2B Addition)

#### **Shadow Levels**
```css
/* None - flat */
box-shadow: none;

/* Level 1 - Card elevation */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Level 2 - Interactive hover */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Level 3 - Modal / floating */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

/* Level 4 - Dropdown / tooltip */
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
```

#### **Tailwind Mapping**
```
shadow-none      → box-shadow: none
shadow-sm        → box-shadow: 0 1px 2px (Level 1)
shadow-md        → box-shadow: 0 4px 6px (Level 2)
shadow-lg        → box-shadow: 0 10px 15px (Level 3)
shadow-xl        → box-shadow: 0 20px 25px (Level 4)
```

#### **Usage Rules**
```
Cards / Containers: shadow-sm (subtle lift)
Hover states:       shadow-md (interactive feedback)
Modals / Drawers:   shadow-lg (prominence)
Floating buttons:   shadow-md (standard) → hover shadow-lg
Focus rings:        No shadow, use outline instead
```

### Icon System - NEW (Phase 2B Addition)

#### **Icon Style Guide**
```
Size:             24x24px (standard), 16x16px (inline), 32x32px (large)
Stroke width:     1.5px (consistent)
Color:            inherit from text color (use currentColor)
Family:           Heroicons or Material Design (consistent set)
ARIA:             aria-hidden="true" for decorative icons
Fallback:         Text label always present (never icon-only except button aria-labels)
```

#### **Icon Categories**

**Navigation Icons:**
- Home, Menu, Settings, Bell (notifications), User, Logout

**Action Icons:**
- Plus (add), Edit, Delete, Download, Upload, Share, Print, Close (X)

**Status Icons:**
- Checkmark (success), Clock (pending), AlertTriangle (warning), AlertCircle (error)

**Job/Operations Icons:**
- MapPin (location), Calendar (date), Users (team), Briefcase (job), Camera (photos)

**Quality Icons:**
- Star (ratings), Eye (review), Flag (issue), ListCheck (checklist)

**Financial Icons:**
- DollarSign (money), TrendingUp (growth), CreditCard (payment), Receipt (invoice)

#### **Example SVG Template**
```tsx
function IconCheckmark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 12 2.12 2.12m5.88-5.88L21 3M9 12l-6-6M3 3v6m0 6v6m18 0v-6M9 12l12-12" />
    </svg>
  )
}

// Usage:
<button>
  <IconCheckmark />
  <span>Approve</span>
</button>
```

---

## PUBLIC SITE COMPONENT SPECS

### Button Components

#### **Button Variants**

**Primary CTA Button**
```
Appearance:    Solid slate-900 background, white text
Padding:       px-6 py-3 (larger on desktop)
Border radius: rounded-lg (8px)
Hover:         Darker background (slate-950), shadow-md
Active:        Slight inset effect (0 1px inset)
Focus:         outline-2 solid outline-offset-2
Disabled:      opacity-50, cursor-not-allowed
Text:          Font weight 600 (semibold), tracking normal
States:        Default | Hover | Focus | Active | Disabled | Loading
```

**Secondary Button**
```
Appearance:    Border outline (2px) with slate-300, slate-700 text
Padding:       px-6 py-3
Hover:         bg-slate-50, border-slate-400
Focus:         outline-2
Disabled:      opacity-50, cursor-not-allowed
```

**Tertiary Link**
```
Appearance:    Text only, slate-600 color
Hover:         slate-900, underline
Focus:         outline-2 with offset
Underline:     None standard, appears on hover
```

**Size Variants**
```
Small:   px-3 py-1.5 text-sm     (badges, secondary actions)
Medium:  px-4 py-2.5 text-base   (standard)
Large:   px-6 py-3 text-lg       (primary CTAs, hero)
```

#### **Button States**

**Loading State**
```
Disabled:     true (cannot re-click)
Spinner:      24x24px spinning icon (centered)
Text:         Faded or replaced with "Sending..."
Duration:     Show until response (max 10 seconds, then error)
```

**Error State**
```
Background:   Change to red or amber for 2 seconds as feedback
Text:         "✗ Try Again" or revert to original
Disabled:     false (allow retry)
```

**Success State**
```
Background:   Brief color flash (green) for 1 second
Text:         "✓ Submitted"
Disabled:     true for 2 seconds, then reset to default
```

### Form Components

#### **Text Input**
```
Background:  bg-white or bg-slate-50 (light)
Border:      1px solid slate-300, rounded-md
Padding:     px-4 py-2.5
Focus:       outline-2 ring-2 ring-slate-900/10
Placeholder: text-slate-400 (faded)
Error state: border-red-400 bg-red-50, text-red-700
Label:       Above or floating (see below)
```

#### **Floating Label Pattern** (Current in codebase)
```
Structure:
  <label htmlFor="field-id" className="absolute -top-2 text-xs uppercase">
    Field Name *
  </label>
  <input id="field-id" placeholder="" />

Animation:
  Label position: relative (default) → absolute when input focused or has value
  Color: slate-500 (default) → slate-900 (focused)
  Duration: 200ms ease-in-out

Alternative (Better a11y):
  <label htmlFor="field-id">Field Name</label>
  <input id="field-id" />
  (Floating is nice-to-have, semantic <label> is required)
```

#### **Textarea**
```
Similar to text input, but:
  - min-height: 120px
  - resize: none (no resize handle)
  - Scrollable when content exceeds height
  - Line height: 1.5 for readability
```

#### **Select Dropdown**
```
Appearance:   Similar to text input
Options:      Native <select> or custom if needed
Chevron:      Add right-aligned chevron icon
Focus:        Same as text input (outline-2)
Error state:  Same as text input (border-red-400)
```

#### **Checkbox & Radio**
```
Size:         20x20px (large touch target)
Border:       1px solid slate-300 (unchecked)
Checked:      bg-slate-900 with white checkmark
Focus:        outline-2 ring
Label:        Associated with input via htmlFor
Spacing:      gap-3 between checkbox + label
Error state:  Border-red-400
```

#### **Form Validation**

**Inline Validation (Per Field)**
```
Timing:       On blur (not while typing)
Error text:   Below field in text-red-600 (12px)
Icon:         Red alert circle (small)
Background:   Subtle red tint (bg-red-50)
CSS classes:  border-red-400 bg-red-50 text-red-900

Example:
  Name field loses focus
  → If empty → Error text "Name is required"
  → If filled → No error

Phone field:
  Typing "555-1234"
  → On blur → "10 digits required, you entered 7"
```

**Form-Level Validation**
```
Display:      Alert box at top of form (role="alert")
Styling:      bg-red-50 border-red-300 text-red-900 p-4 rounded
Icon:         Alert triangle icon
Dismiss:      Manual close button or auto-dismiss after fix
Message:      "Please fix 2 errors before submitting"
```

### Card Components

#### **Standard Card**
```
Background:  bg-white
Border:      1px solid slate-200
Padding:     p-6
Border radius: rounded-lg (8px)
Shadow:      shadow-sm (subtle)
Content:     Title (h3), description (p), image, footer
Hover:       shadow-md (optional - lift on hover)
```

#### **Service Card** (From homepage)
```
Layout:      Image top, content below
Image:       Full bleed (no padding), height: 200px
Content:     Title (h3), 2-3 line description
CTA:         "Learn more" link or button
Hover:       Image zoom (2%), shadow-md
```

#### **Job Card** (Admin dashboard)
```
Layout:      Flex: Icon + details + status badge + actions
Content:     Job address, date, service type, crew assigned
Status:      Badge (pill) showing current state (scheduled, in progress, completed, qa-review)
Actions:     "View details", "Assign", "Edit" (action buttons or kebab menu)
Padding:     p-4 (compact)
Border:      1px solid slate-200
```

### Modal / Dialog Components

#### **Quote Request Modal** (On homepage)
```
Overlay:       rgba(0,0,0,0.5) (dimmed background)
Modal:         bg-white, rounded-lg, max-w-xl
Padding:       p-8 (generous)
Header:        Close button (X), title
Body:          Quote form
Footer:        Cancel + Submit buttons
Focus trap:    Focus stays within modal (Tab cycles)
Escape:        Close modal on Esc key
Animation:     Fade in 200ms, scale up from 95% (optional)
```

#### **Floating Quote Panel** (Sticky, bottom-right)
```
Appearance:    Rounded-lg card, white, shadow-lg
Size:          w-80 max-w (320px max width)
Position:      fixed bottom-6 right-6
Content:       Mini quote form (3-4 fields only)
CTA:           "Get Quote" button
Dismiss:       Close button, reappear after 5 minutes
Mobile:        Different treatment (see Mobile section)
Z-index:       z-40 (above content, below modals)
```

### List Components

#### **Unordered List** (Testimonials, features)
```
Structure:     <ul role="list">
Item:          <li> with consistent spacing
Bullet:        Default (•) or custom icon
Spacing:       space-y-3 (12px between items)
Icon:          Checkmark (✓) for feature lists
Icon color:    text-green-600 (success color)
```

#### **Table** (Admin dashboard job list)
```
Header:        bg-slate-100, font-semibold, border-b
Rows:          Alternating subtle background (zebra stripe optional)
Padding:       px-4 py-3 per cell
Hover:         bg-slate-50 for full row
Sortable:      Column header shows sort icon (↑ ↓)
Scrollable:    Horizontal scroll on mobile
Condensed:     Reduce padding on mobile (px-2 py-2)
```

---

## ADMIN DASHBOARD COMPONENT SPECS

### Dashboard Layout Components

#### **Main Container**
```
Sidebar:       0-300px width (collapsible on mobile)
Content area:  flex-1 (takes remaining space)
Padding:       p-6 desktop, p-4 mobile
Max width:     No max (full viewport)
Background:    bg-slate-50 or bg-white
```

#### **Quick Stats Cards** (Jobs pending, new leads, etc.)
```
Grid:          grid-cols-1 md:grid-cols-2 lg:grid-cols-4
Card:          bg-white, border-l-4 border-blue-500 (accent color per stat)
Content:       Large number (metric), small label (description)
Icon:          24x24px icon top-right
Hover:         shadow-md
Padding:       p-6
```

#### **Data Table** (Jobs list, leads pipeline)
```
Structure:     Sortable columns, pagination
Header:        bg-slate-100, font-600
Rows:          bg-white, hover bg-slate-50, border-b
Compact mode:  Reduce padding on mobile
Density:       Comfortable (default), compact (optional toggle)
Actions:       Kebab menu (...) or action buttons right-aligned
Selection:     Checkboxes for bulk actions
Sort:          Click column header to sort A-Z or Z-A
Filter:        Filter button, dropdown with multiple options
Pagination:    Previous / [1 2 3...] / Next at bottom
```

#### **Timeline / Status** (Job status progression)
```
Layout:        Vertical line with circles (steps)
Current:       Filled circle, bold text
Completed:     Checkmark in circle
Pending:       Hollow circle, faded text
Line color:    green (complete), blue (in progress), gray (pending)
Labels:        Status name below circle
Dates:         Optional date/time below label
```

### Admin-Specific Components

#### **QA Review Card** (For reviewing completed jobs)
```
Layout:        Vertical card in queue
Content:       
  - Job header (address, date, crew name)
  - Photo gallery (thumbnail grid, tap to expand)
  - Checklist section (each item with checkbox, crew sign-off)
  - Issues section (if any flagged)
  - Action buttons (Approve / Reject / Flag Critical)
Card styling:  Border-l-4 border-blue-500 (pending) or green (approved)
Padding:       p-6
Gap:           Photo gallery to checklist: gap-4
Shadow:        shadow-md
```

#### **Notification Center** (Badge + popover)
```
Icon:          Bell icon (top-right corner)
Badge:         Red circle with count (e.g., "3")
Popover:       Appears on click, positioned below/left of icon
Width:         w-80 (320px)
Content:       
  - "Notifications" title
  - List of recent alerts
  - "Mark all as read" link
  - "See all" link to full page
Styling:       Shadow-lg, rounded-lg, white background
```

### Form Components - Admin

#### **Create/Edit Job Form**
```
Layout:        Two-column on desktop, single-column on mobile
Sections:      
  1. Job details (address, service type, date, time)
  2. Crew assignment (select crew dropdown)
  3. Scope (textarea for special instructions)
  4. Checklist template (select from dropdown)
  5. Additional notes (optional textarea)
Button row:    Save / Cancel (bottom)
Required:      Mark with * asterisk
Errors:        Inline validation (see Form Validation section)
Success:       Toast notification at top (confirmation)
```

#### **Create Quote Form**
```
Layout:        Single column (focused flow)
Sections:
  1. Select lead (dropdown or search)
  2. Service type (select)
  3. Line items (add/remove rows)
  4. Subtotal (auto-calculated)
  5. Tax (optional percentage or fixed)
  6. Total (auto-calculated, bold, large)
  7. Valid until date (date picker)
  8. Notes (textarea)
Action:        Launch PDF preview + Send buttons
```

---

## MOBILE COMPONENT STRATEGY

### Bottom Navigation Bar (Admin Mobile)

#### **Design Specs**
```
Position:      Fixed bottom of viewport
Height:        56px (iOS) / 64px (Android standard)
Background:    bg-white border-t border-slate-200
Items:         5 icons + labels (or 4 + 1 icon-only)
Layout:        Flex, space-around, center-aligned
Safe area:     padding-bottom accounts for notch/home indicator

Item styling:
  - Icon: 24x24px, change color on active
  - Label: 10px font-size, truncate if needed
  - Color default: slate-600
  - Color active: slate-900
  - Padding: py-2 around item
  - Tap target: minimum 48x48px
```

#### **Bottom Navigation Items** (Admin)
```
1. Home     → Dashboard
2. Jobs     → Jobs list
3. QA       → QA review queue
4. Schedule → Calendar view
5. More (≡) → Hamburger menu for Everything else
```

### Mobile Menu (Hamburger)

#### **Menu Icon**
```
Position:      Top-left (hidden on 1024px+)
Size:          24x24px or 32x32px tap target
Animation:     Morphs to X when open, back to ≡ when closed
Color:         slate-900
Hover:         shadow-sm (lift)
```

#### **Menu Overlay (Full-screen)**
```
Overlay:       rgba(0,0,0,0.3) (semi-transparent)
Menu panel:    bg-white, slides from left (0.3s ease-out)
Width:         100% or 80% (device decision)
Height:        100vh from top
Content:
  - Menu items in list format
  - Section headers (Bold, uppercase)
  - Padding: py-6 px-4
  - Spacing: space-y-4 between items
  - Action: Click item → Navigate and close menu
Close:         Tap X, tap overlay, swipe left (optional gesture)
Safe area:     padding-top accounts for notch
```

#### **Mobile Menu Structure**
```
OPERATIONS
├─ Dashboard
├─ Jobs
├─ Schedule
├─ Crew

QUALITY
├─ QA Review
├─ Resource Library

SALES
├─ Leads
├─ Quotes

FINANCIAL
├─ Dashboard
├─ Invoices

SETTINGS
├─ Profile
├─ Notifications
├─ Integrations

HELP
├─ Documentation
├─ Support
```

### Mobile Form Optimization

#### **Touch-Friendly Input Fields**
```
Height:        48px minimum (not default smaller)
Padding:       px-4 py-3 (generous)
Font size:     16px (prevents auto-zoom on iOS)
Spacing:       space-y-4 between fields (16px)
Labels:        Always visible (not just placeholder)
Keyboard:      Specific input types (email, tel, number) show correct keyboard
```

#### **Mobile Checkbox/Radio Layout**
```
Size:          24x24px (large touch target)
Spacing:       gap-3 (12px) between radio and label
Layout:        flex items-start gap-3
Label:         Left-aligned, wraps if needed
```

#### **Mobile Button Layout**
```
Width:         Full width (w-full) for primary CTA
Height:        48px minimum
Padding:       px-4 py-3
Margin:        mb-3 between buttons
Secondary:     Outline button below primary
Text:          16px font size
```

### Mobile Gallery/Carousel

#### **Photo Slider** (Before/After, Job photos)
```
Width:         Full viewport width
Height:        300-400px (adjust per content)
Gesture:       Swipe left/right to navigate
Dots:          Page indicator dots below gallery
Tap:           Full-screen lightbox view on tap
Touch feedback: Slight momentum on swipe (optional)
```

### Mobile Bottom Sheet (Modals)

#### **Sheet from Bottom**
```
Position:      Fixed bottom, slides up from bottom
Height:        60-90% viewport (user can drag up/down)
Border radius:  rounded-t-3xl (very rounded at top)
Padding:       p-6 (safe area bottom included)
Handle:        Small rounded bar at top (12x4px, gray)
Background:    bg-white, shadow-lg upward
Content:       Forms, options, details
Close:         Drag down, tap outside, close button, or button action
Z-index:       z-50 (above everything except modals)
```

---

## MOTION & ANIMATION SYSTEM

### Choreographed Entrance Animations (Page Load)

#### **Hero Section Timing**
```
0ms:    Hero text starts fade-up (opacity 0 → 1, translateY 24px → 0)
100ms:  Hero subheading fades in
200ms:  Hero CTA button fades in
300ms:  Hero image/background appears
```

**CSS Animation:**
```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 0ms forwards;
}

.hero-subtitle {
  animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards;
}

.hero-cta {
  animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards;
}
```

#### **Scroll-Triggered Sections** (Entrance on scroll into view)
```
On scroll into viewport (Intersection Observer):
  ├─ Service cards: Staggered slide-up (each 50ms apart)
  ├─ Testimonials: Fade-in with slight scale (95% → 100%)
  ├─ Timeline: Items slide from left sequentially
  └─ Trust bar: Counters count-up while fading in
```

**Easing Function:**
```
cubic-bezier(0.22, 1, 0.36, 1)  [Fast start, smooth deceleration]
```

### Interactive Element Animations

#### **Button Hover**
```
Transition duration: 200ms
Changes:
  - Background color (darker shade)
  - Shadow elevation (shadow-sm → shadow-md)
  - Optional slight scale (1 → 1.02)

CSS:
  transition: all 200ms ease-out;
  Hover: bg-slate-950 shadow-md
```

#### **Form Input Focus**
```
Transition duration: 150ms
Changes:
  - Border color (slate-300 → slate-900)
  - Ring color (subtle blue/slate tint)

CSS:
  transition: border-color 150ms ease-out;
  Focus: border-slate-900 ring-2 ring-slate-900/10
```

#### **Loading Spinner**
```
Animation: Continuous rotation
Duration: 1s per full rotation
Easing: linear
Kind: SVG <circle> with rotating stroke
```

### Scroll-Based Interactions

#### **Navbar Scroll State** (Optional Enhancement)
```
On scroll < 50px: Transparent background, no shadow
On scroll > 50px: Solid background, add shadow
Transition: 300ms ease-out

Usage: Differentiates hero section from rest of page
```

#### **Parallax Image** (Optional, Performance-Dependent)
```
Hero background image moves slower than scroll
Rate: scrollY * 0.5 (moves at 50% of scroll speed)
Implementation: CSS transform or JS requestAnimationFrame
Caution: impacts performance - test on mobile
```

### Reduced Motion Compliance

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## LOADING & ERROR STATES

### Loading States

#### **Button Loading**
```
State:         Disabled (cannot re-click)
Spinner:       24x24px SVG, animation: rotate
Location:      Centered (overlaid on text, which fades out)
Text:          "Sending..." or fades to transparency
Duration:      Until response returns or 10s timeout
Fallback:      After 10s show "Still loading..." text
```

#### **Form Submission Loading**
```
Full form:     Disabled (inputs disabled, buttons disabled)
Overlay:       Semi-transparent white overlay (optional)
Spinner:       Center of page, size 32x32px
Message:       "Submitting your quote..." text below spinner
Timeout:       After 10s show "This is taking longer than expected"
```

#### **Image Loading** (Phase 4A - needs finalization)
```
Placeholder:   bg-slate-200 animated-pulse
Dimensions:    Maintain aspect ratio (aspect-video)
Transition:    Fade in over 300ms when loaded
Blur-up:       Optional blurred low-res preview before full load
```

#### **Skeleton Screens** (Data loading)
```
Structure:    Mimic actual content layout
Animation:    Pulse or shimmer effect
Duration:     Until data arrives (max 10s)
Colors:       bg-slate-200 for skeleton blocks
Spacing:      Match actual content spacing
```

### Error States

#### **Inline Field Error**
```
Border:        border-red-400 (2px)
Background:    bg-red-50
Text (input):  text-red-900
Error message: text-red-700 (12px, below field)
Icon:          Red circle with X (optional, left of error text)
Timing:        Show on blur if validation fails
Clear:         Disappear on user correction / re-blur
```

#### **Form-Level Error**
```
Position:      Top of form (sticky on scroll)
Styling:       bg-red-50 border-l-4 border-red-500 p-4 rounded
Title:         "Unable to submit" (bold)
Message:       "Please fix these errors: ..."
List:          Bulleted list of specific errors
Action:        Close button (X), auto-dismiss after 10s
Icon:          Red alert triangle
ARIA:          role="alert" aria-live="assertive"
```

#### **API Error Response**
```
Generic:
  Message: "Something went wrong. Please try again."
  Action: Retry button

Specific:
  Message: "Email already has pending quote. Check your inbox."
  Action: Dismiss button

Network:
  Message: "Connection lost. You're offline."
  Action: "Retry" button, auto-retry when connection restored

Server Error (5xx):
  Message: "Our servers are experiencing issues. We'll be right back."
  Action: "Contact support" button
  Display: Page-level banner or modal
```

#### **404 Page** (Missing quote token)
```
Headline:      "Quote not found"
Subtext:       "This quote link is invalid or has expired."
Icon:          Large sad face or broken link icon
CTAs:          "Request new quote" and "View services" buttons
Styling:       bg-slate-50, centered container, py-20
```

#### **Loading Timeout**
```
After 5s: Show message "This is taking longer than expected"
After 10s: Show "Something may be wrong. Try refreshing or contact support"
Offer:     Visible retry button and contact info
```

### Success States

#### **Quote Request Submitted**
```
Modal/Toast:   bg-green-50 border-green-300 p-6 rounded
Icon:          Green checkmark
Title:         "Quote request sent!"
Message:       "Check your email at [user@example.com] for a quote and next steps."
Action:        "Close" button or auto-dismiss after 5s
ARIA:          role="status" aria-live="polite"
```

#### **Job Completed**
```
Toast:         Bottom-right, auto-dismiss after 5s
Styling:       bg-green-50 text-green-900 border-green-300
Icon:          Checkmark
Message:       "Job marked as complete. QA review pending."
Action:        Optional "Undo" link (if reversible)
```

---

## COMPONENT LIBRARY INVENTORY

### Public Site Components (Build in Phase 2B)

**Navigation**
- [ ] PublicHeader (responsive desktop/tablet/mobile)
- [ ] MobileMenu (hamburger overlay)

**Hero & Sections**
- [ ] HeroSection (enhanced with animations)
- [ ] AuthorityBar (trust signals with icons)
- [ ] ServiceCard (single service display)
- [ ] BeforeAfterSlider (gallery with gesture support)
- [ ] TestimonialCard (single testimonial with rating)
- [ ] TimelineStep (process/workflow step)

**Forms**
- [ ] FormInput (text, email, tel, number)
- [ ] FormSelect (dropdown with custom styling)
- [ ] FormTextarea (for descriptions)
- [ ] FormCheckbox (single checkbox)
- [ ] QuoteForm (full quote request)
- [ ] EmploymentApplicationForm (careers form)

**Modals & Floating**
- [ ] QuoteRequestModal (modal overlay)
- [ ] FloatingQuotePanel (sticky bottom-right)
- [ ] BottomSheet (mobile sheet from bottom)

**Feedback**
- [ ] AlertBox (success, error, warning, info)
- [ ] Toast (temporary notification)
- [ ] LoadingSpinner (animated spinner)
- [ ] FormErrorMessage (inline field error)

**Layout**
- [ ] Container (max-width wrapper)
- [ ] Card (standard card styling)
- [ ] Grid (responsive grid)

### Admin Dashboard Components (Build in Phase 2B)

**Layout**
- [ ] AdminLayout (sidebar + content area)
- [ ] AdminSidebar (left navigation)
- [ ] AdminHeader (top bar)
- [ ] AdminBottomNav (mobile bottom navigation)

**Data Display**
- [ ] Table (sortable, filterable, paginated)
- [ ] DataCard (quick stat display)
- [ ] LazyImage (with skeleton loading)
- [ ] Timeline (status progression)
- [ ] Badge (status indicator)

**Forms**
- [ ] JobForm (create/edit job)
- [ ] QuoteForm (admin quote creation)
- [ ] FormField (reusable field wrapper)
- [ ] DatePicker (date selection)
- [ ] MultiSelect (select multiple crew)

**QA Specific**
- [ ] QAReviewCard (job QA card in queue)
- [ ] PhotoGallery (grid of photos with full-screen view)
- [ ] ChecklistDisplay (checklist items with crew sign-off)

**Feedback**
- [ ] NotificationCenter (bell icon + popover)
- [ ] Toast (bottom-right, auto-dismiss)
- [ ] Modal (general purpose modal)
- [ ] ConfirmDialog (confirm dangerous actions)
- [ ] LoadingOverlay (full-page loading)

### Shared/Utility Components

- [ ] Button (all variants: primary, secondary, tertiary)
- [ ] Link (styled text link)
- [ ] Icon (SVG icon wrapper)
- [ ] Skeleton (loading placeholder)
- [ ] Divider (hr alternative)
- [ ] Badge (inline status/label)

---

## IMPLEMENTATION CHECKLIST

### Visual System Setup
- [ ] Update Tailwind config with finalized color tokens
- [ ] Add shadow utilities to Tailwind
- [ ] Configure font loading (system fonts / optional Cormorant)
- [ ] Create CSS variables for design tokens (colors, spacing, shadows)
- [ ] Build icon library (SVG component library)
- [ ] Document icon usage guidelines

### Public Site Components
- [ ] Build and test all public site components
- [ ] Implement scroll animations with proper easing
- [ ] Add loading states to forms
- [ ] Add error validation and display
- [ ] Test responsive behavior (all breakpoints)
- [ ] Test keyboard navigation (Tab through all elements)
- [ ] Test screen reader compatibility (NVDA, JAWS, VoiceOver)

### Admin Dashboard Components
- [ ] Build layout wrapper (sidebar + content)
- [ ] Build all data display components (table, cards, timeline)
- [ ] Build form components with validation
- [ ] Build QA-specific components (review cards, galleries)
- [ ] Implement mobile bottom navigation
- [ ] Implement mobile hamburger menu
- [ ] Test responsive behavior

### Mobile-Specific
- [ ] Test touch targets (≥44px)
- [ ] Test form inputs (correct keyboard types)
- [ ] Test floating elements (bottom sheet, floating buttons)
- [ ] Test gesture interactions (swipe, tap)
- [ ] Test on real devices (iOS, Android)

### Accessibility
- [ ] Audit all components with axe DevTools
- [ ] Test keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast (4.5:1 minimum)
- [ ] Add ARIA labels where needed
- [ ] Test focus indicators visibility
- [ ] Test prefers-reduced-motion compliance

### Performance
- [ ] Lighthouse audit (target > 90)
- [ ] Image optimization (lazy load, WebP)
- [ ] CSS bundle size check
- [ ] JavaScript bundle size check
- [ ] Animation performance (60 FPS on mobile)

### Testing
- [ ] Component unit tests (if using Jest/Vitest)
- [ ] Visual regression tests (if using Percy/Chromatic)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Chrome Mobile)
- [ ] Accessibility scanning (axe, WAVE)

---

**Status:** Ready for Phase 2C (QA Module Design)  
**Next:** Phase 2C QA module specific design and Phase 3 Master Spec 2.0 Implementation

