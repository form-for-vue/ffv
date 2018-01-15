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
    const { props } = context

    function wrapEventHandlers (listeners) {
      return Object.keys(listeners).reduce((events, event) => {
        events[event] = value => {
          // To make required property error do it's job
          if (value === '') {
            value = undefined
          }
          listeners[event].call(null, value)
        }
        return events
      }, {})
    }

    const enumOptions = isSelect(props.schema) && optionsList(props.schema)
    const defaultWidget = enumOptions ? 'select' : 'text'

    return h(getWidget(props.schema,
      props.uiOptions.widget || defaultWidget,
      props.registry.widgets), {
        props: {
          id: props.idSchema.$id,
          errors: props.errors,
          value: props.value ? props.value : props.uiOptions.defaultValue,
          ...props.uiOptions,
          enumOptions,
        },
        on: wrapEventHandlers(context.listeners),
      })
  },
}
