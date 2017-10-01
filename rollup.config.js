const fs = require('fs')
const path = require('path')
const vue = require('rollup-plugin-vue')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const alias = require('rollup-plugin-alias')
const json = require('rollup-plugin-json')
const { minify } = require('uglify-es')
const CleanCSS = require('clean-css')
const { camelCase } = require('lodash')
const { name, devDependencies } = require('./package.json')

const base = path.resolve(__dirname)
const lib = path.resolve(base, 'src')
const dist = path.resolve(base, 'dist')

// Ensure dist directory exists
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist)
}

const args = process.argv.slice(2)
const shouldMinify = args.includes('--minify') || args.includes('-m')

module.exports = {
  input: path.resolve(lib, 'index.js'),
  external: Object.keys(devDependencies),
  name: name,
  plugins: [
    vue({
      cssModules: {
        generateScopedName: '[name]__[local]'
      },
      css (style) {
        fs.writeFileSync(path.resolve(dist, `${name}.css`), new CleanCSS().minify(style).styles)
      }
    }),
    resolve({ external: ['vue'] }),
    commonjs(),
    babel({ exclude: 'node_modules/**' }),
    alias({
      resolve: ['.vue'],
      '@': path.resolve(__dirname, './src')
    }),
    json(),
    shouldMinify === true ? uglify({}, minify) : {},
  ],
  globals: {
    //
  },
  output: [
    {
      format: 'cjs',
      name: camelCase(name),
      file: path.resolve(dist, name + '.common.js'),
      sourcemap: true
    },
    {
      format: 'es',
      file: path.resolve(dist, name + '.esm.js'),
      sourcemap: true
    },
    {
      format: 'umd',
      modulename: camelCase(name),
      file: path.resolve(dist, name + '.js'),
      sourcemap: true
    }
  ]
}
