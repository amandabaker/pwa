
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/nested-pwas/child/sw.js', { scope: '/pwa/nested-pwas/child/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}
