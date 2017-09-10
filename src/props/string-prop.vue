<template>
  <component
    :is="getWidget(schema,
                  uiSchema['ui:options'] ? uiSchema['ui:options']['widget'] || 'text' : 'text',
                  registry.widgets)"
    :label="label"
    :value="value"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :type="uiSchema['ui:options'] ? uiSchema['ui:options']['inputType'] || 'text' : 'text'"
    :onUpload="onUpload"
    :onPreview="onPreview"
    @input="handleInput"
    @blur="handleBlur"
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
      value: [String, Number, Object],
      registry: Object,
      onUpload: Function,
      onPreview: Function,
    },

    methods: {
      handleInput (value) {
        // To make required property error do it's job
        if (value === '') {
          value = undefined
        }
        this.$emit('input', value)
      },
      handleBlur (value) {
        if (value === '') {
          value = undefined
        }
        this.$emit('blur', value)
      },
    }
  }
</script>
