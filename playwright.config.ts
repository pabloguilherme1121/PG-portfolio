import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],
  webServer: {
    command: "node scripts/run-workspace.mjs dev-server --host 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
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
    // Run the #255/#256 contracts in every browser at both mobile widths.
    // Firefox supports narrow viewports, but not mobile device emulation.
    ...(["chromium", "firefox", "webkit"] as const).flatMap(browserName =>
      [320, 390].map(width => ({
        name: `mobile-actions-${browserName}-${width}`,
        use: {
          browserName,
          viewport: { width, height: 844 },
          ...(browserName !== "firefox" ? { isMobile: true, hasTouch: true } : {}),
        },
        testMatch: /navigation\.(mobile\.(shell|foundation)|briefing|projects)\.spec\.ts/,
        grep: /dock em 320\/390px|dock mobile reduz detalhes|dock oculto pelo CTA|mobile esconde o dock|menu mobile não esconde estado|menu mobile move o foco|menu mobile mantém o foco|menu mobile expõe semântica modal|mobile adapta atalhos|mantém briefing e vitrine|briefing mantém apenas|abre projeto em destaque/,
      })),
    ),
  ],
});
