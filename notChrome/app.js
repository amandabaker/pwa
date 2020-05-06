const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/customTitleBar/sw.js', { scope: '/pwa/customTitleBar/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}