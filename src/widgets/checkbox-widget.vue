<template>
  <b-form-checkbox
    :checked="value"
    :required="required"
    :disabled="disabled"
    @change="value => $emit('input', value)"
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
      disabled: Boolean
    }
  }
</script>
