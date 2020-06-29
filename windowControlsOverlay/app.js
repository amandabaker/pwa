
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
// NOTE: this assumes that the browser language will never switch from left to right
// or vice versa. It can only enable the overlay, but it cannot turn it off (for now).
const initializeTitleBar = () => {
  const rect = navigator.windowControlsOverlay.getBoundingRect();

  const titleBar = document.getElementById("titleBar");

  // rect.x will be 0 if the overlay is on the left
  if (rect.x === 0) {
    titleBar.classList.add("leftOverlay");
  } else {
    titleBar.classList.add("rightOverlay");
  }

  const mainContent = document.getElementById("mainContent");
  mainContent.classList.add("overlay");
};

if (window.navigator.controlsOverlay &&
    window.navigator.controlsOverlay.visible) {
  initializeTitleBar();
}

const updateWCOInfo = () => {
  const wcoElement = document.getElementById('WCO');
  const visibleElement = document.getElementById('WCOVisible');
  const rectElement = document.getElementById('WCORect');
  if (!navigator.windowControlsOverlay) {
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

const onResize = () => {
  initializeTitleBar();
  updateWCOInfo();
}

window.addEventListener('resize', onResize);