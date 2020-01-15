// mac left, windows right. So this needs to work with either layout.
const height = 40;
const width = 184;

// Windows
const startX = window.innerWidth - width;
const endX = window.innerWidth;

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
  const overlay = window.menubar.controlOverlay.getBoundingRect();

  const titlebar = document.getElementById('titlebar');
  titlebar.style.left = `${overlay.x ? 0 : overlay.width}px`;
  titlebar.style.right = `${overlay.x ? overlay.width : 0}px`;
  titlebar.style.top = '0px';
  titlebar.style.bottom = `${window.innerHeight - overlay.bottom}px`;

  const mainContent = document.getElementById('mainContent');
  mainContent.style.top = `${overlay.height}px`;
}

resizeTitleBar();
window.addEventListener('resize', resizeTitleBar);