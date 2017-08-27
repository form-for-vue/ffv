<template>
  <component
    :is="getWidget(uiSchema['ui:widget'] || 'checkbox', schema)"
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
    mixins: [mixin],

    props: {
      schema: Object,
      uiSchema: Object,
      required: Boolean,
      value: Boolean,
      invalid: Boolean,
    },

    data () {
      return {
        required: this.uiSchema['ui:required'] || this.required || false,
        disabled: this.uiSchema['ui:disabled'] || false
      }
    },

    components: {
      CheckboxWidget
    }
  }
</script>
