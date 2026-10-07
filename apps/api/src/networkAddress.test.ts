import { describe, expect, it } from "vitest";
import { isTrustedProxyAddress, normalizeNetworkAddress } from "./_core/networkAddress";

describe("network address trust policy", () => {
  it("normalizes mapped IPv4 and empty addresses consistently", () => {
    expect(normalizeNetworkAddress("::ffff:192.168.1.10")).toBe("192.168.1.10");
    expect(normalizeNetworkAddress(undefined)).toBe("unknown");
  });

  it("recognizes only the existing trusted proxy ranges", () => {
    for (const address of ["127.0.0.1", "::1", "10.0.0.1", "192.168.1.1", "172.16.0.1", "172.31.255.1", "100.64.0.1", "100.127.255.1", "fc00::1", "fd00::1", "fe80::1"]) {
      expect(isTrustedProxyAddress(address)).toBe(true);
    }
    for (const address of ["172.15.0.1", "172.32.0.1", "100.63.0.1", "100.128.0.1", "203.0.113.5"]) {
      expect(isTrustedProxyAddress(address)).toBe(false);
    }
  });
});
