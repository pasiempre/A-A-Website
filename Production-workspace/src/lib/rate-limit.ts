import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export type RateLimitTier = "strict" | "auth" | "api" | "relaxed";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  tier: RateLimitTier;
}

type RateLimitWindow = `${number} ${"s" | "m" | "h" | "d"}`;

const TIER_CONFIG: Record<
  RateLimitTier,
  { requests: number; window: RateLimitWindow }
> = {
  strict: { requests: 5, window: "1 h" },
  auth: { requests: 10, window: "15 m" },
  api: { requests: 60, window: "1 m" },
  relaxed: { requests: 200, window: "1 m" },
};

const PATH_RULES: Array<{ match: (path: string) => boolean; tier: RateLimitTier }> = [
  { match: (p) => p === "/api/quote-request", tier: "strict" },
  { match: (p) => p === "/api/ai-assistant", tier: "strict" },
  { match: (p) => p === "/api/employment-application", tier: "strict" },
  { match: (p) => p === "/api/lead-capture", tier: "strict" },
  { match: (p) => p.startsWith("/api/auth") || p.startsWith("/auth"), tier: "auth" },
  { match: (p) => p.startsWith("/api/"), tier: "api" },
];

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

const limiters = new Map<RateLimitTier, Ratelimit>();

function getLimiter(tier: RateLimitTier): Ratelimit | null {
  const client = getRedis();
  if (!client) return null;

  if (!limiters.has(tier)) {
    const config = TIER_CONFIG[tier];
    limiters.set(
      tier,
      new Ratelimit({
        redis: client,
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
        prefix: `rl:${tier}`,
        analytics: true,
      }),
    );
  }

  return limiters.get(tier)!;
}

const ALLOW_RESULT: RateLimitResult = {
  allowed: true,
  limit: 0,
  remaining: 0,
  reset: 0,
  tier: "relaxed",
};

let degradedWarningEmitted = false;

function allowDegraded(tier: RateLimitTier, reason: string): RateLimitResult {
  if (!degradedWarningEmitted) {
    console.warn(`[rate-limit] Degraded mode: ${reason}. All requests allowed.`);
    degradedWarningEmitted = true;

    import("@/lib/sentry")
      .then(({ trackFallback }) => {
        trackFallback("rate_limit", reason, { tier });
      })
      .catch(() => {
      });
  }

  return { ...ALLOW_RESULT, tier };
}

export async function rateLimit(
  identifier: string,
  tier: RateLimitTier = "api",
): Promise<RateLimitResult> {
  const limiter = getLimiter(tier);

  if (!limiter) {
    return allowDegraded(tier, "Upstash Redis not configured");
  }

  try {
    const result = await limiter.limit(identifier);

    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      tier,
    };
  } catch (error) {
    return allowDegraded(
      tier,
      `Redis error: ${error instanceof Error ? error.message : "unknown"}`,
    );
  }
}

export async function rateLimitByPath(
  identifier: string,
  pathname: string,
): Promise<RateLimitResult> {
  const tier = resolveTier(pathname);
  return rateLimit(`${identifier}:${tier}`, tier);
}

export async function checkRateLimit(
  identifier: string,
  options: { maxRequests?: number; max?: number; windowMs?: number } | string,
): Promise<{ allowed: boolean; remaining: number }> {
  if (typeof options === "string") {
    const tier = mapPolicyNameToTier(options);
    const result = await rateLimit(identifier, tier);
    return { allowed: result.allowed, remaining: result.remaining };
  }

  const configuredMax = options.maxRequests ?? options.max ?? 60;
  const tier = mapOptionsToBestTier(configuredMax);
  const result = await rateLimit(identifier, tier);
  return { allowed: result.allowed, remaining: result.remaining };
}

export function setRateLimitHeaders(headers: Headers, result: RateLimitResult): void {
  headers.set("X-RateLimit-Limit", String(result.limit));
  headers.set("X-RateLimit-Remaining", String(result.remaining));
  headers.set("X-RateLimit-Reset", String(result.reset));
  headers.set("X-RateLimit-Tier", result.tier);
}

export function rateLimitResponse(result: RateLimitResult): Response {
  const retryAfter = result.reset > Date.now()
    ? Math.ceil((result.reset - Date.now()) / 1000)
    : 1;

  const headers = new Headers({
    "Content-Type": "application/json",
    "Retry-After": String(retryAfter),
  });

  setRateLimitHeaders(headers, result);

  return new Response(
    JSON.stringify({
      error: "Too many requests",
      retryAfter,
    }),
    { status: 429, headers },
  );
}

function resolveTier(pathname: string): RateLimitTier {
  for (const rule of PATH_RULES) {
    if (rule.match(pathname)) return rule.tier;
  }
  return "relaxed";
}

function mapOptionsToBestTier(maxRequests: number): RateLimitTier {
  if (maxRequests <= 5) return "strict";
  if (maxRequests <= 10) return "auth";
  if (maxRequests <= 60) return "api";
  return "relaxed";
}

function mapPolicyNameToTier(policyName: string): RateLimitTier {
  if (
    policyName.includes("quote") ||
    policyName.includes("lead") ||
    policyName.includes("employment") ||
    policyName.includes("assistant")
  ) {
    return "strict";
  }

  if (policyName.includes("auth")) {
    return "auth";
  }

  return "api";
}
