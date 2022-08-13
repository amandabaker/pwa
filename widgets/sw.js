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

const getByTag = async (tag) => {
  const widgets = await self.widgets.getByTag(tag);
  console.log(`getByTag(${tag}) returned:`);
  console.log(widgets);
};

const getByInstanceId = async (tag) => {
  const widgets = await self.widgets.getByInstanceId(tag);
  console.log(`getByInstanceId(${tag}) returned:`);
  console.log(widgets);
};

const matchAll = async () => {
  const widgets = await self.widgets.matchAll({});
  console.log(widgets);
};

const updateByTag = async (tag) => {
  await self.widgets.updateByTag(tag, '{ "data": "content" }');
  console.log(`Widget updated`);
};

const updateByInstanceId = async (instanceId) => {
  await self.widgets.updateByInstanceId(instanceId, '{ "data": "content" }');
  console.log(`Widget updated`);
};

self.onmessage = (event) => {
  console.log('Request: ' + event.data);

  const tokens = event.data.split(';');
  if (tokens.length > 2)
    console.log('Input included a semicolon. This is used as a separator, so anything after it will be dropped.');

  const action = tokens[0];
  const inputData = tokens.length > 1 ? tokens[1] : "";
  switch (action) {
    case 'getByTag':
      getByTag(inputData);
      break;
    case 'getByInstanceId':
      getByInstanceId(inputData);
      break;
    case 'matchAll':
      matchAll();
      break;
    case 'updateByTag':
      updateByTag(inputData);
      break;
    case 'updateByInstanceId':
      updateByInstanceId(inputData);
      break;
    default:
      console.log('Not sure what to do with that...');
  }
};
