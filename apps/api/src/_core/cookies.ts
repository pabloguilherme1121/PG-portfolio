import type { CookieOptions, Request } from "express";
import { isTrustedProxyAddress } from "./networkAddress";


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
