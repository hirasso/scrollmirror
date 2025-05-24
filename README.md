<p align="center">

[![readme-header](https://github.com/hirasso/scrollmirror/assets/869813/978e2445-d11c-4f32-8f73-e0cf8dfdce8c)](https://scrollmirror.js.org)

</p>

<div align="center">

[![e2e test status](https://img.shields.io/github/actions/workflow/status/hirasso/scrollmirror/e2e-tests.yml?branch=main&label=e2e%20tests)](https://github.com/hirasso/scrollmirror/actions/workflows/e2e-tests.yml)
[![unit test status](https://img.shields.io/github/actions/workflow/status/hirasso/scrollmirror/unit-tests.yml?branch=main&label=unit%20tests)](https://github.com/hirasso/scrollmirror/actions/workflows/unit-tests.yml)
[![weekly NPM downloads](https://img.shields.io/npm/dw/scrollmirror)](https://www.npmjs.com/package/scrollmirror)
[![license](https://img.shields.io/github/license/hirasso/scrollmirror)](https://github.com/hirasso/scrollmirror/blob/master/LICENSE)

</div>

## Demo

[scrollmirror.js.org](https://scrollmirror.js.org)

## Installation

Install the plugin from npm and import it into your bundle:

```bash
npm i scrollmirror
```

```js
import ScrollMirror from "scrollmirror";
```

Or include the minified production file from a CDN:

```html
<script src="https://unpkg.com/scrollmirror"></script>
```

## Usage Example

Suppose you have the following HTML:

```html
<div class="scrollers">
  <div class="scroller">
    <!-- some HTML that forces the element to have overflow -->
  </div>
  <div class="scroller">
    <!-- some HTML that forces the element to have overflow. Different length than the previous .scroller -->
  </div>
</div>
<style>
  .scrollers {
    display: grid;
    grid-template-columns: 50% 50%;
    width: 500px;
  }
  .scroller {
    height: 200px;
    overflow: auto; /* this is important! */
  }
</style>
```

This is how you would mirror the scroll position between the two `div.scroller`:

```js
import ScrollMirror from "scrollmirror";
/** Mirror all divs that match the class `.scroller` */
new ScrollMirror(document.querySelectorAll(".scroller"));
```

See also this [minimal example on CodePen](https://codepen.io/rassohilber/pen/JjxwJpo)

💡 To mirror the scroll position from and to the `window`, you would have to add one of `:root`, `html` or `body` to the selector:

```js
new ScrollMirror(document.querySelectorAll(":root, .scroller"));
/** or */
new ScrollMirror(document.querySelectorAll("html, .scroller"));
/** or */
new ScrollMirror(document.querySelectorAll("body, .scroller"));
```

## Options

You can pass in a few additional options to ScrollMirror as the second argument:

```js
new ScrollMirror(document.querySelectorAll(".scroller"), options);
```

The type signature of the options object:

```js
type Options = {
  vertical: boolean;
  horizontal: boolean;
  debug: boolean;
}
```

### `vertical`

Type: `boolean`, default: `true`. Should the vertical scroll position be mirrored?

### `horizontal`

Type: `boolean`, default: `true`. Should the horizontal scroll position be mirrored?

### `debug`

Type: `boolean`, default: `true`. Should debug messages be printed to the console?

## API

To access ScrollMirror's API, you have to save a reference to the class during instaciation:

```js
const mirror = new ScrollMirror(document.querySelectorAll(".scroller"));
```

### `mirror.progress`

Get the current scroll progress in the form of `{ x: number, y: number }`, where both x and y are a
number between 0-1

### `mirror.progress = value`

Set the progress and scrolls all mirrored elements. For example:

```js
// for both directions
mirror.progress = { x: 0.2, y: 0.5 };
// or only set one direction
mirror.progress = { y: 0.5 };
// or for both directions at once:
mirror.progress = 0.5;
```

### `mirror.getScrollProgress(element: HTMLElement)`

Get the current progress of an element. The element doesn't _need_ to be one of the mirrored elements

```ts
const mirror = new ScrollMirror(document.querySelectorAll(".scroller"));
// ...sometime later:
console.log(mirror.getScrollProgress(document.querySelector(":root")));
```

## Motivation

There are already a few libraries out there that do the same thing. But all I could find had some limitations (For example, [react-scroll-sync](https://github.com/okonet/react-scroll-sync) needs React, [syncscroll](https://github.com/asvd/syncscroll) doesn't provide an NPM package).

Also, this simple package gave me an excuse to play around with the tooling involved with creating a robust open source `npm` package:

- The [demo page](https://scrollmirror.js.org) is generated using [Astro](https://astro.build) and deployed via [Netlify](https://www.netlify.com/)
- Browser testing is being done with [PlayWright](https://playwright.dev/), using the demo site as the source for the test fixtures
- The source code is written in [TypeScript](https://www.typescriptlang.org/)
