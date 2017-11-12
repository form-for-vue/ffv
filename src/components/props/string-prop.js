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

  render (h, context) {
    function wrapEventHandlers (listeners) {
      return Object.keys(listeners).reduce((events, event) => {
        events[event] = value => {
          // To make required property error do it's job
          if (value === '') {
            value = undefined
          }
          context.listeners[event].call(null, value)
        }
        return events
      }, {})
    }

    const enumOptions = isSelect(context.props.schema) && optionsList(context.props.schema)
    const defaultWidget = enumOptions ? 'select' : 'text'

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
        on: wrapEventHandlers(context.listeners),
      })
  }
}
