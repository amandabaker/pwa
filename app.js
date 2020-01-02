
const registerServiceWorker = async () => {
    try {
        await navigator.serviceWorker.register('/pwa/sw.js', { scope: '/pwa/'});
        console.log('Service worker registered');
    } catch (e) {
        console.log(`Registration failed: ${e}`);
    }
}

if (navigator.serviceWorker) {
    registerServiceWorker();
}

let count = 0;
const clickCountElement = document.getElementById("clickCount");

document.getElementById("clickMe").addEventListener("click", (event) => {
    clickCountElement.textContent = ++count;    
});