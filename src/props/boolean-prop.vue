<template>
  <component
    :is="getWidget('checkbox', schema)"
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
      value: Boolean,
      invalid: Boolean,
    },

    data () {
      return {
        required: this.uiSchema['ui:required'] || false,
        disabled: this.uiSchema['ui:disabled'] || false
      }
    },

    components: {
      CheckboxWidget
    }
  }
</script>
