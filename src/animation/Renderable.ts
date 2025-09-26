export abstract class Renderable {
  update: (
    /** How long since the previous update */
    deltaTimeMs: number,
  ) => void;

  render: (
    context: CanvasRenderingContext2D,

    /** a looping value, for timed animations */
    t: number,
  ) => void;
}
