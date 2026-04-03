"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PublicChrome } from "@/components/public/PublicChrome";
import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { COMPANY_PHONE_E164 } from "@/lib/company";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✅
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
            { icon: "📞", step: "Step 1", text: "We'll call you within 1 hour" },
            { icon: "📋", step: "Step 2", text: "We'll send a detailed quote" },
            { icon: "✅", step: "Step 3", text: "Accept online with one click" },
            { icon: "🧹", step: "Step 4", text: "We clean. You relax." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4 text-left">
              <span className="text-2xl">{item.icon}</span>
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
              📸 See Our Work
            </CTAButton>
            <CTAButton ctaId="confirmation_read_reviews" href="/#testimonials" className="cta-outline-dark min-h-[44px]">
              ⭐ Read Reviews
            </CTAButton>
            <CTAButton ctaId="confirmation_call_now" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[44px]">
              📞 Call Now
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
