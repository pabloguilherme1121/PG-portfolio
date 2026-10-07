import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("source escape audit coverage", () => {
  it("includes API server, client, and Drizzle source trees", () => {
    const script = readFileSync(join(process.cwd(), "scripts/check-source-escapes.mjs"), "utf8");

    expect(script).toContain('"apps/api/src"');
    expect(script).toContain('"apps/api/client"');
    expect(script).toContain('"apps/api/drizzle"');
  });

  it("keeps one canonical lint command for the optional API", () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
    };
    const apiWorkflow = readFileSync(join(process.cwd(), ".github/workflows/api.yml"), "utf8");
    const apiLint = packageJson.scripts?.["lint:api"] ?? "";

    expect(apiLint).toContain("apps/api/src");
    expect(apiLint).toContain("apps/api/client");
    expect(apiLint).toContain("apps/api/drizzle");
    expect(apiLint).toContain("packages/contracts");
    expect(apiLint).toContain("drizzle.config.ts");
    expect(packageJson.scripts?.lint).toContain("pnpm lint:api");
    expect(apiWorkflow).toContain("run: pnpm lint:api");
    expect(apiWorkflow).not.toContain("pnpm dlx oxlint@");
  });
});
