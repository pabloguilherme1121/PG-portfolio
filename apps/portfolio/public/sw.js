const CACHE_PREFIX = "pg-portfolio-pwa-";

async function retireLegacyRuntime() {
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX))
        .map((key) => caches.delete(key)),
    );
  } catch {
    // Best-effort cleanup for caches created by older PWA versions.
  }

  try {
    await self.clients.claim();
  } catch {
    // A client can disappear while the worker is activating.
  }

  try {
    await self.registration.unregister();
  } catch {
    // This worker has no fetch handler, so requests still pass through to the network.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(retireLegacyRuntime());
});

self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "PG_RETIRE_RUNTIME") return;
  event.waitUntil(retireLegacyRuntime());
});

// Deliberately no fetch handler: the portfolio is installable but network-only.
