import type { Progress, Options } from "./support/defs.js";
import {
  getScrollProgress,
  hasCSSOverflow,
  hasOverflow,
  nextTick,
} from "./support/helpers.js";

/**
 * Mirrors the scroll position of multiple elements on a page
 */
export default class ScrollMirror {
  /** Mirror the scroll positions of these elements */
  readonly elements: HTMLElement[];
  /** The default options */
  readonly defaults: Options = {
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
    options: Partial<Options> = {}
  ) {
    this.elements = [...elements]
      .filter(Boolean)
      .map((el) => this.getScrollContainer(el));

    // remove duplicates
    this.elements = [...new Set(this.elements)];

    this.options = { ...this.defaults, ...options };

    this.validateElements();

    this.elements.forEach((element) => this.addHandler(element));
    /**
     * Initially, make sure that elements are mirrored to the
     * documentElement's scroll position (if provided)
     */
    if (this.elements.includes(document.documentElement)) {
      this.mirrorScrollPositions(
        getScrollProgress(document.documentElement),
        document.documentElement
      );
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
  validateElements(): void {
    const elements = [...this.elements];

    if (elements.length < 1) {
      console.warn(`${this.prefix} No elements provided.`);
      return;
    }

    if (elements.length < 2) {
      console.warn(`${this.prefix} Only one element provided.`, elements);
    }

    if (elements.some((el) => !el)) {
      console.error(`${this.prefix} some elements are not defined:`, elements);
    }

    for (const element of elements) {
      if (element instanceof HTMLElement && !hasOverflow(element)) {
        console.warn(`${this.prefix} element doesn't have overflow:`, element);
      }
      if (
        element instanceof HTMLElement &&
        element.matches("body *") &&
        !hasCSSOverflow(element)
      ) {
        console.warn(`${this.prefix} no "overflow: auto;" or "overflow: scroll;" set on element:`, element); // prettier-ignore
      }
    }
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

    if (!event.currentTarget) return;

    const scrolledElement = this.getScrollContainer(event.currentTarget);

    await nextTick();

    this.mirrorScrollPositions(
      getScrollProgress(scrolledElement),
      scrolledElement
    );
  };

  /** Mirror the scroll positions of all elements to a target @internal */
  mirrorScrollPositions(
    progress: Progress,
    ignore: HTMLElement | undefined = undefined
  ) {
    this.elements.forEach((element) => {
      /* Ignore the currently scrolled element  */
      if (ignore === element) return;

      /* Remove the scroll event listener */
      this.removeHandler(element);

      this.setScrollPosition(progress, element);

      /* Re-attach the scroll event listener */
      window.requestAnimationFrame(() => {
        this.addHandler(element);
      });
    });
  }

  /** Mirror the scroll position from one element to another @internal */
  setScrollPosition(progress: Progress, target: HTMLElement) {
    const { vertical, horizontal } = this.options;

    /* Calculate the actual element scroll lengths */
    const availableScroll = {
      x: target.scrollWidth - target.clientWidth,
      y: target.scrollHeight - target.clientHeight,
    };

    /* Adjust the scroll position accordingly */
    if (vertical && !!availableScroll.y) {
      target.scrollTo({
        top: availableScroll.y * progress.y,
        behavior: "instant",
      });
    }
    if (horizontal && !!availableScroll.x) {
      target.scrollTo({
        left: availableScroll.x * progress.x,
        behavior: "instant",
      });
    }
  }

  get progress(): Progress {
    const firstWithOverflow = this.elements.find((el) => hasOverflow(el));

    return getScrollProgress(firstWithOverflow);
  }

  /**
   * Get or set the scroll progress of all mirrored elements
   *
   * The progress is an object of { x:number , y: number }, where both x and y are a number
   * between 0-1
   *
   * Examples:
   *  - `const progress = mirror.progress` — returns something like { x: 0.2, y:0.5 }
   *  - `mirror.progress = 0.5` — set the scroll position to 50% on both axes
   *  - `mirror.progress = { y: 0.5 }` — set the scroll position to 50% on the y axis
   *  - `mirror.progress = { x: 0.2, y: 0.5 }` — set the scroll position on both axes
   */
  set progress(value: Partial<Progress> | number) {
    /** if the value is a number, set both axes to that value */
    if (typeof value === "number") {
      value = { x: value, y: value };
    }
    const progress = { ...this.progress, ...value };

    if (!this.validateProgress(progress)) {
      return;
    }

    this.mirrorScrollPositions(progress);
  }

  /** Validate the progress, log errors for invalid values */
  validateProgress(progress: Partial<Progress>) {
    let valid = true;
    for (const [key, value] of Object.entries(progress)) {
      if (typeof value !== "number" || value < 0 || value > 1) {
        console.error(`progress.${key} must be a number between 0-1`);
        valid = false;
      }
    }
    return valid;
  }
}
