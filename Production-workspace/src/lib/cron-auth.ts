/**
 * Fail-closed authorization for cron / internal API routes.
 *
 * If CRON_SECRET is not configured, ALL requests are rejected.
 * This prevents accidental exposure of internal endpoints in
 * deployments where the secret was forgotten.
 */
export function authorizeCronRequest(request: Request): {
  authorized: boolean;
  error?: string;
} {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error(
      "[cron-auth] CRON_SECRET is not configured. " +
        "All internal endpoints are locked until it is set.",
    );
    return {
      authorized: false,
      error: "Internal endpoint not configured. Contact administrator.",
    };
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return { authorized: false, error: "Unauthorized." };
  }

  return { authorized: true };
}
