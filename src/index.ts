import { AnimationLoop } from "./animation/AnimationLoop";
import { getCanvas, getCanvasContext } from "./Context";
import { Mirror } from "./raytracing/Mirror";
import { ParabolicMirror } from "./raytracing/ParabolicMirror";
import { Ray } from "./raytracing/Ray";
import { LinearEmitter } from "./raytracing/LinearEmitter";
import { TimeRange } from "./types";
import { Grid } from "./Grid";
import { Emitter } from "./raytracing/Emitter";
import { Direction } from "./helpers";
import { FlatMirror } from "./raytracing/FlatMirror";

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
const tMax = 3;
const tSpread = 0.05; // draw 1/20th on either side of the T point

const emitters: Emitter[] = [
  new LinearEmitter(
    { x: 100, y: 200 },
    { x: 100, y: 500 },
    0,
    50,
    3000,
    { start: 0, end: tMax },
    "red",
  ), new LinearEmitter(
    { x: 100, y: 195 },
    { x: 100, y: 495 },
    -0.01,
    50,
    3000,
    { start: 0, end: tMax },
    "green",
  ), new LinearEmitter(
    { x: 100, y: 205 },
    { x: 100, y: 505 },
    0.01,
    50,
    3000,
    { start: 0, end: tMax },
    "blue",
  )
];

// Generate rays from emitters
let rays: Ray[];

const parabolicMirror = new ParabolicMirror({
  vertex: { x: 1000, y: 350 },
  focalLength: 700,
  width: 300,
  orientation: Direction.LEFT,
});

const mirrors: Mirror[] = [
  new FlatMirror({
    position: { x: 450, y: 350 },
    normal: { dx: 1, dy: 1 },
    length: 200,
  }),
  parabolicMirror
];

// Function to recalculate rays when mirror orientation changes
function recalculateRays() {
  rays = emitters.flatMap(emitter => emitter.generateRays());

	let anyBounced = true;
	for (let i = 0; i < 10 && anyBounced; i++) {
		anyBounced = false;
		const nextRays: Ray[] = [];
		for (const ray of rays) {
			let closestMirror: Mirror | null = null;
			let closestDistance = Infinity;
			for (const mirror of mirrors) {
				const d = mirror.distanceToIntersection(ray);
				if (d < closestDistance) {
					closestDistance = d;
					closestMirror = mirror;
				}
			}
			if (closestMirror && Number.isFinite(closestDistance)) {
				const split = closestMirror.splitAndReflectSegment(ray);
				if (split.length > 0) {
					nextRays.push(...split);
					anyBounced = true;
					continue;
				}
			}
			nextRays.push(ray);
		}
		rays = nextRays;
	}
}

// Create grid with default options (100px major spacing, 2 minor divisions = 50px minor spacing)
const grid = new Grid({
  minorColor: "rgba(255, 255, 255, 0.1)",
  majorColor: "rgba(255, 255, 255, 0.2)",
  majorSpacing: 100,
  minorDivisions: 4,
});

// Initial ray calculation
recalculateRays();

const animationLoop = new AnimationLoop((deltaTimeMs: number) => {
  // Draw dark background
  context.fillStyle = "#1a1a1a"; // Dark gray background
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  const canvasWidth = canvas.width / window.devicePixelRatio;
  const canvasHeight = canvas.height / window.devicePixelRatio;
  grid.render(context, canvasWidth, canvasHeight);

  emitters.forEach(emitter => emitter.render(context));

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
});


document.getElementById("playPauseButton")?.addEventListener("click", () => {
  animationLoop.togglePause();
});
document.getElementById("stepForwardButton")?.addEventListener("click", () => {
  animationLoop.step();
});
document.getElementById("stepBackButton")?.addEventListener("click", () => {
  animationLoop.stepBack();
});
document.getElementById("resetButton")?.addEventListener("click", () => {
  t = 0;
  animationLoop.start();
});


window.addEventListener("keydown", (event) => {
  // if space bar is pressed, toggle pause
  if (event.code === "Space") {
    animationLoop.togglePause();
  } else if (event.code === "Period") {
    animationLoop.step();
  } else if (event.code === "Comma") {
    animationLoop.stepBack();
  } else if (event.code === "ArrowLeft") {
    // Rotate mirror counterclockwise by 5 degrees
    const currentOrientation = parabolicMirror.orientation;
    const newOrientation = currentOrientation - (5 * Math.PI) / 180; // 5 degrees in radians
    parabolicMirror.orientation = newOrientation;

    recalculateRays();
  } else if (event.code === "ArrowRight") {
    // Rotate mirror clockwise by 5 degrees
    
    const currentOrientation = parabolicMirror.orientation;
    const newOrientation = currentOrientation + (5 * Math.PI) / 180; // 5 degrees in radians
    parabolicMirror.orientation = newOrientation;

    recalculateRays();
  }
});

animationLoop.start();
