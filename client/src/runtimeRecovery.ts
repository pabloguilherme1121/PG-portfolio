const PWA_CACHE_PREFIX = "pg-portfolio-pwa-";
const RECOVERY_MARKER_KEY = "pg-portfolio-runtime-recovery-at";
const RECOVERY_COOLDOWN_MS = 45_000;

const staleBundlePatterns = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /failed to load module script/i,
  /chunkloaderror/i,
  /loading chunk [\\w-]+ failed/i,
  /unable to preload css/i,
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}

export function isStaleBundleError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return staleBundlePatterns.some((pattern) => pattern.test(message));
}

function reserveAutomaticRecovery(now = Date.now()): boolean {
  try {
    const previous = Number(window.sessionStorage.getItem(RECOVERY_MARKER_KEY) ?? 0);
    if (Number.isFinite(previous) && previous > 0 && now - previous < RECOVERY_COOLDOWN_MS) {
      return false;
    }
    window.sessionStorage.setItem(RECOVERY_MARKER_KEY, String(now));
    return true;
  } catch {
    return true;
  }
}

async function resetPortfolioRuntime(baseUrl: string) {
  const expectedScope = new URL(baseUrl, window.location.href).href;

  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter((registration) => registration.scope === expectedScope)
          .map((registration) => registration.unregister()),
      );
    } catch (error) {
      console.warn("[PWA] Service worker cleanup failed during runtime recovery", error);
    }
  }

  if (typeof caches !== "undefined") {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(PWA_CACHE_PREFIX))
          .map((cacheName) => caches.delete(cacheName)),
      );
    } catch (error) {
      console.warn("[PWA] Cache cleanup failed during runtime recovery", error);
    }
  }
}

async function reloadWithFreshRuntime(baseUrl: string) {
  if (navigator.onLine !== false) {
    await resetPortfolioRuntime(baseUrl);
  }
  window.location.reload();
}

export function installVitePreloadRecovery(baseUrl: string): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handlePreloadError = (event: Event) => {
    if (navigator.onLine === false || !reserveAutomaticRecovery()) return;
    event.preventDefault();
    void reloadWithFreshRuntime(baseUrl);
  };

  window.addEventListener("vite:preloadError", handlePreloadError);
  return () => window.removeEventListener("vite:preloadError", handlePreloadError);
}

export async function recoverFromRuntimeError(error: unknown, baseUrl: string): Promise<void> {
  if (isStaleBundleError(error) && navigator.onLine !== false) {
    await resetPortfolioRuntime(baseUrl);
  }
  window.location.reload();
}
