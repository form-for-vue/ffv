<template>
  <component
    :is="getWidget(schema, uiOptions.widget || 'text', registry.widgets)"
    :label="uiOptions.noLabel ? undefined : label"
    :description="uiOptions.noLabel ? undefined : label"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :value="value ? value : defaultValue"
    :classNames="classNames"
    :feedbacks="feedbacks"
    :type="uiOptions.inputType || 'text'"
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
  import { getUiOptions } from '@/utils'
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
      description: String,
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
      defaultValue: [String, Number, Object],
      classNames: String,
      feedbacks: Array,
      registry: Object,
      onUpload: Function,
      onPreview: Function,
    },

    data () {
      const uiOptions = getUiOptions(this.schema, this.uiSchema)
      return {
        uiOptions,
      }
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
