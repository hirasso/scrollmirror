import { test, expect } from "@playwright/test";
import { scrollTo, scrollToEnd, expectScrollPosition, sleep } from "./support";

test.describe("Features", () => {


  test("should mirror vertical scroll positions", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto("/scrollmirror");
    await page.getByTestId("first-vertical").scrollIntoViewIfNeeded();
    await scrollToEnd(page, "first-vertical");
    await sleep(1000);
    expect(page.getByTestId("third-vertical_tile--last")).toBeInViewport();
  });

  test("should mirror horizontal scroll positions", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto("/scrollmirror");
    await page.getByTestId("third-horizontal").scrollIntoViewIfNeeded();
    await scrollToEnd(page, "first-horizontal");
    await sleep(1000);
    await expect(page.getByTestId("third-horizontal_tile--last")).toBeInViewport();
  });

  test("should mirror positions in both directions", async ({
    page,
    browserName,
  }) => {
    await page.goto("/scrollmirror");
    // test.skip(
    //   browserName === "webkit",
    //   "WebKit has problems with toBeInViewport here"
    // );

    page.setViewportSize({ width: 1000, height: 1000 });
    await page.getByTestId("first-both").scrollIntoViewIfNeeded();
    await scrollToEnd(page, "first-both");
    await sleep(2000);
    await expect(page.getByTestId("third-both_tile--last")).toBeInViewport();
  });

  // test("should mirror scroll positions between the window and elements", async ({
  //   page,
  // }) => {
  //   // window > element
  //   page.setViewportSize({ width: 1400, height: 1000 });
  //   await scrollToEnd(page);
  //   await sleep(1000);
  //   await expect(page.getByTestId("scroller-fixed-end")).toBeInViewport();
  //   // element > window
  //   await scrollTo(page, { y: 0 }, "scroller-fixed");
  //   await sleep(1000);
  //   await expectScrollPosition(page, { x: 0, y: 0 });
  // });
});
