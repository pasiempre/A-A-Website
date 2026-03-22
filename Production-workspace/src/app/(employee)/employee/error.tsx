"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/sentry";

export default function EmployeeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, {
      domain: "client",
      operation: "employee_error_boundary",
      severity: "error",
      metadata: {
        digest: error.digest,
        message: error.message,
        surface: "employee",
      },
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="text-5xl" aria-hidden="true">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900">
          Algo salió mal
        </h2>
        <p className="text-gray-600">
          Hubo un error. Por favor, intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Intentar de nuevo
        </button>
        <p className="text-xs text-gray-400">
          Something went wrong. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-300 font-mono">
            Ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
