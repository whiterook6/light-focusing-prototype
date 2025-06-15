import { Color, Point } from "./types";

export class Emitter {
  public position: Point;
  public color: Color;
  public angle: number;
  public spread: number;

  constructor(position: Point, color: Color, angle: number, spread: number) {
    this.position = position;
    this.color = color;
    this.angle = angle;
    this.spread = spread;
  }

  public draw(ctx: CanvasRenderingContext2D, radius: number): void {
    ctx.save();
    ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a ?? 1})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, radius, this.angle - this.spread / 2, this.angle + this.spread / 2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}