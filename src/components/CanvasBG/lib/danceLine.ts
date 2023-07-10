import { getElementById } from '@src/components/Editor/domUtil';

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;

let zhongX = 0;
let zhongY = 0;
const balls = [];

function randomNum(x, y) {
  return Math.floor(Math.random() * (y - x + 1) + x);
}

function Ball() {
  // this.r = randomNum(0.1, 3);
  this.r = 2;
  this.color = 'white';

  this.x = randomNum(this.r, width - this.r);
  this.y = randomNum(this.r, height - this.r);

  this.speedX = randomNum(1, 3) * (randomNum(0, 1) ? 1 : -1);
  this.speedY = randomNum(1, 3) * (randomNum(0, 1) ? 1 : -1);
}

Ball.prototype.move = function () {
  this.x += this.speedX * 0.2;
  this.y += this.speedY * 0.2;

  if (this.x <= this.r) {
    this.x = this.r;
    this.speedX *= -1;
  }
  if (this.x >= width - this.r) {
    this.x = width - this.r
    this.speedX *= -1;
  }
  //小球碰到上边界的处理 反弹
  if (this.y <= this.r) {
    this.y = this.r;
    //反弹
    this.speedY *= -1;
  }
  //小球碰到下边界的处理 反弹
  if (this.y >= height - this.r) {
    this.y = height - this.r;
    //反弹
    this.speedY *= -1;
  }
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
}

function ballAndMouse(obj) {
  const disX = Math.abs(zhongX - obj.x);
  const disY = Math.abs(zhongY - obj.y);
  return Math.sqrt(disX * disX + disY * disY);
}

function ballAndBall(obj1, obj2) {
  const disX = Math.abs(obj1.x - obj2.x);
  const disY = Math.abs(obj1.y - obj2.y);
  return Math.sqrt(disX * disX + disY * disY);
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(95, 158, 160, 1)";
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].draw();
    if (ballAndMouse(balls[i]) < 130) {
      ctx.lineWidth = (130 - ballAndMouse(balls[i])) * 1.5 / 130;
      ctx.beginPath();
      ctx.moveTo(balls[i].x, balls[i].y);
      ctx.lineTo(zhongX, zhongY);
      ctx.strokeStyle = balls[i].color;
      ctx.stroke();
    }
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = 0; j < balls.length; j++) {
      if (ballAndBall(balls[i], balls[j]) < 80) {
        ctx.lineWidth = (80 - ballAndBall(balls[i], balls[j])) * 0.6 / 80;
        ctx.globalAlpha = (130 - ballAndBall(balls[i], balls[j])) * 1 / 80;
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.strokeStyle = balls[i].color;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1.0;

  requestAnimationFrame(draw);
}

function createBall() {
  const ballNum = Math.floor(0.0001 * width * height);
  for (let i = 0; i < ballNum; i++) {
    const ball = new Ball();
    balls.push(ball);
  }
}

function init() {
  canvas = getElementById("CanvasBG");
  ctx = canvas.getContext("2d");
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  createBall();

  canvas.onmousemove = function (event) {
    event = event || window.event;
    zhongX = event.offsetX;
    zhongY = event.offsetY;
  }

  draw();
}

export default init;