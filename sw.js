const CACHE_NAME = 'kakolark-v14-transactional-voting';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-32.png', './icons/apple-touch-icon.png', './assets/logo/kakolark-logo.png', './assets/backgrounds/kakolark-pattern.png',
  './assets/avatars/masculino/m-01.webp',
  './assets/avatars/masculino/m-02.webp',
  './assets/avatars/masculino/m-03.webp',
  './assets/avatars/masculino/m-04.webp',
  './assets/avatars/masculino/m-05.webp',
  './assets/avatars/masculino/m-06.webp',
  './assets/avatars/masculino/m-07.webp',
  './assets/avatars/masculino/m-08.webp',
  './assets/avatars/masculino/m-09.webp',
  './assets/avatars/masculino/m-10.webp',
  './assets/avatars/masculino/m-11.webp',
  './assets/avatars/masculino/m-12.webp',
  './assets/avatars/feminino/f-01.webp',
  './assets/avatars/feminino/f-02.webp',
  './assets/avatars/feminino/f-03.webp',
  './assets/avatars/feminino/f-04.webp',
  './assets/avatars/feminino/f-05.webp',
  './assets/avatars/feminino/f-06.webp',
  './assets/avatars/feminino/f-07.webp',
  './assets/avatars/feminino/f-08.webp',
  './assets/avatars/feminino/f-09.webp',
  './assets/avatars/feminino/f-10.webp',
  './assets/avatars/feminino/f-11.webp',
  './assets/avatars/feminino/f-12.webp'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('kakolark-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
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
