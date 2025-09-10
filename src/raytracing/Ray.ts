import { TimeRange } from "../types";
import { ID } from "../UniqueID";

interface Args {
  origin: { x: number; y: number };
  direction: number;
  length: number;
  timeRange: TimeRange;
  spawnedByObjectID?: ID;
  hitObjectID?: ID;
}

export class Ray {
  origin: { x: number; y: number };
  direction: number;
  length: number;
  timeRange: TimeRange;
  spawnedByObjectID?: ID;
  hitObjectID?: ID;

  constructor(args: Args) {
    this.origin = args.origin;
    this.direction = args.direction;
    this.length = args.length;
    this.timeRange = args.timeRange;
    this.spawnedByObjectID = args.spawnedByObjectID;
    this.hitObjectID = args.hitObjectID;
  }

  private lerpT = (t: number) => (t - this.timeRange.start) / (this.timeRange.end - this.timeRange.start);

  /**
   * Returns the segment to render for the given render time range, or null if out of bounds.
   */
  getRenderSegment(renderRange: TimeRange): { xStart: number; yStart: number; xEnd: number; yEnd: number } | null {
    if (renderRange.start > this.timeRange.end || renderRange.end < this.timeRange.start) {
      return null; // Outside the segment's time range
    }
    const segStartT = Math.max(this.timeRange.start, renderRange.start);
    const segEndT = Math.min(this.timeRange.end, renderRange.end);
    const startT = this.lerpT(segStartT);
    const endT = this.lerpT(segEndT);
    const xStart = this.origin.x + Math.cos(this.direction) * startT * this.length;
    const yStart = this.origin.y + Math.sin(this.direction) * startT * this.length;
    const xEnd = this.origin.x + Math.cos(this.direction) * endT * this.length;
    const yEnd = this.origin.y + Math.sin(this.direction) * endT * this.length;
    return { xStart, yStart, xEnd, yEnd };
  }

  render(context: CanvasRenderingContext2D, renderRange: TimeRange) {
    const segment = this.getRenderSegment(renderRange);
    if (!segment) return;
    context.beginPath();
    context.moveTo(segment.xStart, segment.yStart);
    context.lineTo(segment.xEnd, segment.yEnd);
    context.stroke();
  }
}