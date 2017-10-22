import { getWidget } from '../../utils'

export default {
  functional: true,

  props: {
    name: String,
    schema: Object,
    uiSchema: Object,
    idSchema: Object,
    errors: Array,
    value: {
      type: Boolean,
      default: false,
    },
    registry: Object,
    uiOptions: Object,
  },

  methods: {
    optionsList (schema) {
      if (schema.enum && schema.enumNames) {
        return schema.enum.map((value, i) => {
          const label = (schema.enumNames && schema.enumNames[i]) || String(value)
          return {label, value}
        })
      }
    }
  },

  render (h, context) {
    const value = context.props.value === true || context.props.value === false ? context.props.value : context.props.uiOptions.defaultValue
    return h(getWidget(context.props.schema,
      context.props.uiOptions.widget || 'checkbox',
      context.props.registry.widgets), {
        props: {
          id: context.props.idSchema.$id,
          errors: context.props.errors,
          value,
          ...context.props.uiOptions,
        },
        on: context.listeners,
      })
  }
}
