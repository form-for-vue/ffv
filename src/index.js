import Ffv from './ffv.vue'
import SchemaField from './fields/schema-field.vue'
import ObjectField from './fields/object-field.vue'
import CheckBoxWidget from './widgets/checkbox-widget.vue'

const plugin = {
  install (Vue) {
    Vue.component('schema-field', SchemaField)
    Vue.component('ObjectField', ObjectField)
    Vue.component('checkbox-widget', CheckBoxWidget)
    Vue.component('ffv', Ffv)
  }
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
