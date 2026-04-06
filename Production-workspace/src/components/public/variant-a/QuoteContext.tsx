"use client";

import { createContext, useContext } from "react";

export type QuoteOpenContext = {
  serviceType?: string;
  sourceCta?: string;
};

type QuoteContextValue = {
  openQuote: (context?: QuoteOpenContext) => void;
};

export const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuoteAction() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuoteAction must be used within a QuoteContext provider");
  }

  return context.openQuote;
}
