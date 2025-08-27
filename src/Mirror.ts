import { Normal, Point, Ray } from "./types";

export class Mirror {
  position: Point;
  normal: Normal;
  length: number; // half width on either side of the center point

  constructor({position, normal, length}: {position: Point, normal: Normal, length: number}){
    this.position = position;
    this.normal = normal;
    this.length = length;
  }

  render(context: CanvasRenderingContext2D){
    // Perpendicular direction to normal
    const perpDx = -this.normal.dy;
    const perpDy = this.normal.dx;
    // Normalize
    const len = Math.hypot(perpDx, perpDy);
    const dirX = perpDx / len;
    const dirY = perpDy / len;

    const halfLen = this.length / 2;
    const x1 = this.position.x - dirX * halfLen;
    const y1 = this.position.y - dirY * halfLen;
    const x2 = this.position.x + dirX * halfLen;
    const y2 = this.position.y + dirY * halfLen;

    context.strokeStyle = "darkblue";
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  /**
   * Splits a line segment by a mirror and returns the before and after (reflected) segments.
   * If no intersection, returns the original segment.
   */
  public splitAndReflectSegment(
    ray: Ray
  ): Ray[] {
    // Mirror line: point M (mirror.position), direction D (perpendicular to mirror.normal)
    const { x1, y1, x2, y2 } = ray;
    debugger;
    const M = this.position;
    // Mirror direction vector (perpendicular to normal)
    const D = { dx: -this.normal.dy, dy: this.normal.dx };

    // Parametric equations:
    // Segment: P = (x1, y1) + t * ((x2-x1), (y2-y1)), t in [0,1]
    // Mirror: Q = M + s * D

    // Solve for intersection:
    const segDx = x2 - x1;
    const segDy = y2 - y1;

    // Set up equations:
    // x1 + t*segDx = M.x + s*D.dx
    // y1 + t*segDy = M.y + s*D.dy
    // Solve for t and s

    const det = segDx * D.dy - segDy * D.dx;
    if (Math.abs(det) < 1e-8) {
      // Parallel, no intersection
      return [ray];
    }

    const t =
      ((M.x - x1) * D.dy - (M.y - y1) * D.dx) / det;
    if (t < 0 || t > 1) {
      // Intersection not within segment
      return [ray];
    }

    // Intersection point
    const ix = x1 + t * segDx;
    const iy = y1 + t * segDy;

    // Before intersection
    const before: Ray = {
      x1,
      y1,
      x2: ix,
      y2: iy,
      t1: ray.t1,
      t2: ray.t1 + t * (ray.t2 - ray.t1),
    };

    // After intersection: reflect (ix,iy)-(x2,y2) about mirror normal
    // Compute incident vector
    const incident = { dx: x2 - ix, dy: y2 - iy };
    // Normalize mirror normal
    const nLen = Math.hypot(this.normal.dx, this.normal.dy);
    const nx = this.normal.dx / nLen;
    const ny = this.normal.dy / nLen;
    // Reflect: R = I - 2*(I·N)*N
    const dot = incident.dx * nx + incident.dy * ny;
    const rx = incident.dx - 2 * dot * nx;
    const ry = incident.dy - 2 * dot * ny;

    const after: Ray = {
      x1: ix,
      y1: iy,
      x2: ix + rx,
      y2: iy + ry,
      t1: ray.t1 + t * (ray.t2 - ray.t1),
      t2: ray.t2
    };

    return [before, after];
  }
}