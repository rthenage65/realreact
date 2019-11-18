// Tutorial: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

var cacheName = 'myapp-cache-0.1';
var appShellFiles = [
  '/index.html',
  '/script.js',
  '/js/html2canvas.min.js',
  '/js/webcam.min.js',
  '/css/normalize.css',
  '/css/skeleton.css',
  '/css/style.css',
  '/img/meme.jpg',
  '/img/favicon.ico',
  '/img/m_navy.png'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
    caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
        if(cacheName.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// Install prompt https://developers.google.com/web/fundamentals/app-install-banners/#listen_for_beforeinstallprompt
self.addEventListener('beforeinstallprompt', (e) => {
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  showInstallPromotion();
});
