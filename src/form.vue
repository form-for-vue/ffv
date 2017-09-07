<template>
  <div>
    <error-widget :errors="errors"></error-widget>
    <form-widget :noHtml5Validate="noHtml5Validate" :onCustomSubmit="onSubmit">
      <schema-prop
        :schema="schema"
        :uiSchema="uiSchema"
        :errorSchema="errorSchema"
        :value="value"
        :registry="registry"
        :onUpload="onUpload"
        :onPreview="onPreview"
        @input="handleInput"
        @blur="handleBlur"
      ></schema-prop>

      <slot></slot>
    </form-widget>
  </div>
</template>

<script>
  import ErrorWidget from './widgets/error-widget.vue'
  import FormWidget from './widgets/form-widget.vue'
  import { getDefaultRegistry } from './utils'
  import { validateFormData } from './validate'

  export default {
    components: {
      ErrorWidget,
      FormWidget,
    },

    props: {
      schema: {
        type: Object,
        required: true
      },
      uiSchema: Object,
      value: Object,
      liveValidate: {
        type: String,
        default: 'lazy',
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
      widgets: Array,
      onUpload: Object,
      onPreview: Object,
    },

    data () {
      return {
        registry: this.getRegistry(),
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
        this.$emit('input', value)
      },
      getRegistry () {
        const {props, widgets} = getDefaultRegistry()
        return {
          props: {...props},
          widgets: {...widgets, ...this.widgets},
        }
      }
    }
  }
</script>
