import { getElementById } from '@src/components/Editor/domUtil';

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let arr = null;

const str = "0101010101010101010101".split("");
const len = str.length;

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0f0";
  ctx.font = '12px';
  arr.forEach((i, index) => {
    ctx.fillText(str[Math.floor(len * Math.random())], index * 20, i + 10);
    arr[index] = i > height || i > 28888 * Math.random() ? 0 : i + 10;
  });
  requestAnimationFrame(draw)
}

function onResize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  ctx.fillRect(0, 0, width, height);
}

function init() {
  canvas = getElementById("CanvasBG");
  ctx = canvas.getContext("2d");
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  arr = new Array(Math.ceil(width / 10)).fill(0);
  draw();

  window.onresize = onResize;
}

export default init;