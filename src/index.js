import {
  BooleanProp,
  NumberProp,
  ObjectProp,
  SchemaProp,
  StringProp,
  ArrayProp,
  UnsupportedProp
} from './props'

import Form from './form.vue'

const plugin = {
  install (Vue) {
    Vue.component('boolean-prop', BooleanProp)
    Vue.component('number-prop', NumberProp)
    Vue.component('object-prop', ObjectProp)
    Vue.component('schema-prop', SchemaProp)
    Vue.component('string-prop', StringProp)
    Vue.component('array-prop', ArrayProp)
    Vue.component('unsupported-prop', UnsupportedProp)

    Vue.component('v-form', Form)
  }
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
