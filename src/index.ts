import { AnimationLoop } from "./animation/AnimationLoop";
import { getCanvas, getCanvasContext } from "./Context";
import { VectorGizmo } from "./gizmos/VectorGizmo";
import { Mirror } from "./raytracing/Mirror";
import { ParabolicMirror } from "./raytracing/ParabolicMirror";
import { Ray } from "./raytracing/Ray";
import { PointEmitter } from "./raytracing/PointEmitter";
import { LinearEmitter } from "./raytracing/LinearEmitter";
import { TimeRange } from "./types";

const canvas = getCanvas("myCanvas");
const context = getCanvasContext(canvas);

const resizeCanvas = () => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  context.setTransform(dpr, 0, 0, dpr, 0, 0); // scale all drawing
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let t = 0;
const tMax = 1;
const tSpread = 0.05; // draw 1/20th on either side of the T point

// Create emitters
const pointEmitter = new PointEmitter(
  {
    x: canvas.width / window.devicePixelRatio / 2,
    y: canvas.height / window.devicePixelRatio / 2,
  },
  100, // ray count
  500, // ray length
  { start: 0, end: tMax },
  0, // start angle
  2 * Math.PI, // end angle
  "orange", // color
);

// Example of a linear emitter
const linearEmitter = new LinearEmitter(
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  Math.PI / 2, // direction (downward)
  20, // ray count
  500, // ray length
  { start: 0, end: tMax },
  "blue", // color
);

// Generate rays from emitters
let rays: Ray[] = [...pointEmitter.generateRays(), ...linearEmitter.generateRays()];

const parabolicMirror = new ParabolicMirror({
  vertex: { x: 709, y: 90 },
  focalLength: 200,
  width: 200,
  orientation: Math.PI / 4, // 45 degrees rotation
});

const mirrors: Mirror[] = [
  // new FlatMirror({
  //   position: {
  //     x: canvas.width / window.devicePixelRatio / 2,
  //     y: canvas.height / window.devicePixelRatio / 3,
  //   },
  //   normal: { dx: Math.cos(12), dy: Math.sin(12) },
  //   length: 200,
  // }),
  // new FlatMirror({
  //   position: {
  //     x: canvas.width / window.devicePixelRatio / 2 - 100,
  //     y: canvas.height / window.devicePixelRatio / 3,
  //   },
  //   normal: { dx: Math.cos(12), dy: Math.sin(12) },
  //   length: 200,
  // }),
  parabolicMirror,
];

const gizmo = new VectorGizmo(canvas);

let anyBounced = true;
for (let i = 0; i < 10 && anyBounced; i++) {
  anyBounced = false;
  for (const mirror of mirrors) {
    rays = rays.flatMap((ray) => {
      const newRaysFromThisMirror = mirror.splitAndReflectSegment(ray);
      if (newRaysFromThisMirror.length > 0) {
        anyBounced = true;
        return newRaysFromThisMirror;
      } else {
        return [ray];
      }
    });
  }
}

const animationLoop = new AnimationLoop((deltaTimeMs: number) => {
  context.fillStyle = "lightblue";
  context.fillRect(0, 0, canvas.width, canvas.height);
  t += deltaTimeMs / 1000;
  if (t > tMax + tSpread) {
    t = -tSpread; // Reset time after one loop
  } else if (t < -tSpread) {
    t = tMax + tSpread; // Reset time after one loop
  }

  const renderRange: TimeRange = { start: t - tSpread, end: t + tSpread };

  for (const ray of rays) {
    ray.render(context, renderRange);
  }

  for (const mirror of mirrors) {
    mirror.render(context);
  }

  // Render emitters
  pointEmitter.render(context);
  linearEmitter.render(context);

  gizmo.render(context);
});

window.addEventListener("keydown", (event) => {
  // if space bar is pressed, toggle pause
  if (event.code === "Space") {
    animationLoop.togglePause();
  } else if (event.code === "Period") {
    animationLoop.step();
  } else if (event.code === "Comma") {
    animationLoop.stepBack();
  }
});

animationLoop.start();
