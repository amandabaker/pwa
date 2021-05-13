
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/maybe-promotable/sw.js', { scope: '/pwa/maybe-promotable/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
