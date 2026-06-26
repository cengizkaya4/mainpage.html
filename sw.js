const CACHE_NAME = 'tum-sinavlar-v2';
// Sadece aynı origin'deki çekirdek dosyaları ön belleğe alıyoruz.
// Harici (cross-origin) adresleri addAll içine koymak install'ı kırabildiği için
// onları runtime'da, istendikçe önbelleğe alıyoruz.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.PNG',
  './panelikon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Başarılı yanıtları runtime önbelleğine ekle (harici testler dahil).
        if (response && (response.ok || response.type === 'opaque')) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
