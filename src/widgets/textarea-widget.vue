<template>
  <b-form-group
    :label="label"
  >
    <b-form-textarea
      :placeholder="placeholder"
      :value="value"
      :required="required"
      :disabled="disabled"
      :rows="2"
      @input="value => $emit('input', value)"
    >
    </b-form-textarea>
  </b-form-group>
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
