import { DebugOptions, DrawerOptions } from './canvas';

export const defaultOptions = {
  step: 10,
  debugStep: 10,
  circleScale: 30,
  circlesNum: 3,
  debugCircle: false,
  debugGrid: false,
  debugInvDist: false,
  lightOrb: false,
  fps: true,
};

export const options: DrawerOptions & DebugOptions = {
  ...defaultOptions,
};

export const resetOptions = (
  options: DrawerOptions & DebugOptions,
) => {
  Object.assign(options, defaultOptions);
};

export const toggleDebugOptions = (options: DebugOptions) => {
  options.debugCircle = !options.debugCircle;
  options.debugGrid = !options.debugGrid;
  options.debugInvDist = !options.debugInvDist;
};
