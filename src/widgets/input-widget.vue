<template>
  <b-form-group
    :label="label"
  >
    <b-form-input
      :placeholder="placeholder"
      :checked="value"
      :required="required"
      :disabled="disabled"
      :type="type"
      @input="value => $emit('input', value)"
    >
    </b-form-input>
  </b-form-group>
</template>

<script>
  export default {
    props: {
      label: String,
      placeholder: String,
      value: Boolean,
      required: Boolean,
      disabled: Boolean,
      type: String
    }
  }
</script>
