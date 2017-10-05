<template>
  <div>
    <form-widget :noHtml5Validate="noHtml5Validate" :onCustomSubmit="onSubmit">
      <schema-prop
        name="form"
        :schema="schema"
        :uiSchema="uiSchema"
        :errorSchema="errorSchema"
        :value="value"
        :registry="registry"
        :handlers="handlers"
        :onUpload="onUpload"
        :onPreview="onPreview"
        @input="handleInput"
        @blur="handleBlur"
      ></schema-prop>

      <div slot="actions">
        <slot></slot>
      </div>
    </form-widget>
  </div>
</template>

<script>
  import FormWidget from './widgets/form-widget.vue'
  import { getDefaultRegistry } from '../utils'
  import { validateFormData } from '../validate'

  export default {
    components: {
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
      onBlur: Function,
      widgets: Object,
      props: Object,
      handlers: Object,
      onUpload: Object,
      onPreview: Object,
    },

    data () {
      return {
        registry: this.getRegistry(),
        errorSchema: null,
      }
    },

    methods: {
      validateAll () {
        this.validate({allErrors: true})
      },
      validate (options) {
        const {errorSchema} = validateFormData(this.schema, this.value, options)
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

        if (this.onBlur) {
          this.onBlur()
        }
      },
      getRegistry () {
        const {props, widgets} = getDefaultRegistry()
        return {
          props: {...props, ...this.props},
          widgets: {...widgets, ...this.widgets},
          definitions: this.schema.definitions || {},
        }
      },
    }
  }
</script>