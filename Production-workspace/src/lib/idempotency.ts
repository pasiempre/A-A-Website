import { NextResponse } from "next/server";

type CacheEntry = {
  expiresAt: number;
  status: number;
  body: unknown;
};

const TTL_MS = 60_000;
const store = new Map<string, CacheEntry>();

function prune(): void {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.expiresAt <= now) {
      store.delete(key);
    }
  }
}

export function idempotencyKey(...parts: Array<string | number | null | undefined>): string {
  return parts
    .map((part) => (part === null || part === undefined ? "" : String(part).trim()))
    .join("|");
}

export function guardIdempotency(key: string): {
  isDuplicate: boolean;
  replay: NextResponse;
}
export function guardIdempotency(
  key: string,
  options: { ttlMs?: number },
): {
  isDuplicate: boolean;
  replay: NextResponse;
}
export function guardIdempotency(
  key: string,
  options?: { ttlMs?: number },
): {
  isDuplicate: boolean;
  replay: NextResponse;
} {
  prune();

  const hit = store.get(key);
  if (!hit) {
    if (options?.ttlMs && options.ttlMs > 0) {
      store.set(key, {
        status: 202,
        body: {
          success: true,
          message: "Idempotency placeholder",
        },
        expiresAt: Date.now() + options.ttlMs,
      });
    }
    return {
      isDuplicate: false,
      replay: NextResponse.json({}, { status: 204 }),
    };
  }

  const replay = NextResponse.json(hit.body, { status: hit.status });
  replay.headers.set("X-Idempotency", "replay");
  return {
    isDuplicate: true,
    replay,
  };
}

export function commitIdempotency(
  key: string,
  status: number,
  body: unknown,
  ttlMs: number = TTL_MS,
): void {
  store.set(key, {
    status,
    body,
    expiresAt: Date.now() + ttlMs,
  });
}



  