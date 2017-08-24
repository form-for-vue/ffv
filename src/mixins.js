export const mixin = {
  data () {
    return {
      widgetMap: {
        boolean: {
          checkbox: 'CheckboxWidget'
        },
        string: {
          text: 'InputWidget',
          password: 'InputWidget',
          textarea: 'TextareaWidget'
        },
        number: {
          text: 'InputWidget'
        },
        integer: {
          text: 'InputWidget'
        }
      }
    }
  },

  methods: {
    getWidget (widget, schema) {
      const { type } = schema

      if (!this.widgetMap.hasOwnProperty(type)) {
        throw new Error(`No widget for type "${type}"`)
      }

      if (this.widgetMap[type].hasOwnProperty(widget)) {
        const registeredWidget = this.widgetMap[type][widget]
        return registeredWidget
      }

      throw new Error(`No widget "${widget}" for type "${type}"`)
    }
  }
}
