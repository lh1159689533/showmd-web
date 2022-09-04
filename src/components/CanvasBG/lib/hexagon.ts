import { getElementById } from '@src/components/Editor/vditorEditor';

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
const particles = [];
const settings = {
  speed: 1,
  lifeTime: 1000,
  maxParticles: 1024,
  lineLength: 35,
  radius: 0.6,
};
// 方向
const dirVecs = [[1, 0], rotate([1, 0], 120), rotate([1, 0], 240)];

function rotate(vec, angle) {
  // convert the angle from degrees to radians
  angle = (angle * Math.PI) / 180;
  return [vec[0] * Math.cos(angle) - vec[1] * Math.sin(angle), vec[0] * Math.sin(angle) + vec[1] * Math.cos(angle)];
}

function particle() {
  this.x = Math.random() > 0.5 ? 800 : -800;
  this.y = 0;
  this.age = 0;
  // 从方向里随机取一个值，0-2
  this.dir = dirVecs[Math.floor(Math.random() * 3)];
  // 时间随机颜色
  // H：0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360。
  // S：取值为：0.0% - 100.0%；0% 意味着灰色，而 100% 是全彩
  // L：取值为：0.0% - 100.0%；0% 是黑色，100% 是白色。
  this.color = 'hsl(' + ((Date.now() / 240.0) % 360.0) + ', 84%, 67%)';
}

particle.prototype.updateAndDraw = function () {
  this.age++;
  // 滚动时间能整除边长 则表示要转向了
  if (this.age % settings.lineLength === 0) {
    const dir1 = rotate(this.dir, 60);
    const dir2 = rotate(this.dir, -60);

    let options = [];

    options = [dir1, dir2];

    this.dir = options[Math.floor(Math.random() * options.length)];
  }

  ctx.fillStyle = this.color;
  ctx.beginPath();
  // 画圆
  ctx.arc(width / 2.0 + this.x, height / 2.0 + this.y, settings.radius, 0, 6.3);

  // ctx.shadowBlur = settings.radius / 10;
  // ctx.shadowColor = this.color;
  ctx.fill();

  this.x += this.dir[0] * settings.speed;
  this.y += this.dir[1] * settings.speed;
};

function updateAndDraw() {
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgb(55, 65, 81, 0.03)';
  ctx.fillRect(0, 0, width, height);
  // ctx.globalCompositeOperation = 'lighter';
  ctx.globalCompositeOperation = 'source-over';

  for (let i = particles.length - 1; i >= 0; i--) {
    // 移动粒子
    particles[i].updateAndDraw();
    if (particles[i].age > settings.lifeTime) {
      // remove the particle if it is to old
      particles.splice(i, 1);
    }
  }

  if (particles.length < settings.maxParticles) {
    // if more particles can be added
    if (Math.random() > 0.9) {
      particles.push(new particle());
    }
  } else if (particles.length > settings.maxParticles) {
    // if there are two many particles
    particles.splice(0, settings.maxParticles);
  }

  requestAnimationFrame(updateAndDraw);
}

function onResize() {
  (width = canvas.width = window.innerWidth), (height = canvas.height = window.innerHeight);

  // particles.length = 0; // 重加载的时候是否需要清除粒子树
  ctx.fillStyle = '#374151';
  ctx.fillRect(0, 0, width, height);
}

function init() {
  canvas = getElementById('CanvasBG');

  ctx = canvas.getContext('2d');
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  ctx.fillStyle = '#374151';
  ctx.fillRect(0, 0, width, height);

  window.onresize = onResize;

  updateAndDraw();
}

export default init;