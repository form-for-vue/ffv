<template>
  <component
    :is="`${currentFieldType}-field`"
    :schema="fieldSchema"
    v-model="formData"
  ></component>
</template>

<script>
  import BooleanField from './boolean-field.vue'
  //  import { retrieveSchema } from '../utils'

  export default {
    name: 'schema-field',

    props: {
      schema: {
        type: Object
      },
      formData: {
        type: Object
      }
    },

    model: {
      prop: 'formData',
      event: 'change'
    },

    data () {
//      const fieldSchema = retrieveSchema(this.schema)
      const fieldSchema = this.schema
      return {
        fieldSchema,
        currentFieldType: fieldSchema.type
      }
    },

    components: {
      BooleanField,
    },
  }
</script>
