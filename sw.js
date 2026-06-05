const CACHE_NAME = 'tum-sinavlar-v1';
const urlsToCache = [
  './',
  './mainpage.html',
  './manifest.json',
  // Diğer testlerinizin ana sayfalarını da hafızaya alıyoruz
  'https://cengizkaya4.github.io/devletarsivhizmetleriyonetmeligi/index.html',
  'https://cengizkaya4.github.io/uyum-prosed-rleri-test-01/index.html',
  'https://cengizkaya4.github.io/genelilgilimevzuat-6331-sayili-isg-kanunu/index.html',
  'https://cengizkaya4.github.io/ehkquiz/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
