
const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('/pwa/explainer-example/sw.js', { scope: '/pwa/explainer-example/'});
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
