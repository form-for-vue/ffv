<template>
  <wrapper-widget :label="schema.title">
    <schema-prop
      v-for="prop in props"
      :name="prop.name"
      :schema="prop.schema"
      :uiSchema="prop.uiSchema"
      :value="prop.value"
      @input="propVal => $emit('input', Object.assign({}, value, { [prop.name]: propVal }))"
    ></schema-prop>
  </wrapper-widget>
</template>

<script>
  export default {
    props: {
      schema: Object,
      uiSchema: Object,
      value: Object
    },

    created () {
      this.defaultProps()
    },

    computed: {
      props () {
        return Object.keys(this.schema.properties).map(propName => {
          const propValue = (this.value || {})[propName]
          const propSchema = this.schema.properties[propName]
          const propUiSchema = this.uiSchema && this.uiSchema[propName] !== undefined ? this.uiSchema[propSchema] : {}
          return {
            name: propName,
            value: propValue,
            schema: propSchema,
            uiSchema: propUiSchema
          }
        })
      }
    },

    methods: {
      defaultProps () {
        const value = Object.assign({}, this.value)
        Object.keys(this.schema.properties).forEach(propName => {
          const propSchema = this.schema.properties[propName]
          if (value[propName] === undefined) {
            value[propName] = propSchema.default
          }
        })
        this.$emit('input', value)
      }
    }
  }
</script>
