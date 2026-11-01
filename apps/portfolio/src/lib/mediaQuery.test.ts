import { afterEach, describe, expect, it, vi } from "vitest";
import { getSafeMediaQuery, subscribeToMediaQuery } from "./mediaQuery";

describe("getSafeMediaQuery", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("does not throw when the browser has no matchMedia", () => {
    vi.stubGlobal("window", {});
    expect(getSafeMediaQuery("(max-width: 639px)")).toBeNull();
  });

  it("returns the actual MediaQueryList when supported", () => {
    const query = { matches: true } as MediaQueryList;
    const matchMedia = vi.fn(() => query);
    vi.stubGlobal("window", { matchMedia });
    expect(getSafeMediaQuery("(prefers-reduced-motion: reduce)")).toBe(query);
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });
});

describe("subscribeToMediaQuery", () => {
  it("uses the modern change event when available", () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const mediaQuery = {
      addEventListener,
      removeEventListener,
    } as unknown as MediaQueryList;
    const listener = vi.fn();

    const unsubscribe = subscribeToMediaQuery(mediaQuery, listener);

    expect(addEventListener).toHaveBeenCalledWith("change", listener);
    unsubscribe();
    expect(removeEventListener).toHaveBeenCalledWith("change", listener);
  });

  it("falls back to legacy addListener/removeListener for older WebKit", () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    const mediaQuery = {
      addListener,
      removeListener,
    } as unknown as MediaQueryList;
    const listener = vi.fn();

    const unsubscribe = subscribeToMediaQuery(mediaQuery, listener);

    expect(addListener).toHaveBeenCalledWith(listener);
    unsubscribe();
    expect(removeListener).toHaveBeenCalledWith(listener);
  });
});
