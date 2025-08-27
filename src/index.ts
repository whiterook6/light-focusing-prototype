import { AnimationLoop } from './animation/AnimationLoop';
import { getCanvas, getCanvasContext } from './Context';
import { Mirror } from './Mirror';
import { Ray } from './types';


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
  const angle = ((i / 100) * Math.PI) - (Math.PI / 2); // Spread rays evenly in a circle
  const x1 = 200;
  const y1 = 200;
  const x2 = 200 + Math.cos(angle) * 100;
  const y2 = 200 + Math.sin(angle) * 100;
  return {
    x1,
    y1,
    x2,
    y2,
    t1: 0,
    t2: 1,
  };
});

const mirror = new Mirror({
  position: {x: 250, y: 150},
  normal: {dx: 0, dy: 1},
  length: 100
});

const reflectedRays = rays.flatMap(ray => mirror.splitAndReflectSegment(ray));

const animationLoop = new AnimationLoop((deltaTimeMs: number) => {
  context.fillStyle = 'lightblue';
  context.fillRect(0, 0, canvas.width, canvas.height);
  t += 0.01;
  if (t > tMax + tSpread) {
    t = -tSpread; // Reset time after one loop
  }

  const t1 = Math.max(0, t - tSpread);
  const t2 = Math.min(1, t + tSpread);
  context.strokeStyle = 'red';

  for (const ray of reflectedRays){
    if (ray.t2 < t1 || ray.t1 > t2) {
      continue;
    }
    
    const xStart = ray.x1 + (ray.x2 - ray.x1) * t1;
    const yStart = ray.y1 + (ray.y2 - ray.y1) * t1;
    const xEnd = ray.x1 + (ray.x2 - ray.x1) * t2;
    const yEnd = ray.y1 + (ray.y2 - ray.y1) * t2;

    context.beginPath();
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.stroke();
  }

  mirror.render(context);
});

window.addEventListener('keydown', (event) => {
  // if space bar is pressed, toggle pause
  if (event.code === 'Space') {
    animationLoop.togglePause();
  }
})

animationLoop.start();