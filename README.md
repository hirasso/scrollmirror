![readme-header](https://github.com/hirasso/scrollmirror/assets/869813/978e2445-d11c-4f32-8f73-e0cf8dfdce8c)

## Demo

[hirasso.github.io/scrollmirror](https://hirasso.github.io/scrollmirror/)

## Motivation

There are already a few libraries out there that do the same thing. But all I could find had some limitations (For example, [react-scroll-sync](https://github.com/okonet/react-scroll-sync) needs React, [syncscroll](https://github.com/asvd/syncscroll) doesn't provide an NPM package).

Also, this simple package gave me an excuse to play around with the tooling involved with creating a robust `npm` package:

- The [demo page](https://hirasso.github.io/scrollmirror/) is generated using [Astro](https://astro.build) and [deployed to GitHub pages](https://github.com/hirasso/scrollmirror/blob/main/.github/workflows/docs.yml)
- Browser testing is being done with [PlayWright](https://playwright.dev/), with the demo site as the target
- The source code is written in [TypeScript](https://www.typescriptlang.org/)

## Installation

```bash
npm i scrollmirror
```

## Usage

```js
import ScrollMirror from "scrollmirror";
/** Mirror all divs that match the class `.scroller` */
new ScrollMirror(document.querySelectorAll(".scroller"));
```

## Options

You can pass in a few additional options to ScrollMirror as the second argument:

```js
new ScrollMirror(document.querySelectorAll(".scroller"), options);
```

The type signature of the options object:

```js
type Options = {
  proportional: boolean;
  vertical: boolean;
  horizontal: boolean;
}
```

### `proportional`

Type: `boolean`, default: `true`. Should the scrolling speed be adjusted so that all mirrored elements reach the maximum scroll position at the same time?

### `vertical`

Type: `boolean`, default: `true`. Should the vertical scroll position be mirrored?

### `horizontal`

Type: `boolean`, default: `true`. Should the horizontal scroll position be mirrored?

