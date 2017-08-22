import Hello from './Hello.vue'

function plugin (Vue) {
  Vue.component('hello', Hello)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
