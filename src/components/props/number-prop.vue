<template>
  <string-prop
    :name="name"
    :schema="schema"
    :uiSchema="uiSchema"
    :idSchema="idSchema"
    :errors="errors"
    :value="value"
    :registry="registry"
    :uiOptions="uiOptions"
    @input="handleInput"
    @blur="handleBlur"
  ></string-prop>
</template>

<script>
  import StringProp from './string-prop'
  import { asNumber } from '../../utils'

  export default {
    components: {
      StringProp
    },

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      idSchema: Object,
      errors: Array,
      value: Number,
      registry: Object,
      uiOptions: Object,
    },

    methods: {
      handleInput (value) {
        this.$emit('input', asNumber(value))
      },
      handleBlur (value) {
        this.$emit('blur', asNumber(value))
      },
    }
  }
</script>
