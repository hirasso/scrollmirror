import ScrollMirror from "../../../src/index.js";
/** Vertical mirroring */
new ScrollMirror(document.querySelectorAll(".scroller.--vertical"));
/** Horizontal mirroring */
new ScrollMirror(document.querySelectorAll(".scroller--horizontal"));
/** Mirroring in both directions */
new ScrollMirror(document.querySelectorAll(".scroller--both"));
/** Mirroring with the window */
new ScrollMirror([
  document.body,
  document.querySelector<HTMLElement>(".scroller--sidebar"),
]);
