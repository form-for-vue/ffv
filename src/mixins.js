export const mixin = {
  data () {
    return {
      widgetMap: {
        boolean: {
          checkbox: 'CheckboxWidget'
        }
      }
    }
  },

  methods: {
    getWidget (schema, widget, registeredWidgets = {}) {
      const { type } = schema

      if (!this.widgetMap.hasOwnProperty(type)) {
        throw new Error(`No widget for type "${type}"`)
      }

      if (this.widgetMap[type].hasOwnProperty(widget)) {
        const registeredWidget = this.widgetMap[type][widget]
        console.log(registeredWidget)
        return registeredWidget
      }

      throw new Error(`No widget "${widget}" for type "${type}"`)
    }
  }
}
