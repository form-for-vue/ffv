<template>
  <component
    :is="getWidget(schema, uiSchema['ui:widget'] || 'text', registry.widgets)"
    :value="value"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :type="uiSchema['ui:widget'] || 'text'"
    :onUpload="onUpload"
    :onPreview="onPreview"
    @input="value => $emit('input', value)"
    @blur="value => $emit('blur', value)"
  ></component>
</template>

<script>
  import FileWidget from '@/widgets/file-widget'
  import InputWidget from '@/widgets/input-widget'
  import TextareaWidget from '@/widgets/textarea-widget'
  import { mixin } from '@/mixins'

  export default {
    components: {
      InputWidget,
      TextareaWidget,
      FileWidget,
    },

    mixins: [mixin],

    props: {
      name: String,
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
      value: [String, Object],
      registry: Object,
      onUpload: Function,
      onPreview: Function,
    },
  }
</script>
