import { getSafeStorage, readStorage, writeStorage } from "@/lib/safeStorage";

// Compatibility seam for clients installed before the network-only v10 release.
// Keep the worker aliases until a migration window has been verified in production.
export const RUNTIME_MIGRATION_REVISION = "runtime-hardening-v10";
const MIGRATION_KEY = "pg-portfolio-runtime-migration";
const MIGRATION_PARAM = "pg_runtime";
const CACHE_PREFIX = "pg-portfolio-pwa-";

interface PrebootRecovery {
  migration?: Promise<boolean>;
  dispose?: () => void;
}

function prebootRecovery(): PrebootRecovery | undefined {
  return (window as Window & { __pgRuntimeRescue?: PrebootRecovery }).__pgRuntimeRescue;
}

export function handOffPrebootRecovery() {
  if (typeof window !== "undefined") prebootRecovery()?.dispose?.();
}

async function portfolioCacheNames() {
  if (typeof caches === "undefined") return [] as string[];
  try {
    return (await caches.keys()).filter((name) => name.startsWith(CACHE_PREFIX));
  } catch {
    return [] as string[];
  }
}

export async function resetPortfolioRuntime(baseUrl: string) {
  const expectedScope = new URL(baseUrl, window.location.href).href;
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations
        .filter((registration) => registration.scope === expectedScope)
        .map(async (registration) => {
          try {
            registration.active?.postMessage({ type: "PG_RETIRE_RUNTIME", version: "v10" });
          } catch {
            // A worker can stop between enumeration and cleanup.
          }
          await registration.unregister();
        }));
    } catch (error) {
      console.warn("[PWA] Service worker cleanup failed during runtime recovery", error);
    }
  }
  const cacheNames = await portfolioCacheNames();
  try {
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  } catch (error) {
    console.warn("[PWA] Cache cleanup failed during runtime recovery", error);
  }
}

export async function prepareLegacyRuntimeMigration(baseUrl: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // The unbundled shell can repair a client even when today's modules cannot load.
  // Reuse its startup task rather than racing another cleanup/navigation against it.
  const migration = prebootRecovery()?.migration;
  if (migration && await migration) return true;

  const url = new URL(window.location.href);
  const migrated = url.searchParams.get(MIGRATION_PARAM) === RUNTIME_MIGRATION_REVISION;
  for (const param of ["pg_recover", "pg_sw_takeover", "pg_sw_retired", "pg_boot_rescue", MIGRATION_PARAM]) {
    url.searchParams.delete(param);
  }
  window.history.replaceState(window.history.state, "", url.toString());

  const local = getSafeStorage("local");
  if (migration || migrated) {
    writeStorage(local, MIGRATION_KEY, RUNTIME_MIGRATION_REVISION);
    return false;
  }

  const storedRevision = readStorage(local, MIGRATION_KEY);
  const hasController = "serviceWorker" in navigator && Boolean(navigator.serviceWorker.controller);
  if (storedRevision === RUNTIME_MIGRATION_REVISION && !hasController) return false;

  const cacheNames = await portfolioCacheNames();
  if (cacheNames.length || hasController) await resetPortfolioRuntime(baseUrl);
  writeStorage(local, MIGRATION_KEY, RUNTIME_MIGRATION_REVISION);

  if (hasController && storedRevision !== RUNTIME_MIGRATION_REVISION && navigator.onLine !== false) {
    url.searchParams.set(MIGRATION_PARAM, RUNTIME_MIGRATION_REVISION);
    window.location.replace(url.toString());
    return true;
  }
  return false;
}
