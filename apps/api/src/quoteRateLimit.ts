type RateLimitBucket = {
  startedAt: number;
  count: number;
};

export const DEFAULT_RATE_LIMIT_BUCKET_CAP = 2_048;

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private nextPruneAt = 0;

  constructor(
    private readonly windowMs: number,
    private readonly maxRequests: number,
    private readonly maxIdentifiers = DEFAULT_RATE_LIMIT_BUCKET_CAP,
  ) {
    if (!Number.isSafeInteger(maxIdentifiers) || maxIdentifiers <= 0) {
      throw new RangeError("maxIdentifiers must be a positive safe integer");
    }
  }

  private pruneExpired(now: number, force = false) {
    if (!force && now < this.nextPruneAt) return;

    for (const [identifier, bucket] of this.buckets) {
      if (now - bucket.startedAt >= this.windowMs) {
        this.buckets.delete(identifier);
      }
    }
    this.nextPruneAt = now + this.windowMs;
  }

  consume(identifier: string, now = Date.now()) {
    this.pruneExpired(now);
    const current = this.buckets.get(identifier);
    if (!current || now - current.startedAt >= this.windowMs) {
      if (!current && this.buckets.size >= this.maxIdentifiers) {
        this.pruneExpired(now, true);
        if (this.buckets.size >= this.maxIdentifiers) {
          return false;
        }
      }
      this.buckets.set(identifier, { startedAt: now, count: 1 });
      return true;
    }

    if (current.count >= this.maxRequests) return false;
    current.count += 1;
    return true;
  }

  get size() {
    return this.buckets.size;
  }
}
