const RETIRE_VERSION = "v10";
const CACHE_PREFIX = "pg-portfolio-pwa-";
const SCOPE_URL = new URL(self.registration.scope);
const RETIRE_PARAM = "pg_sw_retired";

async function clearPortfolioCaches() {
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX))
        .map((key) => caches.delete(key)),
    );
  } catch {
    // Cache cleanup is best-effort. This worker intentionally stays network-pass-through.
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
        url.searchParams.set(RETIRE_PARAM, `${RETIRE_VERSION}-${Date.now().toString(36)}`);
        await client.navigate(url.toString());
      } catch {
        // Closing/background clients may reject navigation.
      }
    }),
  );
}

async function retirePortfolioWorker() {
  await clearPortfolioCaches();

  try {
    await self.clients.claim();
  } catch {
    // A client can disappear while the worker is activating.
  }

  await refreshPortfolioClients();

  try {
    await self.registration.unregister();
  } catch {
    // If unregister fails, this worker still has no fetch handler and cannot serve stale assets.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(retirePortfolioWorker());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "PG_RETIRE_RUNTIME") return;
  event.waitUntil(retirePortfolioWorker());
});

// Deliberately no fetch handler.
// Any legacy client that updates to this worker immediately falls back to the network.
