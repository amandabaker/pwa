// mac left, windows right. So this needs to work with either layout.
const height = 40;
const width = 276;

// Windows
let startX = window.innerWidth - width;
let endX = window.innerWidth;

// // Mac
// const startX = 0;
// const endX = width;

window.menubar.controlOverlay = {};
window.menubar.controlOverlay.overlay = {};
window.menubar.controlOverlay.getBoundingRect = () => {
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

const resizeTitleBar = () => {
  if (!window.menubar.controlOverlay) {
    return;
  }

  const overlay = window.menubar.controlOverlay.getBoundingRect();

  document.documentElement.style.setProperty('--title-bar-inset-left', 
                                             `${overlay.x ? 0 : overlay.width}px`);
  document.documentElement.style.setProperty('--title-bar-inset-right', 
                                             `${overlay.x ? overlay.width : 0}px`);
  document.documentElement.style.setProperty('--title-bar-height', 
                                             `${overlay.height}px`);
}

resizeTitleBar();
window.addEventListener('resize', resizeTitleBar);


const registerServiceWorker = async () => {
  try {
      await navigator.serviceWorker.register('/pwa/customTitleBar-cssVar/sw.js', { scope: '/pwa/customTitleBar-cssVar/'});
      console.log('Service worker registered');
  } catch (e) {
      console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}