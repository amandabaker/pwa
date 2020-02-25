
this.addEventListener('install', async (event) => {
  return;
});

this.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
