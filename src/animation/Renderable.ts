export abstract class Renderable {
  abstract update: (
    /** How long since the previous update */
    deltaTimeMs: number,
  ) => void;

  abstract render: (
    context: CanvasRenderingContext2D,

    /** a looping value, for timed animations */
    t: number,
  ) => void;
}
