export const getContainer = () => {
  return document.getElementById("container");
};

export const createCanvas = (
  container: HTMLElement,
  W: number,
  H: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.height = H;
  canvas.width = W;
  container.appendChild(canvas);
  return canvas;
};

export const createControllerGroup = (container: HTMLElement) => {
  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("btn-grp");

  const pButton = document.createElement("button");
  pButton.textContent = "Pause";
  pButton.style.height = "40px";
  buttonGroup.appendChild(pButton);

  const dbButton = document.createElement("button");
  dbButton.textContent = "Debug";
  dbButton.style.height = "40px";
  buttonGroup.appendChild(dbButton);

  const rsButton = document.createElement("button");
  rsButton.textContent = "Reset";
  rsButton.style.height = "40px";
  buttonGroup.appendChild(rsButton);

  const seButton = document.createElement("button");
  seButton.textContent = "Switch Engine";
  seButton.style.height = "40px";
  buttonGroup.appendChild(seButton);

  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.style.height = "40px";
  buttonGroup.appendChild(addButton);

  const popButton = document.createElement("button");
  popButton.textContent = "Pop";
  popButton.style.height = "40px";
  buttonGroup.appendChild(popButton);

  container.appendChild(buttonGroup);
  return {
    buttonGroup,
    pButton,
    dbButton,
    rsButton,
    seButton,
    addButton,
    popButton,
  };
};
