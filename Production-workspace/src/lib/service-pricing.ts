export type ServicePricingType = "construction" | "commercial" | "turnover" | "specialty";

export type ServicePricingProfile = {
  heading: string;
  pricingRange: string;
  includes: string[];
  addOns: string[];
  quoteBasis: string;
  commitments: string[];
};

export const SERVICE_PRICING: Record<ServicePricingType, ServicePricingProfile> = {
  construction: {
    heading: "Pricing Guidance - Post-Construction",
    pricingRange: "Starting from $0.18-$0.55 / sq ft",
    includes: [
      "Debris and dust removal",
      "Surface wipe-down and detail cleaning",
      "Interior glass and fixture finishing",
    ],
    addOns: [
      "Exterior pressure washing",
      "Carpet extraction",
      "High-dust ceiling detail",
    ],
    quoteBasis: "Final quote is confirmed from plans, photos, or a walkthrough.",
    commitments: [
      "Quote delivered within 24 hours",
      "Urgent crews mobilized within 48 hours",
      "Free reclean within 24 hours if needed",
    ],
  },
  commercial: {
    heading: "Pricing Guidance - Commercial Service",
    pricingRange: "Starting from $0.10-$0.28 / sq ft",
    includes: [
      "Lobby, restroom, and common-area cleaning",
      "Trash, touchpoint, and surface sanitation",
      "Floor care aligned to facility needs",
    ],
    addOns: [
      "Day porter support",
      "Deep disinfection cycles",
      "Strip and wax floor service",
    ],
    quoteBasis: "Final quote is based on traffic levels, schedule, and scope frequency.",
    commitments: [
      "Quote delivered within 24 hours",
      "Scheduled service starts in 3-5 business days",
      "Quality issue response within 24 hours",
    ],
  },
  turnover: {
    heading: "Pricing Guidance - Turnover Cleaning",
    pricingRange: "Starting from $175-$425 per unit",
    includes: [
      "Kitchen and bath reset cleaning",
      "Cabinet, appliance, and fixture detail",
      "Dust, floor, and final touch-up pass",
    ],
    addOns: [
      "Inside fridge/oven deep detail",
      "Carpet extraction",
      "Balcony and exterior touch-up",
    ],
    quoteBasis: "Final quote depends on unit condition, size, and requested turnaround window.",
    commitments: [
      "Same-day quote review",
      "Priority scheduling for vacancy turns",
      "Free touch-up within 24 hours after walkthrough",
    ],
  },
  specialty: {
    heading: "Pricing Guidance - Specialty Cleaning",
    pricingRange: "Starting from $199 per visit",
    includes: [
      "Specialized glass and facade cleaning",
      "Targeted pressure-wash treatment",
      "Detail finishing for high-visibility surfaces",
    ],
    addOns: [
      "Rust and stain treatment",
      "Sealant-safe chemical wash",
      "Multi-story access coordination",
    ],
    quoteBasis: "Final quote is based on access, material sensitivity, and equipment needs.",
    commitments: [
      "Quote delivered within 24 hours",
      "Flexible scheduling for off-hours access",
      "Satisfaction re-service within 24 hours",
    ],
  },
};
