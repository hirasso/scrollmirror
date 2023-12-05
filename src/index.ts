import { hasCSSOverflow, hasOverflow, nextTick } from "./support/utils.js";

type ScrollContainer = Window | HTMLElement;

type ScrollContainerProps = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
};

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
  readonly elements: ScrollContainer[];
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
    elements: NodeListOf<Element> | (HTMLElement | Window | null)[],
    options: Partial<Options> = {},
  ) {
    this.elements = [...elements]
      .filter(Boolean)
      .map((el) => this.getScrollContainer(el));

    this.options = { ...this.defaults, ...options };

    if (!this.validateElements()) return;

    this.elements.forEach((element) => this.addHandler(element));
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
      if (element instanceof HTMLElement && !hasCSSOverflow(element)) {
        console.warn(
          `${this.prefix} no "overflow: auto;" or "overflow: scroll;" set on element:`,
          element,
        );
      }
    }
    return true;
  }

  /** Add the scroll handler to the element @internal */
  addHandler(element: ScrollContainer) {
    element.addEventListener("scroll", this.handleScroll);
  }

  /** Remove the scroll handler from an element @internal */
  removeHandler(element: ScrollContainer) {
    element.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * Get the scroll container, based on element provided:
   * - return the element if it's a child of <body>
   * - otherwise, return the window
   */
  getScrollContainer(el: unknown): ScrollContainer {
    if (el instanceof HTMLElement && el.matches("body *")) {
      return el;
    }
    return window;
  }

  /** Handle a scroll event on an element @internal */
  handleScroll = async (event: Event) => {
    if (this.paused) return;

    const scrolledElement = this.getScrollContainer(event.currentTarget);

    await nextTick();

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
  };

  /** Mirror the scroll position from another element @internal */
  mirrorScrollPosition(
    scrolledElement: ScrollContainer,
    element: ScrollContainer,
  ) {
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = this.getProps(scrolledElement);

    const {
      scrollHeight: elementScrollHeight,
      scrollWidth: elementScrollWidth,
    } = this.getProps(element);

    const scrollTopOffset = scrollHeight - clientHeight;
    const scrollLeftOffset = scrollWidth - clientWidth;

    const { proportional, vertical, horizontal } = this.options;

    /* Calculate the actual element scroll height */
    const elementHeight = elementScrollHeight - clientHeight;
    const elementWidth = elementScrollWidth - clientWidth;

    /* Adjust the scroll position accordingly */
    if (vertical && scrollTopOffset > 0) {
      const top = proportional ? (elementHeight * scrollTop) / scrollTopOffset : scrollTop // prettier-ignore
      element.scrollTo({ top, behavior: "instant" });
    }
    if (horizontal && scrollLeftOffset > 0) {
      const left = proportional ? (elementWidth * scrollLeft) / scrollLeftOffset : scrollLeft // prettier-ignore
      element.scrollTo({ left, behavior: "instant" });
    }
  }

  /** Get required properties from either the window or an HTMLElement */
  getProps(element: ScrollContainer): ScrollContainerProps {
    if (element instanceof Window) {
      return {
        scrollTop: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: window.innerHeight,
        scrollLeft: window.scrollX,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: window.innerWidth,
      };
    }
    return {
      scrollTop: element.scrollTop,
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
      scrollLeft: element.scrollLeft,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    };
  }
}
