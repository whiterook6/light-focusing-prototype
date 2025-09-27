import { ID, UniqueID } from "../UniqueID";
import { Ray } from "./Ray";

export abstract class Optic {
  id: ID;

  constructor() {
    this.id = UniqueID.getNextID();
  }

  /**
   * Splits a line segment by a mirror or lens and returns the before and after (reflected) segments.
   * If no intersection, it returns an empty array
   */
  abstract splitAndReflectSegment(ray: Ray): Ray[];
  /**
   * Returns the distance from the ray origin to the intersection point with this mirror or lens,
   * or Infinity if there is no intersection.
   */
  abstract distanceToIntersection(ray: Ray): number;
  abstract render(context: CanvasRenderingContext2D): void;
}
