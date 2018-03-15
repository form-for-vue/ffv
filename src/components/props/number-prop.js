import StringProp from './string-prop'
import { asNumber } from '../../utils'

export default {
  functional: true,

  components: {
    StringProp,
  },

  props: {
    name: String,
    schema: Object,
    uiSchema: Object,
    idSchema: Object,
    errors: Array,
    value: Number,
    registry: Object,
    uiOptions: Object,
  },

  render (h, context) {
    const { props } = context

    function wrapEventHandlers (listeners) {
      return Object.keys(listeners).reduce((events, event) => {
        events[event] = data => {
          const { value } = data
          if (value) {
            data = {...data, value: asNumber(value)}
          }
          listeners[event].call(null, data)
        }
        return events
      }, {})
    }

    return h(StringProp, {
      props: {
        ...props,
      },
      on: wrapEventHandlers(context.listeners),
    })
  },
}
