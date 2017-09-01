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
    getWidget (widget, schema) {
      const { type } = schema

      if (!this.widgetMap.hasOwnProperty(type))
        throw new Error(`No widget for type "${type}"`)

      if (this.widgetMap[type].hasOwnProperty(widget))
        return this.widgetMap[type][widget]

      throw new Error(`No widget "${widget}" for type "${type}"`)
    }
  }
}
