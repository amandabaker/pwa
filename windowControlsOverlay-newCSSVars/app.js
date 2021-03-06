
// global
let geometrychangeCount = 0;

const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('/pwa/windowControlsOverlay-newCSSVars/sw.js', { scope: '/pwa/windowControlsOverlay-newCSSVars/'});
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}

document.children[0].classList.add("testWin");

// Button handlers for emulating different orientations
const resetEmulation = () => {
  document.children[0].classList.remove('emulateWin');
  document.children[0].classList.remove('emulateMac');
  updateWCOInfo();
}

const emulateWin = () => {
  document.children[0].classList.remove('emulateMac');
  document.children[0].classList.add('emulateWin');
  updateWCOInfo();
}

const emulateMac = () => {
  document.children[0].classList.remove('emulateWin');
  document.children[0].classList.add('emulateMac');
  updateWCOInfo();
}

// Button handler for changing theme-color via meta tag
const toggleHCThemeColor = () => {
  const oldThemeColorElement = 
      document.getElementsByTagName('meta').namedItem("theme-color");
  
  // If there was an existing theme-color element, delete it. 
  if (oldThemeColorElement){
    oldThemeColorElement.remove();
    return;
  }

  // Otherwise, add one. 
  const themeColorElement = document.createElement("meta");
  themeColorElement.name = "theme-color";
  // Commented code below does not work since it returns the color name,
  //  e.g. "ActiveText". I'm just leaving it as a reminder that this approach 
  // was attempted at one point, so don't try again. 
  // themeColorElement.content = 
  //   getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
  themeColorElement.content = 
      getComputedStyle(document.getElementById("titleBarContainer"))
      .getPropertyValue('background-color');
  document.head.appendChild(themeColorElement);
}

const logJSBounds = () => {
  const wcoElement = document.getElementById('WCO');
  const visibleElement = document.getElementById('WCOVisible');
  const rectElement = document.getElementById('WCORect');

  if (!navigator.windowControlsOverlay) {
    wcoElement.textContent = "navigator.windowControlsOverlay = undefined";
    visibleElement.textContent = "";
    rectElement.textContent = "";
    return;
  }

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
}

const logCSSRect = () => {
  const cssElement = document.getElementById('WCOCss');
  const cssElementTest = document.getElementById('WCOCssTest');

  // This mapping should match the #WCOCssTest style in ./style.css
  let x = getComputedStyle(cssElementTest).getPropertyValue('padding-left');
  if (x == "123.45px")
    x = "undefined";

  let width = getComputedStyle(cssElementTest).getPropertyValue('padding-right');
  if (width == "123.45px")
    width = "undefined";

  let y = getComputedStyle(cssElementTest).getPropertyValue('padding-top');
  if (y == "123.45px")
    y = "undefined";

  let height= getComputedStyle(cssElementTest).getPropertyValue('padding-bottom');
  if (height == "123.45px")
    height = "undefined";

  cssElement.textContent =
`titlebar-area-x: ${x},
titlebar-area-width: ${width},
titlebar-area-y: ${y},
titlebar-area-height: ${height},
`;

  // Show warning if the CSS env()s evaluate to an empty rect.
  const cssEmpty = document.getElementById("CSSEnvsEmptyRect");
  if (height == "0px" && width == "0px") {
    cssEmpty.style.visibility = "visible";
  } else {
    cssEmpty.style.visibility = "hidden";
  }
}

// Logging stuff in UI should all go below here.
const updateWCOInfo = () => {
  logJSBounds();
  logCSSRect();

  const geometrychangeCountElement = document.getElementById('WCOGeometrychangeCount');
  geometrychangeCountElement.textContent = `geometrychange count: ${geometrychangeCount}`;

}
updateWCOInfo();

const onGeometryChange = () => {
  geometrychangeCount++;
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