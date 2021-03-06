
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
  
  // Adjust size and position of the "title bar" div which holds the app name and input box
  const titleBar = document.getElementById('titleBar');
  titleBar.style.left = `${overlay.x ? 0 : overlay.width}px`;
  titleBar.style.right = `${overlay.x ? overlay.width : 0}px`;
  titleBar.style.top = '0px';
  titleBar.style.height = `${overlay.height}px`;
  titleBar.style.width = 'auto';

  // Adjust the height of the container that paints a background color behind the "title bar" area
  const titleBarContainer = document.getElementById('titleBarContainer');
  titleBarContainer.style.height = `${overlay.height}px`;

  // Adjust the top edge of the main scrollable content area
  const mainContent = document.getElementById('mainContent');
  mainContent.style.top = `${overlay.height}px`;
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

let eventCount = 0;
const onGeometrychange = (event) => {
  eventCount++;
  const countElement = document.getElementById('eventCount');
  countElement.textContent = eventCount;

  const visibleElement = document.getElementById('WCOEventVisible');
  visibleElement.textContent = `visible = ${event.visible}`;
  
  const rect = event.boundingRect;
  const rectElement = document.getElementById('WCOEventRect');
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

if (navigator.windowControlsOverlay &&
    navigator.windowControlsOverlay.ongeometrychange == null) {
  navigator.windowControlsOverlay.ongeometrychange = onGeometrychange;
}
