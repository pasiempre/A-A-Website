import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return ["", "/about", "/services", "/careers"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
