import { ID, UniqueID } from "../UniqueID";
import { Ray } from "./Ray";

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
  abstract render(context: CanvasRenderingContext2D): void;
}