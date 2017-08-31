<template>
  <component
    :is="getWidget(uiSchema['ui:widget'] || 'text', schema)"
    :value="value"
    :required="requiredProp"
    :disabled="disabled"
    :invalid="invalid"
    :type="uiSchema['ui:widget'] || 'text'"
    :onUpload="onUpload"
    @input="value => $emit('input', value)"
    @blur="value => $emit('blur', value)"
  ></component>
</template>

<script>
  import InputWidget from '@/widgets/input-widget'
  import TextareaWidget from '@/widgets/textarea-widget'
  import FileWidget from '@/widgets/file-widget'
  import { mixin } from '@/mixins'

  export default {
    mixins: [mixin],

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      required: Boolean,
      value: [String, Object],
      onUpload: Function,
      invalid: Boolean,
    },

    data () {
      return {
        requiredProp: this.uiSchema['ui:required'] || this.required || false,
        disabled: this.uiSchema['ui:disabled'] || false
      }
    },

    components: {
      InputWidget,
      TextareaWidget,
      FileWidget,
    },
  }
</script>
