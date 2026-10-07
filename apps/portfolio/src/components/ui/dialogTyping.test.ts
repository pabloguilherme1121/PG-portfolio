import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("dialog typing hygiene", () => {
  it("uses the native KeyboardEvent composition flag without any casts", () => {
    const source = readFileSync(
      join(process.cwd(), "apps/portfolio/src/components/ui/dialog.tsx"),
      "utf8",
    );

    expect(source).not.toContain("as any");
    expect(source).toContain("e.isComposing");
  });
});
