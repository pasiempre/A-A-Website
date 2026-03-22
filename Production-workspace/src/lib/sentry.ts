import * as Sentry from "@sentry/nextjs";

export type ErrorDomain =
  | "api"
  | "integration"
  | "queue"
  | "client"
  | "auth"
  | "data"
  | "cron";

export type ErrorSeverity = "fatal" | "error" | "warning" | "info";

export type IntegrationProvider =
  | "twilio"
  | "resend"
  | "quickbooks"
  | "supabase"
  | "openai";

export interface ErrorContext {
  domain: ErrorDomain;
  operation: string;
  severity?: ErrorSeverity;
  metadata?: Record<string, unknown>;
  userId?: string;
  role?: string;
}

export function captureError(error: unknown, context: ErrorContext): string {
  const eventId = Sentry.captureException(error, (scope) => {
    scope.setTag("error.domain", context.domain);
    scope.setTag("error.operation", context.operation);
    scope.setLevel(toSentryLevel(context.severity ?? "error"));

    if (context.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context.role) {
      scope.setTag("user.role", context.role);
    }
    if (context.metadata) {
      scope.setContext("operation_metadata", context.metadata);
    }

    return scope;
  });

  return eventId;
}

export function captureWarning(
  message: string,
  context: Omit<ErrorContext, "severity">,
): void {
  Sentry.captureMessage(message, (scope) => {
    scope.setTag("error.domain", context.domain);
    scope.setTag("error.operation", context.operation);
    scope.setLevel("warning");
    if (context.metadata) {
      scope.setContext("operation_metadata", context.metadata);
    }
    return scope;
  });
}

export function captureApiError(
  error: unknown,
  route: string,
  metadata?: Record<string, unknown>,
): string {
  return captureError(error, {
    domain: "api",
    operation: `api.${route}`,
    severity: "error",
    metadata: { route, ...metadata },
  });
}

export function captureIntegrationError(
  error: unknown,
  provider: IntegrationProvider,
  operation: string,
  metadata?: Record<string, unknown>,
): string {
  return captureError(error, {
    domain: "integration",
    operation: `${provider}.${operation}`,
    severity: "error",
    metadata: { provider, ...metadata },
  });
}

export function captureQueueError(
  error: unknown,
  queueName: string,
  itemId?: string,
  metadata?: Record<string, unknown>,
): string {
  return captureError(error, {
    domain: "queue",
    operation: `queue.${queueName}`,
    severity: "error",
    metadata: { queueName, itemId, ...metadata },
  });
}

export function captureAuthError(
  error: unknown,
  action: string,
  metadata?: Record<string, unknown>,
): string {
  return captureError(error, {
    domain: "auth",
    operation: `auth.${action}`,
    severity: "warning",
    metadata,
  });
}

export function captureCronError(
  error: unknown,
  jobName: string,
  metadata?: Record<string, unknown>,
): string {
  return captureError(error, {
    domain: "cron",
    operation: `cron.${jobName}`,
    severity: "error",
    metadata: { jobName, ...metadata },
  });
}

export function captureDataError(
  error: unknown,
  table: string,
  operation: string,
  metadata?: Record<string, unknown>,
): string {
  return captureError(error, {
    domain: "data",
    operation: `data.${table}.${operation}`,
    severity: "error",
    metadata: { table, ...metadata },
  });
}

export function trackFallback(
  operation: string,
  reason: string,
  metadata?: Record<string, unknown>,
): void {
  Sentry.addBreadcrumb({
    category: "fallback",
    message: `Fallback activated: ${operation}`,
    level: "warning",
    data: { reason, ...metadata },
  });

  captureWarning(`Fallback: ${operation} — ${reason}`, {
    domain: "integration",
    operation: `fallback.${operation}`,
    metadata: { reason, ...metadata },
  });
}

export function trackRetry(
  operation: string,
  attempt: number,
  maxAttempts: number,
  metadata?: Record<string, unknown>,
): void {
  Sentry.addBreadcrumb({
    category: "retry",
    message: `Retry ${attempt}/${maxAttempts}: ${operation}`,
    level: "info",
    data: { attempt, maxAttempts, ...metadata },
  });
}

export function trackDeadLetter(
  operation: string,
  itemId: string,
  reason: string,
  metadata?: Record<string, unknown>,
): void {
  captureError(new Error(`Dead letter: ${operation} [${itemId}]`), {
    domain: "queue",
    operation: `dead_letter.${operation}`,
    severity: "error",
    metadata: { itemId, reason, ...metadata },
  });
}

export function setObservabilityUser(user: {
  id: string;
  role?: string;
  email?: string;
}): void {
  Sentry.setUser({ id: user.id, email: user.email });
  if (user.role) {
    Sentry.setTag("user.role", user.role);
  }
}

export function clearObservabilityUser(): void {
  Sentry.setUser(null);
}

export async function withSpan<T>(
  name: string,
  op: string,
  fn: () => Promise<T>,
): Promise<T> {
  return Sentry.startSpan({ name, op }, () => fn());
}

function toSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
  const map: Record<ErrorSeverity, Sentry.SeverityLevel> = {
    fatal: "fatal",
    error: "error",
    warning: "warning",
    info: "info",
  };
  return map[severity];
}
