type RateLimitBucket = {
  startedAt: number;
  count: number;
};

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private nextPruneAt = 0;

  constructor(
    private readonly windowMs: number,
    private readonly maxRequests: number,
  ) {}

  private pruneExpired(now: number) {
    if (now < this.nextPruneAt) return;

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
