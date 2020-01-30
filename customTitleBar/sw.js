
this.addEventListener('install', async (event) => {
    return;
    // await event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(cachedFiles)));
});

this.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
    // }, async () => {
    //     const response = await caches.match(event.request);
    //     if (response) {
    //         return response;
    //     }
    // }));
});
