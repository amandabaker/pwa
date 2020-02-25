
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/display-fullscreen/sw.js', { scope: '/pwa/display-fullscreen/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
