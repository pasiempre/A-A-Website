"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/sentry";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, {
      domain: "client",
      operation: "global_error_boundary",
      severity: "error",
      metadata: {
        digest: error.digest,
        message: error.message,
      },
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl" aria-hidden="true">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="text-gray-600">
          We&apos;ve been notified and are looking into it. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <p className="text-sm text-gray-400">
          If this keeps happening, contact support.
          {error.digest && (
            <span className="block mt-1 font-mono text-xs">
              Ref: {error.digest}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
