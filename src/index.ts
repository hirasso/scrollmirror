import { hasCSSOverflow, hasOverflow, nextTick } from "./support/utils.js";

export type Options = {
  /** Adjust the scroll speed so that all elements reach the maximum scroll position at the same time */
  proportional: boolean;
  /** Mirror the vertical scroll position */
  vertical: boolean;
  /** Mirror the horizontal scroll position */
  horizontal: boolean;
};

/**
 * Mirrors the scroll position of multiple elements on a page
 */
export default class ScrollMirror {
  /** Mirror the scroll positions of these elements */
  readonly elements: HTMLElement[];
  /** The default options */
  readonly defaults: Options = {
    proportional: true,
    vertical: true,
    horizontal: true,
  };
  /** The parsed options */
  options: Options;
  /** Is mirroring paused? */
  paused: boolean = false;
  /** @internal */
  prefix: string = "[scroll-mirror]";

  constructor(elements: HTMLElement[], options: Partial<Options> = {}) {
    this.elements = elements;
    this.options = { ...this.defaults, ...options };

    if (!this.validateElements()) return;

    this.elements.forEach((element) => this.addEventListener(element));
  }

  /** Pause mirroring */
  pause() {
    this.paused = true;
  }

  /** Resume mirroring */
  resume() {
    this.paused = false;
  }

  /** Destroy. Removes all event handlers */
  destroy() {
    this.elements.forEach((element) => this.removeEventListener(element));
  }

  /** Make sure the provided elements are valid @internal */
  validateElements(): boolean {
    const elements = [...this.elements];
    if (elements.length < 2) {
      console.error(`${this.prefix} Please provide at least two elements`);
      return false;
    }
    for (const element of elements) {
      if (!hasOverflow(element)) {
        console.warn(`${this.prefix} element doesn't have overflow:`, element);
      }
      if (!hasCSSOverflow(element)) {
        console.warn(
          `${this.prefix} no "overflow: auto;" or "overflow: scroll;" set on element:`,
          element
        );
      }
    }
    return true;
  }

  /** Add the scroll handler to the element @internal */
  addEventListener(element: HTMLElement) {
    element.addEventListener("scroll", this.handleScroll);
  }

  /** Remove the scroll handler from an element @internal */
  removeEventListener(element: HTMLElement) {
    element.removeEventListener("scroll", this.handleScroll);
  }

  /** Handle a scroll event on an element @internal */
  handleScroll = async (event: Event) => {
    if (this.paused) return;

    const scrolledElement = event.target as HTMLElement;

    await nextTick();

    this.elements.forEach((element) => {
      /* Ignore the currently scrolled element  */
      if (scrolledElement.isSameNode(element)) return;

      /* Remove the scroll event listener */
      this.removeEventListener(element);

      this.mirrorScrollPosition(scrolledElement, element);

      /* Re-attach the scroll event listener */
      window.requestAnimationFrame(() => {
        this.addEventListener(element);
      });
    });
  };

  /** Mirror the scroll position from another element @internal */
  mirrorScrollPosition(scrolledElement: HTMLElement, element: HTMLElement) {
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
      offsetHeight,
      offsetWidth,
    } = scrolledElement;

    const scrollTopOffset = scrollHeight - clientHeight;
    const scrollLeftOffset = scrollWidth - clientWidth;

    const { proportional, vertical, horizontal } = this.options;

    /* Calculate the actual element scroll height */
    const elementHeight = element.scrollHeight - clientHeight;
    const elementWidth = element.scrollWidth - clientWidth;

    /* Adjust the scroll position of it accordingly */
    if (vertical && scrollTopOffset > 0) {
      element.scrollTop = proportional ? (elementHeight * scrollTop) / scrollTopOffset : scrollTop; // prettier-ignore
    }
    if (horizontal && scrollLeftOffset > 0) {
      element.scrollLeft = proportional ? (elementWidth * scrollLeft) / scrollLeftOffset : scrollLeft; // prettier-ignore
    }
  }
}
