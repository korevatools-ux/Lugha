// Lugha service worker: makes Lugha installable and lets lessons, words and listening work offline.
// Pages are fetched fresh when online and served from the cache when offline.
// AI requests (/api/) and sign-in/progress sync (Firebase) always go to the network.
const CACHE = "lugha-v1";
const SHELL = [
  "/", "/app/", "/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png",
  "/icon-maskable-512.png", "/apple-icon.png", "/mascot.webp", "/detectives/detectives.js",
];
// Versioned libraries and fonts from these hosts never change, so the cached copy is kept.
const LIBRARY_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net", "www.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req, fallback) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match(fallback)) || Response.error();
  }
}

// Serve the saved copy at once and refresh it in the background.
async function staleWhileRevalidate(e) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(e.request);
  const fresh = fetch(e.request)
    .then((res) => { if (res.ok) cache.put(e.request, res.clone()); return res; })
    .catch(() => null);
  if (hit) { e.waitUntil(fresh); return hit; }
  return (await fresh) || Response.error();
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") cache.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);

  if (LIBRARY_HOSTS.includes(url.hostname)) return e.respondWith(cacheFirst(req));
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;

  if (req.mode === "navigate") return e.respondWith(networkFirst(req, url.pathname.startsWith("/app") ? "/app/" : "/"));
  e.respondWith(staleWhileRevalidate(e));
});
