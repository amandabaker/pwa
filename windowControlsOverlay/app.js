
const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('/pwa/windowControlsOverlay/sw.js', { scope: '/pwa/windowControlsOverlay/'});
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}

// initialize the title bar to avoid the caption control overlay which
// could be in either the top right or top left corner
const initializeTitleBar = () => {
  const rect = window.navigator.controlsOverlay.getBoundingRect();

  const titleBar = document.getElementById("titleBar");
  // rect.x will be 0 if the overlay is on the left
  if (rect.x === 0) {
    titleBar.classList.add("leftOverlay");
  } else {
    titleBar.classList.add("rightOverlay");
  }
};

if (window.navigator.controlsOverlay &&
    window.navigator.controlsOverlay.visible) {
  initializeTitleBar();
}

const updateWCOInfo = () => {
  const wcoElement = document.getElementById('WCO');
  const visibleElement = document.getElementById('WCOVisible');
  const rectElement = document.getElementById('WCORect');
  if (navigator.windowControlsOverlay == undefined) {
    wcoElement.textContent = "navigator.windowControlsOverlay = undefined";
    visibleElement.textContent = "";
    rectElement.textContent = "";
  } else {
    wcoElement.textContent = "navigator.windowControlsOverlay";
    visibleElement.textContent = `visible = ${navigator.windowControlsOverlay.visible}`;
    const rect = navigator.windowControlsOverlay.getBoundingClientRect();
    rectElement.textContent = 
`getBoundingClientRect() = { 
  x: ${rect.x},
  y: ${rect.y},
  width: ${rect.width},
  height: ${rect.height},
  top: ${rect.top},
  right: ${rect.right},
  bottom: ${rect.bottom},
  left: ${rect.left}
}`;
  }
}

updateWCOInfo();