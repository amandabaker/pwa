importScripts('counter.js');
importScripts('log-events.js');

const kIncrementActionVerb = 'inc';
const kOpenAppActionVerb = 'openApp';


const kIncrementTemplate = {
  type: 'AdaptiveCard',
  body: [
    { type: 'TextBlock', text: 'You have clicked the button ${count} times' },
    {
      type: 'ActionSet',
      actions: [
        {
          type: 'Action.Execute',
          title: 'Increment',
          verb: `${kIncrementActionVerb}`,
          style: 'positive',
        },
        {
          type: 'Action.Execute',
          title: 'Open App',
          verb: `${kOpenAppActionVerb}`,
        },
      ]
    }
  ],

  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  version: '1.5',
};

const incrementData = async () => {
  // get the stored count
  const count = await getAndIncrementCount();
  return { count };
};

const incrementPayload = async () => {
  return {
    template: JSON.stringify(kIncrementTemplate),
    data: JSON.stringify(await incrementData()),
  };
};

const ticTacToePayload = async (event) => {
  const template = JSON.stringify(await (await fetch("cards/tic-tac-toe.ac.json")).json());
  const x =  {
    template,
    data: JSON.stringify({
      "values": [
          ["a", "b", "c"],
          ["d", "e", "f"],
          ["g", "h", "i"]
      ]
  }),
  };

  return x;
}

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('install', (event) => {
  // cache counter script for offline use
  event.waitUntil(caches.open("v1").then((cache) => cache.add("counter.js")));
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
  logWidgetEvent('widgetclick', Date.now());
  if (event.action === kIncrementActionVerb) {
    event.waitUntil(updateDefaultWidget());
  } else if (event.action === kOpenAppActionVerb) {
    event.waitUntil(openApp());
  }

  if (event.tag == "tic-tac-toe") {
    event.waitUntil(updateTicTacToeWidget(event));
    return;
  }

  event.waitUntil(console.log(event));
  incrementWidgetclick();
});

self.addEventListener('widgetinstall', (event) => {
  logWidgetEvent('widgetinstall', Date.now());
  if (event.tag == "tic-tac-toe") {
    event.waitUntil(updateTicTacToeWidget(event));
    return;
  }

  event.waitUntil(updateDefaultWidget());

});

self.addEventListener('widgetuninstall', (event) => {
  logWidgetEvent('widgetuninstall', Date.now());
  if (event.tag == "tic-tac-toe") {
    event.waitUntil(updateTicTacToeWidget(event));
    return;
  }

  event.waitUntil(updateDefaultWidget());
});

self.addEventListener('widgetresume', (event) => {
  logWidgetEvent('widgetresume', Date.now());
  if (event.tag == "tic-tac-toe") {
    event.waitUntil(updateTicTacToeWidget(event));
    return;
  }

  event.waitUntil(updateDefaultWidget());
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
  await updateByTag('increment', await incrementPayload());
};

const updateTicTacToeWidget = async (event) => {
  await updateByTag('tic-tac-toe', await ticTacToePayload(event));
}

const openApp = async () => {
  // Focus existing window, if any.
  const clientsArr = await clients.matchAll({ type: "window" });
  if (clientsArr.length) {
    clientsArr[0].focus();
    return;
  }

  // Otherwise, open a new window.
  const windowClient = await clients.openWindow('.');
  if (windowClient) {
    windowClient.focus();
  } else {
    console.log("Failed to open window");
  }
}

const checkIfWidgetsIsDefined = () => {
  const widgetsIsDefined = !!self.widgets;
  const action = 'self.widgets';
  const additionalText = widgetsIsDefined ? ' is defined' : ' is undefined';
  showResult(action, additionalText);
}

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
    case 'checkSelf.Widgets':
        checkIfWidgetsIsDefined();
        break;
    default:
      console.log('Not sure what to do with that...');
  }
};

self.addEventListener(
  "push",
  (event) => {
    // Treat a push as an increment.
    updateDefaultWidget();
  },
  false,
);
