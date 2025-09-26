export class VectorGizmo {
  private canvas: HTMLCanvasElement;
  private lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  private isDrawing: boolean = false;
  private startPos: { x: number; y: number } | null = null;
  private currentPos: { x: number; y: number } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return; // Only left mouse button
    const rect = this.canvas.getBoundingClientRect();
    this.isDrawing = true;
    this.startPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    this.currentPos = { ...this.startPos };
  };

  handleMouseMove = (event: MouseEvent) => {
    if (!this.isDrawing) return;
    const rect = this.canvas.getBoundingClientRect();
    this.currentPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  handleMouseUp = (event: MouseEvent) => {
    if (!this.isDrawing || !this.startPos || !this.currentPos) return;
    this.lines.push({
      x1: this.startPos.x,
      y1: this.startPos.y,
      x2: this.currentPos.x,
      y2: this.currentPos.y,
    });
    this.isDrawing = false;
    this.startPos = null;
    this.currentPos = null;
  };

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.strokeStyle = "green";
    context.lineWidth = 2;
    context.font = "13px monospace";
    context.fillStyle = "black";

    // Helper to draw info for a line
    const drawLineInfo = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      // Normal vector (perpendicular, normalized)
      let nx = 0,
        ny = 0;
      if (length > 0) {
        nx = -dy / length;
        ny = dx / length;
      }
      const info = `start: [${x1.toFixed(0)}, ${y1.toFixed(0)}]`;
      const info2 = `angle: ${angle.toFixed(1)}°, len: ${length.toFixed(1)}`;
      const info3 = `dx: ${dx.toFixed(1)}, dy: ${dy.toFixed(1)}`;
      const info4 = `normal: [${nx.toFixed(2)}, ${ny.toFixed(2)}]`;
      // Draw info near start point
      context.fillText(info, x1 + 10, y1 + 10);
      context.fillText(info2, x1 + 10, y1 + 26);
      context.fillText(info3, x1 + 10, y1 + 42);
      context.fillText(info4, x1 + 10, y1 + 58);
    };

    // Draw all pinned lines
    for (const line of this.lines) {
      context.beginPath();
      context.moveTo(line.x1, line.y1);
      context.lineTo(line.x2, line.y2);
      context.stroke();
      drawLineInfo(line.x1, line.y1, line.x2, line.y2);
    }
    // Draw current line if drawing
    if (this.isDrawing && this.startPos && this.currentPos) {
      context.beginPath();
      context.moveTo(this.startPos.x, this.startPos.y);
      context.lineTo(this.currentPos.x, this.currentPos.y);
      context.setLineDash([5, 5]);
      context.stroke();
      context.setLineDash([]);
      drawLineInfo(this.startPos.x, this.startPos.y, this.currentPos.x, this.currentPos.y);
    }
    context.restore();
  }

  destroy() {
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }
}
