import { AnimationLoop } from './animation/AnimationLoop';
import { getCanvas, getCanvasContext } from './Context';
import { Ray } from './Ray';
import { LineSegment } from './types';

const canvas = getCanvas("myCanvas");
const context = getCanvasContext(canvas);

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const rays: Ray[] = [];
for (let i = 0; i < 10; i++) {
  const x1 = 200;
  const y1 = 200;
  const x2 = 300;;
  const y2 = 200 + i * 10;
  const color = {
    r: 255,
    g: 0,
    b: 0,
    a: 1,
  };
  rays.push(new Ray({
    x1,
    y1,
    x2,
    y2,
  }, color, 0, 1));
}

const reflector: LineSegment = {
  x1: 100,
  y1: 100,
  x2: 400,
  y2: 400,
};

const reflectedRays: Ray[] = rays.flatMap(ray => ray.reflect(reflector));

let t = 0;
const tMax = 1;
const tStep = 60 / 1000; // 60 FPS, one second loop

const animationLoop = new AnimationLoop((deltaTimeMs: number) => {
  context.fillStyle = 'lightblue';
  context.fillRect(0, 0, canvas.width, canvas.height);
  t += deltaTimeMs / 1000; // Convert ms to seconds
  if (t > tMax) {
    t = 0; // Reset time after one loop
  }

  for (const ray of reflectedRays) {
    ray.render(context, t);
  }
});

window.addEventListener('keydown', (event) => {
  // if space bar is pressed, toggle pause
  if (event.code === 'Space') {
    animationLoop.togglePause();
  }
})

animationLoop.start();