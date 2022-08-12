self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response("Oh, no! Where's the internet?");
    })
  );
});

self.addEventListener('widgetclick', e => {
  e.waitUntil(console.log(e));
});

const getByTag = async () => {
  const widgets = await self.widgets.getByTag('max_ac');
  console.log('getByTag returned:');
  console.log(widgets);
};

const matchAll = async () => {
  const widgets = await self.widgets.matchAll({});
  console.log(widgets);
};

const updateByTag = async () => {
  const widgets = await self.widgets.updateByTag('max-ac', '{ "some": "content" }');
  console.log(widgets);
};

self.onmessage = (event) => {
  console.log('Request: ' + event.data);

  switch (event.data) {
    case 'getByTag':
      getByTag();
      break;
    case 'matchAll':
      matchAll();
      break;
    case 'updateByTag':
      updateByTag();
      break;
    default:
      console.log('Not sure what to do with that...');
  }
};
