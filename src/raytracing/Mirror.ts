import { ID, UniqueID } from "../UniqueID";
import { Ray } from "./Ray";
import { Point } from "../types";

export abstract class Mirror {
  id: ID;

  constructor() {
    this.id = UniqueID.getNextID();
  }

  /**
   * Splits a line segment by a mirror and returns the before and after (reflected) segments.
   * If no intersection, it returns an empty array
   */
  abstract splitAndReflectSegment(ray: Ray): Ray[];
  /**
   * Computes the first intersection between this mirror and the provided ray.
   * Returns the intersection point in world coordinates and the distance from the ray origin,
   * or null if there is no intersection within both the mirror's bounds and the ray length.
   */
  abstract intersect(ray: Ray): { point: Point; distance: number } | null;
  abstract render(context: CanvasRenderingContext2D): void;
}
