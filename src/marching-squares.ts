import {
  Circle,
  circlesInverseDistance,
  Line,
  Point,
} from './cord.js';

// const midpointX = (point: Point, x: Point): Point => {
//   return { x: point.x, y: midpoint(point.y, x.y) };
// };

// const midpointY = (point: Point, y: Point) => {
//   return { y: point.y, x: midpoint(point.x, y.x) };
// };

// const midpoint = (x: number, y: number) => {
//   return (x + y) >> 1;
// };

const linearInterpolationX = (
  point: Point,
  x: Point,
  fp: number,
  fx: number,
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
  fx: number,
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
  fx1: number,
) => {
  return Math.floor(x0 + ((1 - fx0) * (x1 - x0)) / (fx1 - fx0));
};

const contourPoint = (
  p1: number,
  p2: number,
  handler: any,
  p: Point[],
  d: number[],
): Point => {
  if (
    handler === linearInterpolationX ||
    handler === linearInterpolationY
  )
    return handler(p[p1], p[p2], d[p1], d[p2]);
  return handler(p[p1], p[p2]);
};

export const marchingSquare = (
  circles: Circle[],
  { x, y }: Point,
  step: number,
): [Line[] | null, number[], Point[]] => {
  const cellPoints = [
    { x, y },
    { x: x + step, y },
    { x, y: y + step },
    { x: x + step, y: y + step },
  ];
  const cellInvDist = [
    circlesInverseDistance(circles, cellPoints[0]),
    circlesInverseDistance(circles, cellPoints[1]),
    circlesInverseDistance(circles, cellPoints[2]),
    circlesInverseDistance(circles, cellPoints[3]),
  ];
  const f = [
    cellInvDist[0] >= 1 ? 1 : 0,
    cellInvDist[1] >= 1 ? 1 : 0,
    cellInvDist[2] >= 1 ? 1 : 0,
    cellInvDist[3] >= 1 ? 1 : 0,
  ];
  const t = (((((f[0] << 1) + f[1]) << 1) + f[3]) << 1) + f[2];
  const handlerX = linearInterpolationX;
  const handlerY = linearInterpolationY;
  let contourLines: Line[] | null = null;
  if (t === 0 || t === 15) contourLines = null;
  if (t === 1 || t === 14) {
    contourLines = [
      [
        contourPoint(2, 0, handlerX, cellPoints, cellInvDist),
        contourPoint(2, 3, handlerY, cellPoints, cellInvDist),
      ],
    ];
  }
  if (t === 2 || t === 13) {
    contourLines = [
      [
        contourPoint(3, 1, handlerX, cellPoints, cellInvDist),
        contourPoint(3, 2, handlerY, cellPoints, cellInvDist),
      ],
    ];
  }
  if (t === 4 || t === 11) {
    contourLines = [
      [
        contourPoint(1, 3, handlerX, cellPoints, cellInvDist),
        contourPoint(1, 0, handlerY, cellPoints, cellInvDist),
      ],
    ];
  }
  if (t === 7 || t === 8) {
    contourLines = [
      [
        contourPoint(0, 2, handlerX, cellPoints, cellInvDist),
        contourPoint(0, 1, handlerY, cellPoints, cellInvDist),
      ],
    ];
  }

  if (t === 3 || t === 12) {
    contourLines = [
      [
        contourPoint(0, 2, handlerX, cellPoints, cellInvDist),
        contourPoint(1, 3, handlerX, cellPoints, cellInvDist),
      ],
    ];
  }
  if (t === 6 || t === 9) {
    contourLines = [
      [
        contourPoint(0, 1, handlerY, cellPoints, cellInvDist),
        contourPoint(2, 3, handlerY, cellPoints, cellInvDist),
      ],
    ];
  }

  if (t === 5) {
    contourLines = [
      [
        contourPoint(0, 2, handlerX, cellPoints, cellInvDist),
        contourPoint(0, 1, handlerY, cellPoints, cellInvDist),
      ],
      [
        contourPoint(3, 1, handlerX, cellPoints, cellInvDist),
        contourPoint(3, 2, handlerY, cellPoints, cellInvDist),
      ],
    ];
  }

  if (t === 10) {
    contourLines = [
      [
        contourPoint(1, 3, handlerX, cellPoints, cellInvDist),
        contourPoint(1, 0, handlerY, cellPoints, cellInvDist),
      ],
      [
        contourPoint(2, 0, handlerX, cellPoints, cellInvDist),
        contourPoint(2, 3, handlerY, cellPoints, cellInvDist),
      ],
    ];
  }

  return [contourLines, cellInvDist, cellPoints];
};
