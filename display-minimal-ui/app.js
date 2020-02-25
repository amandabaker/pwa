
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/display-minimal-ui/sw.js', { scope: '/pwa/display-minimal-ui/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
