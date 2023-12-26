import { test, expect } from "@playwright/test";
import { scrollTo, scrollToEnd, expectScrollPosition, sleep } from "./support";

test.describe("Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("mirrors vertical scroll positions", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.getByTestId("first-vertical").scrollIntoViewIfNeeded();
    await scrollToEnd(page, "first-vertical");
    await sleep(1000);
    expect(page.getByTestId("third-vertical_tile--last")).toBeInViewport();
  });

  test("mirrors horizontal scroll positions", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.getByTestId("third-horizontal").scrollIntoViewIfNeeded();
    await scrollToEnd(page, "first-horizontal");
    await sleep(1000);
    await expect(
      page.getByTestId("third-horizontal_tile--last")
    ).toBeInViewport();
  });

  test("mirrors positions in both directions", async ({
    page,
    browserName,
  }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page.getByTestId("first-both").scrollIntoViewIfNeeded();
    await scrollToEnd(page, "first-both");
    await sleep(2000);
    await expect(page.getByTestId("third-both_tile--last")).toBeInViewport();
  });

  test("mirrors positions to and from the root", async ({ page }) => {
    await page.goto("/root");
    // root > element
    page.setViewportSize({ width: 1400, height: 1000 });
    await scrollToEnd(page);
    await sleep(1000);
    await expect(page.getByTestId("scroller_tile--last")).toBeInViewport();
    // element > root
    await scrollTo(page, { y: 0 }, "scroller");
    await sleep(1000);
    await expectScrollPosition(page, { x: 0, y: 0 });
  });
});
