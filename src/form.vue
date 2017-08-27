<template>
  <div>
    <error-widget :errors="errors"></error-widget>
    <form-widget :noHtml5Validate="noHtml5Validate" :onSubmit="onSubmit">
      <schema-prop
        :schema="schema"
        :uiSchema="uiSchema"
        :errorSchema="errorSchema"
        :value="value"
        @input="handleInput"
        @blur="handleBlur"
      ></schema-prop>
    </form-widget>
  </div>
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
      noHtml5Validate: {
        type: Boolean,
        default: false,
      },
      onSubmit: Function,
    },

    data () {
      return {
        errorSchema: null,
        errors: null,
      }
    },

    methods: {
      validate (value) {
        const {errors, errorSchema} = validateFormData(this.schema, value)
        this.errors = errors
        this.errorSchema = errorSchema
      },
      handleInput (value) {
        if (!this.noValidate && this.liveValidate === 'eager') {
          this.validate(value)
        }
        this.$emit('input', value)
      },
      handleBlur (value) {
        if (!this.noValidate && this.liveValidate === 'lazy') {
          this.validate(value)
        }
      }
    }
  }
</script>
