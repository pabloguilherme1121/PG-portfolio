import { getSafeStorage, readStorage, removeStorage, writeStorage } from "@/lib/safeStorage";

import { prepareLegacyRuntimeMigration, resetPortfolioRuntime, RUNTIME_MIGRATION_REVISION } from "./legacyRuntimeMigration";

const RUNTIME_RECOVERY_PARAM = "pg_recover";
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

export async function preparePortfolioRuntime(baseUrl: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  sanitizePortfolioStorage();
  return prepareLegacyRuntimeMigration(baseUrl);
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
