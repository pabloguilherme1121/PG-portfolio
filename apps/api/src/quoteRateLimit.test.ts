import { describe, expect, it } from "vitest";
import { FixedWindowRateLimiter } from "./quoteRateLimit";

describe("FixedWindowRateLimiter", () => {
  it("blocks requests after the configured limit and resets at the window boundary", () => {
    const limiter = new FixedWindowRateLimiter(1_000, 2);

    expect(limiter.consume("client", 0)).toBe(true);
    expect(limiter.consume("client", 100)).toBe(true);
    expect(limiter.consume("client", 200)).toBe(false);
    expect(limiter.consume("client", 1_000)).toBe(true);
  });

  it("prunes expired identifiers instead of retaining them indefinitely", () => {
    const limiter = new FixedWindowRateLimiter(1_000, 2);

    expect(limiter.consume("stale-a", 0)).toBe(true);
    expect(limiter.consume("stale-b", 0)).toBe(true);
    expect(limiter.size).toBe(2);

    expect(limiter.consume("fresh", 1_000)).toBe(true);
    expect(limiter.size).toBe(1);
  });
});
