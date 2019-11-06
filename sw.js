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
    event.respondWith(async () => {
        const response = await caches.match(event.request);
        if (response) {
            return response;
        }
        return fetch(event.request);
    });
});
