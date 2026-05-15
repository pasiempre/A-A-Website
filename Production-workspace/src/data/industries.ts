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
    painPoint: "When a closeout is days from walkthrough, the final clean has to match the punch list: glass, millwork, floors, fixtures, and the details clients notice first.",
    outcome: "See how A&A supports final cleans, touch-up passes, and proof-ready handoffs for contractor schedules.",
    fit: ["Final Walkthroughs", "Punch-List Support", "Schedule-Sensitive Handoffs"],
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
    painPoint: "Every extra day between tenants affects leasing, inspections, and team workload. Turn cleaning needs to be repeatable, fast, and easy to schedule.",
    outcome: "Explore turnover support for vacant units, common areas, and leasing-ready presentation across property portfolios.",
    fit: ["Vacant Unit Turns", "Move-In Standards", "Leasing-Ready Presentation"],
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
    painPoint: "Active workplaces need cleaning that respects hours, access, staff, and customer-facing areas without creating another coordination problem.",
    outcome: "Review flexible service options for offices, facilities, and shared spaces that need a consistent standard.",
    fit: ["Off-Hours Service", "Active Facilities", "Customer-Facing Areas"],
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
  { href: "/industries/general-contractors", label: "General Contractors", desc: "Final-clean support for closeouts." },
  { href: "/industries/property-managers", label: "Property Managers", desc: "Turnover cleaning that keeps units moving." },
  { href: "/industries/commercial-spaces", label: "Commercial Spaces", desc: "Cleaning planned around active operations." },
];
