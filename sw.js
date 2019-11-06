const CACHE = 'myCache';

this.addEventListener('install', async (event) => {
    const cache = await caches.open(CACHE);
    cache.addAll([
        'index.html',
        'app.js',
        'style.css',
    ]);
    this.skipWaiting();
});

this.addEventListener('fetch', async (event) => {
    let response = await caches.match(event.request);
    if (response !== undefined) {
        event.respondWith(response);
    } else {
        response = await fetch(event.request);
        let responseCopy = response.clone();
        const cache = await caches.open(CACHE);
        cache.put(event.request, responseCopy);
        event.respondWith(response);
    }
});
