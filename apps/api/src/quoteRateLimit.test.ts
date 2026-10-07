import { describe, expect, it } from "vitest";
import { FixedWindowRateLimiter } from "./quoteRateLimit";

describe("FixedWindowRateLimiter", () => {
  it.each([NaN, Infinity, -Infinity, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    "rejects an invalid identifier capacity: %s",
    (capacity) => {
      expect(() => new FixedWindowRateLimiter(1_000, 2, capacity)).toThrow(RangeError);
    },
  );

  it("preserves existing fixed windows when the configured capacity is full", () => {
    const limiter = new FixedWindowRateLimiter(1_000, 2, 1);

    expect(limiter.consume("client-a", 0)).toBe(true);
    expect(limiter.consume("client-b", 100)).toBe(false);
    expect(limiter.consume("client-a", 200)).toBe(true);
    expect(limiter.consume("client-a", 999)).toBe(false);
    expect(limiter.consume("client-a", 1_000)).toBe(true);
    expect(limiter.consume("client-b", 1_001)).toBe(false);
    expect(limiter.size).toBe(1);
    expect(limiter.consume("client-b", 2_000)).toBe(true);
    expect(limiter.size).toBe(1);
  });

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

  it("caps active identifier buckets even before the window expires", () => {
    const limiter = new FixedWindowRateLimiter(60_000, 2);

    for (let index = 0; index < 2_048; index += 1) {
      expect(limiter.consume(`client-${index}`, index)).toBe(true);
    }

    expect(limiter.consume("overflow-client", 2_049)).toBe(false);
    expect(limiter.size).toBe(2_048);
  });


  it("reclaims expired buckets when capacity is full before the next scheduled prune", () => {
    const limiter = new FixedWindowRateLimiter(1_000, 2, 2);

    expect(limiter.consume("client-a", 0)).toBe(true);
    expect(limiter.consume("client-b", 900)).toBe(true);
    expect(limiter.consume("client-c", 1_000)).toBe(true);
    expect(limiter.size).toBe(2);

    expect(limiter.consume("client-d", 1_900)).toBe(true);
    expect(limiter.size).toBe(2);
  });

});
