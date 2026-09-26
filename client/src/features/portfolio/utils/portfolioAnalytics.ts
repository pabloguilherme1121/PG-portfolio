export const conversionEventNames = [
  "quote_cta",
  "whatsapp_click",
  "briefing_started",
  "briefing_completed",
  "briefing_whatsapp_prepared",
  "project_opened",
] as const;

export type ConversionEventName = (typeof conversionEventNames)[number];

type ConversionProperties = Partial<{
  source: "hero" | "contact" | "footer";
  projectId: string;
  surface: "details";
  channel: "whatsapp";
}>;

export function trackPortfolioEvent(eventName: ConversionEventName, properties: ConversionProperties = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    eventName,
    properties,
    path: window.location.pathname,
    websiteId: import.meta.env.VITE_ANALYTICS_WEBSITE_ID,
  };

  window.dispatchEvent(new CustomEvent("portfolio:analytics", { detail: payload }));

  const umami = (window as Window & {
    umami?: { track?: (event: string, data?: Record<string, string>) => void };
  }).umami;

  if (typeof umami?.track === "function") {
    try {
      umami.track(eventName, properties);
    } catch {
      // Analytics must never interfere with the portfolio interaction.
    }
    return;
  }

  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
  if (!endpoint) return;

  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // Analytics must never interfere with the portfolio interaction.
  }
}
