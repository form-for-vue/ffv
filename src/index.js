import {
  ArrayProp,
  BooleanProp,
  NumberProp,
  ObjectProp,
  SchemaProp,
  StringProp,
  UnsupportedProp
} from './props'
import Form from './form.vue'

const components = {
  'boolean-prop': BooleanProp,
  'number-prop': NumberProp,
  'object-prop': ObjectProp,
  'schema-prop': SchemaProp,
  'string-prop': StringProp,
  'array-prop': ArrayProp,
  'unsupported-prop': UnsupportedProp,
  'v-form': Form
}

const plugin = {
  install (Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key])
    })
  }
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
