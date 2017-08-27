<template>
  <b-form-input
    :placeholder="placeholder"
    :value="value"
    :required="required"
    :disabled="disabled"
    :type="type"
    :state="invalid ? 'invalid' : 'null'"
    @input="value => $emit('input', value)"
    @change="value => $emit('blur', value)"
  >
  </b-form-input>
</template>

<script>
  export default {
    props: {
      label: String,
      placeholder: String,
      value: String,
      required: Boolean,
      disabled: Boolean,
      type: String,
      invalid: Boolean,
    }
  }
</script>
