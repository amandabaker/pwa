
const matchAll = async () => {
  console.log('Pushing matchAll request to SW');
  const sw = await navigator.serviceWorker.getRegistration();
  sw.active.postMessage('matchAll');
};

// Tag is hard coded in the SW.
const getByTag = async () => {
  console.log('Pushing getByTag request to SW');
  const sw = await navigator.serviceWorker.getRegistration();
  sw.active.postMessage('getByTag');
};

// Tag is hard coded in the SW.
const updateByTag = async () => {
  console.log('Pushing updateByTag request to SW');
  const sw = await navigator.serviceWorker.getRegistration();
  sw.active.postMessage('updateByTag');
};
