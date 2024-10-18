import type { getLogger } from "./functions.js";

export type Progress = {
  x: number;
  y: number;
};

export type Options = {
  /** Mirror the vertical scroll position */
  vertical: boolean;
  /** Mirror the horizontal scroll position */
  horizontal: boolean;
  /** Enable debug messages */
  debug: boolean;
};

export type Logger = ReturnType<typeof getLogger>;