let widgetclickCount = 0;

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

const incrementWidgetClick = () => {
  widgetclickCount++;
  document.getElementById('widgetclickCount').textContent = widgetclickCount;
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
      incrementWidgetClick();
      break;
  }
});
