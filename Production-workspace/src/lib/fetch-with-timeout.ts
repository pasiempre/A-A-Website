/**
 * Fetch wrapper with timeout and automatic abort.
 *
 * Prevents external service calls (Resend, Anthropic, QuickBooks)
 * from hanging indefinitely. Default timeout: 10 seconds.
 *
 * Usage:
 *   const response = await fetchWithTimeout("https://api.resend.com/emails", {
 *     method: "POST",
 *     headers: { ... },
 *     body: JSON.stringify({ ... }),
 *     timeoutMs: 8_000,
 *   });
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 10_000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `Request to ${new URL(url).hostname} timed out after ${timeoutMs}ms`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
