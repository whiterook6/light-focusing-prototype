import { AnimationLoop } from './AnimationLoop';
import { Emitter } from './Emitter';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
if (!canvas){
  throw new Error("Cannot get canvas");
}
const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error("Cannot get canvas context");
}

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
let circleRadius = 5;
const minCircleRadius = 5;
const maxCircleRadius = 300;

const emitters: Emitter[] = [];
for (let i = 0; i < 10; i++) {
  emitters.push(new Emitter(
    {
      x: canvas.width / 2,
      y: canvas.height / 2 + i * 5 - 25, // Staggered vertical positions
    }, {
      r: 0,
      g: 0,
      b: 255,
      a: 1, // Blue color with full opacity
    },
    0,
    Math.PI / 4
  ));
}

const animationLoop = new AnimationLoop((deltaTimeMs: number) => {
  circleRadius += deltaTimeMs * 0.1; // Increase radius over time
  if (circleRadius > maxCircleRadius) {
    circleRadius = minCircleRadius; // Reset radius if it exceeds max
  }

  ctx!.fillStyle = 'lightblue';
  ctx!.fillRect(0, 0, canvas.width, canvas.height);

  for (const emitter of emitters) {
    emitter.draw(ctx!, circleRadius);
  }
});

window.addEventListener('keydown', (event) => {
  // if space bar is pressed, toggle pause
  if (event.code === 'Space') {
    animationLoop.togglePause();
  }
})

animationLoop.start();