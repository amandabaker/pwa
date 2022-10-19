const defaultActionVerb = 'inc';
const defaultTemplate = {
  type: 'AdaptiveCard',
  body: [
    { type: 'TextBlock', text: 'You have clicked the button ${count} times' },
  ],
  actions: [
    {
      type: 'Action.Execute',
      title: 'Increment',
      verb: `${defaultActionVerb}`,
      style: 'positive',
    },
  ],
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  version: '1.5',
};

importScripts('counter.js');

const defaultData = async () => {
  // get the stored count
  const count = await getAndIncrementCount();
  return { count };
};

const defaultPayload = async () => {
  return {
    template: JSON.stringify(defaultTemplate),
    data: JSON.stringify(await defaultData()),
  };
};

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('install', (event) => {
  // cach counter script for offline use
  event.waitUntil(caches.open("v1").then((cache) => cache.add("/pwa/widgets/counter.js")));
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
  if (event.action === 'widget-install') {
    event.waitUntil(updateDefaultWidget());
  } else if (event.action === 'widget-resume') {
    event.waitUntil(updateDefaultWidget());
  } else if (event.action === defaultActionVerb) {
    event.waitUntil(updateDefaultWidget());
  }

  event.waitUntil(console.log(event));
  incrementWidgetclick();
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

const getByHostId = async (hostId) => {
  const action = `getByHostId(${hostId})`;
  try {
    const widgets = await self.widgets.getByHostId(hostId);
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

const matchAll = async (options) => {
  if (!options)
    options = {};

  const action = `matchAll(${JSON.stringify(options)})`;
  try {
    const widgets = await self.widgets.matchAll(options);
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

const updateByTag = async (tag, payload) => {
  if (!payload)
    payload = { data: "content" };
  const action = `updateByTag(${tag}, ${JSON.stringify(payload)})`;
  try {
    await self.widgets.updateByTag(tag, payload);
    console.log(`${action} completed`);
    showResult(action, `completed`);
  } catch (error) {
    console.log(error);
    showResult(action, `failed.`);
  }
};

const updateByInstanceId = async (instanceId, payload) => {
  if (!payload)
    payload = { data: "content" };
  const action = `updateByInstanceId(${instanceId}, ${JSON.stringify(payload)})`;
  try {
    await self.widgets.updateByInstanceId(instanceId, payload);
    console.log(`${action} completed`);
    showResult(action, `completed`);
  } catch (error) {
    console.log(error);
    showResult(action, `failed.`);
  }
};

const updateDefaultWidget = async () => {
  await updateByTag('max_ac', await defaultPayload());
};

self.onmessage = (event) => {
  const action = event.data.action;
  const inputData = event.data.input;
  const payload = event.data.payload;
  switch (action) {
    case 'getByTag':
      getByTag(inputData);
      break;
    case 'getByInstanceId':
      getByInstanceId(inputData);
      break;
    case 'getByHostId':
      getByHostId(inputData);
      break;
    case 'matchAll':
      matchAll(inputData);
      break;
    case 'updateByTag':
      updateByTag(inputData, payload);
      break;
    case 'updateByInstanceId':
      updateByInstanceId(inputData, payload);
      break;
    default:
      console.log('Not sure what to do with that...');
  }
};
