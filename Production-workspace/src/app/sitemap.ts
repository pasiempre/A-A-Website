import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

const BUILD_DATE = new Date().toISOString();

const locationSlugs = [
  "round-rock",
  "georgetown",
  "pflugerville",
  "buda",
  "kyle",
  "san-marcos",
  "hutto",
];

type SitemapEntry = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const pages: SitemapEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/service-area", changeFrequency: "monthly", priority: 0.7 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.5 },
  { path: "/services/post-construction-cleaning", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/final-clean", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/commercial-cleaning", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/move-in-move-out-cleaning", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/windows-power-wash", changeFrequency: "monthly", priority: 0.8 },
  ...locationSlugs.map((slug) => ({
    path: `/service-area/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: BUILD_DATE,
    changeFrequency,
    priority,
  }));
}
