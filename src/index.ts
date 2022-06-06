import {
  drawCircle,
  marchingSquaresDraw,
  pixelsDraw,
} from './canvas.js';
import {
  options,
  resetOptions,
  toggleDebugOptions,
} from './config.js';
import {
  Circle,
  createCircle,
  createPoint,
  moveCircle,
} from './cord.js';
import {
  createCanvas,
  createControllerGroup,
  getContainer,
} from './dom.js';

const size = (window.innerHeight >> 2) << 2;
const W = Math.min(size, 1024);
const H = Math.min(size, 1024);
let pause = false;

const circles: Circle[] = [];
const addCircle = (
  circles: Circle[],
  x: number,
  y: number,
  scale: number,
) => {
  circles.push(
    createCircle(createPoint(x, y), (Math.random() + 0.5) * scale),
  );
};

let requestAnimationId: number | null;
const drawEngine = [marchingSquaresDraw, pixelsDraw];
const drawEngineName = ['Marching Squares', 'Full Pixels'];
let engine = 0;

let lastCalcFPS = performance.now();
const calcFPS = () => {
  const now = performance.now();
  const delta = (now - lastCalcFPS) / 1000;
  lastCalcFPS = now;
  const fps = (1 / delta).toPrecision(2);
  return fps;
};

let drawHandler = (ctx: CanvasRenderingContext2D) => {
  if (!pause) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, W, H);
    drawEngine[engine](ctx, circles, options);

    for (let circle of circles) {
      if (options.debugCircle) drawCircle(ctx, circle);
      moveCircle(circle, W, H);
    }
    if (options.fps) {
      ctx.fillStyle = 'yellow';
      ctx.font = '16px serif';
      ctx.fillText(calcFPS() + ' ' + drawEngineName[engine], 10, 20);
    }
  }
  requestAnimationId = requestAnimationFrame(() => {
    drawHandler(ctx);
  });
};

const startDraw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < options.circlesNum; i++) {
    addCircle(circles, W / 2, H / 2, options.circleScale);
  }
  drawHandler(ctx);
};

const init = () => {
  const container = getContainer();
  if (!container) return null;

  const canvas = createCanvas(container, W, H);
  canvas.onclick = (event: any) => {
    let x = event.layerX || event.offsetX;
    let y = event.layerY || event.offsetY;
    if (x && y && options.circleScale) {
      addCircle(circles, x, y, options.circleScale);
    }
  };

  const {
    pButton,
    dbButton,
    rsButton,
    seButton,
    addButton,
    popButton,
  } = createControllerGroup(container);
  pButton.onclick = () => {
    pause = !pause;
  };

  dbButton.onclick = () => {
    toggleDebugOptions(options);
  };

  rsButton.onclick = () => {
    pause = false;
    resetOptions(options);
    circles.splice(0, circles.length);
    if (requestAnimationId) {
      cancelAnimationFrame(requestAnimationId);
    }
    startDraw(canvas);
  };
  seButton.onclick = () => {
    engine = (engine + 1) % drawEngine.length;
  };
  addButton.onclick = () => {
    if (options.circleScale)
      addCircle(circles, W / 2, H / 2, options.circleScale);
  };
  popButton.onclick = () => {
    circles.pop();
  };
  return canvas;
};

const cv = init();
if (cv) startDraw(cv);
