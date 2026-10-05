import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((source) => source.includes('var rescueVersion = "v10"'))!;

type RescueRuntime = {
  version: string;
  mode: string;
  rescue: (reason: string) => Promise<boolean>;
};

function boot(href = "https://example.com/PG-portfolio/") {
  const listeners = new Map<string, (event: unknown) => void>();
  const deletedCaches: string[] = [];
  const unregisteredScopes: string[] = [];
  const navigations: string[] = [];
  let fallbackVisible = false;

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
      href,
      replace(url: string) {
        navigations.push(url);
      },
    },
    caches,
    addEventListener(type: string, handler: (event: unknown) => void) {
      listeners.set(type, handler);
    },
    __pgRuntimeRescue: undefined as RescueRuntime | undefined,
  };

  const document = {
    getElementById(id: string) {
      if (id !== "portfolio-startup-fallback") return null;
      return {
        get hidden() {
          return !fallbackVisible;
        },
        set hidden(value: boolean) {
          fallbackVisible = !value;
        },
      };
    },
  };

  runInNewContext(script.replaceAll("%BASE_URL%", "/PG-portfolio/"), {
    window,
    navigator,
    caches,
    document,
    URL,
    Promise,
    String,
  });

  return {
    listeners,
    deletedCaches,
    unregisteredScopes,
    navigations,
    runtime: window.__pgRuntimeRescue!,
    isFallbackVisible: () => fallbackVisible,
  };
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
    expect(runtime.navigations).toEqual([]);
    expect(runtime.runtime).toMatchObject({
      version: "v10",
      mode: "network-only",
    });
  });

  it("performs one recovery navigation and then exposes the fallback", async () => {
    const first = boot();
    await flushPromises();

    expect(await first.runtime.rescue("window-error")).toBe(true);
    expect(first.navigations).toHaveLength(1);
    expect(new URL(first.navigations[0]).searchParams.get("pg_boot_rescue")).toBe(
      "v10-window-error",
    );

    const second = boot(first.navigations[0]);
    await flushPromises();

    expect(await second.runtime.rescue("window-error")).toBe(false);
    expect(second.navigations).toEqual([]);
    expect(second.isFallbackVisible()).toBe(true);
  });

  it("ignores ordinary promise rejections and recovers stale chunk failures", async () => {
    const runtime = boot();
    await flushPromises();

    const rejectionHandler = runtime.listeners.get("unhandledrejection");
    expect(rejectionHandler).toBeTypeOf("function");

    rejectionHandler?.({ reason: new Error("Cannot read properties of undefined") });
    await flushPromises();
    expect(runtime.navigations).toEqual([]);

    rejectionHandler?.({
      reason: new Error(
        "Failed to fetch dynamically imported module: https://example.com/PG-portfolio/assets/old.js",
      ),
    });
    await flushPromises();

    expect(runtime.navigations).toHaveLength(1);
  });
});
