const CACHE_NAME = "wine-tracker-shell-v2";
const SHELL_ASSETS = ["/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Everything under /api/ (including the Next.js route handlers that talk to
// the backend): always network, so wine data is never served stale.
//
// HTML page navigations: always network too. Pages are server-rendered per
// request and change across deploys, so caching them would risk showing a
// stale login/list/detail page indefinitely (the cache only gets cleared
// when this file's own bytes change, not on every app deploy).
//
// Everything else (icons, manifest, Next's content-hashed static assets):
// cache-first, since those URLs only change when their content does.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.pathname.startsWith("/api/")) {
    return;
  }

  if (event.request.mode === "navigate") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request)),
  );
});
