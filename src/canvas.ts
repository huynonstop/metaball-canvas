import { mapTo8BitColor } from './color.js';
import {
  Circle,
  createPoint,
  Line,
  circlesInverseDistance,
} from './cord.js';
import { marchingSquare } from './marching-squares.js';

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  circle: Circle,
) => {
  ctx.beginPath();
  ctx.moveTo(circle.pos.x + circle.r, circle.pos.y);
  ctx.arc(
    circle.pos.x,
    circle.pos.y,
    circle.r,
    0,
    2 * Math.PI,
    false,
  );
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'red';
  ctx.stroke();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  line?: Line | null,
) => {
  if (!line) return;
  ctx.beginPath();
  ctx.moveTo(line[0].x, line[0].y);
  ctx.lineTo(line[1].x, line[1].y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'green';
  ctx.stroke();
};

const drawDebugGrid = (
  pixels: Uint8ClampedArray,
  W: number,
  H: number,
  step: number,
) => {
  let cachedPixels: Uint8ClampedArray;
  const cachedDraw = () => {
    if (cachedPixels) return cachedPixels;
    for (let h = 0; h < H; h += 1) {
      for (let w = 0; w < W; w += 1) {
        const i = h * W + w;
        const off = i * 4;
        // if (h % step === 0 || w % step === 0) {
        // // grid
        //   pixels[off + 2] = 255;
        // }
        if (h % step === 0 && w % step === 0) {
          // dot
          pixels[off + 2] = 255;
        }
      }
    }
    cachedPixels = pixels;
    return pixels;
  };
  return cachedDraw();
};

export const pixelsDraw: Drawer = (ctx, circles, options) => {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const imgData = ctx.getImageData(0, 0, W, H);
  const pixels = imgData.data;

  if (options.debugGrid && options.step) {
    drawDebugGrid(pixels, W, H, options.step);
  }

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
    }
  }
  ctx.putImageData(imgData, 0, 0);
};

export const marchingSquaresDraw: Drawer = (
  ctx,
  circles,
  options,
) => {
  const step = options.step; // marching square size
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const imgData = ctx.getImageData(0, 0, W, H);
  const pixels = imgData.data;

  if (options.debugGrid && step) {
    drawDebugGrid(pixels, W, H, step);
    ctx.putImageData(imgData, 0, 0);
  }

  for (let h = 0; h < H; h += step) {
    for (let w = 0; w < W; w += step) {
      // const i = h * W + w;
      // const off = i * 4;
      const point = createPoint(w, h);
      const [pairPoints, ids] = marchingSquare(circles, point, step);

      if (options.debugInvDist) {
        const id = ids[0];
        ctx.font = '8px serif';
        ctx.fillStyle = id >= 1 ? 'green' : 'red';
        ctx.fillText(id.toPrecision(2), w, h);
      }

      if (pairPoints) {
        drawLine(ctx, pairPoints[0]);
        drawLine(ctx, pairPoints[1]);
      }
    }
  }
};

export type Drawer = (
  ctx: CanvasRenderingContext2D,
  circles: Circle[],
  options: DebugOptions & DrawerOptions,
) => void;

export interface DebugOptions {
  debugInvDist: boolean;
  debugCircle: boolean;
  debugGrid: boolean;
}

export interface DrawerOptions {
  step: number;
  debugStep: number;
  lightOrb: boolean;
  circlesNum: number;
  circleScale: number;
  fps: boolean;
}
