import type { Progress } from "./defs.js";

/** Return a Promise that resolves after the next event loop. */
export const nextTick = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
};

/** Check if an element has overflow */
export const hasOverflow = ({
  clientWidth,
  clientHeight,
  scrollWidth,
  scrollHeight,
}: HTMLElement) => {
  return scrollHeight > clientHeight || scrollWidth > clientWidth;
};

/** Check if an element is set to overflow: auto in at least one direction */
export const hasCSSOverflow = (element: HTMLElement) => {
  const overflow = window.getComputedStyle(element)["overflow"];
  return overflow.includes("auto") || overflow.includes("scroll");
};

/** Get the scroll progress of an element, between 0-1 */
export const getScrollProgress = (el: HTMLElement | undefined): Progress => {
  if (el == null) {
    return {
      x: 0,
      y: 0,
    };
  }

  const {
    scrollTop,
    scrollHeight,
    clientHeight,
    scrollLeft,
    scrollWidth,
    clientWidth,
  } = el;

  const availableWidth = scrollWidth - clientWidth;
  const availableHeight = scrollHeight - clientHeight;

  return {
    x: !!scrollLeft ? scrollLeft / Math.max(0.00001, availableWidth) : 0,
    y: !!scrollTop ? scrollTop / Math.max(0.00001, availableHeight) : 0,
  };
};
