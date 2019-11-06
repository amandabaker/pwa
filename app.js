
const registerServiceWorker = async () => {
    try {
        await navigator.serviceWorker.register('./sw.js')
        console.log('Service worker registered');
    } catch (e) {
        console.log(e);
    }
}

if (navigator.serviceWorker) {
    registerServiceWorker();
}

window.onload = () => {
    const fetchButton = document.getElementById('fetchFilesButton');
    fetchButton.onclick = () => fetch('app.js');
}