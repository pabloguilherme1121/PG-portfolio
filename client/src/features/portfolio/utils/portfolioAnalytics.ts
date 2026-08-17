export function trackPortfolioEvent(eventName: string, properties: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const payload = { eventName, properties, url: window.location.href, websiteId: import.meta.env.VITE_ANALYTICS_WEBSITE_ID };
  window.dispatchEvent(new CustomEvent("portfolio:analytics", { detail: payload }));
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
  if (!endpoint) return;
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => undefined);
    }
  } catch {
    // Analytics must never interfere with the portfolio interaction.
  }
}
