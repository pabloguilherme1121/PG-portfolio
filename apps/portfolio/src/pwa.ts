const PWA_RETIRE_VERSION = "v10";
const CACHE_PREFIX = "pg-portfolio-pwa-";

async function clearPortfolioCaches() {
  if (typeof caches === "undefined") return;
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX))
        .map((key) => caches.delete(key)),
    );
  } catch (error) {
    console.warn("[PWA] Cache cleanup failed while retiring legacy runtime", error);
  }
}

async function unregisterPortfolioWorkers(baseUrl: string) {
  if (!("serviceWorker" in navigator)) return;
  const expectedScope = new URL(baseUrl, window.location.href).href;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter((registration) => registration.scope === expectedScope)
        .map(async (registration) => {
          try {
            registration.active?.postMessage({ type: "PG_RETIRE_RUNTIME", version: PWA_RETIRE_VERSION });
          } catch {
            // The worker may already be stopping.
          }
          await registration.unregister();
        }),
    );
  } catch (error) {
    console.warn("[PWA] Service worker cleanup failed", error);
  }
}

export function registerPortfolioPwa() {
  if (!import.meta.env.PROD || typeof window === "undefined") return;

  const baseUrl = import.meta.env.BASE_URL;
  void Promise.all([
    unregisterPortfolioWorkers(baseUrl),
    clearPortfolioCaches(),
  ]);
}
