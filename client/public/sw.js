const RUNTIME_VERSION = "v9";
const CACHE_PREFIX = "pg-portfolio-pwa-";
const SCOPE_URL = new URL(self.registration.scope);
const TAKEOVER_PARAM = "pg_sw_takeover";

async function clearPortfolioCaches() {
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX))
        .map((key) => caches.delete(key)),
    );
  } catch {
    // Cache cleanup is best-effort; the runtime stays network-only.
  }
}

async function refreshPortfolioClients() {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  await Promise.all(
    clients.map(async (client) => {
      try {
        const url = new URL(client.url);
        if (url.origin !== SCOPE_URL.origin || !url.pathname.startsWith(SCOPE_URL.pathname)) return;
        if (url.searchParams.get(TAKEOVER_PARAM) === RUNTIME_VERSION) return;
        url.searchParams.set(TAKEOVER_PARAM, RUNTIME_VERSION);
        await client.navigate(url.toString());
      } catch {
        // Closing/background clients may reject navigation.
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
      await clearPortfolioCaches();
      await self.clients.claim();
      await refreshPortfolioClients();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "PG_FORCE_RUNTIME_REFRESH") return;
  event.waitUntil(
    (async () => {
      await clearPortfolioCaches();
      await refreshPortfolioClients();
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
