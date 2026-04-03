"use client";

import { CTAButton } from "./CTAButton";

type QuoteCTAProps = {
  ctaId?: string; // Optional for now to avoid breaking but recommended
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Legacy wrapper for QuoteCTA. Now delegates to CTAButton.
 * F-25: CTA Taxonomy + Instrumentation
 */
export function QuoteCTA({ ctaId = "unidentified_quote_trigger", children, className, style }: QuoteCTAProps) {
  return (
    <CTAButton
      ctaId={ctaId}
      actionType="quote"
      className={className}
      style={style}
    >
      {children}
    </CTAButton>
  );
}
