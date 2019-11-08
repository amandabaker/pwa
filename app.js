
const registerServiceWorker = async () => {
    try {
        await navigator.serviceWorker.register('/pwa/sw.js', { scope: '/pwa'});
        console.log('Service worker registered');
    } catch (e) {
        console.log(`Registration failed: ${e}`);
    }
}

if (navigator.serviceWorker) {
    registerServiceWorker();
}
