self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("Oh, no! Where's the internet?");
    })
  );
});

const incrementWidgetclick = async () => {
  const allClients = await clients.matchAll({});
  allClients.forEach(client => {
    client.postMessage({ type: "widgetclick" });
  });
};

self.addEventListener('widgetclick', (event) => {
  event.waitUntil(async () => {
    console.log(event);
    incrementWidgetclick();
  });
});

const showResult = async (action, additionalText) => {
  const allClients = await clients.matchAll({});
  allClients.forEach(client => {
    client.postMessage({
      type: "showResult",
      action,
      additionalText,
    });
  });
};

const getByTag = async (tag) => {
  const action = `getByTag(${tag})`;
  try {
    const widget = await self.widgets.getByTag(tag);
    console.log(`${action} returned:`);
    console.log(widget);
    if (widget)
      showResult(action, `found a widget named "${widget.definition.name}"`);
    else
      showResult(action, `returned undefined`);
  } catch (error) {
    console.log(error);
    showResult(action, `failed.`);
  }
};

const getByInstanceId = async (instanceId) => {
  const action = `getByInstanceId(${instanceId})`;
  try {
    const widget = await self.widgets.getByInstanceId(instanceId);
    console.log(`${action} returned:`);
    console.log(widget);
    if (widget)
      showResult(action, `found a widget named ${widget.definition.name}`);
    else
      showResult(action, `returned undefined`);
  } catch (error) {
    console.log(error);
    showResult(action, `failed.`);
  }
};

const matchAll = async () => {
  const action = `matchAll({})`;
  try {
    const widgets = await self.widgets.matchAll({});
    console.log(`${action} returned:`);
    console.log(widgets);
    if (widgets)
      showResult(action, `found ${widgets.length} widgets`);
    else
      showResult(action, `returned undefined`);
  } catch (error) {
    console.log(error);
    showResult(action, `failed.`);
  }
};

const updateByTag = async (tag) => {
  const payload = '{ "data": "content" }';
  const action = `updateByTag(${tag}, ${payload})`;
  try {
    await self.widgets.updateByTag(tag, payload);
    console.log(`${action} completed`);
    showResult(action, `completed`);
  } catch (error) {
    console.log(error);
    showResult(action, `failed.`);
  }
};

const updateByInstanceId = async (instanceId) => {
  const payload = '{ "data": "content" }';
  const action = `updateByInstanceId(${instanceId}, ${payload})`;
  try {
    await self.widgets.updateByInstanceId(instanceId, payload);
    console.log(`${action} completed`);
    showResult(action, `completed`);
  } catch (error) {
    console.log(error);
    showResult(action, `failed.`);
  }
};

self.onmessage = (event) => {
  const action = event.data.action;
  const inputData = event.data.input;
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
