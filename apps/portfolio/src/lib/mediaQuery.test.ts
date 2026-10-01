import { describe, expect, it, vi } from "vitest";
import { subscribeToMediaQuery } from "./mediaQuery";

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
