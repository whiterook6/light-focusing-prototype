import { Ray } from "./Ray";
import { TimeRange } from "../types";

/**
 * Base abstract class for all ray emitters.
 * Provides a common interface for generating rays from different sources.
 */
export abstract class Emitter {
  protected timeRange: TimeRange;
  protected color: string;

  constructor(timeRange: TimeRange, color: string = "red") {
    this.timeRange = timeRange;
    this.color = color;
  }

  /**
   * Generate rays from this emitter.
   * Must be implemented by subclasses to define specific ray generation behavior.
   */
  abstract generateRays(): Ray[];

  /**
   * Update the time range for generated rays.
   */
  setTimeRange(timeRange: TimeRange): void {
    this.timeRange = timeRange;
  }

  /**
   * Get the current time range.
   */
  getTimeRange(): TimeRange {
    return this.timeRange;
  }

  /**
   * Set the color for this emitter.
   */
  setColor(color: string): void {
    this.color = color;
  }

  /**
   * Get the current color.
   */
  getColor(): string {
    return this.color;
  }

  /**
   * Render the emitter visually.
   * Must be implemented by subclasses to define specific rendering behavior.
   */
  abstract render(context: CanvasRenderingContext2D): void;
}
