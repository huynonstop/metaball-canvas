export const mapTo8BitColor = (value: number, max: number) => {
  return (value / max) * 255;
};

export const createRGB = (r = 0, g = 0, b = 0): ColorRGB => [r, g, b];

export const randomRGB = (): ColorRGB =>
  createRGB(
    mapTo8BitColor(Math.random(), 1),
    mapTo8BitColor(Math.random(), 1),
    mapTo8BitColor(Math.random(), 1)
  );

export type ColorRGB = [number, number, number];
