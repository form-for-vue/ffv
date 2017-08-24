<template>
  <div>
    <schema-field
      v-for="prop in props"
      :schema="prop.schema"
      :value="prop.value"
      @input="propVal => $emit('input', Object.assign({}, value, { [prop.name]: propVal }))"
    ></schema-field>
  </div>
</template>

<script>
  export default {
    name: 'object-field',

    props: {
      schema: {
        type: Object,
        required: true
      },
      value: Object
    },

    created () {
//      let value = Object.assign({}, this.value)
//      Object.keys(this.schema.properties).forEach(propName => {
//        const propSchema = this.schema.properties[propName]
//        if (value[propName] === undefined) {
//          value[propName] = {}
//        }
//      })
//      this.$emit('input', value)
    },

    computed: {
      props () {
        return Object.keys(this.schema.properties).map(propName => {
          const propValue = (this.value || {})[propName]
          const propSchema = this.schema.properties[propName]
          return {
            name: propName,
            value: propValue,
            schema: propSchema
          }
        })
      }
    }
  }
</script>
