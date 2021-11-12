export const getIndexAndOffset = (w: number, h: number, imgData: ImageData) => {
  const index = w * imgData.width + h;
  const offset = index * 4;
  return [index, offset];
};

export const getDistance = (a: Point, b: Point) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export interface Point {
  x: number;
  y: number;
}

export type Line = [Point, Point];

export const createPoint = (x: number, y: number): Point => {
  return {
    x,
    y,
  };
};

export interface Circle {
  pos: Point;
  r: number;
  v: [number, number];
}

export const createCircle = (pos: Point, r: number): Circle => {
  const vx = Math.random() - 0.5;
  const vy = Math.random() - 0.5;
  const scale = (Math.random() + 0.5) * 10;
  const v: [number, number] = [vx * scale, vy * scale];
  return {
    pos,
    r,
    v,
  };
};

export const moveCircle = (circle: Circle, boundW: number, BoundH: number) => {
  const { x, y } = circle.pos;
  const [vx, vy] = circle.v;

  const newX = x + vx;
  const newY = y + vy;
  const newPos = createPoint(newX, newY);
  if (newX + circle.r > boundW || newX - circle.r < 0) {
    circle.v[0] *= -1;
  }
  if (newY + circle.r > BoundH || newY - circle.r < 0) {
    circle.v[1] *= -1;
  }
  circle.pos = newPos;
  return circle;
};

export const circlesInverseDistance = (circles: Circle[], p: Point) => {
  let id = 0;
  for (let circle of circles) {
    const dist = getDistance(p, circle.pos);
    id += circle.r / dist;
  }
  return id;
};
