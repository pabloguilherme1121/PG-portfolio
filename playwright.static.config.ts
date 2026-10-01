import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.E2E_STATIC_BASE_URL ??
  "http://127.0.0.1:4173/PG-portfolio/";

export default defineConfig({
  testDir: "./e2e-static",
  fullyParallel: true,
  reporter: [["list"]],
  webServer: {
    command:
      "VITE_DEPLOY_TARGET=github-pages VITE_STATIC_DEPLOY=true pnpm exec vite preview --host 127.0.0.1 --port 4173",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "static-desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "static-mobile-chromium",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "static-mobile-webkit",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
