const CACHE_NAME = "pg-portfolio-pwa-v5";
const CACHE_PREFIX = "pg-portfolio-pwa-";
const SCOPE_URL = new URL(self.registration.scope);
const OFFLINE_HTML =
  '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline — Pablo Guilherme</title><body style="font-family:system-ui;background:#030b1e;color:#eef5ff;padding:2rem"><h1>Você está offline.</h1><p>Abra novamente o portfólio quando a conexão voltar.</p></body></html>';
const CORE_ASSETS = [
  new URL("manifest.webmanifest", SCOPE_URL).href,
  new URL("favicon.svg", SCOPE_URL).href,
  new URL("pwa-icon-maskable.svg", SCOPE_URL).href,
];

const isPrivatePath = (pathname) =>
  /\/(api|oauth|login)(\/|$)/.test(pathname) ||
  /\/(favoritos|curadoria)(\/|$)/.test(
    pathname.replace(SCOPE_URL.pathname.replace(/\/$/, ""), ""),
  );

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    CORE_ASSETS.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response.ok) await cache.put(url, response);
      } catch {
        // Core metadata is helpful but never allowed to break installation.
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheCoreAssets().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== SCOPE_URL.origin || isPrivatePath(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(
        () =>
          new Response(OFFLINE_HTML, {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }),
      ),
    );
    return;
  }

  if (request.destination === "script" || request.destination === "style") {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  const shouldCache = request.destination === "image" || request.destination === "font";
  if (!shouldCache) return;

  const network = fetch(request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  });

  event.waitUntil(network.then(() => undefined, () => undefined));
  event.respondWith(
    caches.match(request).then((cached) => cached || network).catch(() => caches.match(request)),
  );
});
