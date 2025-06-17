import { Renderable } from "./animation/Renderable";
import { intersect } from "./helpers";
import { Color, LineSegment, Normal } from "./types";

export class Ray extends Renderable {
  lineSegment: LineSegment;
  color: Color;
  t1: number; // Time at which the ray starts
  t2: number; // Time at which the ray ends
  
  constructor(lineSegment: LineSegment, color: Color, t1: number, t2: number) {
    super();
    if (t1 >= t2){
      throw new Error("Invalid time range: t1 must be less than t2");
    }

    this.lineSegment = lineSegment;
    this.color = color;
    this.t1 = t1;
    this.t2 = t2;
  }

  public render = (context: CanvasRenderingContext2D, t: number) => {
    if (t < this.t1 || t > this.t2) {
      return; // Ray is not active at this time
    }

    const normalizedT = (t - this.t1) / (this.t2 - this.t1);
    
    // draw point at T along this line segment
    const x = this.lineSegment.x1 + normalizedT * (this.lineSegment.x2 - this.lineSegment.x1);
    const y = this.lineSegment.y1 + normalizedT * (this.lineSegment.y2 - this.lineSegment.y1);
    context.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a || 1})`;
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fill();
  }

  /** Generate one or two rays when this ray intersects (or doesn't) a reflector line segment. */
  public reflect = (reflector: LineSegment): Ray[] => {
    const intersection = intersect(this.lineSegment, reflector);
    if (!intersection) {
      return [this]; // No intersection, return the original ray
    }

    // get the t-value of the intersection point
    // unlerp
    let tIntersection = 0;
    if (this.lineSegment.x2 !== this.lineSegment.x1) {
      tIntersection = (intersection.x - this.lineSegment.x1) / (this.lineSegment.x2 - this.lineSegment.x1);
    } else if (this.lineSegment.y2 !== this.lineSegment.y1) {
      tIntersection = (intersection.y - this.lineSegment.y1) / (this.lineSegment.y2 - this.lineSegment.y1);
    } else {
      throw new Error("Line segment is a point, cannot calculate intersection t-value.");
    }
    
    const reflectorDx = reflector.x2 - reflector.x1;
    const reflectorDy = reflector.y2 - reflector.y1;
    const reflectorLength = Math.sqrt(
      Math.pow(reflectorDx, 2) +
      Math.pow(reflectorDy, 2)
    );
    const reflectorNormal: Normal = {
      dx: reflectorDy / reflectorLength, // Perpendicular to the line segment
      dy: -reflectorDx / reflectorLength, // Perpendicular to the line segment
    };

    const beforeIntersection: Ray = new Ray({
      x1: this.lineSegment.x1,
      y1: this.lineSegment.y1,
      x2: intersection.x,
      y2: intersection.y,
    }, this.color, this.t1, tIntersection);
    const lengthRemaining = Math.sqrt(
      Math.pow(this.lineSegment.x2 - intersection.x, 2) +
      Math.pow(this.lineSegment.y2 - intersection.y, 2)
    );
    const afterIntersection: Ray = new Ray({
      x1: intersection.x,
      y1: intersection.y,
      x2: intersection.x + reflectorNormal.dx * lengthRemaining,
      y2: intersection.y + reflectorNormal.dy * lengthRemaining,
    }, this.color, tIntersection, this.t2);
    
    return [beforeIntersection, afterIntersection];
  }
}