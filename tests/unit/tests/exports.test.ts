import { describe, expect, it } from "vitest";

import * as ScrollMirrorModule from "../../../src/index.js";
import ScrollMirror from "../../../src/index.js";
import type { Options } from "../../../src/index.js";
import * as ScrollMirrorTS from "../../../src/ScrollMirror.js";

describe("Exports", () => {
  it("should have the correct exports for the es6 module", () => {
    expect(Object.keys(ScrollMirrorModule)).toEqual([
      "getScrollProgress",
      "hasOverflow",
      "hasCSSOverflow",
      "nextTick",
      "default",
    ]);

    const instance = new ScrollMirrorModule.default([
      document.createElement("div"),
    ]);
    expect(instance).toBeInstanceOf(ScrollMirror)
  });

  it("should only have a default export for the UMD bundle", () => {
    expect(Object.keys(ScrollMirrorTS)).toEqual(["default"]);
  });
});
