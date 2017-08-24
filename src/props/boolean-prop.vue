<template>
  <component
    :is="getWidget('checkbox', schema)"
    :label="schema.title"
    :value="value"
    :required="required"
    :disabled="disabled"
    @input="value => $emit('input', value)"
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
      value: Boolean
    },

    data () {
      return {
        required: this.schema.required || false,
        disabled: this.schema.disabled || false
      }
    },

    components: {
      CheckboxWidget
    }
  }
</script>
