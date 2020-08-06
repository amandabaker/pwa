
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
// NOTE: this assumes that the browser language will never switch from left to
// right or vice versa. It can only enable the overlay, but it cannot turn it
// off (for now).
const initializeTitleBar = () => {
  if (!navigator.windowControlsOverlay || 
      !navigator.windowControlsOverlay.visible) {
    return;
  }

  const rect = navigator.windowControlsOverlay.getBoundingClientRect();

  const titleBar = document.getElementById("titleBar");

  // rect.x will be 0 if the overlay is on the left
  if (rect.x === 0 && rect.right != window.innerWidth) {
    titleBar.classList.add("leftOverlay");
  } else {
    titleBar.classList.add("rightOverlay");
  }

  const mainContent = document.getElementById("mainContent");
  mainContent.classList.add("overlay");

  const titleBarContainer = document.getElementById("titleBarContainer");
  titleBarContainer.classList.add("overlay");
};

window.onload = () => {
  initializeTitleBar();
}

const updateWCOInfo = () => {
  const wcoElement = document.getElementById('WCO');
  const visibleElement = document.getElementById('WCOVisible');
  const rectElement = document.getElementById('WCORect');
  const cssElement = document.getElementById('WCOCss');
  const cssElementTest = document.getElementById('WCOCssTest');
  if (!navigator.windowControlsOverlay) {
    wcoElement.textContent = "navigator.windowControlsOverlay = undefined";
    visibleElement.textContent = "";
    rectElement.textContent = "";
  } else {
    wcoElement.textContent = "navigator.windowControlsOverlay";
    visibleElement.textContent = 
        `visible = ${navigator.windowControlsOverlay.visible}`;
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

    const paddingLeft = getComputedStyle(cssElementTest).getPropertyValue('padding-left');
    const paddingRight = getComputedStyle(cssElementTest).getPropertyValue('padding-right');
  cssElement.textContent =
`top_inset_left: ${paddingLeft},
top_inset_right: ${paddingRight}
`;

    const cssError = document.getElementById("CSSEnvsEvaluateTo0");
    if (paddingLeft == "0px" && paddingRight == "0px") {
      cssError.style.visibility = "visible";
    } else {
      cssError.style.visibility = "hidden";
    }
  }
}

updateWCOInfo();

const onGeometryChange = () => {
  initializeTitleBar();
  updateWCOInfo();
}

try {
  navigator.windowControlsOverlay.addEventListener('geometrychange',
                                                   onGeometryChange);
} catch (e) {
  console.error(e);
  
  // Show errors in webpage so it's obvious that something is broken.
  const errorDiv = document.getElementById("GeometryChangeListenerError");
  errorDiv.style.visibility = "visible";

  // If geometry change is not enabled, update on resize instead.
  window.addEventListener('resize', onGeometryChange);
}