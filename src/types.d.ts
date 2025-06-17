export type Point = {
  x: number;
  y: number;
};

export type Color = {
  r: number;
  g: number;
  b: number;
  a?: number; // Optional alpha channel
};

export type LineSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Normal = {
  dx: number; // x component of the normal vector
  dy: number; // y component of the normal vector
}