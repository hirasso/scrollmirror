![readme-header](https://github.com/hirasso/scrollmirror/assets/869813/978e2445-d11c-4f32-8f73-e0cf8dfdce8c)

This package is a Vanilla JavaScript alternative to [react-scroll-sync](https://github.com/okonet/react-scroll-sync).

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