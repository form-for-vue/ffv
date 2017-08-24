import CheckboxWidget from './widgets/checkbox-widget.vue'
import Form from './form.vue'
import SchemaField from './fields/schema-field.vue'
import ObjectField from './fields/object-field.vue'
import BooleanField from './fields/boolean-field.vue'

const plugin = {
  install (Vue) {
    Vue.component('checkbox-widget', CheckboxWidget)
    Vue.component('schema-field', SchemaField)
    Vue.component('object-field', ObjectField)
    Vue.component('boolean-field', BooleanField)
    Vue.component('v-form', Form)
  }
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
