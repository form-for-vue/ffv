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
        :onUpload="onUpload"
        :onPreview="onPreview"
        :wrapper="uiSchema['ui:options'] && uiSchema['ui:options']['wrapper'] ? uiSchema['ui:options']['wrapper'] : wrapper"
        @input="handleInput"
        @blur="handleBlur"
      ></schema-prop>

      <slot></slot>
    </form-widget>
  </div>
</template>

<script>
  import FormWidget from './widgets/form-widget.vue'
  import { getDefaultRegistry } from './utils'
  import { validateFormData } from './validate'

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
      onUpload: Object,
      onPreview: Object,
      wrapper: {
        type: String,
        default: 'complex',
        validator (value) {
          return ['simple', 'complex'].includes(value)
        }
      },
    },

    data () {
      return {
        registry: this.getRegistry(),
        errorSchema: null,
      }
    },

    methods: {
      validate (value) {
        const {errorSchema} = validateFormData(this.schema, value)
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
        }
      }
    }
  }
</script>
