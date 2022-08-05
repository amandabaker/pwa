const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('/pwa/how-does-scope-work/sw.js', { scope: '/pwa/how-does-scope-work/'});
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
