type ConversionPayload = {
  eventName: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export async function trackConversionEvent(payload: ConversionPayload) {
  try {
    const pagePath = typeof window !== "undefined" ? window.location.pathname : undefined;

    const response = await fetch("/api/conversion-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: payload.eventName,
        source: payload.source,
        metadata: {
          pagePath,
          ...(payload.metadata ?? {}),
        },
      }),
      keepalive: true,
    });

    if (!response.ok && process.env.NODE_ENV === "development") {
      console.warn(
        `[analytics] Failed to track "${payload.eventName}": ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[analytics] Error tracking "${payload.eventName}":`, error);
    }
  }
}
