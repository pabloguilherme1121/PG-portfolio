import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("source escape audit coverage", () => {
  it("includes both API server and API client source trees", () => {
    const script = readFileSync(join(process.cwd(), "scripts/check-source-escapes.mjs"), "utf8");

    expect(script).toContain('"apps/api/src"');
    expect(script).toContain('"apps/api/client"');
  });
});
