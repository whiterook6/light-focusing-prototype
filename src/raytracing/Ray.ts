
export type TimeRange = {
  start: number;
  end: number;
};

export class Ray {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: number;
  timeRange: TimeRange;
  spawnedByObjectID: string | number | null;
  hitObjectID: string | number | null;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    startT: number,
    endT: number,
    spawnedByObjectID: string | number | null = null,
    hitObjectID: string | number | null = null
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.timeRange = { start: startT, end: endT };
    this.spawnedByObjectID = spawnedByObjectID;
    this.hitObjectID = hitObjectID;
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
    const xStart = this.x1 + (this.x2 - this.x1) * startT;
    const yStart = this.y1 + (this.y2 - this.y1) * startT;
    const xEnd = this.x1 + (this.x2 - this.x1) * endT;
    const yEnd = this.y1 + (this.y2 - this.y1) * endT;
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