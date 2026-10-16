import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";
import { ENV } from "./env";
import { sdk } from "./sdk";

const original = { appId: ENV.appId, cookieSecret: ENV.cookieSecret };
const secret = "session-test-secret-with-at-least-32-bytes";
const payload = { openId: "user-1", appId: "portfolio-test", name: "Pablo" };
const key = (value = secret) => new TextEncoder().encode(value);

async function token(
  claims: Record<string, unknown> = payload,
  algorithm = "HS256",
  signingSecret = secret
) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: algorithm, typ: "JWT" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + 60)
    .sign(key(signingSecret));
}

beforeEach(() => {
  ENV.appId = payload.appId;
  ENV.cookieSecret = secret;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  Object.assign(ENV, original);
  vi.restoreAllMocks();
});

describe("session JWT compatibility and rejection", () => {
  it("round-trips a session", async () => {
    expect(
      await sdk.verifySession(
        await sdk.createSessionToken(payload.openId, { name: payload.name })
      )
    ).toEqual(payload);
  });
  it("accepts an existing HS256 token", async () => {
    expect(await sdk.verifySession(await token())).toEqual(payload);
  });
  it("round-trips a user without a display name", async () => {
    expect(
      await sdk.verifySession(await sdk.createSessionToken(payload.openId))
    ).toEqual({ ...payload, name: "" });
  });
  it("rejects expired tokens", async () => {
    expect(
      await sdk.verifySession(
        await sdk.signSession(payload, { expiresInMs: -1000 })
      )
    ).toBeNull();
  });
  it("rejects tampering", async () => {
    const signed = await token();
    const [header, , signature] = signed.split(".");
    const altered = Buffer.from(
      JSON.stringify({ ...payload, openId: "attacker" })
    ).toString("base64url");
    expect(
      await sdk.verifySession(`${header}.${altered}.${signature}`)
    ).toBeNull();
  });
  it("rejects the wrong secret", async () => {
    expect(
      await sdk.verifySession(await token(payload, "HS256", secret + "wrong"))
    ).toBeNull();
  });
  it("rejects another HMAC algorithm", async () => {
    expect(await sdk.verifySession(await token(payload, "HS384"))).toBeNull();
  });
  it("rejects tokens belonging to another app", async () => {
    expect(
      await sdk.verifySession(await token({ ...payload, appId: "another-app" }))
    ).toBeNull();
  });
  it.each([undefined, null, "", "not-a-token"])(
    "rejects missing or malformed token %s",
    async value => {
      expect(await sdk.verifySession(value)).toBeNull();
    }
  );
  it.each(["", "   "])(
    "refuses signing and verification with blank secret",
    async value => {
      const signed = await token();
      ENV.cookieSecret = value;
      await expect(sdk.signSession(payload)).rejects.toThrow(/JWT_SECRET/);
      expect(await sdk.verifySession(signed)).toBeNull();
    }
  );
  it("rejects sessions when the app is not configured", async () => {
    const signed = await token();
    ENV.appId = "";
    expect(await sdk.verifySession(signed)).toBeNull();
    await expect(sdk.createSessionToken(payload.openId)).rejects.toThrow(
      /app/i
    );
  });
  it.each([
    { ...payload, openId: "" },
    { ...payload, name: 42 },
    { openId: "user-1", appId: payload.appId },
  ])("rejects invalid claims", async claims => {
    expect(await sdk.verifySession(await token(claims))).toBeNull();
  });
});
