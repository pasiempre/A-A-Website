"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/sentry";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, {
      domain: "client",
      operation: "admin_error_boundary",
      severity: "error",
      metadata: {
        digest: error.digest,
        message: error.message,
        surface: "admin",
      },
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl" aria-hidden="true">🔧</div>
        <h2 className="text-xl font-bold text-gray-900">
          Admin Module Error
        </h2>
        <p className="text-gray-600">
          Something went wrong in this module. Your other admin tools are
          unaffected.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Module
          </button>
          <a
            href="/admin"
            className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-400 font-mono">
            Ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
