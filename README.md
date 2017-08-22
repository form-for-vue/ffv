# FFV

[![npm](https://img.shields.io/npm/v/ffv.svg)](https://www.npmjs.com/package/ffv) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> Form For Vue

## Installation

```bash
npm install --save ffv
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import Ffv from 'ffv'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'ffv/dist/ffv.css'

Vue.use(Ffv)
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="ffv/dist/ffv.css"></link>
<script src="ffv/dist/ffv.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/ffv/dist/ffv.css"></link>
<script src="https://unpkg.com/ffv"></script>
```

## Development

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```


## Publishing

The `prepublish` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
