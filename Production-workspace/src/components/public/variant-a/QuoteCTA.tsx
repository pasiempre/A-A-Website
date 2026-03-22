"use client";

import { useQuoteAction } from "./QuoteContext";

type QuoteCTAProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function QuoteCTA({ children, className, style }: QuoteCTAProps) {
  const openQuote = useQuoteAction();

  return (
    <button type="button" onClick={openQuote} className={className} style={style}>
      {children}
    </button>
  );
}
