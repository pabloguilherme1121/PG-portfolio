import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("source escape audit coverage", () => {
  it("includes both API server and API client source trees", () => {
    const script = readFileSync(join(process.cwd(), "scripts/check-source-escapes.mjs"), "utf8");

    expect(script).toContain('"apps/api/src"');
    expect(script).toContain('"apps/api/client"');
    expect(script).toContain('"apps/api/drizzle"');
  });

  it("lints API runtime, client, and Drizzle sources", () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
    };
    const apiWorkflow = readFileSync(join(process.cwd(), ".github/workflows/api.yml"), "utf8");

    expect(packageJson.scripts?.lint).toContain("apps/api/src");
    expect(packageJson.scripts?.lint).toContain("apps/api/client");
    expect(packageJson.scripts?.lint).toContain("apps/api/drizzle");
    expect(packageJson.scripts?.lint).toContain("drizzle.config.ts");
    expect(apiWorkflow).toContain("apps/api/src");
    expect(apiWorkflow).toContain("apps/api/client");
    expect(apiWorkflow).toContain("apps/api/drizzle");
    expect(apiWorkflow).toContain("packages/contracts");
    expect(apiWorkflow).toContain("drizzle.config.ts");
  });
});
