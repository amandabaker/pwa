
this.addEventListener('install', async (event) => {
  return;
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response('Hello offline page');
    })
  );
});
