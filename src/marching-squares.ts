import { Circle, getDistance, Line, Point } from "./cord.js";

export const circlesInverseDistance = (circles: Circle[], p: Point) => {
  let id = 0;
  for (let circle of circles) {
    const dist = getDistance(p, circle.pos);
    id += circle.r / dist;
  }
  return id;
};

export const marchingSquare = (
  circles: Circle[],
  { x, y }: Point,
  step: number
): Line[] | null => {
  const p = [
    { x, y },
    { x: x + step, y },
    { x, y: y + step },
    { x: x + step, y: y + step },
  ];
  const d = [
    circlesInverseDistance(circles, p[0]),
    circlesInverseDistance(circles, p[1]),
    circlesInverseDistance(circles, p[2]),
    circlesInverseDistance(circles, p[3]),
  ];
  const f = [
    d[0] >= 1 ? 1 : 0,
    d[1] >= 1 ? 1 : 0,
    d[2] >= 1 ? 1 : 0,
    d[3] >= 1 ? 1 : 0,
  ];
  const t = (((((f[0] << 1) + f[1]) << 1) + f[3]) << 1) + f[2];
  if (t === 0 || t === 15) return null;
  if (t === 1 || t === 14) {
    return [[pointX(p[2], p[0]), pointY(p[2], p[3])]];
  }
  if (t === 2 || t === 13) return [[pointX(p[3], p[1]), pointY(p[3], p[2])]];
  if (t === 4 || t === 11) return [[pointX(p[1], p[3]), pointY(p[1], p[0])]];
  if (t === 7 || t === 8) return [[pointX(p[0], p[2]), pointY(p[0], p[1])]];

  if (t === 3 || t === 12) return [[pointX(p[0], p[2]), pointX(p[1], p[3])]];
  if (t === 6 || t === 9) return [[pointY(p[0], p[1]), pointY(p[2], p[3])]];

  if (t === 5)
    return [
      [pointX(p[0], p[2]), pointY(p[0], p[1])],
      [pointX(p[3], p[1]), pointY(p[3], p[2])],
    ];
  if (t === 10)
    return [
      [pointX(p[1], p[3]), pointY(p[1], p[0])],
      [pointX(p[2], p[0]), pointY(p[2], p[3])],
    ];
  return null;
};

const pointX = (point: Point, x: Point): Point => {
  return { x: point.x, y: midpoint(point.y, x.y) };
};

const pointY = (point: Point, y: Point) => {
  return { y: point.y, x: midpoint(point.x, y.x) };
};

const linearInterpolation = (x: number, fx: number, y: number, fy: number) => {
  return x + ((1 - fx) * (y - x)) / (fy - fx);
};

const midpoint = (x: number, y: number) => {
  return (x + y) >> 1;
};
