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
        try {
            const response = await caches.match(event.request);
            if (response) {
                return response;
            }
        } catch (e) {
            console.log(e);
            return fetch(event.request);
        }
    });
});
