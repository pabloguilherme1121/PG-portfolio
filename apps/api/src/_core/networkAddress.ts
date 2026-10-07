export function normalizeNetworkAddress(value: string | undefined) {
  return (value || "unknown").trim().replace(/^::ffff:/, "").slice(0, 80);
}

export function isTrustedProxyAddress(address: string | undefined) {
  const normalized = normalizeNetworkAddress(address).toLowerCase();
  if (normalized === "127.0.0.1" || normalized === "::1") return true;
  if (normalized.startsWith("10.") || normalized.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(normalized)) return true;
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(normalized)) return true;
  return normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}
