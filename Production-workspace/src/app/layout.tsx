import type { Metadata } from "next";
import "@/styles/globals.css";

import { COMPANY_NAME } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: COMPANY_NAME,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: "Construction-ready cleaning operations and quote intake for Austin-area contractors, property teams, and commercial spaces.",
  openGraph: {
    title: COMPANY_NAME,
    description: "Structured quote intake, cleaning operations, and quality-ready handoff for A&A Cleaning Services.",
    url: getSiteUrl(),
    siteName: COMPANY_NAME,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
