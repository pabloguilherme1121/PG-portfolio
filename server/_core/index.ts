import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerSeoRoutes } from "../seo";

const PUBLIC_BODY_LIMIT = "100kb";

function getCspOrigin(value: string | undefined) {
  if (!value) return null;
  try {
    const origin = new URL(value).origin;
    return origin.startsWith("https://") ? origin : null;
  } catch {
    return null;
  }
}

function getReportOnlyCsp() {
  const analyticsOrigin = getCspOrigin(process.env.VITE_ANALYTICS_ENDPOINT);
  const scriptSources = ["'self'", "'unsafe-inline'", "https://files.manuscdn.com"];
  const connectSources = ["'self'"];
  if (analyticsOrigin) {
    scriptSources.push(analyticsOrigin);
    connectSources.push(analyticsOrigin);
  }
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `script-src ${scriptSources.join(" ")}`,
    `connect-src ${connectSources.join(" ")}`,
    "frame-src 'self'",
    "manifest-src 'self'",
  ].join("; ");
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
      res.setHeader("Content-Security-Policy", getReportOnlyCsp());
    }
    next();
  });
  const server = createServer(app);
  // Os endpoints públicos atuais recebem somente payloads textuais validados por Zod;
  // uploads usam storage assinado e não passam por este parser global.
  app.use(express.json({ limit: PUBLIC_BODY_LIMIT }));
  app.use(express.urlencoded({ limit: PUBLIC_BODY_LIMIT, extended: true }));
  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    next();
  });
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerSeoRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
