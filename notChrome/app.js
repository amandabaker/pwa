const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/notChrome/sw.js', { scope: '/pwa/notChrome/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}