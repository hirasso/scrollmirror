import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

type ScrollPosition = {
  x: number;
  y: number;
};

export function scrollTo(
  page: Page,
  position: Partial<ScrollPosition>,
  testId?: string
) {
  return page.evaluate(
    (args) => {
      if (args.testId) {
        window.document
          .querySelector(`[data-testid="${args.testId}"]`)
          ?.scrollTo(args.position.x, args.position.y);
        return;
      }
      window.scrollTo(args.position.x, args.position.y);
    },
    {
      position: {
        ...{ x: 0, y: 0 },
        ...position,
      },
      testId,
    }
  );
}

export function scrollToEnd(page: Page, testId?: string) {
  return page.evaluate(
    (args) => {
      if (args.testId) {
        const el = document.querySelector(`[data-testid="${args.testId}"]`)!;
        el.scrollTo(el.scrollWidth, el.scrollHeight);
        return;
      }
      window.scrollTo(document.body.scrollWidth, document.body.scrollHeight);
    },
    { testId }
  );
}

export function sleep(timeout = 0): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(undefined), timeout)
  );
}

export async function expectScrollPosition(
  page: Page,
  expected: ScrollPosition,
  testId?: string
) {
  const scrollY = await page.evaluate((testId): ScrollPosition => {
    if (!testId)
      return {
        x: window.scrollY,
        y: window.scrollX,
      };
    const el = window.document.querySelector(`[data-testid="${testId}"]`);
    if (!el) return { x: -1, y: -1 };
    return {
      x: el.scrollLeft,
      y: el.scrollTop,
    };
  }, testId);
  expect(scrollY).toEqual(expected);
}
