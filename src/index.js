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

const defaultComponents = {
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
  install (Vue, options = {props: []}) {
    const __components = Object.assign({}, defaultComponents, options.props)
    Object.keys(__components).forEach(key => {
      Vue.component(key, __components[key])
    })
  }
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
