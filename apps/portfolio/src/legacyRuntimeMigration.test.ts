import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { handOffPrebootRecovery, prepareLegacyRuntimeMigration, resetPortfolioRuntime } from "./legacyRuntimeMigration";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const preboot = html.match(/<script>\s*(\(function \(\) \{[\s\S]*?)<\/script>/)?.[1];
if (!preboot) throw new Error("The preboot compatibility shell is missing");

function storage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { values.set(key, value); }),
    removeItem: vi.fn((key: string) => { values.delete(key); }),
  };
}

function browser({ migrated = false, controlled = false, priorRescue = false, blockedStorage = false } = {}) {
  const listeners = new Map<string, (event?: unknown) => void>();
  const observers: { disconnect: ReturnType<typeof vi.fn> }[] = [];
  const local = storage(migrated ? { "pg-portfolio-runtime-migration": "runtime-hardening-v10" } : {});
  const session = storage();
  if (blockedStorage) {
    for (const target of [local, session]) {
      target.getItem.mockImplementation(() => { throw new Error("Storage blocked"); });
      target.setItem.mockImplementation(() => { throw new Error("Storage blocked"); });
    }
  }
  const portfolioWorker = {
    scope: "https://example.com/PG-portfolio/",
    active: { postMessage: vi.fn() },
    unregister: vi.fn(async () => true),
  };
  const otherWorker = {
    scope: "https://example.com/another-app/",
    active: { postMessage: vi.fn() },
    unregister: vi.fn(async () => true),
  };
  const navigator = {
    onLine: true,
    serviceWorker: {
      controller: controlled ? { scriptURL: "https://example.com/PG-portfolio/sw.js" } : null,
      getRegistrations: vi.fn(async () => [portfolioWorker, otherWorker]),
    },
  };
  const caches = {
    keys: vi.fn(async () => ["pg-portfolio-pwa-v8", "another-app-cache"]),
    delete: vi.fn(async () => true),
  };
  const location = {
    href: `https://example.com/PG-portfolio/?projeto=observatorio${priorRescue ? "&pg_boot_rescue=v10-old" : ""}#projetos`,
    replace: vi.fn(),
  };
  const window = {
    location, caches,
    localStorage: local, sessionStorage: session,
    history: {
      state: null,
      replaceState: vi.fn((_state, _unused, href: string) => { location.href = href; }),
    },
    addEventListener: vi.fn((name: string, handler: (event?: unknown) => void) => { listeners.set(name, handler); }),
    removeEventListener: vi.fn((name: string) => { listeners.delete(name); }),
    setTimeout: vi.fn(() => 1), clearTimeout: vi.fn(),
    __pgRuntimeRescue: undefined as undefined | { migration: Promise<boolean>; dispose(): void; rescue(reason: string): Promise<boolean> },
  };
  class Observer {
    observe = vi.fn();
    disconnect = vi.fn();
    constructor() { observers.push(this); }
  }
  const document = { getElementById: () => ({ textContent: "Healthy page" }) };
  runInNewContext(preboot!.replace("%BASE_URL%", "/PG-portfolio/"), {
    window, navigator, caches, localStorage: local, sessionStorage: session,
    document, MutationObserver: Observer, URL, Date,
  });
  vi.stubGlobal("window", window);
  vi.stubGlobal("navigator", navigator);
  vi.stubGlobal("caches", caches);
  return { window, navigator, caches, local, portfolioWorker, otherWorker, listeners, observers };
}

afterEach(() => { vi.unstubAllGlobals(); });

describe("legacy runtime migration", () => {
  it("cleans and reloads an old controlled client once, sharing preboot work with the module", async () => {
    const app = browser({ controlled: true });
    expect(await prepareLegacyRuntimeMigration("/PG-portfolio/")).toBe(true);
    expect(app.caches.keys).toHaveBeenCalledTimes(1);
    expect(app.navigator.serviceWorker.getRegistrations).toHaveBeenCalledTimes(1);
    expect(app.caches.delete).toHaveBeenCalledExactlyOnceWith("pg-portfolio-pwa-v8");
    expect(app.portfolioWorker.unregister).toHaveBeenCalledTimes(1);
    expect(app.otherWorker.unregister).not.toHaveBeenCalled();
    const next = new URL(app.window.location.replace.mock.calls[0][0]);
    expect(next.searchParams.get("projeto")).toBe("observatorio");
    expect(next.searchParams.get("pg_boot_rescue")).toContain("controlled-client");
    expect(next.hash).toBe("#projetos");
  });

  it("does no retirement work for an already migrated network client", async () => {
    const app = browser({ migrated: true });
    expect(await prepareLegacyRuntimeMigration("/PG-portfolio/")).toBe(false);
    expect(app.caches.keys).not.toHaveBeenCalled();
    expect(app.navigator.serviceWorker.getRegistrations).not.toHaveBeenCalled();
    expect(app.window.location.replace).not.toHaveBeenCalled();
  });

  it("removes preboot error handlers and observer when the module takes over", async () => {
    const app = browser({ migrated: true });
    await prepareLegacyRuntimeMigration("/PG-portfolio/");
    app.listeners.get("DOMContentLoaded")?.();
    handOffPrebootRecovery();
    expect(app.listeners.size).toBe(0);
    expect(app.observers[0].disconnect).toHaveBeenCalledTimes(1);
    expect(app.window.clearTimeout).toHaveBeenCalledWith(1);
  });

  it("does not loop after a rescue even if browser storage is blocked", async () => {
    const app = browser({ controlled: true, priorRescue: true, blockedStorage: true });
    await prepareLegacyRuntimeMigration("/PG-portfolio/");
    expect(await app.window.__pgRuntimeRescue!.rescue("window-error")).toBe(false);
    expect(app.window.location.replace).not.toHaveBeenCalled();
    expect(new URL(app.window.location.href).searchParams.get("pg_boot_rescue")).toBeNull();
  });

  it("keeps the explicit stale-chunk cleanup scoped to this portfolio", async () => {
    const app = browser({ migrated: true });
    await resetPortfolioRuntime("/PG-portfolio/");
    expect(app.portfolioWorker.active.postMessage).toHaveBeenCalledWith({ type: "PG_RETIRE_RUNTIME", version: "v10" });
    expect(app.portfolioWorker.unregister).toHaveBeenCalledTimes(1);
    expect(app.otherWorker.unregister).not.toHaveBeenCalled();
    expect(app.caches.delete).toHaveBeenCalledExactlyOnceWith("pg-portfolio-pwa-v8");
  });
});
