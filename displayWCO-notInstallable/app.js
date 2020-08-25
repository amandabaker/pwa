
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/displayWCO-notInstallable/sw.js', { scope: '/pwa/displayWCO-notInstallable/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
