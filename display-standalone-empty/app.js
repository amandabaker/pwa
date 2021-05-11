
const registerServiceWorker = async () => {
    try {
      await navigator.serviceWorker.register('/pwa/display-standalone-empty/sw.js', { scope: '/pwa/display-standalone-empty/'});
      console.log('Service worker registered');
    } catch (e) {
      console.log(`Registration failed: ${e}`);
    }
}
  
if (navigator.serviceWorker) {
  registerServiceWorker();
}