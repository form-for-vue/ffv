<script>
  import SchemaProp from './schema-prop.vue'
  import { getWidget } from '@/utils'

  export default {
    name: 'wizard-prop',

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      idSchema: Object,
      value: Object,
      registry: Object,
      uiOptions: Object,
    },

    computed: {
      props () {
        const idSchema = this.getPropsIdSchema()
        return Object.keys(this.schema.properties).map(propName => {
          const propValue = (this.value || {})[propName]
          const propSchema = this.schema.properties[propName]
          const propUiSchema = this.uiSchema[propName] || {}
          const propErrorSchema = this.errorSchema ? this.errorSchema[propName] : {}
          const propIdSchema = idSchema[propName]
          const propOnUpload = this.uiOptions && this.uiOptions.onUpload ? this.uiOptions.onUpload[propName] : undefined
          const propOnPreview = this.uiOptions && this.uiOptions.onPreview ? this.uiOptions.onPreview[propName] : undefined
          return {
            name: propName,
            value: propValue,
            schema: propSchema,
            uiSchema: propUiSchema,
            errorSchema: propErrorSchema,
            idSchema: propIdSchema,
            onUpload: propOnUpload,
            onPreview: propOnPreview,
          }
        })
      }
    },

    created () {
      this.defaultProps()
    },

    methods: {
      defaultProps () {
        const value = Object.assign({}, this.value)
        Object.keys(this.schema.properties).forEach(propName => {
          const propSchema = this.schema.properties[propName]
          if (value[propName] === undefined) {
            value[propName] = propSchema.default
          }
        })
        this.$emit('input', value)
      },
      getPropsIdSchema () {
        return Object.keys(this.schema.properties).reduce((props, propName) => {
          props[propName] = {$id: this.idSchema.$id + '_' + propName}
          return props
        }, {})
      },
      isRequired (name) {
        return (
          Array.isArray(this.schema.required) && this.schema.required.indexOf(name) !== -1
        )
      },
    },

    render (h) {
      const steps = this.props.map(prop => {
        return {
          label: this.schema.properties[prop.name].title || prop.name,
          slot: prop.name,
        }
      })

      return h(getWidget(this.schema,
        this.uiOptions.widget || 'wizard',
        this.registry.widgets), {
          props: {
            id: this.idSchema.$id,
            steps,
            ...this.uiOptions,
          }
        }, this.props.map((prop, index) => {
          return h('div', {
            slot: steps[index].slot,
          }, [h(SchemaProp, {
            props: {
              name: prop.name,
              schema: prop.schema,
              uiSchema: prop.uiSchema,
              errorSchema: prop.errorSchema,
              idSchema: prop.idSchema,
              required: this.isRequired(prop.name),
              value: prop.value,
              registry: this.registry,
              onUpload: prop.onUpload,
              onPreview: prop.onPreview,
            },
            on: {
              input: propVal => {
                this.$emit('input', Object.assign({}, this.value, {[prop.name]: propVal}))
              },
              blur: propVal => {
                this.$emit('blur', Object.assign({}, this.value, {[prop.name]: propVal}))
              }
            }
          })])
        }).concat([
          h('div', {
            attrs: {
              id: this.idSchema.$id + '_label'
            },
            slot: 'label'
          }, this.uiOptions.label),
          h('div', {
            attrs: {
              id: this.idSchema.$id + '_description'
            },
            slot: 'description'
          }, this.uiOptions.description)
        ])
      )
    },
  }
</script>
