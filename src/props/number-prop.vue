<template>
  <component
    :is="getWidget('text', schema)"
    :value="value"
    :label="schema.title !== null ? schema.title : name"
    :required="required"
    :disabled="disabled"
    type="text"
    @input="value => $emit('input', value)"
    @change="value => $emit('change', value)"
  ></component>
</template>

<script>
  import InputWidget from '@/widgets/input-widget'
  import { mixin } from '@/mixins'

  export default {
    mixins: [mixin],

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      value: String
    },

    data () {
      return {
        required: this.uiSchema['ui:required'] || false,
        disabled: this.uiSchema['ui:disabled'] || false
      }
    },

    components: {
      InputWidget
    }
  }
</script>
