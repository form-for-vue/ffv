const {resolve} = require('path')

module.exports = {

  srcDir: resolve(__dirname, 'playground'),

  head: {
    title: 'playground',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'FFV playground'}
    ]
  },

  modules: [
    ['@nuxtjs/bootstrap-vue', {css: false}],
  ],

  plugins: [
    '~/plugins/ffv',
  ],

  css: [
    '~/assets/app.scss',
  ],
}
