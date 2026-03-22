/**
 * Structured request logging for middleware.
 *
 * Logging policy:
 *   - Auth failures and rate-limited requests: console.warn (always)
 *   - API route requests: console.info
 *   - Public page requests: silent (no log)
 */

export type RequestLog = {
  timestamp: string;
  method: string;
  pathname: string;
  ip: string;
  userAgent: string | null;
  userId: string | null;
  role: string | null;
  statusCode: number;
  durationMs: number;
  rateLimited: boolean;
  authFailure: boolean;
  authFailureReason?: string;
};

export function logRequest(entry: RequestLog): void {
  if (entry.authFailure || entry.rateLimited) {
    console.warn("[middleware]", JSON.stringify(entry));
  } else if (entry.pathname.startsWith("/api")) {
    console.info("[middleware]", JSON.stringify(entry));
  }
}
