"use client";

import Link from "next/link";
import { trackConversionEvent } from "@/lib/analytics";
import { useQuoteAction } from "./QuoteContext";

type CTAButtonProps = {
  ctaId: string;
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  actionType?: "quote" | "link" | "call" | "custom";
  style?: React.CSSProperties;
};

/**
 * MOBILE-HARDENING: Shared CTA component with built-in tracking and touch targets.
 * F-25: CTA Taxonomy + Instrumentation
 */
export function CTAButton({
  ctaId,
  children,
  className = "",
  href,
  onClick,
  actionType = "link",
  style,
}: CTAButtonProps) {
  const openQuote = useQuoteAction();

  const handleClick = (e: React.MouseEvent) => {
    // 1. Fire analytics event
    void trackConversionEvent({
      eventName: "cta_click",
      metadata: {
        cta_id: ctaId,
        action_type: actionType,
        href: href || undefined,
      },
    });

    // 2. Perform action
    if (actionType === "quote") {
      e.preventDefault();
      openQuote();
    }

    // 3. Call custom onClick if provided
    if (onClick) {
      onClick();
    }
  };

  const commonClasses = `
    inline-flex items-center justify-center 
    transition-all duration-300 
    active:scale-[0.98] 
    min-h-[44px] md:min-h-[48px]
    whitespace-nowrap
    ${className}
  `.trim();

  // If it's a quote trigger (and no href), use button
  if (actionType === "quote" && !href) {
    return (
      <button type="button" onClick={handleClick} className={commonClasses} style={style}>
        {children}
      </button>
    );
  }

  // If it's a link or call, use Link or a
  if (href) {
    // External or special protocols (tel:, mailto:)
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a href={href} onClick={handleClick} className={commonClasses} style={style}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} onClick={handleClick} className={commonClasses} style={style}>
        {children}
      </Link>
    );
  }

  // Default to button
  return (
    <button type="button" onClick={handleClick} className={commonClasses} style={style}>
      {children}
    </button>
  );
}
