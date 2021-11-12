import {
  Circle,
  circlesInverseDistance,
  getDistance,
  Line,
  Point,
} from "./cord.js";

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
  const handlerX = linearInterpolationX;
  const handlerY = linearInterpolationY;
  if (t === 0 || t === 15) return null;
  if (t === 1 || t === 14) {
    return [
      [
        countourPoint(2, 0, handlerX, p, d),
        countourPoint(2, 3, handlerY, p, d),
      ],
    ];
  }
  if (t === 2 || t === 13) {
    return [
      [
        countourPoint(3, 1, handlerX, p, d),
        countourPoint(3, 2, handlerY, p, d),
      ],
    ];
  }
  if (t === 4 || t === 11) {
    return [
      [
        countourPoint(1, 3, handlerX, p, d),
        countourPoint(1, 0, handlerY, p, d),
      ],
    ];
  }
  if (t === 7 || t === 8) {
    return [
      [
        countourPoint(0, 2, handlerX, p, d),
        countourPoint(0, 1, handlerY, p, d),
      ],
    ];
  }

  if (t === 3 || t === 12) {
    return [
      [
        countourPoint(0, 2, handlerX, p, d),
        countourPoint(1, 3, handlerX, p, d),
      ],
    ];
  }
  if (t === 6 || t === 9) {
    return [
      [
        countourPoint(0, 1, handlerY, p, d),
        countourPoint(2, 3, handlerY, p, d),
      ],
    ];
  }

  if (t === 5) {
    return [
      [
        countourPoint(0, 2, handlerX, p, d),
        countourPoint(0, 1, handlerY, p, d),
      ],
      [
        countourPoint(3, 1, handlerX, p, d),
        countourPoint(3, 2, handlerY, p, d),
      ],
    ];
  }

  if (t === 10) {
    return [
      [
        countourPoint(1, 3, handlerX, p, d),
        countourPoint(1, 0, handlerY, p, d),
      ],
      [
        countourPoint(2, 0, handlerX, p, d),
        countourPoint(2, 3, handlerY, p, d),
      ],
    ];
  }

  return null;
};

const midpointX = (point: Point, x: Point): Point => {
  return { x: point.x, y: midpoint(point.y, x.y) };
};

const midpointY = (point: Point, y: Point) => {
  return { y: point.y, x: midpoint(point.x, y.x) };
};

const midpoint = (x: number, y: number) => {
  return (x + y) >> 1;
};

const linearInterpolationX = (
  point: Point,
  x: Point,
  fp: number,
  fx: number
): Point => {
  return {
    x: point.x,
    y: linearInterpolation(point.y, x.y, fp, fx),
  };
};

const linearInterpolationY = (
  point: Point,
  x: Point,
  fp: number,
  fx: number
): Point => {
  return {
    x: linearInterpolation(point.x, x.x, fp, fx),
    y: point.y,
  };
};

const linearInterpolation = (
  x0: number,
  x1: number,
  fx0: number,
  fx1: number
) => {
  return x0 + ((1 - fx0) * (x1 - x0)) / (fx1 - fx0);
};

const countourPoint = (
  p1: number,
  p2: number,
  handler: any,
  p: Point[],
  d: number[]
): Point => {
  if (handler === linearInterpolationX || handler === linearInterpolationY)
    return handler(p[p1], p[p2], d[p1], d[p2]);
  return handler(p[p1], p[p2]);
};
