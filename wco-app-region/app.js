
const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('/pwa/wco-app-region/sw.js', { scope: '/pwa/wco-app-region/'});
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}