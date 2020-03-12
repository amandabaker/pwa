
// This code fakes out what the browser will do when the environment variables are supported
const inlineStart = "--unsafe-area-top-inset-inline-start";
const inlineEnd = "--unsafe-area-top-inset-inline-end";

const height = 40;
const width = 276;

let isWindows = true;

const setProperty = (name, value) => {
  return document.documentElement.style.setProperty(name, value);
}

const updateCSSVars = () => {
  if (isWindows) {
    setProperty(inlineStart, `${window.innerWidth - width}px`);
    setProperty(inlineEnd, 0);
  } else { // mac
    setProperty(inlineStart, 0);
    setProperty(inlineEnd, `${window.innerWidth - width}px`);
  }
}

updateCSSVars();
window.addEventListener('resize', updateCSSVars);

// toggle between emulating Mac or Windows
const toggleWinMac = () => {
  const button = document.getElementById("toggleWinMac");
  isWindows = !isWindows;
  updateCSSVars();
  button.textContent = isWindows ? "Emulate Mac Overlay" : "Emulate Windows Overlay";
}
document.getElementById("toggleWinMac").addEventListener("click", toggleWinMac);

// register a service worker for the PWA
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/customTitleBar-inset-inline/sw.js', 
                                             { scope: '/pwa/customTitleBar-inset-inline/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}