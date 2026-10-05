import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((source) => source.includes('var cachePrefix = "pg-portfolio-pwa-"'))!;

function boot() {
  const listeners = new Map<string, (event: unknown) => void>();
  const deletedCaches: string[] = [];
  const unregisteredScopes: string[] = [];
  const reload = vi.fn();

  const navigator = {
    onLine: true,
    serviceWorker: {
      getRegistrations: async () => [
        {
          scope: "https://example.com/PG-portfolio/",
          unregister: async () => {
            unregisteredScopes.push("https://example.com/PG-portfolio/");
            return true;
          },
        },
        {
          scope: "https://example.com/other/",
          unregister: async () => {
            unregisteredScopes.push("https://example.com/other/");
            return true;
          },
        },
      ],
    },
  };

  const caches = {
    keys: async () => ["pg-portfolio-pwa-v9", "other-cache"],
    delete: async (key: string) => {
      deletedCaches.push(key);
      return true;
    },
  };

  const window = {
    location: {
      href: "https://example.com/PG-portfolio/",
      reload,
    },
    caches,
    addEventListener(type: string, handler: (event: unknown) => void) {
      listeners.set(type, handler);
    },
  };

  runInNewContext(script.replaceAll("%BASE_URL%", "/PG-portfolio/"), {
    window,
    navigator,
    caches,
    URL,
    Promise,
    String,
  });

  return { listeners, deletedCaches, unregisteredScopes, reload };
}

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("pre-React legacy runtime cleanup", () => {
  it("cleans only portfolio caches and unregisters only this portfolio scope", async () => {
    const runtime = boot();
    await flushPromises();

    expect(runtime.deletedCaches).toEqual(["pg-portfolio-pwa-v9"]);
    expect(runtime.unregisteredScopes).toEqual([
      "https://example.com/PG-portfolio/",
    ]);
    expect(runtime.reload).not.toHaveBeenCalled();
  });

  it("reloads at most once when a stale module failure is observed", async () => {
    const runtime = boot();
    await flushPromises();

    const errorHandler = runtime.listeners.get("error");
    expect(errorHandler).toBeTypeOf("function");

    errorHandler?.({
      target: {
        tagName: "SCRIPT",
        type: "module",
        src: "https://example.com/PG-portfolio/assets/app-old.js",
      },
      message: "Failed to load module script",
    });
    errorHandler?.({
      target: null,
      message: "ChunkLoadError: Loading chunk PortfolioContact failed",
    });
    await flushPromises();

    expect(runtime.reload).toHaveBeenCalledTimes(1);
  });

  it("ignores ordinary promise rejections and recovers stale chunk failures", async () => {
    const runtime = boot();
    await flushPromises();

    const rejectionHandler = runtime.listeners.get("unhandledrejection");
    expect(rejectionHandler).toBeTypeOf("function");

    rejectionHandler?.({ reason: new Error("Cannot read properties of undefined") });
    await flushPromises();
    expect(runtime.reload).not.toHaveBeenCalled();

    rejectionHandler?.({
      reason: new Error(
        "Failed to fetch dynamically imported module: https://example.com/PG-portfolio/assets/old.js",
      ),
    });
    await flushPromises();

    expect(runtime.reload).toHaveBeenCalledTimes(1);
  });
});
