import { Ray } from "./Ray";
import { TimeRange } from "../types";

/**
 * Base abstract class for all ray emitters.
 * Provides a common interface for generating rays from different sources.
 */
export abstract class Emitter {
  protected timeRange: TimeRange;

  constructor(timeRange: TimeRange) {
    this.timeRange = timeRange;
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
}
