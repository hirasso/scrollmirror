import ScrollMirror from "../../../src/index.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/** Vertical mirroring */
new ScrollMirror($$(".scroller.--vertical"));
/** Horizontal mirroring */
new ScrollMirror($$(".scroller.--horizontal"));
/** Mirroring in both directions */
new ScrollMirror($$(".scroller.--both"));

/** Mirroring with the window */
new ScrollMirror([window, $<HTMLElement>(".scroller.--sidebar")]);

/**
 * The UI for the window example
 */
function windowExampleUI() {
  $('[data-action=toggle-sidebar]')?.addEventListener("click", () => {
    $('.scroller.--sidebar')?.classList.toggle('--show');
  });
}
windowExampleUI();