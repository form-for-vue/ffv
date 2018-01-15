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
          return { label, value }
        })
      }
    },
  },

  render (h, context) {
    const { props } = context

    const value = props.value === true || props.value === false ? props.value : props.uiOptions.defaultValue
    return h(getWidget(props.schema,
      props.uiOptions.widget || 'checkbox',
      props.registry.widgets), {
        props: {
          id: props.idSchema.$id,
          errors: props.errors,
          value,
          ...props.uiOptions,
        },
        on: context.listeners,
      })
  },
}
