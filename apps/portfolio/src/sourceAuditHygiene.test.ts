import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("source escape audit coverage", () => {
  it("includes both API server and API client source trees", () => {
    const script = readFileSync(join(process.cwd(), "scripts/check-source-escapes.mjs"), "utf8");

    expect(script).toContain('"apps/api/src"');
    expect(script).toContain('"apps/api/client"');
  });

  it("keeps executable API client code inside both lint gates", () => {
    const packageJson = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const apiWorkflow = readFileSync(join(process.cwd(), ".github/workflows/api.yml"), "utf8");

    expect(packageJson).toContain("apps/api/client");
    expect(apiWorkflow).toContain("apps/api/client");
  });
});
