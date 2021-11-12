import { mapTo8BitColor } from "./color.js";
import { Circle, createPoint, Line, circlesInverseDistance } from "./cord.js";
import { marchingSquare } from "./marching-squares.js";

export const drawCircle = (ctx: CanvasRenderingContext2D, circle: Circle) => {
  ctx.beginPath();
  ctx.moveTo(circle.pos.x + circle.r, circle.pos.y);
  ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI, false);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.stroke();
};

export const drawLine = (ctx: CanvasRenderingContext2D, line?: Line | null) => {
  if (!line) return;
  ctx.beginPath();
  ctx.moveTo(line[0].x, line[0].y);
  ctx.lineTo(line[1].x, line[1].y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "green";
  ctx.stroke();
};

export const pixelsDraw: Drawer = (
  ctx,
  circles,
  options = {
    debugStep: 10,
    debugCircle: false,
    debugGrid: false,
    lightOrb: false,
  }
) => {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H);

  const imgData = ctx.getImageData(0, 0, W, H);
  const pixels = imgData.data;

  for (let h = 0; h < H; h += 1) {
    for (let w = 0; w < W; w += 1) {
      const i = h * W + w;
      const off = i * 4;

      const point = createPoint(w, h);

      let id = circlesInverseDistance(circles, point);

      if (id >= 1) {
        // r / d > 1 <=> r > d
        pixels[off + 1] = 255; // green
      } else if (options.lightOrb) {
        pixels[off + 1] = mapTo8BitColor(Math.max(0, id - 0.2), 0.8);
      }

      if (
        options.debugGrid &&
        options.step &&
        h % options.step === 0 &&
        w % options.step === 0
      ) {
        if (id >= 1) {
          pixels[off + 1] = 255; // green
        } else {
          pixels[off + 2] = 255; // blue
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
};

export const marchingSquaresDraw: Drawer = (
  ctx,
  circles,
  options = { debugID: false, debugCircle: false, debugGrid: false }
) => {
  const step = options.step || 5;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  for (let h = 0; h < H; h += step) {
    for (let w = 0; w < W; w += step) {
      const point = createPoint(w, h);

      if (options.debugID) {
        const id = circlesInverseDistance(circles, point);
        ctx.font = "16px serif";
        ctx.fillStyle = id >= 1 ? "green" : "red";
        ctx.fillText(id.toPrecision(2), w, h);
        ctx.font = "16px serif";
        ctx.fillStyle = "white";
        ctx.fillText(`(${w}, ${h})`, w, h + 14);
      }

      if (options.debugGrid) {
        const id = circlesInverseDistance(circles, point);
        ctx.fillStyle = id >= 1 ? "green" : "blue";
        ctx.fillRect(w, h, 1, 1);
      }

      const points = marchingSquare(circles, point, step);
      if (points) {
        drawLine(ctx, points[0]);
        drawLine(ctx, points[1]);
      }
    }
  }
};

export type Drawer = (
  ctx: CanvasRenderingContext2D,
  circles: Circle[],
  options?: DrawerOptions
) => void;

export interface DrawerOptions {
  step?: number;
  debugStep?: number;
  debugCircle?: boolean;
  debugGrid?: boolean;
  debugID?: boolean;
  lightOrb?: boolean;
  circlesNum?: number;
  circleScale?: number;
  fps?: boolean;
}
