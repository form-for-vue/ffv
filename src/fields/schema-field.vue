<template>
  <component
    :is="`${currentFieldType}-field`"
    :name="name"
    :schema="fieldSchema"
    :formData="formData"
    @change="handleChange"
  ></component>
</template>

<script>
  //  import { retrieveSchema } from '../utils'

  export default {
    name: 'schema-field',

    props: {
      name: String,
      schema: {
        type: Object
      },
      formData: {
        type: Object
      }
    },

    data () {
//      const fieldSchema = retrieveSchema(this.schema)
      const fieldSchema = this.schema
      return {
        fieldSchema,
        currentFieldType: fieldSchema.type
      }
    },

    methods: {
      handleChange(value) {
        this.$emit('change', value)
      }
    },
  }
</script>
