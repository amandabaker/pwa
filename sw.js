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

this.addEventListener('fetch', (event) => {
    event.respondWith(async function() {
        const response = await caches.match(event.request);
        if (response) {
            return response;
        }

        return fetch(event.request);
    });
});
