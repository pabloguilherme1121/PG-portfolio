import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "apps", "portfolio", "src"),
      "@shared": path.resolve(templateRoot, "packages", "contracts"),
    },
  },
  test: {
    environment: "node",
    include: [
      "apps/api/**/*.test.ts",
      "apps/api/**/*.spec.ts",
      "apps/portfolio/**/*.test.ts",
      "apps/portfolio/**/*.spec.ts",
      "packages/**/*.test.ts",
    ],
  },
});
