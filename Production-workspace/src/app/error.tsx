"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF8] px-6 text-center">
      <p className="section-kicker mb-4">Something Went Wrong</p>
      <h1 className="font-serif text-5xl tracking-tight text-[#0A1628] md:text-6xl">Unexpected Error</h1>
      <p className="mt-6 max-w-md text-lg font-light text-slate-600">
        We hit an unexpected issue loading this page. Please try again.
      </p>
      <button type="button" onClick={() => reset()} className="cta-primary mt-10">
        Try Again
      </button>
    </main>
  );
}
