import { GameLoop } from './GameLoop';

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

let age = 0;
const gameLoop = new GameLoop((deltaTimeMs: number) => {
  age += deltaTimeMs;
  ctx!.fillStyle = 'lightblue';
  ctx!.fillRect(0, 0, canvas.width, canvas.height);
  ctx!.fillStyle = 'black';
  ctx!.font = '30px Arial';
  ctx!.textAlign = 'center';
  ctx!.fillText(`${age.toFixed(2)}`, canvas.width / 2, canvas.height / 2);
});

window.addEventListener('keydown', (event) => {
  // if space bar is pressed, toggle pause
  if (event.code === 'Space') {
    gameLoop.togglePause();
  }
})

gameLoop.start();