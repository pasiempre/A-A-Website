import type { Metadata } from "next";
import { COMPANY_CITY, COMPANY_EMAIL, COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_E164, COMPANY_SHORT_NAME } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";
import { VariantAPublicPage } from "@/components/public/variant-a";

export const metadata: Metadata = {
  title: "Construction Cleaning and Turnover Support in Austin",
  description:
    "A&A Cleaning supports Austin-area contractors, property teams, and commercial spaces with post-construction, turnover, and final clean services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "A&A Cleaning | Construction Cleaning and Turnover Support",
    description:
      "Construction-ready cleaning for final walkthroughs, turnovers, and active commercial spaces across Austin.",
    url: getSiteUrl(),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A&A Cleaning | Construction Cleaning and Turnover Support",
    description:
      "Construction-ready cleaning for final walkthroughs, turnovers, and active commercial spaces across Austin.",
  },
};

export default function PublicHomePage() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: COMPANY_NAME,
        alternateName: COMPANY_SHORT_NAME,
        url: baseUrl,
        email: COMPANY_EMAIL,
        telephone: COMPANY_PHONE_E164,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}#localbusiness`,
        name: COMPANY_NAME,
        url: baseUrl,
        telephone: COMPANY_PHONE_E164,
        email: COMPANY_EMAIL,
        areaServed: COMPANY_CITY,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Austin",
          addressRegion: "TX",
          addressCountry: "US",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: COMPANY_PHONE,
          contactType: "customer service",
          areaServed: "US-TX",
          availableLanguage: ["en", "es"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: COMPANY_NAME,
        url: baseUrl,
        inLanguage: "en-US",
      },
      {
        "@type": "AggregateRating",
        "@id": `${baseUrl}#aggregateRating`,
        itemReviewed: { "@id": `${baseUrl}#localbusiness` },
        ratingValue: "5.0",
        reviewCount: "4",
        bestRating: "5",
        worstRating: "1",
      },
      {
        "@type": "Review",
        itemReviewed: { "@id": `${baseUrl}#localbusiness` },
        author: { "@type": "Person", name: "Marcus Torres" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "A&A Cleaning has been our go-to subcontractor for three years. Reliable, detail-oriented, and always on schedule.",
      },
      {
        "@type": "Review",
        itemReviewed: { "@id": `${baseUrl}#localbusiness` },
        author: { "@type": "Person", name: "David Chen" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "They fundamentally understand the demands of commercial builds. We don't worry when they're on the schedule.",
      },
      {
        "@type": "Review",
        itemReviewed: { "@id": `${baseUrl}#localbusiness` },
        author: { "@type": "Person", name: "Sarah Mitchell" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "From rough clean to final walk-through, their attention to detail is unmatched. The best sub we've worked with.",
      },
      {
        "@type": "Review",
        itemReviewed: { "@id": `${baseUrl}#localbusiness` },
        author: { "@type": "Person", name: "James Rodriguez" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "Fast turnaround, professional crew, zero punch list items. A&A sets the standard for construction cleaning.",
      },
      ...[
        {
          name: "Post-Construction Cleaning",
          description: "Rough and final clean for new construction projects. Debris, dust, and detail so spaces are move-in ready.",
          url: `${baseUrl}/services/post-construction-cleaning`,
        },
        {
          name: "Final Clean Services",
          description: "Detail-level cleaning for move-in readiness with first and second final workflows.",
          url: `${baseUrl}/services/final-clean`,
        },
        {
          name: "Commercial Cleaning",
          description: "Ongoing and one-time cleaning for offices, retail spaces, and commercial facilities.",
          url: `${baseUrl}/services/commercial-cleaning`,
        },
        {
          name: "Move-In / Move-Out Cleaning",
          description: "Vacant unit turnover cleaning for property managers with fast turnaround.",
          url: `${baseUrl}/services/move-in-move-out-cleaning`,
        },
        {
          name: "Window Cleaning & Power Washing",
          description: "Interior/exterior window cleaning and power washing for polished final delivery.",
          url: `${baseUrl}/services/windows-power-wash`,
        },
      ].map((service) => ({
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: service.url,
        provider: { "@id": `${baseUrl}#localbusiness` },
        areaServed: {
          "@type": "City",
          name: "Austin",
          containedInPlace: { "@type": "State", name: "Texas" },
        },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <VariantAPublicPage />
    </>
  );
}
