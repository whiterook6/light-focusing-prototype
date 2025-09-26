import { Emitter } from "./Emitter";
import { Ray } from "./Ray";
import { TimeRange, Point } from "../types";

/**
 * Linear emitter that generates parallel rays from a line segment.
 * Useful for simulating collimated light sources like lasers or sunlight.
 */
export class LinearEmitter extends Emitter {
  private startPoint: Point;
  private endPoint: Point;
  private direction: number;
  private rayCount: number;
  private rayLength: number;

  constructor(
    startPoint: Point,
    endPoint: Point,
    direction: number,
    rayCount: number,
    rayLength: number,
    timeRange: TimeRange,
    color: string = "red",
  ) {
    super(timeRange, color);
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.direction = direction;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
  }

  generateRays(): Ray[] {
    const rays: Ray[] = [];

    for (let i = 0; i < this.rayCount; i++) {
      // Interpolate position along the line segment
      const t = i / (this.rayCount - 1);
      const x = this.startPoint.x + t * (this.endPoint.x - this.startPoint.x);
      const y = this.startPoint.y + t * (this.endPoint.y - this.startPoint.y);

      const ray = new Ray({ x, y }, this.direction, this.rayLength, this.timeRange, this.color);

      rays.push(ray);
    }

    return rays;
  }

  /**
   * Update the start point of the emitter line.
   */
  setStartPoint(point: Point): void {
    this.startPoint = point;
  }

  /**
   * Update the end point of the emitter line.
   */
  setEndPoint(point: Point): void {
    this.endPoint = point;
  }

  /**
   * Update the direction of all emitted rays.
   */
  setDirection(direction: number): void {
    this.direction = direction;
  }

  /**
   * Update the number of rays to generate.
   */
  setRayCount(count: number): void {
    this.rayCount = count;
  }

  /**
   * Update the length of emitted rays.
   */
  setRayLength(length: number): void {
    this.rayLength = length;
  }

  /**
   * Get the current start point.
   */
  getStartPoint(): Point {
    return this.startPoint;
  }

  /**
   * Get the current end point.
   */
  getEndPoint(): Point {
    return this.endPoint;
  }

  /**
   * Get the current direction.
   */
  getDirection(): number {
    return this.direction;
  }

  /**
   * Get the current ray count.
   */
  getRayCount(): number {
    return this.rayCount;
  }

  /**
   * Get the current ray length.
   */
  getRayLength(): number {
    return this.rayLength;
  }

  /**
   * Render the linear emitter as a colored line segment.
   */
  render(context: CanvasRenderingContext2D): void {
    // Save current styles
    const originalStrokeStyle = context.strokeStyle;
    const originalLineWidth = context.lineWidth;

    // Draw emitter as a thick colored line
    context.strokeStyle = this.color;
    context.lineWidth = 6;

    context.beginPath();
    context.moveTo(this.startPoint.x, this.startPoint.y);
    context.lineTo(this.endPoint.x, this.endPoint.y);
    context.stroke();

    // Draw direction indicator (arrow)
    const midX = (this.startPoint.x + this.endPoint.x) / 2;
    const midY = (this.startPoint.y + this.endPoint.y) / 2;
    const arrowLength = 15;
    const arrowAngle = this.direction;

    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(midX, midY);
    context.lineTo(
      midX + Math.cos(arrowAngle) * arrowLength,
      midY + Math.sin(arrowAngle) * arrowLength,
    );
    context.stroke();

    // Restore original styles
    context.strokeStyle = originalStrokeStyle;
    context.lineWidth = originalLineWidth;
  }
}
