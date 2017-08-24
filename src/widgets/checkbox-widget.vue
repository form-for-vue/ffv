<template>
  <b-form-checkbox
    :checked="formData"
    @change="handleChange"
  >{{ label }}
  </b-form-checkbox>
</template>

<script>
  export default {
    name: 'checkbox-widget',

    props: {
      schema: {
        type: Object,
      },
      formData: {
        type: Boolean,
      },
      label: String,
      default: Boolean,
    },

    methods: {
      handleChange (value) {
        this.$emit('change', value)
      }
    },
  }
</script>
