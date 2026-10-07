import { afterEach, describe, expect, it, vi } from "vitest";

async function loadEnv(overrides: Record<string, string>) {
  vi.resetModules();
  for (const key of [
    "NOTIFICATION_SERVICE_URL",
    "NOTIFICATION_SERVICE_API_KEY",
    "BUILT_IN_FORGE_API_URL",
    "BUILT_IN_FORGE_API_KEY",
  ]) {
    delete process.env[key];
  }
  Object.assign(process.env, overrides);
  return (await import("./_core/env")).ENV;
}

afterEach(() => {
  for (const key of [
    "NOTIFICATION_SERVICE_URL",
    "NOTIFICATION_SERVICE_API_KEY",
    "BUILT_IN_FORGE_API_URL",
    "BUILT_IN_FORGE_API_KEY",
  ]) {
    delete process.env[key];
  }
  vi.resetModules();
});

describe("notification environment migration", () => {
  it("falls back to legacy notification variables when neutral variables are empty", async () => {
    const env = await loadEnv({
      NOTIFICATION_SERVICE_URL: "",
      NOTIFICATION_SERVICE_API_KEY: "",
      BUILT_IN_FORGE_API_URL: "https://legacy.example.test",
      BUILT_IN_FORGE_API_KEY: "legacy-key",
    });

    expect(env.notificationServiceUrl).toBe("https://legacy.example.test");
    expect(env.notificationServiceApiKey).toBe("legacy-key");
  });

  it("prefers neutral notification variables when both generations are configured", async () => {
    const env = await loadEnv({
      NOTIFICATION_SERVICE_URL: "https://neutral.example.test",
      NOTIFICATION_SERVICE_API_KEY: "neutral-key",
      BUILT_IN_FORGE_API_URL: "https://legacy.example.test",
      BUILT_IN_FORGE_API_KEY: "legacy-key",
    });

    expect(env.notificationServiceUrl).toBe("https://neutral.example.test");
    expect(env.notificationServiceApiKey).toBe("neutral-key");
  });
});
