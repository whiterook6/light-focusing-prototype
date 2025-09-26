import { Emitter } from "./Emitter";
import { Ray } from "./Ray";
import { TimeRange, Point } from "../types";

/**
 * Point emitter that generates rays radiating outward from a single point.
 * Useful for simulating point light sources or omnidirectional emitters.
 */
export class PointEmitter extends Emitter {
  private position: Point;
  private rayCount: number;
  private rayLength: number;
  private startAngle: number;
  private endAngle: number;

  constructor(
    position: Point,
    rayCount: number,
    rayLength: number,
    timeRange: TimeRange,
    startAngle: number = 0,
    endAngle: number = 2 * Math.PI,
    color: string = "red",
  ) {
    super(timeRange, color);
    this.position = position;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  generateRays(): Ray[] {
    const rays: Ray[] = [];

    for (let i = 0; i < this.rayCount; i++) {
      // Calculate angle for this ray
      const angle = this.startAngle + (i / (this.rayCount - 1)) * (this.endAngle - this.startAngle);

      const ray = new Ray(this.position, angle, this.rayLength, this.timeRange, this.color);

      rays.push(ray);
    }

    return rays;
  }

  /**
   * Update the position of the emitter.
   */
  setPosition(position: Point): void {
    this.position = position;
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
   * Update the angular range for ray generation.
   */
  setAngleRange(startAngle: number, endAngle: number): void {
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  /**
   * Get the current position.
   */
  getPosition(): Point {
    return this.position;
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
   * Get the current angle range.
   */
  getAngleRange(): { start: number; end: number } {
    return { start: this.startAngle, end: this.endAngle };
  }

  /**
   * Render the point emitter as a colored circle.
   */
  render(context: CanvasRenderingContext2D): void {
    // Save current styles
    const originalFillStyle = context.fillStyle;
    const originalStrokeStyle = context.strokeStyle;
    const originalLineWidth = context.lineWidth;

    // Draw emitter as a filled circle with a border
    context.fillStyle = this.color;
    context.strokeStyle = "black";
    context.lineWidth = 2;

    context.beginPath();
    context.arc(this.position.x, this.position.y, 8, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    // Restore original styles
    context.fillStyle = originalFillStyle;
    context.strokeStyle = originalStrokeStyle;
    context.lineWidth = originalLineWidth;
  }
}
