import { Optic } from "./Optic";
import { Ray } from "./Ray";

export class BiconvexLens extends Optic {
  
  distanceToIntersection(ray: Ray): number {
    return Number.MAX_VALUE;
  }

  splitAndReflectSegment(ray: Ray): Ray[] {
    return [];
  }

  render(context: CanvasRenderingContext2D): void {
    
  }
}