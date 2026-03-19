type ConversionPayload = {
  eventName: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export async function trackConversionEvent(payload: ConversionPayload) {
  try {
    const pagePath = typeof window !== "undefined" ? window.location.pathname : undefined;

    await fetch("/api/conversion-event", {
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
  } catch {
    // Non-blocking analytics
  }
}
