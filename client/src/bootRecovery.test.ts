import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((source) => source.includes("var rescueVersion"))!;

function boot(href: string, storageBlocked = false, values = new Map<string, string>()) {
  const navigations: string[] = [];
  const window = {
    location: { href, replace: (url: string) => navigations.push(url) },
    history: { state: null, replaceState() {} },
    addEventListener() {},
    sessionStorage: {
      getItem(key: string) {
        if (storageBlocked) throw new Error("Storage denied");
        return values.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        if (storageBlocked) throw new Error("Storage denied");
        values.set(key, value);
      },
    },
    __pgRuntimeRescue: undefined as undefined | { rescue: (reason: string) => Promise<boolean> },
  };
  runInNewContext(script.replaceAll("%BASE_URL%", "/PG-portfolio/"), {
    window, navigator: { onLine: true }, document: { getElementById: () => null }, URL, Promise, Date,
  });
  return { navigations, rescue: window.__pgRuntimeRescue!.rescue };
}

describe("pre-React recovery", () => {
  it.each([false, true])("stops repeating a failed recovery, storage blocked: %s", async (blocked) => {
    const first = boot("https://example.com/PG-portfolio/?projeto=demo#projetos", blocked);
    expect(await first.rescue("window-error")).toBe(true);
    expect(first.navigations).toHaveLength(1);
    const second = boot(first.navigations[0], blocked);
    expect(await second.rescue("window-error")).toBe(false);
    expect(second.navigations).toEqual([]);
  });

  it("shares the cooldown across reloads without recovery parameters", async () => {
    const values = new Map<string, string>();
    const href = "https://example.com/PG-portfolio/";
    expect(await boot(href, false, values).rescue("window-error")).toBe(true);
    expect(await boot(href, false, values).rescue("window-error")).toBe(false);
  });
});

