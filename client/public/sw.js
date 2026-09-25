const CACHE_NAME = "pg-portfolio-pwa-v1";
const SCOPE_URL = new URL(self.registration.scope);
const APP_SHELL_URL = new URL("./", SCOPE_URL).href;
const CORE_ASSETS = [
  APP_SHELL_URL,
  new URL("manifest.webmanifest", SCOPE_URL).href,
  new URL("favicon.svg", SCOPE_URL).href,
  new URL("pwa-icon-maskable.svg", SCOPE_URL).href,
];

const isPrivatePath = (pathname) =>
  /\/(api|oauth|login)(\/|$)/.test(pathname) ||
  /\/(favoritos|curadoria)(\/|$)/.test(
    pathname.replace(SCOPE_URL.pathname.replace(/\/$/, ""), ""),
  );

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(CORE_ASSETS);

  try {
    const response = await fetch(APP_SHELL_URL, { cache: "no-cache" });
    if (!response.ok) return;
    const html = await response.clone().text();
    await cache.put(APP_SHELL_URL, response);

    const assetUrls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((match) => new URL(match[1], APP_SHELL_URL))
      .filter((url) => url.origin === SCOPE_URL.origin)
      .filter((url) => url.pathname.startsWith(SCOPE_URL.pathname))
      .filter((url) => /\.(?:css|js|svg|png|webp|avif|woff2?)$/i.test(url.pathname))
      .map((url) => url.href);

    await Promise.all(
      [...new Set(assetUrls)].map(async (url) => {
        try {
          const assetResponse = await fetch(url);
          if (assetResponse.ok) await cache.put(url, assetResponse);
        } catch {
          // Optional runtime asset: keep installation resilient if one request fails.
        }
      }),
    );
  } catch {
    // CORE_ASSETS already provides a minimal offline shell.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("pg-portfolio-pwa-") && key !== CACHE_NAME)
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
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(request)) ||
            (await caches.match(APP_SHELL_URL)) ||
            new Response(
              "<!doctype html><html lang=\"pt-BR\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Offline — Pablo Guilherme</title><body style=\"font-family:system-ui;background:#030b1e;color:#eef5ff;padding:2rem\"><h1>Você está offline.</h1><p>Abra novamente o portfólio quando a conexão voltar.</p></body></html>",
              { headers: { "Content-Type": "text/html; charset=utf-8" } },
            )
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then(async (response) => {
          if (response.ok && ["script", "style", "image", "font"].includes(request.destination)) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    }),
  );
});
