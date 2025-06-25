# Changelog

## 1.2.4

### Patch Changes

- 57e3279: Trigger tests when @changesets creates it's version PRs. Apparently, `secrets.GITHUB_TOKEN` doesn't trigger other workflows. Instead, we need a custom PAT that needs to be present in the repository secrets (Actions) on GitHub.

## 1.2.3

### Patch Changes

- 2c97860: Change license from GPL back to MIT

## 1.2.2

### Patch Changes

- e905147: Fix license in package.json. npm.js pulls it's license information from the package.json ONLY and thus was displaying the ISC license. But ScrollMirror is actually licensed under `GPL-3.0-or-later`.

## 1.2.1

### Patch Changes

- fcf1a37: Use `@changesets/cli` for managing releases and the CHANGELOG.md
- fcf1a37: Use `devEngines.packageManager` instead of `npx only-allow pnpm` for enforcing `pnpm` as a the manager (thanks @bjoerge)

## [0.1.0] - 2023-12-26

- Allow to mirror the scroll position from and to the `window`

## [0.0.3] - 2023-11

- Fix exported class from cdn build to be uppercase. Before: `new scrollmirror(...)`, after: `new ScrollMirror(...)`

## [0.0.2] - 2023-11

- Testing automated deployment from GitHub releases to npm

## [0.0.1] - 2023-11

- Initial Release

[0.1.0]: https://github.com/swup/fragment-plugin/releases/tag/0.1.0
[0.0.3]: https://github.com/swup/fragment-plugin/releases/tag/0.0.3
[0.0.2]: https://github.com/swup/fragment-plugin/releases/tag/0.0.2
[0.0.1]: https://github.com/swup/fragment-plugin/releases/tag/0.0.1
