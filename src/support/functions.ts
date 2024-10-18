import type { Logger, Progress } from "./defs.js";
import { hasCSSOverflow, hasOverflow } from "./helpers.js";

/**
 * Get the event target for receiving scroll events
 * - return the window if the element is either the html or body element
 * - otherwise, return the element
 */
export function getScrollEventTarget(element: HTMLElement): Window | HTMLElement {
  return element.matches("body *") ? element : window;
}

/**
 * Get a minimal logger with a prefix
 */
export function getLogger(prefix: string) {
  return {
    log: (...args: any[]) => console.log(prefix, ...args),
    warn: (...args: any[]) => console.warn(prefix, ...args),
    error: (...args: any[]) => console.error(prefix, ...args),
  };
}

/**
 * Make sure the provided elements are valid
 */
export function validateElements(
  elements: HTMLElement[],
  logger?: Logger
): void {
  if (elements.length < 1) {
    logger?.warn("No elements provided.");
    return;
  }

  if (elements.length < 2) {
    logger?.warn("Only one element provided.", elements);
  }

  if (elements.some((el) => !el)) {
    logger?.error("Some elements are not defined.", elements);
  }

  for (const element of elements) {
    if (element instanceof HTMLElement && !hasOverflow(element)) {
      logger?.warn("Element doesn't have overflow:", element);
    }
    if (
      element instanceof HTMLElement &&
      element.matches("body *") &&
      !hasCSSOverflow(element)
    ) {
      logger?.warn('No "overflow: auto;" or "overflow: scroll;" set on element:', element); // prettier-ignore
    }
  }
}

/**
 * Validate the progress, log errors for invalid values
 */
export function validateProgress(
  progress: Partial<Progress>,
  logger?: Logger
) {
  let valid = true;
  for (const [key, value] of Object.entries(progress)) {
    if (typeof value !== "number" || value < 0 || value > 1) {
      logger?.error(`progress.${key} must be a number between 0-1`);
      valid = false;
    }
  }
  return valid;
}