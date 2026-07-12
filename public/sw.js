// NILOKA Service Worker
// Strategy:
//   - Navigation requests  → Network-first, fallback to /offline
//   - Static assets (JS/CSS/fonts/images) → Cache-first (stale-while-revalidate)
//   - API calls (/api/*) → Network-only (never cache server actions or AI)

const CACHE_VERSION = "niloka-v1";
const OFFLINE_URL = "/offline";

// Assets to pre-cache on install
const PRECACHE_URLS = [OFFLINE_URL];

// ─── Install ─────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST = Server Actions, mutations — never cache)
  if (request.method !== "GET") return;

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip API routes — always network-only (AI, payment, auth callbacks)
  if (url.pathname.startsWith("/api/")) return;

  // Skip NextAuth internal routes
  if (url.pathname.startsWith("/auth/")) return;

  // Skip uploaded assets served from storage — always fresh from server
  if (url.pathname.startsWith("/uploads/")) return;

  // ── Navigation: Network-first, fall back to offline page ──────────────────
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then(
          (cached) =>
            cached ||
            new Response("Offline — halaman tidak tersedia", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
        )
      )
    );
    return;
  }

  // ── Static assets: Cache-first, update in background ─────────────────────
  // _next/static files are hashed — safe to cache aggressively
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // ── Public static files (icons, manifest, fonts) ─────────────────────────
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/favicon.ico"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // ── Everything else: Network-first (pages, dynamic routes) ───────────────
  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then(
        (cached) =>
          cached ||
          caches.match(OFFLINE_URL).then(
            (offlinePage) =>
              offlinePage ||
              new Response("Tidak ada koneksi internet.", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
              })
          )
      )
    )
  );
});
