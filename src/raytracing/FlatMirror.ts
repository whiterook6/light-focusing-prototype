import { Ray } from "./Ray";
import { Normal, Point } from "../types";
import { Mirror } from "./Mirror";

export class FlatMirror extends Mirror {
  position: Point;
  normal: Normal;
  length: number; // half width on either side of the center point

  constructor({ position, normal, length }: { position: Point; normal: Normal; length: number }) {
    super();
    this.position = position;
    this.normal = normal;
    this.length = length;
  }

  public splitAndReflectSegment(ray: Ray): Ray[] {
    // Mirror line: point M (mirror.position), direction D (perpendicular to mirror.normal)
    const { origin, direction, length, timeRange, spawnedByObjectID, hitObjectID } = ray;
    if (this.id === hitObjectID || this.id === spawnedByObjectID) {
      return [];
    }

    // Compute segment endpoints
    const x1 = origin.x;
    const y1 = origin.y;
    const x2 = origin.x + Math.cos(direction) * length;
    const y2 = origin.y + Math.sin(direction) * length;

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

    const t = ((M.x - x1) * D.dy - (M.y - y1) * D.dx) / det;
    if (t < 0 || t > 1) {
      // Intersection not within segment
      return [ray];
    }

    // Intersection point
    const ix = x1 + t * segDx;
    const iy = y1 + t * segDy;

    // Mirror direction vector (already normalized in render)
    const mirrorDirLen = Math.hypot(D.dx, D.dy);
    const dirX = D.dx / mirrorDirLen;
    const dirY = D.dy / mirrorDirLen;

    // Vector from mirror center to intersection
    const vix = ix - M.x;
    const viy = iy - M.y;

    // Project onto mirror direction
    const proj = vix * dirX + viy * dirY;

    // Check if within mirror bounds
    if (proj < -this.length / 2 || proj > this.length / 2) {
      // Intersection is outside the mirror segment
      return [ray];
    }

    // Before intersection
    const beforeLength = Math.hypot(ix - x1, iy - y1);
    const beforeDirection = Math.atan2(iy - y1, ix - x1);
    const before = new Ray(
      { x: x1, y: y1 },
      beforeDirection,
      beforeLength,
      { start: timeRange.start, end: timeRange.start + t * (timeRange.end - timeRange.start) },
      ray.color,
      spawnedByObjectID,
      this.id,
    );

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

    const afterLength = Math.hypot(rx, ry);
    const afterDirection = Math.atan2(ry, rx);
    const after = new Ray(
      { x: ix, y: iy },
      afterDirection,
      afterLength,
      { start: timeRange.start + t * (timeRange.end - timeRange.start), end: timeRange.end },
      ray.color,
      this.id,
    );

    return [before, after];
  }

  public distanceToIntersection(ray: Ray): number {
    const { origin, direction, length, spawnedByObjectID, hitObjectID } = ray;
    if (this.id === hitObjectID || this.id === spawnedByObjectID) {
      return Infinity;
    }

    const x1 = origin.x;
    const y1 = origin.y;
    const x2 = origin.x + Math.cos(direction) * length;
    const y2 = origin.y + Math.sin(direction) * length;

    const M = this.position;
    const D = { dx: -this.normal.dy, dy: this.normal.dx };

    const segDx = x2 - x1;
    const segDy = y2 - y1;
    const det = segDx * D.dy - segDy * D.dx;
    if (Math.abs(det) < 1e-8) {
      return Infinity;
    }

    const t = ((M.x - x1) * D.dy - (M.y - y1) * D.dx) / det;
    if (t < 0 || t > 1) {
      return Infinity;
    }

    const ix = x1 + t * segDx;
    const iy = y1 + t * segDy;

    const mirrorDirLen = Math.hypot(D.dx, D.dy);
    const dirX = D.dx / mirrorDirLen;
    const dirY = D.dy / mirrorDirLen;
    const vix = ix - M.x;
    const viy = iy - M.y;
    const proj = vix * dirX + viy * dirY;
    if (proj < -this.length / 2 || proj > this.length / 2) {
      return Infinity;
    }

    return t * length;
  }

  render(context: CanvasRenderingContext2D) {
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
}
