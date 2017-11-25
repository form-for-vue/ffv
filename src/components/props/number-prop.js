import StringProp from './string-prop'
import { asNumber } from '../../utils'

export default {
  functional: true,

  components: {
    StringProp
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
    const {props} = context

    function wrapEventHandlers (listeners) {
      return Object.keys(listeners).reduce((events, event) => {
        events[event] = value => {
          if (value) {
            value = asNumber(value)
          }
          listeners[event].call(null, value)
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
