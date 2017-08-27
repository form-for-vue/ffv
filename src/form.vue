<template>
  <form>
    <schema-prop
      :schema="schema"
      :uiSchema="uiSchema"
      :errorSchema="errorSchema"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
    ></schema-prop>
  </form>
</template>

<script>
  import { validateFormData } from './validate'

  export default {
    props: {
      schema: {
        type: Object,
        required: true
      },
      uiSchema: Object,
      value: Object,
      liveValidate: {
        type: String,
        default: 'eager',
        validator (value) {
          return ['eager', 'lazy', 'no'].includes(value)
        }
      },
      noValidate: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        errorSchema: null,
      }
    },

    methods: {
      handleInput (value) {
        if (!this.noValidate && this.liveValidate === 'eager') {
          return validateFormData(this.schema, value)
        }
        this.$emit('input', value)
      },
      handleBlur (value) {
        if (!this.noValidate && this.liveValidate === 'lazy') {
          this.errorSchema = validateFormData(this.schema, value)
        }
      }
    }
  }
</script>
