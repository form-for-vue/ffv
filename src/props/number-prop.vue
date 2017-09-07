<template>
  <string-prop
    :name="name"
    :schema="schema"
    :uiSchema="uiSchema"
    :required="required"
    :disabled="disabled"
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
    components: {
      StringProp
    },

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      required: Boolean,
      disabled: Boolean,
      invalid: Boolean,
      value: String,
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
