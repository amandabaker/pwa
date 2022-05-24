const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('/pwa/widgets/sw.js', { scope: '/pwa/widgets/'});
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}