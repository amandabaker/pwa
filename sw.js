const CACHE = 'myCache';

const cachedFiles = [
    'index.html',
    'app.js',
    'style.css',
];


this.addEventListener('install', async (event) => {
    await event.waitUntil(async () => {
        const cache = await caches.open(CACHE);
        cache.addAll(cachedFiles)
    });
    this.skipWaiting();
});

this.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        if (response) {
            return response;
        }
        return fetch(event.request);
    }));
});
