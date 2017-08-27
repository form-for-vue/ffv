<template>
  <b-form-checkbox
    :checked="value"
    :required="required"
    :disabled="disabled"
    :invalid="invalid ? 'invalid' : 'null'"
    @change="handleChange"
  >
    {{ label }}
  </b-form-checkbox>
</template>

<script>
  export default {
    props: {
      label: String,
      value: Boolean,
      required: Boolean,
      disabled: Boolean,
      invalid: Boolean,
    },

    methods: {
      handleChange () {
        this.$emit('input', value)
        this.$emit('blur', value)
      }
    }
  }
</script>
