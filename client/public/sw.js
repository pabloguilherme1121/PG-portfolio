const TAKEOVER_VERSION = "v8";
const CACHE_PREFIX = "pg-portfolio-pwa-";
const SCOPE_URL = new URL(self.registration.scope);
const TAKEOVER_PARAM = "pg_sw_takeover";

async function clearLegacyCaches() {
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX))
        .map((key) => caches.delete(key)),
    );
  } catch {
    // A cleanup failure must not prevent the worker from taking control.
  }
}

async function refreshControlledClients() {
  const windowClients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  await Promise.all(
    windowClients.map(async (client) => {
      try {
        const url = new URL(client.url);
        if (url.origin !== SCOPE_URL.origin || !url.pathname.startsWith(SCOPE_URL.pathname)) return;
        if (url.searchParams.get(TAKEOVER_PARAM) === TAKEOVER_VERSION) return;
        url.searchParams.set(TAKEOVER_PARAM, TAKEOVER_VERSION);
        await client.navigate(url.toString());
      } catch {
        // Some embedded/closing clients cannot be navigated. Ignore and continue.
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clearLegacyCaches();
      await self.clients.claim();
      await refreshControlledClients();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== SCOPE_URL.origin) return;

  if (
    request.mode === "navigate" ||
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(fetch(request, { cache: "no-store" }));
  }
});
