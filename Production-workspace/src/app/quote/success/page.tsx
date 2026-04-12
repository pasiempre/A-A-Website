"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { PublicChrome } from "@/components/public/PublicChrome";
import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { COMPANY_PHONE_E164 } from "@/lib/company";
import { trackConversionEvent } from "@/lib/analytics";

const PAID_ATTR_KEYS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "ttclid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type IconProps = {
  className?: string;
};

function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.25 12.25l2.25 2.25 5.25-5.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M6.8 3.75h2.15a1.5 1.5 0 0 1 1.45 1.13l.56 2.22a1.5 1.5 0 0 1-.43 1.45l-1.2 1.14a13.5 13.5 0 0 0 5 5l1.14-1.2a1.5 1.5 0 0 1 1.45-.43l2.22.56a1.5 1.5 0 0 1 1.13 1.45v2.15a1.5 1.5 0 0 1-1.68 1.49A16.5 16.5 0 0 1 5.3 5.43 1.5 1.5 0 0 1 6.8 3.75Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function ClipboardIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <rect x="6.5" y="4.5" width="11" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 4.5h6v2H9z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BroomIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M14 4.5l5.5 5.5-1.6 1.6-5.5-5.5L14 4.5Zm-7.5 9 6.2-6.2 4 4-6.2 6.2H6.5v-4Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function CameraIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M4.5 8.5h3l1.2-2h6.6l1.2 2h3a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17v-7a1.5 1.5 0 0 1 1.5-1.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function StarIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M12 4.8l2.3 4.65 5.1.74-3.7 3.6.87 5.08L12 16.5l-4.57 2.37.87-5.08-3.7-3.6 5.1-.74L12 4.8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;

    const paidAttribution = Object.fromEntries(
      PAID_ATTR_KEYS
        .map((key) => [key, searchParams.get(key)])
        .filter(([, value]) => Boolean(value)),
    );
    const utmAttribution = Object.fromEntries(
      UTM_KEYS
        .map((key) => [key, searchParams.get(key)])
        .filter(([, value]) => Boolean(value)),
    );
    const hasPaidIdentifier = Object.keys(paidAttribution).length > 0;

    void trackConversionEvent({
      eventName: "quote_confirmation_viewed",
      source: "quote_success_page",
      metadata: {
        has_paid_identifier: hasPaidIdentifier,
        ...utmAttribution,
        ...paidAttribution,
      },
    });

    if (hasPaidIdentifier) {
      void trackConversionEvent({
        eventName: "paid_channel_conversion",
        source: "quote_success_page",
        metadata: {
          ...utmAttribution,
          ...paidAttribution,
        },
      });
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
        </div>
        
        <h1 className="font-serif text-4xl text-[#0A1628] md:text-5xl">
          Thank you, {name}!
        </h1>
        
        <p className="mt-6 text-lg leading-relaxed text-slate-600 md:text-xl">
          We&apos;ve received your request and our team is reviewing the scope right now.
        </p>

        {/* F-17: Step Process */}
        <div className="mt-12 space-y-4">
          {[
            { Icon: PhoneIcon, step: "Step 1", text: "We'll call you within 1 hour" },
            { Icon: ClipboardIcon, step: "Step 2", text: "We'll send a detailed quote" },
            { Icon: CheckCircleIcon, step: "Step 3", text: "Accept online with one click" },
            { Icon: BroomIcon, step: "Step 4", text: "We clean. You relax." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4 text-left">
              <item.Icon className="mt-0.5 h-6 w-6 shrink-0 text-slate-700" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.step}</p>
                <p className="mt-1 font-medium text-slate-900">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* F-17: While You Wait */}
        <div className="mt-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">While you wait</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CTAButton ctaId="confirmation_see_work" href="/#services" className="cta-outline-dark min-h-[44px]">
              <span className="inline-flex items-center justify-center gap-2">
                <CameraIcon className="h-4 w-4" />
                <span>See Our Work</span>
              </span>
            </CTAButton>
            <CTAButton ctaId="confirmation_read_reviews" href="/#testimonial-section" className="cta-outline-dark min-h-[44px]">
              <span className="inline-flex items-center justify-center gap-2">
                <StarIcon className="h-4 w-4" />
                <span>Read Reviews</span>
              </span>
            </CTAButton>
            <CTAButton ctaId="confirmation_call_now" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[44px]">
              <span className="inline-flex items-center justify-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>Call Now</span>
              </span>
            </CTAButton>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#0A1628] px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1E293B]"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function QuoteSuccessPage() {
  return (
    <PublicChrome>
      <Suspense fallback={<div className="min-h-screen" />}>
        <SuccessContent />
      </Suspense>
    </PublicChrome>
  );
}
