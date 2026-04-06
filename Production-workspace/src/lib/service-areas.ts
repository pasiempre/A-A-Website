export type ServiceAreaRegion = "North" | "Central" | "South";

export type ServiceAreaCity = {
  slug: string;
  name: string;
  distanceLabel: string;
  region: ServiceAreaRegion;
  description: string;
  highlights: string[];
  localSignals: string[];
  nearbyAreaSlugs: string[];
  proof: {
    annualProjects: string;
    responseWindow: string;
    averageTurnaround: string;
    recurringAccounts: string;
  };
};

export const SERVICE_AREA_CITIES: ServiceAreaCity[] = [
  {
    slug: "round-rock",
    name: "Round Rock",
    distanceLabel: "20 miles from Austin HQ",
    region: "North",
    description:
      "A&A Cleaning provides post-construction cleaning, final clean services, and commercial facility care throughout Round Rock, TX. From new multifamily developments along I-35 to commercial office buildouts in the La Frontera area, we bring the same walkthrough-ready standard to every project.",
    highlights: [
      "Post-construction cleaning for new residential and commercial builds",
      "Final clean services for property turnovers and lease-ready units",
      "Ongoing commercial cleaning for Round Rock office parks and retail",
      "Fast response times for urgent walkthrough prep",
    ],
    localSignals: [
      "Coverage concentrated around I-35, La Frontera, and major multifamily corridors",
      "Frequent support for builder handoff timelines and property turnover windows",
      "Crew deployment available for both daytime and after-hours scopes",
    ],
    nearbyAreaSlugs: ["pflugerville", "georgetown", "hutto"],
    proof: {
      annualProjects: "120+",
      responseWindow: "< 1 hour",
      averageTurnaround: "24-48 hours",
      recurringAccounts: "18 active accounts",
    },
  },
  {
    slug: "georgetown",
    name: "Georgetown",
    distanceLabel: "30 miles from Austin HQ",
    region: "North",
    description:
      "From Sun City developments to downtown Georgetown's growing commercial district, A&A Cleaning delivers construction-ready cleaning with the detail and consistency that contractors and property managers expect.",
    highlights: [
      "Post-construction rough and final cleans for Georgetown builders",
      "Turnover cleaning for property management companies",
      "Commercial facility maintenance for retail and office spaces",
      "Licensed and insured for all commercial and construction site work",
    ],
    localSignals: [
      "Frequent support for production-home communities and mixed-use projects",
      "Flexible dispatch windows for long-distance north-metro projects",
      "Quality-control walkthrough alignment with superintendent schedules",
    ],
    nearbyAreaSlugs: ["round-rock", "hutto", "pflugerville"],
    proof: {
      annualProjects: "85+",
      responseWindow: "< 90 min",
      averageTurnaround: "24-72 hours",
      recurringAccounts: "12 active accounts",
    },
  },
  {
    slug: "pflugerville",
    name: "Pflugerville",
    distanceLabel: "15 miles from Austin HQ",
    region: "North",
    description:
      "Pflugerville's rapid growth means more construction projects and more turnovers. A&A Cleaning supports local contractors and property teams with reliable, detail-focused cleaning that keeps handoffs on schedule.",
    highlights: [
      "Construction cleaning for Pflugerville's growing residential developments",
      "Move-in/move-out cleaning for apartment communities",
      "Commercial cleaning for tech corridor offices and retail",
      "Crew scheduling that aligns with contractor timelines",
    ],
    localSignals: [
      "High-volume support for suburban multifamily and townhome developments",
      "Recurring maintenance support for light-commercial and office spaces",
      "Same-week scheduling available for planned turnovers",
    ],
    nearbyAreaSlugs: ["round-rock", "hutto", "austin"],
    proof: {
      annualProjects: "95+",
      responseWindow: "< 1 hour",
      averageTurnaround: "24-48 hours",
      recurringAccounts: "14 active accounts",
    },
  },
  {
    slug: "buda",
    name: "Buda",
    distanceLabel: "12 miles from Austin HQ",
    region: "South",
    description:
      "A&A Cleaning serves the Buda area with the same standards-driven cleaning we bring to every Austin metro project. Whether it's a new build along I-35 or a commercial space in downtown Buda, we deliver walkthrough-ready results.",
    highlights: [
      "Post-construction cleaning for South Austin corridor developments",
      "Turnover support for Buda property management teams",
      "Detail-focused final cleans for residential and commercial projects",
      "Flexible scheduling including weekends and off-hours",
    ],
    localSignals: [
      "Coverage for fast-moving suburban housing and mixed-use projects",
      "South-corridor dispatch routes for responsive site arrival",
      "Crew plans tuned for property turnover and leasing velocity",
    ],
    nearbyAreaSlugs: ["kyle", "austin", "san-marcos"],
    proof: {
      annualProjects: "70+",
      responseWindow: "< 1 hour",
      averageTurnaround: "24-48 hours",
      recurringAccounts: "9 active accounts",
    },
  },
  {
    slug: "kyle",
    name: "Kyle",
    distanceLabel: "18 miles from Austin HQ",
    region: "South",
    description:
      "Kyle is one of the fastest-growing cities in Texas, and A&A Cleaning is here to support the construction and property management teams building it. We handle post-construction cleans, turnovers, and commercial maintenance throughout the Kyle area.",
    highlights: [
      "Cleaning support for Kyle's residential construction boom",
      "Apartment turnover cleaning for leasing teams",
      "Commercial facility care for Kyle Crossing and surrounding retail",
      "Same-day emergency turnovers available by request",
    ],
    localSignals: [
      "Strong support for rapid homebuilder closeout timelines",
      "Regular multifamily turnover runs with repeat leasing teams",
      "Coordination for mixed residential and retail scope overlap",
    ],
    nearbyAreaSlugs: ["buda", "san-marcos", "austin"],
    proof: {
      annualProjects: "88+",
      responseWindow: "< 90 min",
      averageTurnaround: "24-72 hours",
      recurringAccounts: "11 active accounts",
    },
  },
  {
    slug: "san-marcos",
    name: "San Marcos",
    distanceLabel: "28 miles from Austin HQ",
    region: "South",
    description:
      "A&A Cleaning brings professional construction and commercial cleaning to San Marcos. From student housing turnovers near Texas State University to new commercial builds along the I-35 corridor, we deliver consistent, inspection-ready results.",
    highlights: [
      "Student housing turnover cleaning at scale",
      "Post-construction services for San Marcos commercial development",
      "Recurring cleaning contracts for retail and office environments",
      "Bilingual crews for mixed tenant and owner teams",
    ],
    localSignals: [
      "Seasonal student-housing cycle support with tight turnover deadlines",
      "Commercial corridor coverage for retail and hospitality projects",
      "South-metro routing for planned and urgent scopes",
    ],
    nearbyAreaSlugs: ["kyle", "buda", "austin"],
    proof: {
      annualProjects: "76+",
      responseWindow: "< 90 min",
      averageTurnaround: "24-72 hours",
      recurringAccounts: "10 active accounts",
    },
  },
  {
    slug: "hutto",
    name: "Hutto",
    distanceLabel: "25 miles from Austin HQ",
    region: "North",
    description:
      "As Hutto continues its rapid residential and commercial growth, A&A Cleaning supports builders and property managers with reliable post-construction and turnover cleaning. We bring Austin-level standards to every Hutto project.",
    highlights: [
      "Post-construction cleaning for Hutto's new home developments",
      "Builder turnover packages for production homebuilders",
      "Commercial cleaning for Hutto's expanding retail and office market",
      "Consistent crew quality and on-time delivery",
    ],
    localSignals: [
      "Production-builder turnover specialization with repeat scheduling",
      "North-corridor mobilization for suburban development zones",
      "Cross-city support with Round Rock and Pflugerville teams",
    ],
    nearbyAreaSlugs: ["round-rock", "pflugerville", "georgetown"],
    proof: {
      annualProjects: "68+",
      responseWindow: "< 90 min",
      averageTurnaround: "24-72 hours",
      recurringAccounts: "8 active accounts",
    },
  },
];

export const SERVICE_AREA_BY_SLUG: Record<string, ServiceAreaCity> =
  Object.fromEntries(SERVICE_AREA_CITIES.map((city) => [city.slug, city]));

// Display the first 6 cities on homepage/service pills. Hutto (index 6) retains
// its own city page for organic search but is excluded from featured navigation.
export const HOMEPAGE_SERVICE_AREA_LINKS = SERVICE_AREA_CITIES.slice(0, 6).map((city) => ({
  label: city.name,
  href: `/service-area/${city.slug}`,
}));
