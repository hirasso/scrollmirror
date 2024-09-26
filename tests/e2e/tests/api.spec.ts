import { test, expect } from "@playwright/test";
import {
  scrollTo,
  scrollToEnd,
  expectScrollPosition,
  sleep,
  expectProgress,
  setProgress,
} from "./support";

test.describe("API", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("gets the current progress after mirroring", async ({ page }) => {
    await scrollToEnd(page, "first-vertical");
    await sleep(1000);
    await expectProgress(page, "vertical", { x: 0, y: 1 });
  });

  test("sets the progress vertically", async ({ page }) => {
    await setProgress(page, "vertical", { y: 0.5 });
    await expectProgress(page, "vertical", { x: 0, y: 0.5 });
  });

  test("sets the progress horizontally", async ({ page }) => {
    await setProgress(page, "horizontal", { x: 0.5 });
    await expectProgress(page, "horizontal", { x: 0.5, y: 0 });
  });

  test("sets the progress in both directions", async ({ page }) => {
    // two values (x, y)
    await setProgress(page, "both", { x: 0.25, y: 0.75 });
    await expectProgress(page, "both", { x: 0.25, y: 0.75 });

    // And one value for both directions
    await setProgress(page, "both", 0.5);
    await expectProgress(page, "both", { x: 0.5, y: 0.5 });
  });
});
