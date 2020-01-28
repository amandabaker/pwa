const CACHE = 'myCache';

const cachedFiles = [
    '/pwa/sample/',
    '/pwa/sample/index.html',
    '/pwa/sample/app.js',
    '/pwa/sample/style.css',
    '/pwa/sample/favicon.ico',
];


this.addEventListener('install', async (event) => {
    await event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(cachedFiles)));
});

this.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).then((response) => {
        return response;
    }, async () => {
        const response = await caches.match(event.request);
        if (response) {
            return response;
        }
    }));
});
