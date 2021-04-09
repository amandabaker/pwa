
const registerServiceWorker = async () => {
    try {
      await navigator.serviceWorker.register('/pwa/wco-empty/sw.js', { scope: '/pwa/wco-empty/'});
      console.log('Service worker registered');
    } catch (e) {
      console.log(`Registration failed: ${e}`);
    }
}
  
if (navigator.serviceWorker) {
  registerServiceWorker();
}