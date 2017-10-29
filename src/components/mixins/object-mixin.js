import { getObjectPropsIdSchema } from '../../utils'

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
        const propSchema = this.schema.properties[propName]
        const propUiSchema = this.uiSchema && this.uiSchema[propName] ? this.uiSchema[propName] : {}
        const propErrorSchema = this.errorSchema ? this.errorSchema[propName] : {}
        const propIdSchema = idSchema[propName]
        const propHandlers = this.uiOptions && this.uiOptions.handlers ? this.uiOptions.handlers[propName] : undefined
        return {
          name: propName,
          value: propValue,
          schema: propSchema,
          uiSchema: propUiSchema,
          errorSchema: propErrorSchema,
          idSchema: propIdSchema,
          handlers: propHandlers,
        }
      })
    }
  },

  methods: {
    isRequired (name) {
      return (
        Array.isArray(this.schema.required) && this.schema.required.indexOf(name) !== -1
      )
    },
  },
}
