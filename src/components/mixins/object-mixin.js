import { getObjectPropsIdSchema, retrieveSchema } from '@/utils'

export default {
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
      const idSchema = getObjectPropsIdSchema(this.schema, this.idSchema)
      return Object.keys(this.schema.properties).map(propName => {
        const propValue = (this.value || {})[propName]
        const propSchema = retrieveSchema(this.schema.properties[propName], this.registry.definitions)
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
    isRequired (name) {
      return (
        Array.isArray(this.schema.required) && this.schema.required.indexOf(name) !== -1
      )
    },
  },
}
