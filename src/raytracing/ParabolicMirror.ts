import { Ray } from "./Ray";
import { Point } from "../types";
import { Optic } from "./Optic";

export class ParabolicMirror extends Optic {
  // Parabola parameters: y = a*x^2 + b*x + c
  a: number; // curvature coefficient
  b: number; // linear coefficient
  c: number; // constant term
  xMin: number; // left boundary
  xMax: number; // right boundary
  vertex: Point; // vertex of the parabola
  orientation: number; // rotation angle in radians

  constructor({
    vertex,
    focalLength,
    width,
    orientation = 0, // rotation angle in radians
  }: {
    vertex: Point;
    focalLength: number;
    width: number;
    orientation?: number;
  }) {
    super();

    this.vertex = vertex;
    // Offset orientation by -π/2 so that 0 opens right, π/2 opens up, etc.
    this.orientation = orientation - Math.PI / 2;

    // For a parabola with vertex at origin: y = (1/4f) * x^2
    // where f is focal length
    this.a = 1 / (4 * focalLength);
    this.b = 0;
    this.c = 0;

    // Set boundaries
    this.xMin = -width / 2;
    this.xMax = width / 2;
  }

  /**
   * Transform a point from world coordinates to local coordinates (relative to vertex, unrotated)
   */
  private worldToLocal(worldPoint: Point): Point {
    // Translate to vertex
    const translated = {
      x: worldPoint.x - this.vertex.x,
      y: worldPoint.y - this.vertex.y,
    };

    // Rotate by -orientation to get to local coordinates
    const cos = Math.cos(-this.orientation);
    const sin = Math.sin(-this.orientation);

    return {
      x: translated.x * cos - translated.y * sin,
      y: translated.x * sin + translated.y * cos,
    };
  }

  /**
   * Transform a point from local coordinates to world coordinates
   */
  private localToWorld(localPoint: Point): Point {
    // Rotate by orientation to get to world orientation
    const cos = Math.cos(this.orientation);
    const sin = Math.sin(this.orientation);

    const rotated = {
      x: localPoint.x * cos - localPoint.y * sin,
      y: localPoint.x * sin + localPoint.y * cos,
    };

    // Translate from vertex
    return {
      x: rotated.x + this.vertex.x,
      y: rotated.y + this.vertex.y,
    };
  }

  /**
   * Transform a direction vector from world coordinates to local coordinates
   */
  private worldDirectionToLocal(worldDirection: number): number {
    return worldDirection - this.orientation;
  }

  /**
   * Transform a direction vector from local coordinates to world coordinates
   */
  private localDirectionToWorld(localDirection: number): number {
    return localDirection + this.orientation;
  }

  /**
   * Get the y-coordinate of the parabola at a given x-coordinate (in local coordinates)
   */
  private getY(x: number): number {
    return this.a * x * x + this.b * x + this.c;
  }

  /**
   * Get the derivative (slope) of the parabola at a given x-coordinate
   */
  private getDerivative(x: number): number {
    return 2 * this.a * x + this.b;
  }

  /**
   * Get the surface normal at a given point on the parabola
   */
  private getNormal(x: number): { dx: number; dy: number } {
    const slope = this.getDerivative(x);

    // For a parabola y = ax², the normal vector perpendicular to tangent is (-slope, 1)
    // But we need to ensure it points toward the focus (inside the parabola)
    // The focus is at (0, 1/(4a)) in local coordinates
    const normalX = -slope;
    const normalY = 1;

    // Normalize
    const length = Math.hypot(normalX, normalY);
    const normalizedX = normalX / length;
    const normalizedY = normalY / length;

    // Check if the normal points toward the focus
    // Focus is at (0, 1/(4a)) = (0, focalLength)
    const focalLength = 1 / (4 * this.a);
    const pointY = this.getY(x);

    // Vector from point to focus
    const toFocusX = 0 - x;
    const toFocusY = focalLength - pointY;

    // Dot product of normal with vector to focus
    const dot = normalizedX * toFocusX + normalizedY * toFocusY;

    // If dot product is negative, flip the normal
    if (dot < 0) {
      return {
        dx: -normalizedX,
        dy: -normalizedY,
      };
    }

    return {
      dx: normalizedX,
      dy: normalizedY,
    };
  }

  /**
   * Find intersection between ray and parabola
   */
  private findIntersection(ray: Ray): { x: number; y: number; tFraction: number } | null {
    const { origin, direction, length } = ray;

    // Transform ray to parabola's local coordinate system
    const localOrigin = this.worldToLocal(origin);
    const localDirection = this.worldDirectionToLocal(direction);
    const dx = Math.cos(localDirection);
    const dy = Math.sin(localDirection);

    const x0 = localOrigin.x;
    const y0 = localOrigin.y;

    // Ray parametric equation: x = x0 + t*dx, y = y0 + t*dy
    // Parabola equation: y = a*x^2 + b*x + c

    // Substitute ray into parabola equation:
    // y0 + t*dy = a*(x0 + t*dx)^2 + b*(x0 + t*dx) + c
    // y0 + t*dy = a*(x0^2 + 2*x0*t*dx + t^2*dx^2) + b*(x0 + t*dx) + c
    // y0 + t*dy = a*x0^2 + 2*a*x0*t*dx + a*t^2*dx^2 + b*x0 + b*t*dx + c

    // Rearrange to quadratic form: At^2 + Bt + C = 0
    const A = this.a * dx * dx;
    const B = 2 * this.a * x0 * dx + this.b * dx - dy;
    const C = this.a * x0 * x0 + this.b * x0 + this.c - y0;

    // Solve quadratic equation
    const discriminant = B * B - 4 * A * C;

    if (discriminant < 0) {
      return null; // No real solutions
    }

    if (Math.abs(A) < 1e-10) {
      // Linear case (shouldn't happen for parabola, but handle gracefully)
      if (Math.abs(B) < 1e-10) {
        return null;
      }
      const s = -C / B; // distance along the ray
      if (s > 0 && s <= length) {
        const localX = x0 + s * dx;
        const localY = y0 + s * dy;
        // Check bounds in local coordinates, consistent with quadratic branch
        if (localX < this.xMin || localX > this.xMax) {
          return null;
        }
        // Transform back to world coordinates consistently
        const worldIntersection = this.localToWorld({ x: localX, y: localY });
        return { x: worldIntersection.x, y: worldIntersection.y, tFraction: s / length };
      }
      return null;
    }

    // Two solutions
    const sqrtDisc = Math.sqrt(discriminant);
    const s1 = (-B + sqrtDisc) / (2 * A); // distances along the ray
    const s2 = (-B - sqrtDisc) / (2 * A);

    // Find the smallest positive t within ray length
    let validS: number | null = null;

    if (s1 > 0 && s1 <= length) {
      validS = s1;
    }
    if (s2 > 0 && s2 <= length && (validS === null || s2 < validS)) {
      validS = s2;
    }

    if (validS === null) {
      return null;
    }

    const localX = x0 + validS * dx;
    const localY = y0 + validS * dy;

    // Check if intersection is within parabola bounds
    if (localX < this.xMin || localX > this.xMax) {
      return null;
    }

    // Transform intersection point back to world coordinates
    const worldIntersection = this.localToWorld({ x: localX, y: localY });

    return {
      x: worldIntersection.x,
      y: worldIntersection.y,
      tFraction: validS / length,
    };
  }

  public splitAndReflectSegment(ray: Ray): Ray[] {
    const { origin, direction, length, timeRange, spawnedByObjectID, hitObjectID } = ray;

    if (this.id === hitObjectID || this.id === spawnedByObjectID) {
      return [];
    }

    const intersection = this.findIntersection(ray);
    if (!intersection) {
      return [ray]; // No intersection
    }

    const { x: ix, y: iy, tFraction } = intersection;

    // Create ray segment before intersection
    const beforeLength = Math.hypot(ix - origin.x, iy - origin.y);
    const beforeDirection = Math.atan2(iy - origin.y, ix - origin.x);
    const before = new Ray(
      { x: origin.x, y: origin.y },
      beforeDirection,
      beforeLength,
      {
        start: timeRange.start,
        end: timeRange.start + tFraction * (timeRange.end - timeRange.start),
      },
      ray.color,
      ray.spawnedByObjectID,
      this.id,
    );

    // Calculate reflection in local coordinate system
    const localIntersection = this.worldToLocal({ x: ix, y: iy });
    const localNormal = this.getNormal(localIntersection.x);

    // Transform incident direction to local coordinates
    const localIncidentDirection = this.worldDirectionToLocal(direction);
    const localIncident = {
      dx: Math.cos(localIncidentDirection),
      dy: Math.sin(localIncidentDirection),
    };

    // Reflect in local coordinates: R = I - 2*(I·N)*N
    const dot = localIncident.dx * localNormal.dx + localIncident.dy * localNormal.dy;
    // If the incident direction is aligned with the normal (back face), do not reflect
    if (dot >= 0) {
      return [before];
    }
    const localReflected = {
      dx: localIncident.dx - 2 * dot * localNormal.dx,
      dy: localIncident.dy - 2 * dot * localNormal.dy,
    };

    // Transform reflected direction back to world coordinates
    const localReflectedDirection = Math.atan2(localReflected.dy, localReflected.dx);
    const worldReflectedDirection = this.localDirectionToWorld(localReflectedDirection);

    const afterLength = (1 - tFraction) * length;
    const after = new Ray(
      { x: ix, y: iy },
      worldReflectedDirection,
      afterLength,
      {
        start: timeRange.start + tFraction * (timeRange.end - timeRange.start),
        end: timeRange.end,
      },
      ray.color,
      this.id,
    );

    return [before, after];
  }

  public distanceToIntersection(ray: Ray): number {
    const { spawnedByObjectID, hitObjectID, length } = ray;
    if (this.id === hitObjectID || this.id === spawnedByObjectID) {
      return Infinity;
    }

    const intersection = this.findIntersection(ray);
    if (!intersection) {
      return Infinity;
    }
    return intersection.tFraction * length;
  }

  render(context: CanvasRenderingContext2D) {
    context.strokeStyle = "darkgreen";
    context.lineWidth = 2;
    context.beginPath();

    // Draw parabola by sampling points
    const numPoints = 100;
    const step = (this.xMax - this.xMin) / numPoints;

    let firstPoint = true;
    for (let i = 0; i <= numPoints; i++) {
      const localX = this.xMin + i * step;
      const localY = this.getY(localX);
      const worldPoint = this.localToWorld({ x: localX, y: localY });

      if (firstPoint) {
        context.moveTo(worldPoint.x, worldPoint.y);
        firstPoint = false;
      } else {
        context.lineTo(worldPoint.x, worldPoint.y);
      }
    }

    context.stroke();

    // Draw focal point (in local coordinates, focal point is at (0, 1/(4a)))
    const localFocal = { x: 0, y: 1 / (4 * this.a) };
    const worldFocal = this.localToWorld(localFocal);
    context.fillStyle = "red";
    context.beginPath();
    context.arc(worldFocal.x, worldFocal.y, 3, 0, 2 * Math.PI);
    context.fill();
  }
}
