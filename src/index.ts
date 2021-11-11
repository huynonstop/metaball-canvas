import { mapTo8BitColor } from "./color.js";
import {
  Circle,
  createCircle,
  createPoint,
  getDistance,
  Line,
  moveCircle,
  Point,
} from "./cord.js";
import { circlesInverseDistance, marchingSquare } from "./marching-squares.js";

const size = (window.innerHeight >> 2) << 2;
const W = Math.min(size, 800);
const H = Math.min(size, 800);
let pause = false;

const circles: Circle[] = [];

const init = (circlesNum: number = 3) => {
  const [container, canvas] = createCanvas();
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < circlesNum; i++) {
    circles.push(
      createCircle(createPoint(W / 2, H / 2), (Math.random() + 0.5) * 30)
    );
  }
  requestAnimationFrame(() => {
    draw(ctx);
  });
};

const pixelsDraw = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const imgData = ctx.getImageData(0, 0, W, H);
  const pixels = imgData.data;

  for (let h = 0; h < imgData.height; h += 1) {
    for (let w = 0; w < imgData.width; w += 1) {
      const i = h * W + w;
      const off = i * 4;

      const point = createPoint(w, h);

      let id = circlesInverseDistance(circles, point);

      if (id >= 1) {
        // r / d > 1 <=> r > d
        pixels[off + 1] = 255; // green
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  for (let circle of circles) {
    moveCircle(circle, imgData);
  }

  requestAnimationFrame(() => {
    pixelsDraw(ctx);
  });
};

const S = 3;
const draw = (ctx: CanvasRenderingContext2D) => {
  if (pause) {
    requestAnimationFrame(() => {
      draw(ctx);
    });
    return;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const imgData = ctx.getImageData(0, 0, W, H);
  const pixels = imgData.data;

  for (let h = 0; h < imgData.height; h += S) {
    for (let w = 0; w < imgData.width; w += S) {
      const point = createPoint(w, h);

      const i = h * W + w;
      const off = i * 4;
      pixels[off + 2] = 255;

      // const id = circlesInverseDistance(circles, point);
      // ctx.font = "16px serif";
      // ctx.strokeStyle = id >= 1 ? "green" : "red";
      // ctx.strokeText(id.toPrecision(2), w, h);
      // ctx.font = "16px serif";
      // ctx.strokeStyle = "white";
      // ctx.strokeText(`(${w}, ${h})`, w, h + 14);

      const points = marchingSquare(circles, point, S);
      if (points) {
        drawLine(ctx, points[0]);
        drawLine(ctx, points[1]);
      }
    }
  }
  // ctx.putImageData(imgData, 0, 0);

  for (let circle of circles) {
    drawCircle(ctx, circle);
    moveCircle(circle, imgData);
  }

  requestAnimationFrame(() => {
    draw(ctx);
  });
};

const drawCircle = (ctx: CanvasRenderingContext2D, circle: Circle) => {
  ctx.beginPath();
  ctx.moveTo(circle.pos.x + circle.r, circle.pos.y);
  ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI, false);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.stroke();
};

const drawLine = (ctx: CanvasRenderingContext2D, line?: Line | null) => {
  if (!line) return 1;
  ctx.beginPath();
  ctx.moveTo(line[0].x, line[0].y);
  ctx.lineTo(line[1].x, line[1].y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "green";
  ctx.stroke();
  return 0;
};

const createCanvas = (): [HTMLElement | null, HTMLCanvasElement] => {
  const container = document.getElementById("container");
  const canvas = document.createElement("canvas");
  canvas.height = H;
  canvas.width = W;
  container?.appendChild(canvas);
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    pause = !pause;
  });
  button.textContent = "Pause";
  button.style.height = "40px";
  container?.appendChild(button);
  return [container, canvas];
};

init(5);
