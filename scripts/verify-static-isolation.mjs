import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";

const fromPortfolio = createRequire(path.resolve("apps/portfolio/package.json"));
for (const dependency of ["@trpc/server", "@trpc/client", "@trpc/react-query", "@tanstack/react-query", "express", "drizzle-orm", "mysql2", "superjson"]) {
  assert.throws(() => fromPortfolio.resolve(dependency), { code: "MODULE_NOT_FOUND" }, `${dependency} leaked into the isolated portfolio`);
}
assert.equal(existsSync("apps/api/node_modules"), false, "API packages were installed in the isolated workspace");
console.log("Static installation is isolated from API dependencies.");
