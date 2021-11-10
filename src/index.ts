const init = () => {
  const [container, canvas] = createCanvas();
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const createCanvas = (): [HTMLElement | null, HTMLCanvasElement] => {
  const H = 800;
  const W = 800;
  const container = document.getElementById("container");
  const canvas = document.createElement("canvas");
  canvas.height = H;
  canvas.width = W;
  container?.appendChild(canvas);
  return [container, canvas];
};

init();
