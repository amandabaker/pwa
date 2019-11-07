const CACHE = 'myCache';

const cachedFiles = [
    '/pwa/',
    '/pwa/index.html',
    '/pwa/app.js',
    '/pwa/style.css',
];


this.addEventListener('install', async (event) => {
    await event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(cachedFiles)));
});

this.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        if (response) {
            return response;
        }
        return fetch(event.request);
    }));
});
