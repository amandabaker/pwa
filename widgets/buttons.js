
const postToSW = async (action, input, payload) => {
  const sw = await navigator.serviceWorker.getRegistration();
  sw.active.postMessage({
    action,
    input,
    payload,
  });
};

const getByTag = async () => {
  console.log('Pushing getByTag request to SW');

  const tag = document.getElementById('getByTagInput').value;
  postToSW('getByTag', tag);
};

const getByInstanceId = async () => {
  console.log('Pushing getByInstanceId request to SW');

  const instanceId = document.getElementById('getByInstanceIdInput').value;
  postToSW('getByInstanceId', instanceId);
};

const getByHostId = async () => {
  console.log('Pushing getByHostId request to SW');

  const hostId = document.getElementById('getByHostIdInput').value;
  postToSW('getByHostId', hostId);
};

const matchAll = async () => {
  console.log('Pushing matchAll request to SW');

  const matchAllOptions = document.getElementById('matchAllInput').value;
  postToSW('matchAll', matchAllOptions);
};

const updateByTag = async () => {
  console.log('Pushing updateByTag request to SW');

  const tag = document.getElementById('updateByTagInput').value;
  const payload = document.getElementById('updateByTagPayloadInput').value;
  postToSW('updateByTag', tag, payload);
};

const updateByInstanceId = async () => {
  console.log('Pushing updateByInstanceId request to SW');

  const instanceId = document.getElementById('updateByInstanceIdInput').value;
  const payload = document.getElementById('updateByInstanceIdPayloadInput').value;
  postToSW('updateByInstanceId', instanceId, payload);
};

const onInputKeydown = (event, action) => {
  if (event.key == 'Enter')
    action(event.target.value);
}

document.getElementById('getByTagInput').addEventListener('keydown', (event) => {
    onInputKeydown(event, getByTag)});
document.getElementById('getByInstanceIdInput').addEventListener('keydown', (event) => {
    onInputKeydown(event, getByInstanceId)});
document.getElementById('updateByTagInput').addEventListener('keydown', (event) => {
    onInputKeydown(event, updateByTag)});
document.getElementById('updateByInstanceIdInput').addEventListener('keydown', (event) => {
      onInputKeydown(event, updateByInstanceId)});


navigator.serviceWorker.addEventListener('message', (event) => {
  switch(event.data.type) {
    case 'showResult':
      document.getElementById('resultAction').textContent = event.data.action;
      document.getElementById('resultAdditionalText').textContent = ` ${event.data.additionalText}`;
      break;
    case 'widgetclick':
      // incrementWidgetClick();
      updateWidgetClickUI();
      break;
  }
});

// To-do: don't duplicate these consts from log-events.js
const dbName = "eventLogs";
const dbVersion = 1;
const eventsOSName = "events";
const eventCountOSName = "eventCount";

const updateWidgetClickUI = () => {
  const request = indexedDB.open(dbName, dbVersion);
  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(eventCountOSName,
                                       "readwrite",
                                       { durability: "strict"});

    // Get info about all widget types
    const eventCountOS = transaction.objectStore(eventCountOSName);
    const getRequest = eventCountOS.get("widgetclick");
    getRequest.onsuccess = (event) => {
      document.getElementById('widgetclickCount').textContent = getRequest.result.count;
    }
  }
}

// Gets the count diff of each widget event since the last app/window launch.
const updateCountSinceLaunchUIAndReset = () => {
  const request = indexedDB.open(dbName, dbVersion);

  request.onerror = (event) => {
    console.log(`Failed to open db with: ${event.errorCode}`)
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(eventCountOSName,
                                       "readwrite",
                                       { durability: "strict"});

    transaction.oncomplete = (event) => {
      console.log("Widget count since last app launch completed.");
    }
    transaction.onerror = (event) => {
      console.log(`Failed to update widget count since last app launch: ${event.errorCode}`);
    }

    // Get info about all widget types
    const eventCountOS = transaction.objectStore(eventCountOSName);
    const getRequest = eventCountOS.getAll();
    getRequest.onsuccess = (event) => {
      // Add up all counts, add up all lastCounts, and find the difference.
      let count = 0;
      let lastCount = 0;
      getRequest.result.forEach((eventInfo) => {
        count += eventInfo.count;
        lastCount +=eventInfo.countAtLastAppLaunch;

        eventInfo.countAtLastAppLaunch = eventInfo.count;
        eventCountOS.put(eventInfo);
      });
      document.getElementById('widgetEventCountSinceLastLaunch').textContent = count - lastCount;

    }
  }
}

updateWidgetClickUI();
updateCountSinceLaunchUIAndReset();