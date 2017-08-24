<template>
  <component
    :is="getWidget('checkbox', schema)"
    :label="schema.title"
    :default="schema.default"
    @input="value => $emit('input', value)"
  ></component>
</template>

<script>
  import CheckboxWidget from '../widgets/checkbox-widget.vue'
  import { mixin } from '../mixins'

  export default {
    name: 'boolean-field',

    mixins: [mixin],

    props: {
      schema: Object,
      value: Boolean

    },

    components: {
      CheckboxWidget
    }
  }
</script>
