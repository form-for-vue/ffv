<template>
  <component
    :is="getWidget(schema,
                  uiSchema['ui:options'] ? uiSchema['ui:options']['widget'] || 'checkbox' : 'checkbox',
                  registry.widgets)"
    :label="uiSchema['ui:options'] && uiSchema['ui:options']['noTitle'] ? undefined : schema.title"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :value="value ? value : defaultValue"
    :classNames="classNames"
    :feedbacks="feedbacks"
    @input="value => $emit('input', value)"
    @change="value => $emit('change', value)"
  ></component>
</template>

<script>
  import CheckboxWidget from '@/widgets/checkbox-widget'
  import { mixin } from '@/mixins'

  export default {
    components: {
      CheckboxWidget
    },

    mixins: [mixin],

    props: {
      name: String,
      label: String,
      schema: Object,
      uiSchema: Object,
      required: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      invalid: Boolean,
      value: {
        type: Boolean,
        default: false,
      },
      defaultValue: Boolean,
      classNames: String,
      feedbacks: Array,
      registry: Object,
    },
  }
</script>
