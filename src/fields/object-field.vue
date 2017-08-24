<template>
  <div>
    <schema-field
      v-for="(name, index) in orderProperties()"
      :name="name"
      :schema="schema.properties[name]"
      :formData="value[name]"
      @change="handleChange"
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
      formData: {
        type: Object,
      },
    },

    data () {
      let value = this.formData
      if (value === undefined) {
        value = {}
        for (const key in this.schema.properties) {
          value[key] = undefined
        }
      }
      return {
        value,
      }
    },

    methods: {
      handleChange (value) {
        Object.assign(this.value, value)
        this.$emit('change', this.value)
      },
      orderProperties () {
        return Object.keys(this.schema.properties)
      }
    }
  }
</script>
