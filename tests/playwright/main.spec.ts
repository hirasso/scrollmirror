import { test, expect } from "@playwright/test";
import { scrollTo, expectScrollPosition, sleep } from "./support";

test.describe("Vanilla Scroll Sync", () => {
  test.beforeEach(async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto("/");
  });

  test("should mirror vertical scroll positions", async ({ page }) => {
    await page.getByTestId("first-vertical").scrollIntoViewIfNeeded();
    await scrollTo(page, { y: 3000 }, "first-vertical");
    await sleep(1000);
    expect(page.getByTestId("third-vertical-end")).toBeInViewport();
  });

  test("should mirror horizontal scroll positions", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.getByTestId("third-horizontal").scrollIntoViewIfNeeded();
    await scrollTo(page, { x: 10000 }, "third-horizontal");
    await sleep(1000);
    await expect(page.getByTestId("first-horizontal-end")).toBeInViewport();
  });

  test("should mirror positions in both directions", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.getByTestId("first-both").scrollIntoViewIfNeeded();
    await scrollTo(page, { x: 10000, y: 10000 }, "first-both");
    await sleep(1000);
    await expect(page.getByTestId("third-both-end")).toBeInViewport();
  });

  test("should mirror scroll positions between the window and elements", async ({ page }) => {
    // window > element
    page.setViewportSize({ width: 1400, height: 1000 });
    await scrollTo(page, { y: 100000 });
    await sleep(1000);
    await expect(page.getByTestId("scroller-fixed-end")).toBeInViewport();
    // element > window
    await scrollTo(page, { y: 0 }, "scroller-fixed");
    await sleep(1000);
    await expectScrollPosition(page, {x: 0, y: 0});
  });

});
