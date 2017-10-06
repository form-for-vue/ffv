import { getWidget, isSelect, optionsList } from '../../utils'

export default {
  functional: true,

  props: {
    name: String,
    schema: Object,
    uiSchema: Object,
    idSchema: Object,
    errors: Array,
    value: [String, Number, Object],
    registry: Object,
    uiOptions: Object,
  },

//    methods: {
//      handleInput (value) {
//        // To make required property error do it's job
//        if (value === '') {
//          value = undefined
//        }
//        this.$emit('input', value)
//      },
//      handleBlur (value) {
//        if (value === '') {
//          value = undefined
//        }
//        this.$emit('blur', value)
//      },
//    },

  render (h, context) {
    const enumOptions = isSelect(context.props.schema) && optionsList(context.props.schema)
    const defaultWidget = enumOptions ? "select" : "text"

    return h(getWidget(context.props.schema,
      context.props.uiOptions.widget || defaultWidget,
      context.props.registry.widgets), {
        props: {
          id: context.props.idSchema.$id,
          errors: context.props.errors,
          value: context.props.value ? context.props.value : context.props.uiOptions.defaultValue,
          ...context.props.uiOptions,
          enumOptions,
        },
        on: context.listeners,
      })
  }
}
