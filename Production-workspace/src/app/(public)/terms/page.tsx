import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageShell } from "@/components/public/PublicPageShell";
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
  title: "Terms of Service",
  description: `Terms of service for ${COMPANY_NAME}. Understand the terms governing your use of our website, quote request system, AI assistant, and cleaning services.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "June 1, 2025";
const LAST_UPDATED = "June 1, 2025";

const TOC = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "services-overview", label: "Our Services" },
  { id: "quote-requests", label: "Quote Requests & Lead Intake" },
  { id: "ai-assistant-terms", label: "AI Quote Assistant" },
  { id: "employment-applications", label: "Employment Applications" },
  { id: "user-conduct", label: "User Conduct & Prohibited Uses" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "limitation-liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "governing-law", label: "Governing Law & Disputes" },
  { id: "termination", label: "Termination" },
  { id: "modifications", label: "Modifications to Terms" },
  { id: "severability", label: "Severability & Waiver" },
  { id: "contact-terms", label: "Contact Us" },
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

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.95rem] leading-[1.8] text-slate-600">{children}</p>;
}

function Bullets({
  items,
  color = "gold",
}: {
  items: string[];
  color?: "gold" | "blue" | "red";
}) {
  const dotColor = color === "blue" ? "bg-[#2563EB]" : color === "red" ? "bg-red-500" : "bg-[#C9A94E]";
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

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-l-[3px] border-[#C9A94E] bg-[#FAFAF8] py-5 pl-6 pr-5 text-[0.95rem] leading-[1.75] text-slate-700">
      {children}
    </div>
  );
}

function Card({
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

export default function TermsOfServicePage() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/terms#page`,
    name: `Terms of Service — ${COMPANY_NAME}`,
    description: `Terms governing use of ${COMPANY_NAME}'s website and services.`,
    url: `${baseUrl}/terms`,
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
          name: "Terms of Service",
          item: `${baseUrl}/terms`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PublicPageShell>
        <main className="pb-24 md:pb-0">
          <section className="relative overflow-hidden border-b border-slate-200 bg-[#FAFAF8] pb-14 pt-32 md:pb-18 md:pt-40">
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
                  <li>
                    <Link href="/" className="transition hover:text-[#0A1628]">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-medium text-[#0A1628]">Terms of Service</li>
                </ol>
              </nav>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-8 bg-[#2563EB]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
                  Legal
                </span>
              </div>

              <h1 className="mt-4 font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl lg:text-[3.5rem]">
                Terms of Service
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
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the website,
                quote request system, AI-powered assistant, and related services (&ldquo;Services&rdquo;)
                provided by {COMPANY_NAME} (&ldquo;{COMPANY_SHORT_NAME},&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;). Please read these Terms carefully before using our
                Services.
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
                    <SectionHeading id="acceptance" index={1}>
                      Acceptance of Terms
                    </SectionHeading>
                    <P>
                      By accessing or using our website at{" "}
                      <span className="font-medium text-[#0A1628]">{baseUrl.replace("https://", "")}</span>{" "}
                      or any of our Services, you acknowledge that you have read, understood, and agree to be
                      bound by these Terms and our{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-[#2563EB] underline decoration-[#2563EB]/30 underline-offset-2 transition hover:decoration-[#2563EB]"
                      >
                        Privacy Policy
                      </Link>
                      , which is incorporated by reference.
                    </P>
                    <P>
                      If you do not agree to these Terms, you must discontinue use of the website and all
                      Services immediately. If you are using the Services on behalf of a company,
                      organization, or other entity, you represent that you have authority to bind that
                      entity to these Terms.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="services-overview" index={2}>
                      Our Services
                    </SectionHeading>
                    <P>
                      {COMPANY_NAME} provides professional cleaning services in the {COMPANY_CITY}
                      metropolitan area, including but not limited to:
                    </P>
                    <Bullets
                      items={[
                        "Post-construction cleaning (rough clean and final clean)",
                        "Final walkthrough preparation for builders and general contractors",
                        "Commercial facility cleaning and recurring maintenance",
                        "Move-in and move-out turnover cleaning for property managers",
                        "Window cleaning and exterior power washing",
                      ]}
                    />
                    <P>
                      Through this website, we also provide a quote request intake system, an AI-powered
                      conversational quote assistant, employment application intake, and related
                      informational content. These digital tools are provided to facilitate communication
                      between you and our business and do not constitute a binding service agreement on their
                      own.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="quote-requests" index={3}>
                      Quote Requests & Lead Intake
                    </SectionHeading>
                    <P>
                      Our website provides multiple channels for requesting a cleaning quote: an inline quote
                      form, a detailed scope request panel, an AI-powered chat assistant, and direct phone
                      contact. When you submit a quote request, the following terms apply:
                    </P>
                    <Card title="Quote Request Terms">
                      <Bullets
                        items={[
                          "Submitting a quote request does not create a binding contract or guarantee service. It initiates a conversation between you and our team.",
                          "We aim to respond to all quote requests within one (1) hour during regular business hours. This is a target, not a guarantee. Response times may vary based on volume, staffing, and time of submission.",
                          "Information you provide (name, phone, email, company, project details) will be used to follow up on your request. By submitting, you consent to being contacted via phone, SMS, and email regarding your inquiry.",
                          "Quotes and estimates provided by our team are based on the information available at the time of assessment and are subject to change upon site inspection or if project scope changes.",
                          "A formal service agreement, including scope of work, pricing, timeline, and terms, will be established separately before any cleaning services begin.",
                        ]}
                      />
                    </Card>
                    <Highlight>
                      <strong>No automated pricing:</strong> Our website does not provide automated quotes or
                      binding price commitments. All pricing is confirmed by a human member of our team after
                      reviewing the project scope.
                    </Highlight>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="ai-assistant-terms" index={4}>
                      AI Quote Assistant
                    </SectionHeading>
                    <P>
                      Our website includes an AI-powered conversational quote assistant designed to help you
                      structure and submit cleaning quote requests. By using this feature, you agree to the
                      following:
                    </P>
                    <Bullets
                      items={[
                        "The AI assistant is an automated tool that uses artificial intelligence to generate responses based on your input. It is not a human representative of our company.",
                        "Responses generated by the assistant are informational and conversational in nature. They do not constitute binding quotes, commitments, service agreements, pricing guarantees, or professional advice.",
                        "The assistant may occasionally produce responses that are inaccurate, incomplete, or not applicable to your specific situation. Always verify important details with our human team.",
                        "Messages you send to the assistant are processed by a third-party AI provider to generate responses. See our Privacy Policy for details on how this data is handled.",
                        "Do not share sensitive personal information (such as financial details, Social Security numbers, passwords, or government IDs) through the assistant. If you inadvertently share sensitive data, contact us and we will work to remove it.",
                        "The assistant supports English and Spanish. Translation accuracy may vary, and legal interpretation of communications defaults to the English language version.",
                        "We reserve the right to modify, suspend, or discontinue the AI assistant at any time without prior notice.",
                      ]}
                    />
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="employment-applications" index={5}>
                      Employment Applications
                    </SectionHeading>
                    <P>
                      Our website accepts employment applications for cleaning crew positions. By submitting
                      an application:
                    </P>
                    <Bullets
                      items={[
                        "You represent that all information provided is accurate and complete to the best of your knowledge. Providing false or misleading information may result in disqualification or termination.",
                        "Submitting an application does not guarantee employment, an interview, or a response. We review applications as positions become available.",
                        "Application data is retained and used as described in our Privacy Policy.",
                        "We are an equal opportunity employer and do not discriminate on the basis of race, color, religion, sex, national origin, age, disability, genetic information, veteran status, or any other protected class.",
                      ]}
                    />
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="user-conduct" index={6}>
                      User Conduct & Prohibited Uses
                    </SectionHeading>
                    <P>
                      You agree not to use our website or Services for any unlawful purpose or in any manner
                      that could damage, disable, overburden, or impair our infrastructure. The following
                      uses are expressly prohibited:
                    </P>
                    <Bullets
                      color="red"
                      items={[
                        "Submitting false, misleading, fraudulent, or spam quote requests or employment applications.",
                        "Attempting to circumvent rate limiting, security measures, access controls, or anti-spam protections.",
                        "Using automated tools (bots, scrapers, crawlers) to access or extract data from the website in a manner not authorized by our robots.txt or these Terms.",
                        "Attempting to probe, scan, or test the vulnerability of our systems, or to breach security or authentication measures without authorization.",
                        "Impersonating another person, company, or entity, or misrepresenting your affiliation with any person or entity.",
                        "Interfering with or disrupting the website, servers, or networks connected to the website.",
                        "Uploading or transmitting malicious code, viruses, or any technology designed to disrupt or damage the Services.",
                        "Using the AI assistant to generate harmful, abusive, harassing, defamatory, or illegal content.",
                        "Harvesting or collecting email addresses, phone numbers, or other personal information of other users for unsolicited communications.",
                      ]}
                    />
                    <P>
                      We reserve the right to restrict or terminate access to our website and Services for any
                      user who violates these terms, without prior notice.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="intellectual-property" index={7}>
                      Intellectual Property
                    </SectionHeading>
                    <P>
                      All content on this website — including but not limited to text, graphics, logos,
                      icons, images, photographs, video, page layout, design elements, color schemes, and
                      software code — is the property of {COMPANY_NAME} or its content suppliers and is
                      protected by United States and international copyright, trademark, and other
                      intellectual property laws.
                    </P>
                    <Card title="Permitted & Restricted Uses">
                      <Bullets
                        items={[
                          "You may view, download, and print pages from this website for your own personal, non-commercial use, provided you do not modify the content and you retain all copyright and proprietary notices.",
                          "You may not reproduce, distribute, publicly display, create derivative works from, or commercially exploit any content from this website without our prior written permission.",
                          "The A&A name, A&A Cleaning name, and all related names, logos, product and service names, designs, and slogans are trademarks of the company. You may not use these marks without our prior written permission.",
                          "All custom SVG icons, illustrations, and interactive components (including the before/after slider, service area map, and AI assistant interface) are proprietary works.",
                        ]}
                      />
                    </Card>
                    <P>
                      If you believe any content on our website infringes your intellectual property rights,
                      please contact us at{" "}
                      <a
                        href={`mailto:${COMPANY_EMAIL}`}
                        className="font-medium text-[#2563EB] underline decoration-[#2563EB]/30 underline-offset-2 transition hover:decoration-[#2563EB]"
                      >
                        {COMPANY_EMAIL}
                      </a>{" "}
                      with a detailed description of the alleged infringement.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="disclaimers" index={8}>
                      Disclaimers
                    </SectionHeading>
                    <Highlight>
                      <strong>
                        THE WEBSITE AND ALL SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND
                        &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                        IMPLIED.
                      </strong>
                    </Highlight>
                    <P>
                      To the fullest extent permitted by applicable law, we disclaim all warranties, express
                      or implied, including but not limited to:
                    </P>
                    <Bullets
                      items={[
                        "Implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
                        "Any warranty that the website will be uninterrupted, timely, secure, or error-free.",
                        "Any warranty regarding the accuracy, reliability, or completeness of any information provided through the website, AI assistant, or other Services.",
                        "Any warranty that defects will be corrected or that the website or servers are free of viruses or other harmful components.",
                      ]}
                    />
                    <P>
                      Information provided on this website, including service descriptions, response time
                      targets, project statistics, and testimonials, is intended for general informational
                      purposes. While we strive for accuracy, we do not guarantee that all information is
                      current, complete, or applicable to your specific situation.
                    </P>
                    <P>
                      The AI quote assistant generates responses using artificial intelligence and may produce
                      inaccurate or inappropriate content. We do not warrant the accuracy, completeness, or
                      suitability of AI-generated responses for any purpose.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="limitation-liability" index={9}>
                      Limitation of Liability
                    </SectionHeading>
                    <Highlight>
                      <strong>
                        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
                        {" "}
                        {COMPANY_NAME.toUpperCase()}, ITS OWNERS, DIRECTORS, EMPLOYEES, AGENTS, OR
                        AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                        EXEMPLARY, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE
                        WEBSITE OR SERVICES.
                      </strong>
                    </Highlight>
                    <P>This limitation applies to, but is not limited to:</P>
                    <Bullets
                      items={[
                        "Damages arising from your use of or inability to use the website or any Services.",
                        "Damages arising from any content, information, or responses provided by the AI assistant.",
                        "Damages arising from unauthorized access to or alteration of your data or transmissions.",
                        "Damages arising from statements or conduct of any third party on the website.",
                        "Any other matter relating to the website or Services.",
                      ]}
                    />
                    <P>
                      In jurisdictions that do not allow the exclusion or limitation of certain damages, our
                      liability shall be limited to the maximum extent permitted by law. In no event shall
                      our total cumulative liability exceed one hundred dollars ($100.00) or the amount you
                      paid us in the twelve (12) months preceding the event giving rise to the claim,
                      whichever is greater.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="indemnification" index={10}>
                      Indemnification
                    </SectionHeading>
                    <P>
                      You agree to indemnify, defend, and hold harmless {COMPANY_NAME}, its owners,
                      officers, directors, employees, agents, and affiliates from and against any and all
                      claims, damages, losses, liabilities, costs, and expenses (including reasonable
                      attorneys&apos; fees) arising out of or related to:
                    </P>
                    <Bullets
                      items={[
                        "Your use of or access to the website and Services.",
                        "Your violation of these Terms.",
                        "Your violation of any applicable law, regulation, or third-party rights.",
                        "Any content, data, or information you submit through the website, including quote requests, chat messages, and employment applications.",
                        "Any dispute between you and a third party arising from your use of the Services.",
                      ]}
                    />
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="governing-law" index={11}>
                      Governing Law & Dispute Resolution
                    </SectionHeading>
                    <P>
                      These Terms shall be governed by and construed in accordance with the laws of the
                      State of Texas, without regard to its conflict of law principles. Any legal action,
                      suit, or proceeding arising out of or related to these Terms or the Services shall be
                      instituted exclusively in the federal or state courts located in Travis County, Texas,
                      and you consent to the personal jurisdiction of such courts.
                    </P>

                    <Card title="Informal Resolution First">
                      <P>
                        Before initiating any formal legal proceeding, you agree to first contact us at{" "}
                        <a
                          href={`mailto:${COMPANY_EMAIL}`}
                          className="font-medium text-[#2563EB] underline decoration-[#2563EB]/30 underline-offset-2 transition hover:decoration-[#2563EB]"
                        >
                          {COMPANY_EMAIL}
                        </a>{" "}
                        to attempt to resolve the dispute informally. We will make good-faith efforts to
                        resolve any concern within thirty (30) days of receiving your notice. If resolution
                        cannot be reached informally, either party may proceed with formal legal remedies.
                      </P>
                    </Card>

                    <P>
                      <strong>Class action waiver:</strong> To the fullest extent permitted by law, you
                      agree that any claims or disputes will be resolved on an individual basis and that you
                      will not bring or participate in any class action, consolidated action, or
                      representative proceeding against us.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="termination" index={12}>
                      Termination
                    </SectionHeading>
                    <P>
                      We reserve the right, in our sole discretion, to restrict, suspend, or terminate your
                      access to the website and Services at any time, for any reason, without prior notice or
                      liability. Reasons for termination may include, but are not limited to:
                    </P>
                    <Bullets
                      items={[
                        "Violation of these Terms or any applicable law.",
                        "Submission of fraudulent, abusive, or spam content.",
                        "Conduct that we reasonably believe is harmful to other users, our business, or third parties.",
                        "Extended inactivity or non-responsiveness related to an active service inquiry.",
                        "Requests by law enforcement or government agencies.",
                      ]}
                    />
                    <P>
                      Upon termination, your right to use the Services will cease immediately. Sections of
                      these Terms that by their nature should survive termination (including, without
                      limitation, intellectual property provisions, disclaimers, limitation of liability, and
                      indemnification) shall survive.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="modifications" index={13}>
                      Modifications to These Terms
                    </SectionHeading>
                    <P>
                      We reserve the right to modify these Terms at any time. When we make changes, we will
                      update the &ldquo;Last Updated&rdquo; date at the top of this page and post the revised
                      Terms on our website. For material changes that significantly affect your rights or
                      obligations, we will make reasonable efforts to provide additional notice.
                    </P>
                    <P>
                      Your continued use of the website and Services following the posting of revised Terms
                      constitutes your acceptance of those changes. If you do not agree to the revised
                      Terms, you must stop using the website and Services.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="severability" index={14}>
                      Severability & Waiver
                    </SectionHeading>
                    <P>
                      If any provision of these Terms is found to be unenforceable or invalid by a court of
                      competent jurisdiction, that provision shall be modified to the minimum extent
                      necessary to make it enforceable, or if modification is not possible, it shall be
                      severed from these Terms. The remaining provisions shall continue in full force and
                      effect.
                    </P>
                    <P>
                      Our failure to enforce any right or provision of these Terms shall not constitute a
                      waiver of that right or provision. A waiver of any term shall not be deemed a further
                      or continuing waiver of such term or any other term.
                    </P>
                    <P>
                      These Terms, together with our Privacy Policy, constitute the entire agreement between
                      you and {COMPANY_NAME} regarding your use of the website and Services, and supersede
                      all prior understandings, communications, and agreements, whether written or oral.
                    </P>
                  </div>

                  <div className="space-y-6">
                    <SectionHeading id="contact-terms" index={15}>
                      Contact Us
                    </SectionHeading>
                    <P>
                      If you have questions about these Terms, please contact us using the information below.
                    </P>

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
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-10">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      Related
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/privacy"
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-[#0A1628]"
                      >
                        Privacy Policy →
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
      </PublicPageShell>
    </>
  );
}
