import { Point, Normal } from "../types";
import { UniqueID } from "../UniqueID";

export class ParabolicMirror {
  id: number;
  position: Point; // Vertex of the parabola
  focalLength: number; // Distance from vertex to focus
  length: number; // Extent of the mirror along the parabola

  constructor({ position, focalLength, length }: { position: Point; focalLength: number; length: number }) {
    this.id = UniqueID.getNextID();
    this.position = position;
    this.focalLength = focalLength;
    this.length = length;
  }

  /**
   * Renders the parabolic mirror as a curve on the canvas.
   * Assumes the parabola opens upwards (y = a(x - h)^2 + k)
   */
  render(context: CanvasRenderingContext2D) {
    const { x: h, y: k } = this.position;
    const f = this.focalLength;
    // Parabola: y = (1/(4f)) * (x - h)^2 + k
    const a = 1 / (4 * f);
    const halfLen = this.length / 2;
    const steps = 100;
    context.strokeStyle = "darkred";
    context.beginPath();
    for (let i = 0; i <= steps; i++) {
      const dx = -halfLen + (i * this.length) / steps;
      const x = h + dx;
      const y = k + a * dx * dx;
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  }
}
