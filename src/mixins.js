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
          textarea: 'TextareaWidget',
          file: 'FileWidget'
        },
        number: {
          text: 'InputWidget'
        },
        integer: {
          text: 'InputWidget'
        },
        array: {
          select: 'SelectWidget'
        },
      }
    }
  },

  methods: {
    /**
     * get widget from core widgets or custom widgets passed by user, supported for specified schema type
     * @param schema
     * @param widget
     * @param registeredWidgets
     * @returns widget
     */
    getWidget (schema, widget, registeredWidgets = {}) {
      const {type} = schema

      if (registeredWidgets.hasOwnProperty(widget)) {
        return registeredWidgets[widget]
      }

      if (!this.widgetMap.hasOwnProperty(type)) {
        throw new Error(`No widget for type "${type}"`)
      }

      if (this.widgetMap[type].hasOwnProperty(widget)) {
        return this.widgetMap[type][widget]
      }

      throw new Error(`No widget "${widget}" for type "${type}"`)
    }
  }
}
