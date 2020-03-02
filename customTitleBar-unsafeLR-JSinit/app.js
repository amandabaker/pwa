
/* ----------------------------------------- *
 * Fake safe-area-top-inset-inline-start/end *
 * ----------------------------------------- */ 

// This code fakes out what the browser will do when the environment variables are supported
const insetLeft = "--unsafe-area-top-inset-left";
const insetRight = "--unsafe-area-top-inset-right";

const height = 40;
const width = 276;

let isWindows = true;
let isLTR = true;

const setProperty = (name, value) => {
  return document.documentElement.style.setProperty(name, value);
}

const updateCSSVars = () => {
  if (isWindows && isLTR || !isWindows && !isLTR) {
    // windows LTR or mac RTL
    setProperty(insetLeft, `${window.innerWidth - width}px`);
    setProperty(insetRight, 0);
  } else if (isWindows && !isLTR || !isWindows && isLTR) { 
    // windows RTL or mac LTR
    setProperty(insetLeft, 0);
    setProperty(insetRight, `${window.innerWidth - width}px`);
  } else {
    console.error("This shouldn't have happened.")
  }
}

updateCSSVars();
window.addEventListener('resize', updateCSSVars);

/* ----------------------------------- *
 * Fake controlsOverlay JavaScript API *
 * ----------------------------------- */

window.navigator.controlsOverlay = {};
window.navigator.controlsOverlay.overlay = {};
window.navigator.controlsOverlay.visible = true;

const updateSetBoundingRect = () => {
  window.navigator.controlsOverlay.getBoundingRect = () => {
    const startX = isWindows ? window.innerWidth - width : 0;
    const endX = isWindows ? window.innerWidth : width;

    return {
      x: startX,
      y: 0,
      width: width,
      height: height,

      top: 0,
      right: endX,
      bottom: height,
      left: startX,
    };
  }
}
updateSetBoundingRect();

const updateEverything = () => {
  // remove left/right class
  const titleBarContainer = document.getElementById("titleBarContainer");
  titleBarContainer.classList.remove("leftOverlay");
  titleBarContainer.classList.remove("rightOverlay");

  updateCSSVars();
  updateSetBoundingRect();

  // update browser emulation state text. 
  const browser = isWindows ? "Windows" : "Mac";
  const direction = isLTR ? "LTR" : "RTL";
  document.getElementById("browserEmulation").textContent = `Browser: ${browser}  Language: ${direction}`;

  // re-initialize the title bar after changing layout of overlay
  if (initializeTitleBar) {
    initializeTitleBar();
  }
}

// helper button to toggle between emulating Mac or Windows
const toggleWinMac = () => {
  const button = document.getElementById("toggleWinMac");
  isWindows = !isWindows;
  button.textContent = isWindows ? "Emulate Mac Overlay" : "Emulate Windows Overlay";
  updateEverything();
}
document.getElementById("toggleWinMac").addEventListener("click", toggleWinMac);

const toggleLTRRTL = () => {
  const button = document.getElementById("toggleLTRRTL");
  isWindows = !isWindows;
  button.textContent = isLTR ? "Emulate RTL Browser Language" : "Emulate LTR Browser Language";
  updateEverything();
}
document.getElementById("toggleLTRRTL").addEventListener("click", toggleLTRRTL);

/* --------------- *
 * Real code below *
 * --------------- */

// initialize the title bar to avoid the caption control overlay which
// could be in either the top right or top left corner
const initializeTitleBar = () => {
  const rect = window.navigator.controlsOverlay.getBoundingRect();

  const titleBarContainer = document.getElementById("titleBarContainer");
  // rect.x will be 0 if the overlay is on the left
  if (rect.x === 0) {
    titleBarContainer.classList.add("leftOverlay");
  } else {
    titleBarContainer.classList.add("rightOverlay");
  }
};

if (window.navigator.controlsOverlay &&
    window.navigator.controlsOverlay.visible) {
  initializeTitleBar();
}

// register a service worker for the PWA
const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/customTitleBar-unsafeLR-JSinit/sw.js', 
                                             { scope: '/pwa/customTitleBar-unsafeLR-JSinit/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
};

if (navigator.serviceWorker) {
  registerServiceWorker();
}