import { vi, describe, expect, it, beforeEach, afterEach } from "vitest";

import ScrollMirror from "../../../src/index.js";

describe("Logger", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn");
    errorSpy = vi.spyOn(console, "error");
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("should log if debug is true", () => {
    const mirror = new ScrollMirror(document.querySelectorAll(":root"), {
      debug: true,
    });
    expect(warnSpy).toBeCalledWith(
      expect.anything(),
      "Only one element provided.",
      expect.anything()
    );

    mirror.progress = { y: 2 };
    expect(errorSpy).toBeCalledWith(
      expect.anything(),
      "progress.y must be a number between 0-1"
    );
  });

  it("should not log if debug is false", () => {
    const mirror = new ScrollMirror(document.querySelectorAll(":root"), {
      debug: false,
    });
    expect(warnSpy).not.toBeCalled();

    mirror.progress = { y: 2 };
    expect(errorSpy).not.toBeCalled();
  });
});
