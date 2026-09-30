const RUNTIME_VERSION = "v8";
const CACHE_PREFIX = "pg-portfolio-pwa-";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX))
            .map((key) => caches.delete(key)),
        );
      } catch {
        // Runtime remains network-first even when cache cleanup is unavailable.
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (
    request.mode === "navigate" ||
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(fetch(request, { cache: "no-store" }));
  }
});
