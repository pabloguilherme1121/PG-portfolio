import { defineConfig, devices } from "@playwright/test";

const servePagesBundle = process.env.E2E_SERVE_PAGES === "true";
const e2ePort = Number(process.env.E2E_PORT ?? 4173);
const e2eOrigin = `http://127.0.0.1:${e2ePort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? (servePagesBundle ? e2eOrigin : "http://127.0.0.1:3000"),
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  webServer: servePagesBundle
    ? {
        command: "node scripts/serve-pages-e2e.mjs",
        url: `${e2eOrigin}/PG-portfolio/`,
        reuseExistingServer: false,
        timeout: 30_000,
      }
    : undefined,
});
