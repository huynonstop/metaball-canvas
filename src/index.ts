import {
  drawCircle,
  DrawerOptions,
  marchingSquaresDraw,
  pixelsDraw,
} from "./canvas.js";
import { Circle, createCircle, createPoint, moveCircle } from "./cord.js";
import { createCanvas, createControllerGroup, getContainer } from "./dom.js";

const size = (window.innerHeight >> 2) << 2;
const W = Math.min(size, 800);
const H = Math.min(size, 800);
let pause = false;
let circles: Circle[] = [];
const addCircle = (x: number, y: number, scale: number) => {
  circles.push(createCircle(createPoint(x, y), (Math.random() + 0.5) * scale));
};

let lastCalcFPS = performance.now();

let options: DrawerOptions = {
  step: 3,
  debugStep: 10,
  circleScale: 30,
  circlesNum: 3,
  debugCircle: false,
  debugGrid: false,
  debugID: false,
  lightOrb: false,
  fps: true,
};

let requestId: number | null;
const drawEngine = [marchingSquaresDraw, pixelsDraw];
const drawEngineName = ["Marching Squares", "Full Pixels"];
let engine = 0;
let drawHandler = (ctx: CanvasRenderingContext2D) => {
  if (!pause) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
    drawEngine[engine](ctx, circles, options);

    for (let circle of circles) {
      if (options.debugCircle) drawCircle(ctx, circle);
      moveCircle(circle, W, H);
    }
    if (options.fps) {
      const now = performance.now();
      const delta = (now - lastCalcFPS) / 1000;
      lastCalcFPS = now;
      const fps = (1 / delta).toPrecision(2);
      ctx.fillStyle = "yellow";
      ctx.font = "16px serif";
      ctx.fillText(fps + " " + drawEngineName[engine], 10, 20);
    }
  }
  requestId = requestAnimationFrame(() => {
    drawHandler(ctx);
  });
};

const init = () => {
  const container = getContainer();
  if (!container) return;

  const canvas = createCanvas(container, W, H);

  canvas.style.cursor = "pointer";
  canvas.onclick = (event: any) => {
    let x = event.layerX || event.offsetX;
    let y = event.layerY || event.offsetY;
    if (x && y && options.circleScale) {
      addCircle(x, y, options.circleScale);
    }
  };

  const { pButton, dbButton, rsButton, seButton, addButton, popButton } =
    createControllerGroup(container);

  pButton.onclick = () => {
    pause = !pause;
  };

  dbButton.onclick = () => {
    options.debugCircle = !options.debugCircle;
    options.debugGrid = !options.debugGrid;
    options.debugID = !options.debugID;
  };
  dbButton.disabled = true;

  rsButton.onclick = () => {
    pause = false;
    options = {
      step: 3,
      debugStep: 10,
      circleScale: 30,
      circlesNum: 3,
      debugCircle: false,
      debugGrid: false,
      debugID: false,
      lightOrb: false,
      fps: true,
    };
    circles = [];
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
    startDraw(canvas);
  };
  seButton.onclick = () => {
    engine = (engine + 1) % drawEngine.length;
  };
  addButton.onclick = () => {
    if (options.circleScale) addCircle(W / 2, H / 2, options.circleScale);
  };
  popButton.onclick = () => {
    circles.pop();
  };

  startDraw(canvas);
};

const startDraw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const circlesNum = options.circlesNum || 3;
  const circleScale = options.circleScale || 30;
  for (let i = 0; i < circlesNum; i++) {
    addCircle(W / 2, H / 2, circleScale);
  }
  drawHandler(ctx);
};

init();
