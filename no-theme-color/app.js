
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/no-theme-color/sw.js', { scope: '/pwa/no-theme-color/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
