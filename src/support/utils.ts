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