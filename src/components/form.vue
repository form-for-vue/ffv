<template>
  <div>
    <form-widget :noHtml5Validate="noHtml5Validate" :onCustomSubmit="onSubmit">
      <schema-prop
        v-if="reducedSchema"
        :schema="reducedSchema"
        :uiSchema="uiSchema"
        :errorSchema="errorSchema"
        :value="value"
        :registry="registry"
        :handlers="handlers"
        @input="handleInput"
        @blur="handleBlur"
        @errors="handleErrors"
      ></schema-prop>

      <div slot="actions">
        <slot></slot>
      </div>
    </form-widget>
  </div>
</template>

<script>
  import { getDefaultRegistry, isEmpty, reduceSchema } from '../utils'
  import FormWidget from './widgets/form-widget.vue'
  import { validateFormData } from '../validate'

  export default {
    components: {
      FormWidget,
    },

    provide () {
      const errorProvider = {}
      Object.defineProperty(errorProvider, 'errorSchema', {
        enumerable: true,
        get: () => this.errorSchema,
      })
      Object.defineProperty(errorProvider, 'childrenErrors', {
        enumerable: true,
        get: () => !isEmpty(this.childrenErrors) ? this.childrenErrors : null,
      })
      return { errorProvider }
    },

    props: {
      schema: {
        type: Object,
        required: true,
      },
      uiSchema: Object,
      value: Object,
      liveValidate: {
        type: String,
        default: 'lazy',
        validator: value => ['eager', 'lazy', 'no'].includes(value),
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
    },

    data () {
      return {
        registry: this.getRegistry(),
        errorSchema: null,
        errors: null,
        childrenErrors: {},
      }
    },

    computed: {
      reducedSchema () {
        if (this.schema) {
          return reduceSchema(this.schema, this.schema.definitions)
        }
      },
    },

    methods: {
      validateAll () {
        this.validate({ allErrors: true })
      },
      validate (options = { allErrors: false }) {
        const { errorSchema } = validateFormData(this.reducedSchema, this.value, options)
        this.errorSchema = !isEmpty(errorSchema) ? errorSchema : null
      },
      handleInput ({ value, options = { validate: true } }) {
        if (!this.noValidate && options.validate && this.liveValidate === 'eager') {
          this.validate()
        }
        this.$emit('input', value)
      },
      handleBlur ({ value, options = { validate: true } }) {
        if (!this.noValidate && options.validate && this.liveValidate === 'lazy') {
          this.validate()
        }
        this.$emit('input', value)

        if (this.onBlur) {
          this.onBlur()
        }
      },
      handleErrors ({ id, errorSchema }) {
        if (errorSchema) {
          this.$set(this.childrenErrors, id, errorSchema)
        } else {
          this.$delete(this.childrenErrors, id)
        }
      },
      getRegistry () {
        const { props, widgets } = getDefaultRegistry()
        return {
          props: { ...props, ...this.props },
          widgets: { ...widgets, ...this.widgets },
        }
      },
    },
  }
</script>
