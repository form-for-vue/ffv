import {
  BooleanProp,
  NumberProp,
  ObjectProp,
  SchemaProp,
  StringProp,
  UnsupportedProp
} from './props'

import {
  WrapperWidget,
  CheckboxWidget,
  InputWidget,
  TextareaWidget
} from './widgets'

import Form from './form.vue'

const plugin = {
  install (Vue) {
    Vue.component('boolean-prop', BooleanProp)
    Vue.component('number-prop', NumberProp)
    Vue.component('object-prop', ObjectProp)
    Vue.component('schema-prop', SchemaProp)
    Vue.component('string-prop', StringProp)
    Vue.component('unsupported-prop', UnsupportedProp)

    Vue.component('wrapper-widget', WrapperWidget)
    Vue.component('checkbox-widget', CheckboxWidget)
    Vue.component('input-widget', InputWidget)
    Vue.component('textarea-widget', TextareaWidget)

    Vue.component('v-form', Form)
  }
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
