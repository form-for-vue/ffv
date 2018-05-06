import {
  ArrayProp,
  BooleanProp,
  NumberProp,
  ObjectProp,
  SchemaProp,
  StringProp,
  TableProp,
} from './components/props'
import Form from './components/form.vue'

const components = {
  'boolean-prop': BooleanProp,
  'number-prop': NumberProp,
  'object-prop': ObjectProp,
  'schema-prop': SchemaProp,
  'string-prop': StringProp,
  'array-prop': ArrayProp,
  'table-prop': TableProp,
  'v-form': Form,
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

export * from './components/mixins/index'
export default plugin
