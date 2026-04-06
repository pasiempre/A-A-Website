export type IndustryIcon = "contractor" | "property" | "office";

export type IndustryData = {
  slug: "general-contractors" | "property-managers" | "commercial-spaces";
  title: string;
  eyebrow: string;
  painPoint: string;
  outcome: string;
  fit: string[];
  stat: string;
  statLabel: string;
  accent: string;
  accentIcon: string;
  accentBorder: string;
  accentGlow: string;
  icon: IndustryIcon;
};

export const INDUSTRIES: IndustryData[] = [
  {
    slug: "general-contractors",
    title: "General Contractors",
    eyebrow: "Walkthrough-Ready Closeouts",
    painPoint: "Punch-list pressure and inconsistent final-clean quality across trades can slow handoff.",
    outcome: "A&A helps tighten the final presentation with detail-focused cleaning and proof-of-completion support.",
    fit: ["Final Walkthroughs", "Multi-Trade Closeouts", "Schedule-Sensitive Turnovers"],
    stat: "200+",
    statLabel: "closeouts completed on schedule",
    accent: "from-blue-50/80 via-blue-100/40 to-transparent",
    accentIcon: "bg-blue-100 text-blue-600 ring-blue-200/60",
    accentBorder: "border-blue-200/60",
    accentGlow: "group-hover:shadow-blue-100/50",
    icon: "contractor",
  },
  {
    slug: "property-managers",
    title: "Property Managers",
    eyebrow: "Faster Turnover Flow",
    painPoint: "Slow turns and inconsistent unit-ready standards make leasing and inspections harder than they should be.",
    outcome: "Projects move faster when units, common areas, and touchpoints are cleaned to a predictable standard.",
    fit: ["Vacant Unit Turns", "Common Areas", "Leasing-Ready Presentation"],
    stat: "48hr",
    statLabel: "average turnaround time",
    accent: "from-amber-50/80 via-amber-100/40 to-transparent",
    accentIcon: "bg-amber-100 text-amber-600 ring-amber-200/60",
    accentBorder: "border-amber-200/60",
    accentGlow: "group-hover:shadow-amber-100/50",
    icon: "property",
  },
  {
    slug: "commercial-spaces",
    title: "Commercial Spaces",
    eyebrow: "Clean Without Disruption",
    painPoint: "Office and operational teams need reliable cleaning that fits active business environments and deadlines.",
    outcome: "Flexible scheduling and standards-driven work help maintain a clean impression without unnecessary friction.",
    fit: ["Off-Hours Service", "Active Facilities", "Polished Daily Environments"],
    stat: "15+",
    statLabel: "active facilities served weekly",
    accent: "from-emerald-50/80 via-emerald-100/40 to-transparent",
    accentIcon: "bg-emerald-100 text-emerald-600 ring-emerald-200/60",
    accentBorder: "border-emerald-200/60",
    accentGlow: "group-hover:shadow-emerald-100/50",
    icon: "office",
  },
];

export const INDUSTRY_MENU_LINKS = [
  { href: "/industries/general-contractors", label: "General Contractors", desc: "Walkthrough-ready closeouts." },
  { href: "/industries/property-managers", label: "Property Managers", desc: "Fast leasing turnovers." },
  { href: "/industries/commercial-spaces", label: "Commercial Spaces", desc: "Zero-disruption active site cleaning." },
];
