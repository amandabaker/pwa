
this.addEventListener('install', async (event) => {
    return;
    // await event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(cachedFiles)));
});

self.addEventListener('fetch', e => {
    e.respondWith(
      fetch(e.request).catch(() => {
        return new Response('Hello offline page');
      })
    );
  });
