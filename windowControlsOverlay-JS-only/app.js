
const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('/pwa/windowControlsOverlay-JS-only/sw.js', { scope: '/pwa/windowControlsOverlay-JS-only/'});
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}

const layoutTitleBarForOverlay = () => {
  const overlay = navigator.windowControlsOverlay.getBoundingClientRect();
  
  const titleBar = document.getElementById('titleBar');
  titleBar.style.left = `${overlay.x ? 0 : overlay.width}px`;
  titleBar.style.right = `${overlay.x ? overlay.width : 0}px`;
  titleBar.style.top = '0px';
  titleBar.style.height = `${overlay.height}px`
  titleBar.style.width = 'auto';
}

if (window.navigator.windowControlsOverlay &&
    window.navigator.windowControlsOverlay.visible) {
  layoutTitleBarForOverlay();
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
  layoutTitleBarForOverlay();
  updateWCOInfo();
}

window.addEventListener('resize', onResize);
