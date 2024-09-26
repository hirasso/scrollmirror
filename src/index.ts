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

  constructor(
    elements: NodeListOf<Element> | Element[],
    options: Partial<Options> = {},
  ) {
    this.elements = [...elements]
      .filter(Boolean)
      .map((el) => this.getScrollContainer(el));

    // remove duplicates
    this.elements = [...new Set(this.elements)];

    this.options = { ...this.defaults, ...options };

    if (!this.validateElements()) return;

    this.elements.forEach((element) => this.addHandler(element));
    /**
     * Initially, make sure that elements are mirrored to the
     * documentElement's scroll position (if provided)
     */
    if (this.elements.includes(document.documentElement)) {
      this.mirrorScrollPositions(document.documentElement);
    }
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
    this.elements.forEach((element) => this.removeHandler(element));
  }

  /** Make sure the provided elements are valid @internal */
  validateElements(): boolean {
    const elements = [...this.elements];
    if (elements.length < 2) {
      console.error(`${this.prefix} Please provide at least two elements`);
      return false;
    }
    for (const element of elements) {
      if (!element) {
        console.warn(`${this.prefix} element is not defined:`, element);
        return false;
      }
      if (element instanceof HTMLElement && !hasOverflow(element)) {
        console.warn(`${this.prefix} element doesn't have overflow:`, element);
      }
      if (
        element instanceof HTMLElement &&
        element.matches("body *") &&
        !hasCSSOverflow(element)
      ) {
        console.warn(
          `${this.prefix} no "overflow: auto;" or "overflow: scroll;" set on element:`,
          element,
        );
      }
    }
    return true;
  }

  /** Add the scroll handler to the element @internal */
  addHandler(element: HTMLElement) {
    /** Safeguard to prevent duplicate handlers on elements */
    this.removeHandler(element);

    const target = this.getEventTarget(element);
    target.addEventListener("scroll", this.handleScroll);
  }

  /** Remove the scroll handler from an element @internal */
  removeHandler(element: HTMLElement) {
    const target = this.getEventTarget(element);
    target.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * Get the scroll container, based on element provided:
   * - return the element if it's a child of <body>
   * - otherwise, return the documentElement
   */
  getScrollContainer(el: unknown): HTMLElement {
    if (el instanceof HTMLElement && el.matches("body *")) return el;
    return document.documentElement;
  }

  /**
   * Get the event target for receiving scroll events
   * - return the window if the element is either the html or body element
   * - otherwise, return the element
   */
  getEventTarget(element: HTMLElement): Window | HTMLElement {
    return element.matches("body *") ? element : window;
  }

  /** Handle a scroll event on an element @internal */
  handleScroll = async (event: Event) => {
    if (this.paused) return;

    const scrolledElement = this.getScrollContainer(event.currentTarget);

    await nextTick();

    this.mirrorScrollPositions(scrolledElement);
  };

  /** Asynchroneously mirror the scroll posistions of all elements to a provided element */
  async mirrorScrollPositions(scrolledElement: HTMLElement) {
    this.elements.forEach((element) => {
      /* Ignore the currently scrolled element  */
      if (scrolledElement === element) return;

      /* Remove the scroll event listener */
      this.removeHandler(element);

      this.mirrorScrollPosition(scrolledElement, element);

      /* Re-attach the scroll event listener */
      window.requestAnimationFrame(() => {
        this.addHandler(element);
      });
    });
  }

  /** Mirror the scroll position from on to another element @internal */
  mirrorScrollPosition(scrolled: HTMLElement, target: HTMLElement) {
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = scrolled;

    const scrollTopOffset = scrollHeight - clientHeight;
    const scrollLeftOffset = scrollWidth - clientWidth;

    const { proportional, vertical, horizontal } = this.options;

    /* Calculate the actual element scroll height */
    const elementHeight = target.scrollHeight - target.clientHeight;
    const elementWidth = target.scrollWidth - target.clientWidth;

    /* Adjust the scroll position accordingly */
    if (vertical && scrollTopOffset > 0) {
      const top = proportional ? (elementHeight * scrollTop) / scrollTopOffset : scrollTop // prettier-ignore
      target.scrollTo({ top, behavior: "instant" });
    }
    if (horizontal && scrollLeftOffset > 0) {
      const left = proportional ? (elementWidth * scrollLeft) / scrollLeftOffset : scrollLeft // prettier-ignore
      target.scrollTo({ left, behavior: "instant" });
    }
  }
}
