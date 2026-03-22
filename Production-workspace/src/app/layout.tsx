import type { Metadata } from "next";
import "@/styles/globals.css";

import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { COMPANY_NAME } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: COMPANY_NAME,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: "Construction-ready cleaning operations and quote intake for Austin-area contractors, property teams, and commercial spaces.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: COMPANY_NAME,
    description: "Structured quote intake, cleaning operations, and quality-ready handoff for A&A Cleaning Services.",
    url: getSiteUrl(),
    siteName: COMPANY_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY_NAME,
    description: "Construction-ready cleaning operations and quote intake for Austin-area contractors, property teams, and commercial spaces.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RouteProgressBar />
        <a
          href="#main-content"
          className="sr-only left-4 top-4 z-[70] rounded bg-[#0A1628] px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed"
        >
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
