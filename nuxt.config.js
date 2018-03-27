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
    ['@nuxtjs/bootstrap-vue'],
    ['@nuxtjs/axios'],
    ['@nuxtjs/proxy'],
  ],

  proxy: {
    '/api': process.env.PROXY_API_URL || 'http://localhost:3000'
  },

  plugins: [
    '~/plugins/ffv',
  ],
}
