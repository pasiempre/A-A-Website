/**
 * Centralized environment variable validation and access.
 *
 * Tiers:
 *   PUBLIC  — Required on client + server (NEXT_PUBLIC_*). Validated eagerly.
 *   SERVER  — Required on server only. Validated on demand via requireServerEnv().
 *   OPTIONAL — Documented defaults, returns null when absent.
 *
 * Startup validation:
 *   Call validateServerEnvironment() once in a server entry point
 *   (e.g. instrumentation.ts or a top-level API layout) to surface
 *   all missing variables at boot instead of at first request.
 */

// ============================================================
// Public environment (safe for client + server)
// ============================================================

export function getPublicEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const missing: string[] = [];
  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    throw new Error(
      `Missing required public environment variables: ${missing.join(", ")}`,
    );
  }

  return {
    supabaseUrl: supabaseUrl as string,
    supabaseAnonKey: supabaseAnonKey as string,
    appUrl,
  };
}

// ============================================================
// Server-only required variables
// ============================================================

const SERVER_REQUIRED_KEYS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_FROM_NUMBER",
  "CRON_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const;

type ServerRequiredKey = (typeof SERVER_REQUIRED_KEYS)[number];

/**
 * Returns the value of a required server environment variable.
 * Throws immediately if the variable is missing.
 */
export function requireServerEnv(key: ServerRequiredKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required server environment variable: ${key}. ` +
        `Check .env.local and deployment configuration.`,
    );
  }
  return value;
}

// ============================================================
// Optional variables (returns null when absent)
// ============================================================

export function optionalServerEnv(key: string): string | null {
  return process.env[key] || null;
}

// ============================================================
// Dev preview mode
// ============================================================

/**
 * Returns true only in non-production when explicitly enabled.
 * Used by middleware to bypass auth guards during local development.
 */
export function isDevPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_DEV_PREVIEW_MODE === "true"
  );
}

// ============================================================
// Startup validation
// ============================================================

export function validateServerEnvironment(): {
  valid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of SERVER_REQUIRED_KEYS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  const recommended = ["ADMIN_ALERT_PHONE", "ANTHROPIC_API_KEY"];
  for (const key of recommended) {
    if (!process.env[key]) {
      warnings.push(`${key} is not configured (optional but recommended)`);
    }
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    if (process.env.NODE_ENV === "production") {
      warnings.push(
        "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN missing: distributed rate limiting disabled in production",
      );
    } else {
      warnings.push(
        "Upstash Redis not configured: rate limiting will run in degraded allow-all mode",
      );
    }
  }

  if (
    process.env.NEXT_PUBLIC_DEV_PREVIEW_MODE === "true" &&
    process.env.NODE_ENV === "production"
  ) {
    warnings.push(
      "CRITICAL: NEXT_PUBLIC_DEV_PREVIEW_MODE is 'true' in production — auth guards are bypassed!",
    );
  }

  if (missing.length > 0) {
    console.error(
      `[env] Missing required server variables: ${missing.join(", ")}`,
    );
  }
  if (warnings.length > 0) {
    console.warn(`[env] Warnings:\n  - ${warnings.join("\n  - ")}`);
  }

  return { valid: missing.length === 0, missing, warnings };
}
