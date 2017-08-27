<template>
  <string-prop
    :name="name"
    :schema="schema"
    :uiSchema="uiSchema"
    :value="value"
    :invalid="invalid"
    @input="handleInput"
    @blur="handleBlur"
  ></string-prop>
</template>

<script>
  import StringProp from '@/props/string-prop'
  import { asNumber } from '@/utils'

  export default {
    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      value: String,
      invalid: Boolean,
    },

    components: {
      StringProp
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
