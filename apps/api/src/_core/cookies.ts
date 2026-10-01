import type { CookieOptions, Request } from "express";

function isTrustedProxyAddress(value: string | undefined) {
  const address = (value || "").replace(/^::ffff:/, "").toLowerCase();
  return address === "127.0.0.1" || address === "::1" ||
    /^10\./.test(address) || /^192\.168\./.test(address) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(address) ||
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(address) ||
    address.startsWith("fc") || address.startsWith("fd") || address.startsWith("fe80:");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;
  if (!isTrustedProxyAddress(req.socket.remoteAddress)) return false;

  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto?.split(",")[0];
  return proto?.trim().toLowerCase() === "https";
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  return {
    httpOnly: true,
    path: "/",
    sameSite: isSecureRequest(req) ? "none" : "lax",
    secure: isSecureRequest(req),
  };
}
