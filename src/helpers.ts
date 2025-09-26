import { LineSegment, Point } from "./types";

export const intersect = (left: LineSegment, right: LineSegment): Point | null => {
  const { x1, y1, x2, y2 } = left;
  const { x1: x3, y1: y3, x2: x4, y2: y4 } = right;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denom === 0) return null; // Parallel lines

  const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
  const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

  // Check if intersection is within both segments
  const within1 =
    Math.min(x1, x2) <= px &&
    px <= Math.max(x1, x2) &&
    Math.min(y1, y2) <= py &&
    py <= Math.max(y1, y2);
  const within2 =
    Math.min(x3, x4) <= px &&
    px <= Math.max(x3, x4) &&
    Math.min(y3, y4) <= py &&
    py <= Math.max(y3, y4);
  if (within1 && within2) {
    return { x: px, y: py };
  }
  return null;
};
