// When SW is installed, cache urls for later use.
self.addEventListener('install', (event) => {

  self.skipWaiting();

  // Cache content for offline use.
  const urlsToCache = ['/', 'app.js'];
   event.waitUntil(async () => {
      const cache = await caches.open('pwa-assets');
      return cache.addAll(urlsToCache);
   });
});

// Once SW is activated, claim clients to set the new instance as the controller.
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// If fetch fails, serve content from cache.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
    .catch(error => {
      return caches.match(event.request) ;
    })
  );
});