import { AnimationLoop } from './animation/AnimationLoop';
import { getCanvas, getCanvasContext } from './Context';
import { Mirror } from './Mirror';
import { Ray } from './Ray';


const canvas = getCanvas("myCanvas");
const context = getCanvasContext(canvas);

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let t = 0;
const tMax = 1;
const tSpread = 0.05; // draw 1/20th on either side of the T point

const rays: Ray[] = Array.from({ length: 100 }, (_, i) => {
  const angle = ((i / 100) * 2 * Math.PI); // Spread rays evenly in a circle
  const x1 = canvas.width / 2;
  const y1 = canvas.height / 2;
  const x2 = x1 + Math.cos(angle) * 500;
  const y2 = y1 + Math.sin(angle) * 500;
  return new Ray(
    x1,
    y1,
    x2,
    y2,
    0,
    1
  );
});

const mirror = new Mirror({
  position: {x: canvas.width / 2, y: canvas.height / 3},
  normal: {dx: Math.cos(12), dy: Math.sin(12)},
  length: 200
});

const reflectedRays = rays.flatMap(ray => mirror.splitAndReflectSegment(ray));

const animationLoop = new AnimationLoop((deltaTimeMs: number) => {
  context.fillStyle = 'lightblue';
  context.fillRect(0, 0, canvas.width, canvas.height);
  t += deltaTimeMs / 1000;
  if (t > tMax + tSpread) {
    t = -tSpread; // Reset time after one loop
  } else if (t < -tSpread) {
    t = tMax + tSpread; // Reset time after one loop
  }

  const t1 = Math.max(0, t - tSpread);
  const t2 = Math.min(1, t + tSpread);
  context.strokeStyle = 'red';

  for (const ray of reflectedRays){
    ray.render(context, t1);
  }

  mirror.render(context);
});

window.addEventListener('keydown', (event) => {
  // if space bar is pressed, toggle pause
  if (event.code === 'Space') {
    animationLoop.togglePause();
  } else if (event.code === 'Period') {
    animationLoop.step();
  } else if (event.code === 'Comma') {
    animationLoop.stepBack();
  }
});

animationLoop.start();