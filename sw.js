const CACHE_NAME = 'pakhomo-jobs-cache-v3'; // Updated cache name to force update
const urlsToCache = [
  '/pakhomojobs/',
  '/pakhomojobs/index.html',
  '/pakhomojobs/blog.html',
  '/pakhomojobs/bookingform.html',
  '/pakhomojobs/registration.html',
  '/pakhomojobs/dashboard.html',
  '/pakhomojobs/css/blog.css',
  '/pakhomojobs/src/styles/globals.css',
  '/pakhomojobs/offline.html'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the new service worker to activate
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fetch failed, and it's not in cache. 
          // If it's a navigation request, show the offline page.
          if (event.request.mode === 'navigate') {
            return caches.match('/pakhomojobs/offline.html');
          }
        });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
