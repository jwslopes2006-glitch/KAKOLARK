const CACHE_NAME = 'kakolark-performance-vote-fix-v1';
const SHELL = [
  './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-32.png', './icons/apple-touch-icon.png',
  './assets/logo/kakolark-logo.webp', './assets/backgrounds/kakolark-pattern.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const current = await caches.open(CACHE_NAME);
    const keys = await caches.keys();
    // Keep avatar files that were cached by earlier versions, but don't require downloading
    // all 24 large images during installation. New images cache on first use.
    for (const key of keys.filter(name => name.startsWith('kakolark-') && name !== CACHE_NAME)) {
      const previous = await caches.open(key);
      const requests = await previous.keys();
      for (const request of requests) {
        if (!new URL(request.url).pathname.includes('/assets/avatars/')) continue;
        const response = await previous.match(request);
        if (response) await current.put(request, response).catch(() => {});
      }
      await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname === '/') {
    event.respondWith(fetch(req).then(response => { if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone())).catch(() => {}); return response; }).catch(async () => (await caches.match(req)) || (await caches.match('./index.html')))); return;
  }
  if (url.pathname.includes('/assets/') || url.pathname.includes('/icons/') || url.pathname.endsWith('/manifest.webmanifest')) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => { if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone())).catch(() => {}); return response; })));
  }
});
