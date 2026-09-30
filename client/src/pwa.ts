const PWA_RUNTIME_VERSION = "v9";
const PWA_RUNTIME_SCRIPT = "sw.js";

export function registerPortfolioPwa() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  const baseUrl = import.meta.env.BASE_URL;
  void navigator.serviceWorker
    .register(`${baseUrl}${PWA_RUNTIME_SCRIPT}?runtime=${PWA_RUNTIME_VERSION}`, {
      scope: baseUrl,
      updateViaCache: "none",
    })
    .then(async (registration) => {
      await registration.update();
      registration.active?.postMessage({ type: "PG_FORCE_RUNTIME_REFRESH" });
    })
    .catch((error) => {
      console.warn("[PWA] Service worker registration failed", error);
    });
}
