// Service Worker - LayanDesa Mobile
const CACHE_NAME = 'layandesa-v4'; // bump setiap update JS/CSS
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './js/config.js',
  './js/api.js',
  './js/router.js',
  './js/components.js',
  './js/pages/home.js',
  './js/pages/berita.js',
  './js/pages/pengumuman.js',
  './js/pages/layanan.js',
  './js/pages/profil.js',
  './js/pages/kontak.js',
  './js/app.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first for API, cache first for static
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
