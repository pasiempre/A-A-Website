import { type NextRequest, NextResponse } from "next/server";

import { isDevPreviewEnabled } from "@/lib/env";
import { evaluateAuth } from "@/lib/middleware/auth";
import { type RequestLog, logRequest } from "@/lib/middleware/logging";
import { applySecurityHeaders } from "@/lib/middleware/security-headers";
import {
  rateLimitByPath,
  rateLimitResponse,
  setRateLimitHeaders,
} from "@/lib/rate-limit";

// ============================================================
// Helpers
// ============================================================

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";
}

function buildLogEntry(
  overrides: Partial<RequestLog> & {
    method: string;
    pathname: string;
    ip: string;
    userAgent: string | null;
    startTime: number;
  },
): RequestLog {
  return {
    timestamp: new Date().toISOString(),
    userId: null,
    role: null,
    statusCode: 200,
    rateLimited: false,
    authFailure: false,
    durationMs: Date.now() - overrides.startTime,
    ...overrides,
  };
}

// ============================================================
// Middleware
// ============================================================

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");
  const shared = { method: request.method, pathname, ip, userAgent, startTime };

  // 1. Dev preview bypass
  if (isDevPreviewEnabled()) {
    const response = NextResponse.next({ request });
    applySecurityHeaders(response);
    return response;
  }

  // 2. Rate limiting
  const rateCheck = await rateLimitByPath(ip, pathname);
  if (!rateCheck.allowed) {
    const response = rateLimitResponse(rateCheck);
    applySecurityHeaders(response);
    logRequest(buildLogEntry({ ...shared, statusCode: 429, rateLimited: true }));
    return response;
  }

  // 3. Auth evaluation
  const response = NextResponse.next({ request });
  const { context, redirect } = await evaluateAuth(request, response);

  if (redirect) {
    setRateLimitHeaders(redirect.headers, rateCheck);
    applySecurityHeaders(redirect);
    logRequest(
      buildLogEntry({
        ...shared,
        userId: context.userId,
        role: context.role,
        statusCode: 302,
        authFailure: context.authFailure,
        authFailureReason: context.authFailureReason,
      }),
    );
    return redirect;
  }

  // 4. Success path
  setRateLimitHeaders(response.headers, rateCheck);
  applySecurityHeaders(response);
  logRequest(
    buildLogEntry({
      ...shared,
      userId: context.userId,
      role: context.role,
    }),
  );

  return response;
}

// ============================================================
// Route matcher
// ============================================================

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
};
