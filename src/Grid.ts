export interface GridOptions {
  /** Color for minor grid lines (e.g., every 50px) */
  minorColor: string;
  /** Color for major grid lines (e.g., every 100px) */
  majorColor: string;
  /** Spacing between major grid lines in pixels */
  majorSpacing: number;
  /** Number of minor divisions between major lines */
  minorDivisions: number;
}

export class Grid {
  private options: GridOptions;

  constructor(options: Partial<GridOptions> = {}) {
    this.options = {
      minorColor: "rgba(255, 255, 255, 0.1)",
      majorColor: "rgba(255, 255, 255, 0.25)",
      majorSpacing: 100,
      minorDivisions: 2, // Creates lines at 50px intervals when majorSpacing is 100
      ...options,
    };
  }

  /**
   * Render the grid on the given canvas context
   */
  render(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    const minorSpacing = this.options.majorSpacing / this.options.minorDivisions;

    // Draw minor grid lines first
    context.strokeStyle = this.options.minorColor;
    context.lineWidth = 1;

    // Draw vertical minor lines
    for (let x = 0; x <= canvasWidth; x += minorSpacing) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
      context.stroke();
    }

    // Draw horizontal minor lines
    for (let y = 0; y <= canvasHeight; y += minorSpacing) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
      context.stroke();
    }

    // Draw major grid lines on top
    context.strokeStyle = this.options.majorColor;
    context.lineWidth = 1;

    // Draw vertical major lines
    for (let x = 0; x <= canvasWidth; x += this.options.majorSpacing) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
      context.stroke();
    }

    // Draw horizontal major lines
    for (let y = 0; y <= canvasHeight; y += this.options.majorSpacing) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
      context.stroke();
    }
  }

  /**
   * Update grid options
   */
  updateOptions(newOptions: Partial<GridOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current grid options
   */
  getOptions(): GridOptions {
    return { ...this.options };
  }
}
