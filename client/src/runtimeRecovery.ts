import { getSafeStorage, readStorage, removeStorage, writeStorage } from "@/lib/safeStorage";

const PWA_CACHE_PREFIX = "pg-portfolio-pwa-";
export const CURRENT_PWA_CACHE = "pg-portfolio-pwa-v10-retired";
const RUNTIME_MIGRATION_REVISION = "runtime-hardening-v10";
const RUNTIME_MIGRATION_KEY = "pg-portfolio-runtime-migration";
const RUNTIME_MIGRATION_PARAM = "pg_runtime";
const RUNTIME_RECOVERY_PARAM = "pg_recover";
const LEGACY_SW_TAKEOVER_PARAM = "pg_sw_takeover";
const RETIRED_SW_PARAM = "pg_sw_retired";
const RECOVERY_MARKER_KEY = "pg-portfolio-runtime-recovery-at";
const RECOVERY_COOLDOWN_MS = 45_000;

const staleBundlePatterns = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /failed to load module script/i,
  /chunkloaderror/i,
  /loading chunk [\w-]+ failed/i,
  /unable to preload css/i,
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.name + ": " + error.message;
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

export function buildFreshRuntimeUrl(currentHref: string, reason: string, now = Date.now()) {
  const url = new URL(currentHref);
  url.searchParams.set(
    RUNTIME_RECOVERY_PARAM,
    `${RUNTIME_MIGRATION_REVISION}-${reason}-${now.toString(36)}`,
  );
  return url.toString();
}

function sanitizeJsonArray(storage: Storage | null, key: string) {
  const raw = readStorage(storage, key);
  if (!raw) return;
  try {
    const value = JSON.parse(raw);
    const normalized = Array.isArray(value)
      ? Array.from(new Set(value.filter((item): item is string => typeof item === "string")))
      : [];
    writeStorage(storage, key, JSON.stringify(normalized));
  } catch {
    writeStorage(storage, key, "[]");
  }
}

function sanitizeJsonRecord(storage: Storage | null, key: string) {
  const raw = readStorage(storage, key);
  if (!raw) return;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      removeStorage(storage, key);
    }
  } catch {
    removeStorage(storage, key);
  }
}

export function sanitizePortfolioStorage() {
  const local = getSafeStorage("local");
  const session = getSafeStorage("session");

  sanitizeJsonArray(local, "pablo-portfolio-favorites");
  sanitizeJsonRecord(local, "pablo-portfolio-briefing-draft");
  sanitizeJsonRecord(local, "pablo-pg-arcade-stats");

  const fontScaleRaw = readStorage(local, "pablo-portfolio-font-scale");
  if (fontScaleRaw !== null) {
    const fontScale = Number(fontScaleRaw);
    if (!Number.isFinite(fontScale) || fontScale < 0.92 || fontScale > 1.16) {
      removeStorage(local, "pablo-portfolio-font-scale");
    }
  }

  for (const key of ["theme-preference", "theme"]) {
    const value = readStorage(local, key);
    if (value && value !== "light" && value !== "dark" && value !== "system") {
      removeStorage(local, key);
    }
  }

  const route = readStorage(session, "pablo-portfolio-experience-route");
  if (route && route !== "client" && route !== "recruiter" && route !== "explorer") {
    removeStorage(session, "pablo-portfolio-experience-route");
  }
}

async function getPortfolioCacheNames() {
  if (typeof caches === "undefined") return [] as string[];
  try {
    return (await caches.keys()).filter((name) => name.startsWith(PWA_CACHE_PREFIX));
  } catch {
    return [] as string[];
  }
}

export async function resetPortfolioRuntime(baseUrl: string) {
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

  const cacheNames = await getPortfolioCacheNames();
  if (cacheNames.length > 0) {
    try {
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    } catch (error) {
      console.warn("[PWA] Cache cleanup failed during runtime recovery", error);
    }
  }
}

export async function preparePortfolioRuntime(baseUrl: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  sanitizePortfolioStorage();

  const migrationUrl = new URL(window.location.href);
  const migrationFromUrl = migrationUrl.searchParams.get(RUNTIME_MIGRATION_PARAM);
  const recoveryFromUrl = migrationUrl.searchParams.get(RUNTIME_RECOVERY_PARAM);
  const legacyTakeoverFromUrl = migrationUrl.searchParams.get(LEGACY_SW_TAKEOVER_PARAM);
  const retiredWorkerFromUrl = migrationUrl.searchParams.get(RETIRED_SW_PARAM);
  const local = getSafeStorage("local");

  if (recoveryFromUrl || legacyTakeoverFromUrl || retiredWorkerFromUrl) {
    migrationUrl.searchParams.delete(RUNTIME_RECOVERY_PARAM);
    migrationUrl.searchParams.delete(LEGACY_SW_TAKEOVER_PARAM);
    migrationUrl.searchParams.delete(RETIRED_SW_PARAM);
    window.history.replaceState(window.history.state, "", migrationUrl.toString());
  }

  if (migrationFromUrl === RUNTIME_MIGRATION_REVISION) {
    migrationUrl.searchParams.delete(RUNTIME_MIGRATION_PARAM);
    window.history.replaceState(window.history.state, "", migrationUrl.toString());
    writeStorage(local, RUNTIME_MIGRATION_KEY, RUNTIME_MIGRATION_REVISION);
    return false;
  }

  const storedRevision = readStorage(local, RUNTIME_MIGRATION_KEY);
  const cacheNames = await getPortfolioCacheNames();
  const hasLegacyCache = cacheNames.length > 0;
  const hasController = "serviceWorker" in navigator && Boolean(navigator.serviceWorker.controller);
  const needsMigration = hasLegacyCache || (storedRevision !== RUNTIME_MIGRATION_REVISION && hasController);

  if (!needsMigration) {
    writeStorage(local, RUNTIME_MIGRATION_KEY, RUNTIME_MIGRATION_REVISION);
    return false;
  }

  writeStorage(local, RUNTIME_MIGRATION_KEY, RUNTIME_MIGRATION_REVISION);
  await resetPortfolioRuntime(baseUrl);

  if (hasController) {
    migrationUrl.searchParams.set(RUNTIME_MIGRATION_PARAM, RUNTIME_MIGRATION_REVISION);
    window.location.replace(migrationUrl.toString());
    return true;
  }

  return false;
}

function reserveAutomaticRecovery(now = Date.now()): boolean {
  const session = getSafeStorage("session");
  const previous = Number(readStorage(session, RECOVERY_MARKER_KEY) ?? 0);
  if (Number.isFinite(previous) && previous > 0 && now - previous < RECOVERY_COOLDOWN_MS) {
    return false;
  }
  writeStorage(session, RECOVERY_MARKER_KEY, String(now));
  return true;
}

async function navigateWithFreshRuntime(baseUrl: string, reason: string) {
  sanitizePortfolioStorage();

  if (navigator.onLine === false) {
    window.location.reload();
    return;
  }

  await resetPortfolioRuntime(baseUrl);
  window.location.replace(buildFreshRuntimeUrl(window.location.href, reason));
}

export async function attemptAutomaticRuntimeRecovery(
  error: unknown,
  baseUrl: string,
): Promise<boolean> {
  if (typeof window === "undefined" || navigator.onLine === false || !reserveAutomaticRecovery()) {
    return false;
  }

  console.warn("[Portfolio] Recovering from runtime failure", getErrorMessage(error));
  await navigateWithFreshRuntime(baseUrl, isStaleBundleError(error) ? "stale-bundle" : "render-error");
  return true;
}

export function installVitePreloadRecovery(baseUrl: string): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handlePreloadError = (event: Event) => {
    if (navigator.onLine === false || !reserveAutomaticRecovery()) return;
    event.preventDefault();
    void navigateWithFreshRuntime(baseUrl, "preload-error").catch((error) => {
      console.warn("[Portfolio] Automatic preload recovery failed", error);
    });
  };

  window.addEventListener("vite:preloadError", handlePreloadError);
  return () => window.removeEventListener("vite:preloadError", handlePreloadError);
}

export async function recoverFromRuntimeError(_error: unknown, baseUrl: string): Promise<void> {
  await navigateWithFreshRuntime(baseUrl, "manual");
}
