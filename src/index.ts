import type { Options, Progress } from "./support/defs.js";
import {
  getScrollProgress,
  hasCSSOverflow,
  hasOverflow,
  nextTick,
} from "./support/helpers.js";
import ScrollMirror from './ScrollMirror.js';

export type { Options, Progress };
export { getScrollProgress, hasOverflow, hasCSSOverflow, nextTick };
export default ScrollMirror;