import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("notification configuration contract", () => {
  it("keeps deployment env compatibility behind neutral internal aliases", () => {
    const env = read("apps/api/src/_core/env.ts");
    const notification = read("apps/api/src/_core/notification.ts");
    const envExample = read("env.example");
    const deployment = read("docs/deployment.md");

    expect(env).toContain("process.env.NOTIFICATION_SERVICE_URL");
    expect(env).toContain("process.env.BUILT_IN_FORGE_API_URL");
    expect(env).toContain("process.env.NOTIFICATION_SERVICE_API_KEY");
    expect(env).toContain("process.env.BUILT_IN_FORGE_API_KEY");
    expect(env).not.toContain("forgeApiUrl:");
    expect(env).not.toContain("forgeApiKey:");
    expect(envExample).toContain("NOTIFICATION_SERVICE_URL=");
    expect(envExample).toContain("NOTIFICATION_SERVICE_API_KEY=");
    expect(deployment).toContain("NOTIFICATION_SERVICE_URL");
    expect(deployment).toContain("NOTIFICATION_SERVICE_API_KEY");
    expect(deployment).toContain("fallback");

    expect(notification).toContain("ENV.notificationServiceUrl");
    expect(notification).toContain("ENV.notificationServiceApiKey");
    expect(notification).not.toContain("ENV.forgeApiUrl");
    expect(notification).not.toContain("ENV.forgeApiKey");
    expect(notification).not.toContain("Manus Notification Service");
  });
});
