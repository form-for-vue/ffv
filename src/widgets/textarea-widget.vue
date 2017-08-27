<template>
  <b-form-textarea
    :placeholder="placeholder"
    :value="value"
    :required="required"
    :disabled="disabled"
    :rows="2"
    @input="value => $emit('input', value)"
  >
  </b-form-textarea>
</template>

<script>
  export default {
    props: {
      label: String,
      placeholder: String,
      value: String,
      required: Boolean,
      disabled: Boolean,
    }
  }
</script>
