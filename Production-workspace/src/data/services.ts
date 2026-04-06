export type ServiceIcon = "build" | "detail" | "office" | "turn" | "wash";

export type ServiceData = {
  anchor: string;
  index: string;
  icon: ServiceIcon;
  titleLines: string[];
  packageLabel: string;
  description: string;
  responsePromise: string;
  proofLine: string;
  image: string;
  bullets: string[];
  reverse?: boolean;
};

export const SERVICES: ServiceData[] = [
  {
    anchor: "service-post-construction",
    index: "01",
    icon: "build",
    titleLines: ["Post-", "Construction", "Clean"],
    packageLabel: "Builder Turnover Package",
    description: "Rough and final clean for new construction projects. We handle debris, dust, and detail so spaces are move-in ready.",
    responsePromise: "Call-back target: under 1 hour during business hours",
    proofLine: "Licensed and insured, with schedules that match contractor timelines.",
    image: "/images/variant-a/service-spread-01.jpg",
    bullets: ["Multifamily buildings", "Commercial offices", "Schools & institutional"],
  },
  {
    anchor: "service-final-clean",
    index: "02",
    icon: "detail",
    titleLines: ["Final", "Clean"],
    packageLabel: "First + Second Final Package",
    description: "Detail-level cleaning for move-in readiness with first and second final workflows.",
    responsePromise: "Quote delivery target: same day after scope confirmation",
    proofLine: "Built for punch-list closeouts and final walkthroughs.",
    image: "/images/variant-a/service-spread-02.jpg",
    bullets: ["Hardwood floors & tiling", "Fixtures & appliances", "Complete dust removal"],
    reverse: true,
  },
  {
    anchor: "service-commercial",
    index: "03",
    icon: "office",
    titleLines: ["Commercial", "Cleaning"],
    packageLabel: "Recurring Site Care",
    description: "Ongoing and one-time cleaning for offices, retail spaces, and commercial facilities.",
    responsePromise: "Flexible scheduling for active business hours",
    proofLine: "Keeps active spaces clean without interrupting daily operations.",
    image: "/images/variant-a/service-spread-03.jpg",
    bullets: ["Office complexes", "Retail environments", "Regular maintenance"],
  },
  {
    anchor: "service-move",
    index: "04",
    icon: "turn",
    titleLines: ["Move-In", "Move-Out"],
    packageLabel: "Vacant Unit Turnover",
    description: "Vacant unit turnover cleaning for property managers with fast turnaround.",
    responsePromise: "Emergency same-day support available by request",
    proofLine: "Fast turnover support to help units pass inspection and lease quickly.",
    image: "/images/variant-a/service-spread-04.jpg",
    bullets: ["Apartment turns", "Deep sanitation", "Property management support"],
    reverse: true,
  },
  {
    anchor: "service-windows",
    index: "05",
    icon: "wash",
    titleLines: ["Windows &", "Power Wash"],
    packageLabel: "Exterior Detail Upgrade",
    description: "Interior/exterior window cleaning and power washing for polished final delivery.",
    responsePromise: "Scope + equipment quote sent after initial call",
    proofLine: "High-visibility exterior finish work for cleaner handoffs.",
    image: "/images/variant-a/service-spread-05.jpg",
    bullets: ["Exterior facades", "High-reach windows", "Concrete & walkways"],
  },
];

export const SERVICE_MENU_LINKS = [
  { href: "/services/post-construction-cleaning", label: "Post-Construction", desc: "Rough and final cleans for turnovers." },
  { href: "/services/final-clean", label: "Final Clean", desc: "Detail-level move-in readiness." },
  { href: "/services/commercial-cleaning", label: "Commercial", desc: "Ongoing facility care and maintenance." },
  { href: "/services/move-in-move-out-cleaning", label: "Move-In / Move-Out", desc: "Fast vacant unit turnovers." },
  { href: "/services/windows-power-wash", label: "Windows & Power Wash", desc: "Exterior polishing and details." },
];
