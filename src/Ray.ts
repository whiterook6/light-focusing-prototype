export class Ray {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  t1: number;
  t2: number;

  constructor(x1: number, y1: number, x2: number, y2: number, t1: number, t2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.t1 = t1;
    this.t2 = t2;
  }

  private lerpT = (t: number) => (t - this.t1) / (this.t2 - this.t1);

  render(context: CanvasRenderingContext2D, t: number){
    if (t < this.t1 || t > this.t2) {
      return; // Outside the segment's t range
    }

    const startT = this.lerpT(t - 0.05);
    const endT = this.lerpT(t + 0.05);

    const xStart = this.x1 + (this.x2 - this.x1) * startT;
    const yStart = this.y1 + (this.y2 - this.y1) * startT;
    const xEnd = this.x1 + (this.x2 - this.x1) * endT;
    const yEnd = this.y1 + (this.y2 - this.y1) * endT;

    context.beginPath();
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.stroke();
  }
}