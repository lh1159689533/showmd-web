import { getElementById } from '@src/components/MDEditor/vditorEditor';

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
const numStars = 2048;
let centerX, centerY;
let stars = [],
  star;
let i;

function executeFrame() {
  moveStars();
  drawStars();
  requestAnimationFrame(executeFrame);
}

function initializeStars() {
  centerX = width / 2;
  centerY = height / 2;

  stars = [];
  for (i = 0; i < numStars; i++) {
    star = {
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      o: '0.' + Math.floor(Math.random() * 99) + 1
    };
    stars.push(star);
  }
}

function moveStars() {
  for (i = 0; i < numStars; i++) {
    star = stars[i];
    star.z--;

    if (star.z <= 0) {
      star.z = width;
    }
  }
}

function drawStars() {
  const focalLength = width * 2;
  let pixelX, pixelY, pixelRadius;
  ctx.fillStyle = "rgba(0,10,20,1)";
  ctx.fillRect(0, 0, width, height);
  for (i = 0; i < numStars; i++) {
    star = stars[i];

    pixelX = (star.x - centerX) * (focalLength / star.z);
    pixelX += centerX;
    pixelY = (star.y - centerY) * (focalLength / star.z);
    pixelY += centerY;
    pixelRadius = 1 * (focalLength / star.z);

    ctx.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
    ctx.fillStyle = "rgba(255, 255, 255, " + star.o + ")";
  }
}

function init() {
  canvas = getElementById("CanvasBG");
  ctx = canvas.getContext("2d");
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  initializeStars();
  executeFrame();
}

export default init;