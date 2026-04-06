import type { Metadata } from "next";
import Link from "next/link";

import {
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  COMPANY_PHONE_E164,
  COMPANY_CITY,
} from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${COMPANY_NAME}. Learn how we collect, use, store, and protect your personal information when you use our website, request quotes, or interact with our AI assistant.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "June 1, 2025";
const LAST_UPDATED = "June 1, 2025";

const TOC = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-information", label: "How We Use Your Information" },
  { id: "how-we-share-information", label: "How We Share Your Information" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "ai-assistant", label: "AI Quote Assistant" },
  { id: "data-storage-security", label: "Data Storage & Security" },
  { id: "data-retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights & Choices" },
  { id: "communications", label: "Communications & SMS" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "do-not-track", label: "Do Not Track" },
  { id: "state-specific", label: "State-Specific Disclosures" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact-privacy", label: "Contact Us" },
];

function SectionHeading({
  id,
  index,
  children,
}: {
  id: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-32 font-serif text-2xl tracking-tight text-[#0A1628] md:text-3xl"
    >
      <span className="mr-2 font-mono text-lg text-[#C9A94E]">
        {String(index).padStart(2, "0")}
      </span>
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.95rem] leading-[1.8] text-slate-600">{children}</p>;
}

function BulletList({
  items,
  color = "gold",
}: {
  items: string[];
  color?: "gold" | "blue";
}) {
  const dotColor = color === "blue" ? "bg-[#2563EB]" : "bg-[#C9A94E]";
  return (
    <ul className="space-y-3 text-[0.95rem] leading-[1.75] text-slate-600">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-3 text-sm font-semibold text-[#0A1628]">
        <span className="h-px w-5 bg-[#C9A94E]" aria-hidden="true" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-l-[3px] border-[#C9A94E] bg-[#FAFAF8] py-5 pl-6 pr-5">
      <div className="text-[0.95rem] leading-[1.75] text-slate-700">{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/privacy#page`,
    name: `Privacy Policy — ${COMPANY_NAME}`,
    description: `Privacy policy for ${COMPANY_NAME} covering data collection, use, and protection practices.`,
    url: `${baseUrl}/privacy`,
    isPartOf: { "@id": `${baseUrl}#website` },
    datePublished: "2025-06-01",
    dateModified: "2025-06-01",
    inLanguage: "en-US",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Privacy Policy",
          item: `${baseUrl}/privacy`,
        },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main>
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] pb-14 pt-28 md:pb-18 md:pt-36">
            <div className="pointer-events-none absolute inset-0 opacity-[0.025]" aria-hidden="true">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative mx-auto max-w-4xl px-6">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-xs text-slate-500">
                  <li><Link href="/" className="transition hover:text-[#0A1628]">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="font-medium text-[#0A1628]">Privacy Policy</li>
                </ol>
              </nav>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
                  Legal
                </span>
              </div>

              <h1 className="mt-4 font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-[3.5rem]">
                Privacy Policy
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 2v4M16 2v4" />
                  </svg>
                  <span>Effective: {EFFECTIVE_DATE}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5l3 1.8" />
                  </svg>
                  <span>Last updated: {LAST_UPDATED}</span>
                </div>
              </div>

              <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-600">
                {COMPANY_NAME} (&ldquo;{COMPANY_SHORT_NAME},&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) is committed to protecting the privacy and security of your personal
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard
                information when you visit our website, request a cleaning quote, use our AI-powered
                quote assistant, submit an employment application, or otherwise interact with our
                services.
              </p>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                By accessing or using our website and services, you agree to the collection and use of
                information in accordance with this policy. If you do not agree, please discontinue use of
                our website and services.
              </p>
            </div>
          </section>

          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-6">
              <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
                <nav
                  aria-label="Table of contents"
                  className="hidden lg:sticky lg:top-32 lg:block lg:w-60 lg:shrink-0 lg:self-start"
                >
                  <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
                    On This Page
                  </p>
                  <ol className="space-y-2.5 border-l border-slate-200 pl-4">
                    {TOC.map((item, i) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="group flex items-start gap-2 text-[13px] text-slate-500 transition hover:text-[#0A1628]"
                        >
                          <span className="mt-px font-mono text-[10px] text-slate-400 transition group-hover:text-[#C9A94E]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="leading-snug">{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <div className="min-w-0 flex-1 space-y-16">
                  <div className="space-y-6">
                    <SectionHeading id="information-we-collect" index={1}>
                      Information We Collect
                    </SectionHeading>

                    <Paragraph>
                      We collect information in two ways: information you voluntarily provide to us, and
                      information that is collected automatically through your use of our website.
                    </Paragraph>

                    <InfoCard title="Information You Provide Directly">
                      <BulletList
                        items={[
                          "Quote requests — Your name, company name, phone number, email address, service type, project timeline, and project description submitted through our website forms or slide-out quote panel.",
                          "AI assistant conversations — Messages you send to our AI-powered quote assistant, including your language preference (English or Spanish), message content, and session identifiers used to maintain conversational context.",
                          "Employment applications — Full name, phone number, email address, preferred language, city of residence, years of professional cleaning experience, transportation availability, U.S. work eligibility status, schedule availability, and any additional notes you choose to include.",
                          "Direct communications — Any information you share when you call us, email us, or otherwise communicate with our team directly.",
                        ]}
                      />
                    </InfoCard>

                    <InfoCard title="Information Collected Automatically">
                      <BulletList
                        items={[
                          "Usage and interaction data — Pages visited, features used (such as the before/after comparison slider, service tabs, and testimonial carousel), buttons clicked, conversion events (such as form submissions and phone link taps), and the source attribution of each interaction.",
                          "Device and browser information — Browser type and version, operating system, screen resolution, viewport dimensions, preferred language settings, and whether you have reduced motion preferences enabled.",
                          "IP address and network data — Your IP address is collected for rate limiting, abuse prevention, and general geographic context (city-level). We do not use IP addresses for individual tracking, behavioral profiling, or cross-site identification.",
                          "Referral information — The URL that referred you to our website, search terms used (if available), and the general source of your visit.",
                        ]}
                      />
                    </InfoCard>

                    <HighlightBox>
                      <strong>What we do NOT collect:</strong> We do not collect Social Security numbers,
                      financial information, payment card details, government identification numbers,
                      health information, or biometric data through our website. We do not use facial
                      recognition or fingerprinting technology.
                    </HighlightBox>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="how-we-use-information" index={2}>
                      How We Use Your Information
                    </SectionHeading>

                    <Paragraph>
                      We use the information we collect for specific, legitimate business purposes. We do
                      not use your personal information for purposes unrelated to the services described
                      below.
                    </Paragraph>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          title: "Service Delivery",
                          items: [
                            "Respond to quote requests and provide project estimates",
                            "Schedule and coordinate cleaning services",
                            "Send transactional confirmations via SMS and email",
                            "Provide real-time assistance through the AI quote assistant",
                          ],
                        },
                        {
                          title: "Operations & Improvement",
                          items: [
                            "Analyze aggregate site usage to improve user experience",
                            "Identify and resolve technical issues or broken workflows",
                            "Evaluate the effectiveness of different conversion paths",
                            "Improve response times and communication quality",
                          ],
                        },
                        {
                          title: "Employment",
                          items: [
                            "Review and process employment applications",
                            "Contact applicants regarding positions and next steps",
                            "Maintain records for compliance with employment laws",
                          ],
                        },
                        {
                          title: "Security & Compliance",
                          items: [
                            "Enforce rate limits to prevent abuse of forms and APIs",
                            "Detect and block spam submissions using honeypot techniques",
                            "Validate phone numbers and input integrity",
                            "Comply with applicable federal, state, and local laws",
                          ],
                        },
                      ].map((group) => (
                        <div
                          key={group.title}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <p className="mb-3 text-sm font-semibold text-[#0A1628]">{group.title}</p>
                          <BulletList items={group.items} color="blue" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="how-we-share-information" index={3}>
                      How We Share Your Information
                    </SectionHeading>

                    <HighlightBox>
                      <strong>
                        We do not sell, rent, trade, or otherwise make available your personal information
                        to third parties for their marketing purposes.
                      </strong>{" "}
                      We have never sold personal data and have no plans to do so.
                    </HighlightBox>

                    <Paragraph>
                      We share information only in the following limited, necessary circumstances:
                    </Paragraph>

                    <BulletList
                      items={[
                        "Service providers — We use carefully selected third-party services to host data, deliver communications, and process AI interactions (detailed in Section 4 below). These providers are contractually obligated to use your data only to perform services on our behalf and maintain appropriate security measures.",
                        "Internal team — Quote request details (name, company, phone, service type) are shared with our internal operations team for follow-up. Admin notifications are delivered via SMS to authorized team members only.",
                        "Legal compliance — We may disclose information if required by law, subpoena, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.",
                        "Business transfers — In the event of a merger, acquisition, reorganization, or sale of company assets, personal information may be transferred as part of that transaction. We will notify affected individuals of any such transfer and any changes to applicable privacy practices.",
                        "With your consent — We may share information in other circumstances if you provide explicit consent.",
                      ]}
                    />
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="third-party-services" index={4}>
                      Third-Party Services
                    </SectionHeading>

                    <Paragraph>
                      We rely on trusted third-party providers to deliver certain functionality. Each
                      provider processes data in accordance with their own privacy policies and security
                      practices. We select providers that maintain industry-standard security measures and
                      limit their use of your data to performing services on our behalf.
                    </Paragraph>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          name: "Database & Storage",
                          description:
                            "Quote requests, lead records, user profiles, and employment applications are stored in a hosted PostgreSQL database with row-level security, encrypted connections, and role-based access controls.",
                        },
                        {
                          name: "Email Delivery",
                          description:
                            "Transactional confirmation emails (quote acknowledgments, application receipts) are delivered through a third-party email API. Emails are sent from our verified domain and contain only information related to your specific request.",
                        },
                        {
                          name: "SMS Communications",
                          description:
                            "Text message confirmations to leads and internal alert notifications to our operations team are sent through a cloud communications provider. Messages are transactional only — we do not send marketing SMS.",
                        },
                        {
                          name: "AI Language Processing",
                          description:
                            "Messages sent to our AI quote assistant are processed by a large language model provider to generate contextual responses. Conversations are not used to train third-party models. Session data is retained temporarily for conversational continuity only.",
                        },
                        {
                          name: "Hosting & CDN",
                          description:
                            "Our website is hosted on a modern cloud platform that provides edge caching, DDoS protection, and encrypted data transmission (TLS/HTTPS) for all page requests and API calls.",
                        },
                        {
                          name: "Analytics",
                          description:
                            "We use a custom, first-party analytics system that records interaction events (page views, button clicks, form submissions) and attributes them to conversion sources. We do not use Google Analytics, Facebook Pixel, or any third-party advertising trackers.",
                        },
                      ].map((svc) => (
                        <div
                          key={svc.name}
                          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                          <p className="text-sm font-semibold text-[#0A1628]">{svc.name}</p>
                          <p className="mt-3 text-sm leading-relaxed text-slate-500">{svc.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="ai-assistant" index={5}>
                      AI Quote Assistant
                    </SectionHeading>

                    <Paragraph>
                      Our website features an AI-powered quote assistant that helps you structure cleaning
                      quote requests through a conversational interface. Because this feature involves
                      automated processing of your messages, we want to be especially transparent about how
                      it works:
                    </Paragraph>

                    <BulletList
                      items={[
                        "What it processes — The text content of messages you type into the assistant, your language preference (English or Spanish), and a temporary session identifier.",
                        "How it generates responses — Your messages are sent to a large language model (LLM) API, which generates a contextual response. The LLM provider processes your message content to produce a reply and does not retain your data for model training purposes.",
                        "Session continuity — A session ID is used to maintain conversational context within a single chat session. Sessions are not linked to persistent user profiles or cross-session identifiers.",
                        "No automated decisions — The AI assistant helps structure your quote request but does not make binding decisions about pricing, scheduling, or service eligibility. All quotes are reviewed and confirmed by our human team.",
                        "Data retention — Chat session data is retained temporarily for the duration of the browser session and for a short period afterward for quality monitoring. It is not stored permanently or used for profiling.",
                        "Opt-out — Use of the AI assistant is entirely optional. You can request a quote through our standard form, by phone, or by email at any time.",
                      ]}
                    />
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="data-storage-security" index={6}>
                      Data Storage & Security
                    </SectionHeading>

                    <Paragraph>
                      We take the security of your information seriously and implement commercially
                      reasonable administrative, technical, and physical safeguards to protect against
                      unauthorized access, alteration, disclosure, or destruction.
                    </Paragraph>

                    <InfoCard title="Security Measures">
                      <BulletList
                        items={[
                          "All data is transmitted over encrypted HTTPS/TLS connections.",
                          "Database access is restricted through row-level security policies and role-based access controls.",
                          "API endpoints are protected with rate limiting to prevent abuse and brute-force attacks.",
                          "Form submissions include anti-spam measures (honeypot fields and input validation).",
                          "Sensitive environment variables (API keys, database credentials) are stored securely and never exposed in client-side code.",
                          "Admin notification systems use quiet-hours logic to manage timing of internal alerts.",
                          "We conduct periodic reviews of our security practices and third-party provider configurations.",
                        ]}
                      />
                    </InfoCard>

                    <Paragraph>
                      Your data is stored on servers located in the United States. By using our website and
                      services, you consent to the transfer and processing of your information within the
                      United States.
                    </Paragraph>

                    <HighlightBox>
                      No method of electronic transmission or data storage is 100% secure. While we strive
                      to protect your personal information, we cannot guarantee absolute security. If you
                      have reason to believe your interaction with us is no longer secure, please contact us
                      immediately.
                    </HighlightBox>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="data-retention" index={7}>
                      Data Retention
                    </SectionHeading>

                    <Paragraph>
                      We retain personal information only for as long as reasonably necessary to fulfill the
                      purposes for which it was collected, comply with legal obligations, resolve disputes,
                      and enforce our agreements.
                    </Paragraph>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-[#FAFAF8] text-left">
                            <th className="px-5 py-3 font-semibold text-[#0A1628]">Data Type</th>
                            <th className="px-5 py-3 font-semibold text-[#0A1628]">Retention Period</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            ["Quote requests & lead records", "Duration of business relationship + 3 years"],
                            [
                              "AI assistant sessions",
                              "Temporary — duration of browser session + short-term quality monitoring period",
                            ],
                            [
                              "Employment applications",
                              "Duration of hiring process + up to 24 months, or as required by applicable employment law",
                            ],
                            [
                              "Conversion analytics",
                              "Retained in aggregate, anonymized form indefinitely. No directly identifying information is stored in analytics records.",
                            ],
                            [
                              "IP-based rate limiting",
                              "Ephemeral — stored in application memory and cleared within 1 hour of the rate limit window",
                            ],
                            [
                              "SMS/email delivery logs",
                              "Retained by third-party providers per their own policies. We do not maintain separate copies of delivery logs.",
                            ],
                          ].map(([type, period]) => (
                            <tr key={type} className="bg-white">
                              <td className="px-5 py-3 font-medium text-[#0A1628]">{type}</td>
                              <td className="px-5 py-3 text-slate-600">{period}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="your-rights" index={8}>
                      Your Rights & Choices
                    </SectionHeading>

                    <Paragraph>
                      Depending on your jurisdiction, you may have certain rights regarding the personal
                      information we hold about you. We respect these rights and will respond to legitimate
                      requests in a timely manner.
                    </Paragraph>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          right: "Right to Access",
                          description:
                            "Request a copy of the personal information we hold about you, including the categories of data collected and the purposes for which it is used.",
                        },
                        {
                          right: "Right to Correction",
                          description:
                            "Request that we correct inaccurate, incomplete, or outdated personal information in our records.",
                        },
                        {
                          right: "Right to Deletion",
                          description:
                            "Request that we delete your personal information, subject to legal retention requirements and legitimate business needs.",
                        },
                        {
                          right: "Right to Opt Out",
                          description:
                            "Opt out of any future marketing communications. Transactional messages related to active service requests may still be sent.",
                        },
                        {
                          right: "Right to Data Portability",
                          description:
                            "Where technically feasible, request a copy of your data in a structured, commonly used, machine-readable format.",
                        },
                        {
                          right: "Right to Non-Discrimination",
                          description:
                            "You will not receive different pricing, quality, or level of service based on exercising your privacy rights.",
                        },
                      ].map((item) => (
                        <div
                          key={item.right}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <p className="text-sm font-semibold text-[#0A1628]">{item.right}</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                        </div>
                      ))}
                    </div>

                    <Paragraph>
                      To exercise any of these rights, contact us at{" "}
                      <a
                        href={`mailto:${COMPANY_EMAIL}`}
                        className="font-medium text-[#2563EB] underline decoration-[#2563EB]/30 underline-offset-2 transition hover:decoration-[#2563EB]"
                      >
                        {COMPANY_EMAIL}
                      </a>{" "}
                      or call{" "}
                      <a href={`tel:${COMPANY_PHONE_E164}`} className="font-medium text-[#0A1628]">
                        {COMPANY_PHONE}
                      </a>
                      . We will verify your identity and respond within 30 days. If we need additional
                      time (up to 90 days), we will notify you of the extension and the reason.
                    </Paragraph>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="communications" index={9}>
                      Communications & SMS
                    </SectionHeading>

                    <Paragraph>
                      When you submit a quote request or employment application, you may receive
                      transactional communications from us:
                    </Paragraph>

                    <BulletList
                      items={[
                        "SMS confirmation — A text message acknowledging receipt of your request and setting expectations for follow-up timing.",
                        "Email confirmation — An email summarizing your request with details about next steps.",
                        "Follow-up communications — Our team may call or text you to confirm project scope, schedule a site visit, or provide your estimate.",
                      ]}
                    />

                    <HighlightBox>
                      <strong>These are transactional messages only.</strong> We will not send unsolicited
                      marketing, promotional, or advertising text messages. By submitting a form that
                      includes your phone number, you consent to receiving transactional SMS related to your
                      specific request. Standard message and data rates may apply. You can opt out of SMS at
                      any time by replying STOP to any message or by contacting us directly.
                    </HighlightBox>

                    <Paragraph>
                      If you receive a message from us that you did not expect or believe was sent in error,
                      please contact us immediately and we will investigate and resolve the issue.
                    </Paragraph>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="cookies" index={10}>
                      Cookies & Tracking
                    </SectionHeading>

                    <Paragraph>
                      Our approach to cookies and tracking is intentionally minimal. We believe in
                      collecting only what is necessary to deliver and improve our services.
                    </Paragraph>

                    <InfoCard title="What We Use">
                      <BulletList
                        items={[
                          "Essential cookies — Minimal cookies required for site functionality, such as session management and security tokens. These cannot be disabled without breaking core site features.",
                          "First-party analytics — Our custom analytics system records page views and interaction events (button clicks, form submissions, conversion paths) using first-party API calls. This data does not include persistent user identifiers and is not shared with third parties.",
                        ]}
                      />
                    </InfoCard>

                    <InfoCard title="What We Do NOT Use">
                      <BulletList
                        items={[
                          "Third-party advertising cookies (Google Ads, Facebook Pixel, etc.)",
                          "Cross-site tracking pixels or beacons",
                          "Browser fingerprinting or canvas fingerprinting",
                          "Persistent user identifiers or supercookies",
                          "Third-party analytics platforms (Google Analytics, Mixpanel, etc.)",
                        ]}
                        color="blue"
                      />
                    </InfoCard>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="do-not-track" index={11}>
                      Do Not Track
                    </SectionHeading>

                    <Paragraph>
                      Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT) signal. Because we do not
                      engage in cross-site tracking or serve third-party advertising, our site behaves the
                      same way regardless of whether DNT is enabled. We do not track users across websites
                      and do not respond differently to DNT signals because our default behavior already
                      aligns with the intent of DNT.
                    </Paragraph>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="state-specific" index={12}>
                      State-Specific Disclosures
                    </SectionHeading>

                    <InfoCard title="Texas Residents">
                      <Paragraph>
                        As a Texas-based business, we comply with the Texas Data Privacy and Security Act
                        (TDPSA), effective July 1, 2024. Texas residents have the right to access, correct,
                        delete, and obtain a copy of their personal data. You may also opt out of the
                        processing of personal data for targeted advertising (which we do not engage in),
                        the sale of personal data (which we do not do), and profiling that produces legal or
                        similarly significant effects (which we do not perform). To exercise your rights,
                        contact us using the information in Section 15.
                      </Paragraph>
                    </InfoCard>

                    <InfoCard title="California Residents (CCPA/CPRA)">
                      <Paragraph>
                        If you are a California resident, you have additional rights under the California
                        Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA).
                        These include the right to know what personal information we collect and how it is
                        used, the right to delete your information, and the right to opt out of the sale or
                        sharing of your information. We do not sell or share personal information as defined
                        by the CCPA/CPRA. To submit a request, contact us at{" "}
                        <a
                          href={`mailto:${COMPANY_EMAIL}`}
                          className="font-medium text-[#2563EB] underline decoration-[#2563EB]/30 underline-offset-2 transition hover:decoration-[#2563EB]"
                        >
                          {COMPANY_EMAIL}
                        </a>
                        .
                      </Paragraph>
                    </InfoCard>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="childrens-privacy" index={13}>
                      Children&apos;s Privacy
                    </SectionHeading>

                    <Paragraph>
                      Our website and services are intended for use by adults (18 years of age and older) in
                      a professional or business context. We do not knowingly collect, use, or disclose
                      personal information from individuals under the age of 18. If we become aware that we
                      have inadvertently collected information from a minor, we will take prompt steps to
                      identify and permanently delete that information from our systems.
                    </Paragraph>

                    <Paragraph>
                      If you are a parent or guardian and believe your child has submitted personal
                      information to us, please contact us immediately at{" "}
                      <a
                        href={`mailto:${COMPANY_EMAIL}`}
                        className="font-medium text-[#2563EB] underline decoration-[#2563EB]/30 underline-offset-2 transition hover:decoration-[#2563EB]"
                      >
                        {COMPANY_EMAIL}
                      </a>
                      .
                    </Paragraph>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="changes" index={14}>
                      Changes to This Policy
                    </SectionHeading>

                    <Paragraph>
                      We may update this Privacy Policy from time to time to reflect changes in our
                      practices, services, technology, legal requirements, or regulatory guidance. When we
                      make material changes, we will:
                    </Paragraph>

                    <BulletList
                      items={[
                        'Update the "Effective Date" and "Last Updated" date at the top of this page.',
                        "Post the revised policy on our website at the same URL.",
                        "For material changes that significantly affect how we handle personal data, we will make reasonable efforts to provide notice (such as a banner on our website or an email to known contacts).",
                      ]}
                    />

                    <Paragraph>
                      Your continued use of our website and services after any changes take effect
                      constitutes your acceptance of the revised policy. We encourage you to review this page
                      periodically.
                    </Paragraph>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="contact-privacy" index={15}>
                      Contact Us
                    </SectionHeading>

                    <Paragraph>
                      If you have any questions, concerns, or requests regarding this Privacy Policy or our
                      data practices, please contact us:
                    </Paragraph>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="font-semibold text-[#0A1628]">{COMPANY_NAME}</p>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>
                          Email:{" "}
                          <a
                            href={`mailto:${COMPANY_EMAIL}`}
                            className="font-medium text-[#2563EB] transition hover:underline"
                          >
                            {COMPANY_EMAIL}
                          </a>
                        </p>
                        <p>
                          Phone:{" "}
                          <a href={`tel:${COMPANY_PHONE_E164}`} className="font-medium text-[#0A1628]">
                            {COMPANY_PHONE}
                          </a>
                        </p>
                        <p>Location: {COMPANY_CITY}</p>
                      </div>
                      <p className="mt-4 text-sm text-slate-500">
                        We aim to respond to all privacy-related inquiries within 30 days.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-10">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      Related
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/terms"
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-[#0A1628]"
                      >
                        Terms of Service →
                      </Link>
                      <Link
                        href="/contact"
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-[#0A1628]"
                      >
                        Contact Us →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
      </main>
    </>
  );
}
