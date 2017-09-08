<template>
  <component
    :is="getWidget(schema, uiSchema['ui:widget'] || 'checkbox', registry.widgets)"
    :label="schema.title"
    :value="value"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
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
      value: Boolean,
      registry: Object,
    },
  }
</script>
