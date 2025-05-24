---
"scrollmirror": patch
---

Fix license in package.json. npm.js pulls it's license information from the package.json ONLY and thus was displaying the ISC license. But ScrollMirror is actually licensed under `GPL-3.0-or-later`.
