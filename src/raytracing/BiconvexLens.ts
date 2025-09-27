import { Optic } from "./Optic";
import { Ray } from "./Ray";
import { Point } from "../types";

export class BiconvexLens extends Optic {
  /** Lens center position (optical axis along +x, no rotation yet) */
  position: Point;
  /** Radius of curvature for the left surface (R1 > 0 for convex) */
  R1: number;
  /** Radius of curvature for the right surface (R2 > 0 for convex) */
  R2: number;
  /** Center thickness (distance between apices along x) */
  thickness: number;
  /** Clear aperture radius (half-height of the lens) */
  apertureRadius: number;

  constructor({
    position,
    radius1,
    radius2,
    thickness,
    apertureRadius,
  }: {
    position: Point;
    radius1: number;
    radius2: number;
    thickness: number;
    apertureRadius: number;
  }) {
    super();

    this.position = position;
    this.R1 = Math.abs(radius1);
    this.R2 = Math.abs(radius2);
    this.thickness = Math.max(0, thickness);
    // Ensure the aperture is not larger than either sphere radius in 2D cross-section
    const maxAperture = Math.min(this.R1, this.R2);
    this.apertureRadius = Math.min(Math.abs(apertureRadius), maxAperture);
  }

  distanceToIntersection(_ray: Ray): number {
    // Intersection/refraction not implemented yet
    return Infinity;
  }

  splitAndReflectSegment(_ray: Ray): Ray[] {
    // Lens does not reflect; leave unimplemented for now
    return [];
  }

  render(context: CanvasRenderingContext2D): void {
    const { x: cx, y: cy } = this.position;
    const a = this.apertureRadius;
    const R1 = this.R1;
    const R2 = this.R2;
    const t = this.thickness;

    // Sphere centers along x-axis
    const C1x = cx - (t / 2 + R1);
    const C2x = cx + (t / 2 + R2);

    // Sampling along vertical from bottom to top
    const samples = 64;
    const dy = (2 * a) / samples;

    // Build path: left surface upward, then right surface downward
    context.strokeStyle = "#66c2ff";
    context.lineWidth = 2;

    context.beginPath();

    // Bottom point on left surface
    let y = cy - a;
    let under1 = R1 * R1 - (y - cy) * (y - cy);
    let xLeft = C1x + Math.sqrt(Math.max(0, under1));
    context.moveTo(xLeft, y);

    // Left surface: y from bottom to top
    for (let i = 1; i <= samples; i++) {
      y = cy - a + i * dy;
      under1 = R1 * R1 - (y - cy) * (y - cy);
      xLeft = C1x + Math.sqrt(Math.max(0, under1));
      context.lineTo(xLeft, y);
    }

    // Right surface: y from top back to bottom
    for (let i = samples; i >= 0; i--) {
      y = cy - a + i * dy;
      const under2 = R2 * R2 - (y - cy) * (y - cy);
      const xRight = C2x - Math.sqrt(Math.max(0, under2));
      context.lineTo(xRight, y);
    }

    context.closePath();
    context.stroke();
  }
}