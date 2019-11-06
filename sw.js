
this.addEventListener('install', async (event) => {
    const cache = await caches.open('myCache');
    cache.addAll([
        'index.html',
        'app.js',
        'style.css',
    ]);
    this.skipWaiting();
});
