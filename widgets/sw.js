self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response("Oh, no! Where's the internet?");
    })
  );
});
