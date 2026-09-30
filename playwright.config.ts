import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],
  webServer: {
    command: "pnpm exec vite --host 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      E2E_FORCE_RESUME_AVAILABLE: "true",
    },
  },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /mobile-smoke\.spec\.ts/,
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] },
      testMatch: /mobile-smoke\.spec\.ts/,
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 13"] },
      testMatch: /mobile-smoke\.spec\.ts/,
    },
    {
      name: "firefox-smoke",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /browser-smoke\.spec\.ts/,
    },
    {
      name: "webkit-smoke",
      use: { ...devices["Desktop Safari"] },
      testMatch: /browser-smoke\.spec\.ts/,
    },
  ],
});
