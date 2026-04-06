import type { IndustryData } from "@/data/industries";

type IndustrySlug = IndustryData["slug"];

export type PersonaReadyMapping = {
  buyerTitle: string;
  decisionContext: string;
  coreOutcomes: string[];
  painSignals: string[];
  decisionCriteria: string[];
  messagingAngles: Array<{ trigger: string; response: string }>;
  proofWishlist: string[];
  objectionHandling: Array<{ objection: string; response: string }>;
  researchNotes: string[];
};

export const INDUSTRY_PERSONA_MAPPING: Record<IndustrySlug, PersonaReadyMapping> = {
  "general-contractors": {
    buyerTitle: "Project Manager / Superintendent",
    decisionContext: "Closeout pressure, inspection deadlines, and subcontractor coordination windows.",
    coreOutcomes: [
      "Walkthrough-ready finish quality on first pass",
      "Reduced rework and punch-list callbacks",
      "Reliable handoff timing for owner turnover",
    ],
    painSignals: [
      "Final clean misses causing inspection delays",
      "Inconsistent finish standards across units/floors",
      "Subcontractor handoff friction at deadline",
    ],
    decisionCriteria: [
      "Can your crew hit strict closeout windows?",
      "Do you follow documented scope standards?",
      "How quickly do you resolve misses or punch-list resets?",
    ],
    messagingAngles: [
      {
        trigger: "Deadline risk",
        response: "Lead with scope alignment + final-pass quality controls before dispatch.",
      },
      {
        trigger: "Quality inconsistency",
        response: "Lead with detail standards by surface category (glass, trim, fixtures, finish dust).",
      },
      {
        trigger: "Communication friction",
        response: "Lead with single-point communication and closeout responsiveness.",
      },
    ],
    proofWishlist: [
      "Project type + sqft + completion window",
      "Before/after examples tied to closeout stages",
      "Client quote from GC or superintendent role",
    ],
    objectionHandling: [
      {
        objection: "We already have a cleaning sub.",
        response: "Position A&A as deadline-protection support for final presentation and punch-list risk.",
      },
      {
        objection: "We cannot risk another re-clean.",
        response: "Show quality-control checklist and rapid correction protocol.",
      },
    ],
    researchNotes: [
      "Add top 3 closeout delay causes from client interviews.",
      "Map required proof assets by project stage (rough/final/walkthrough).",
      "Capture language used by supers when work is considered 'owner ready'.",
    ],
  },
  "property-managers": {
    buyerTitle: "Property Manager / Regional Ops",
    decisionContext: "Turnover speed, leasing timeline pressure, and unit-ready consistency.",
    coreOutcomes: [
      "Faster unit-ready turnover cycles",
      "Consistent handoff standard across properties",
      "Lower reset rate between maintenance and leasing",
    ],
    painSignals: [
      "Units not ready when leasing needs access",
      "Repeat clean requests after handoff",
      "Unclear scope between teams/vendors",
    ],
    decisionCriteria: [
      "How fast can you schedule and complete turns?",
      "Can you maintain standards across multiple properties?",
      "How do you communicate completion readiness?",
    ],
    messagingAngles: [
      {
        trigger: "Leasing urgency",
        response: "Lead with turnaround speed and predictable scheduling windows.",
      },
      {
        trigger: "Standardization concerns",
        response: "Lead with repeatable turnover checklist and QA consistency.",
      },
      {
        trigger: "Resident experience",
        response: "Lead with common-area presentation and continuity standards.",
      },
    ],
    proofWishlist: [
      "Turn-time benchmarks before/after engagement",
      "Portfolio-level consistency examples",
      "Manager testimonial focused on reduced reset work",
    ],
    objectionHandling: [
      {
        objection: "We need one vendor for everything.",
        response: "Clarify scope ownership and show where A&A removes bottlenecks in the turn cycle.",
      },
      {
        objection: "Budget is tight this quarter.",
        response: "Frame as reduced vacancy drag and fewer reclean events.",
      },
    ],
    researchNotes: [
      "Add vacancy-cost assumptions for delayed unit readiness.",
      "Capture common turnover handoff failure points by property type.",
      "Map messaging for on-site PM vs regional ops decision-maker.",
    ],
  },
  "commercial-spaces": {
    buyerTitle: "Facilities Manager / Operations Lead",
    decisionContext: "Business continuity, presentation standards, and off-hours reliability.",
    coreOutcomes: [
      "Consistent presentation without operational disruption",
      "Flexible coverage for changing site schedules",
      "Reliable communication when site conditions shift",
    ],
    painSignals: [
      "Cleaning windows conflict with operational hours",
      "Inconsistent quality between visits",
      "Slow response when urgent needs appear",
    ],
    decisionCriteria: [
      "Can service adapt to changing operations?",
      "Are standards maintained across recurring visits?",
      "Is there a dependable escalation and response path?",
    ],
    messagingAngles: [
      {
        trigger: "Operational disruption risk",
        response: "Lead with scheduling flexibility and low-disruption execution.",
      },
      {
        trigger: "Consistency concerns",
        response: "Lead with standards-based recurring checklists and inspection routines.",
      },
      {
        trigger: "Urgent support needs",
        response: "Lead with response commitments and clear dispatch communication.",
      },
    ],
    proofWishlist: [
      "Recurring performance metrics by facility type",
      "Examples of off-hours coordination outcomes",
      "Facilities leadership testimonials tied to continuity",
    ],
    objectionHandling: [
      {
        objection: "Our operations are too complex for outside vendors.",
        response: "Show phased onboarding with scope controls and schedule-safe execution windows.",
      },
      {
        objection: "We cannot tolerate service inconsistency.",
        response: "Present recurring standards checks and documented quality loops.",
      },
    ],
    researchNotes: [
      "Add facility-type specific priority matrix (office, mixed-use, industrial light).",
      "Capture preferred escalation language from facilities teams.",
      "Map buying committee roles and approval blockers.",
    ],
  },
};