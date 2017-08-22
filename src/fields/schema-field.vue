<template>
  <component :is="currentField"
             :schema="fieldSchema"
             :formData="formData"
  ></component>
</template>

<script>
  import BooleanField from './boolean-field'
  import { retrieveSchema } from '../utils'

  export default {
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
      const fieldSchema = retrieveSchema(this.schema)
      return {
        fieldSchema,
        currentField: fieldSchema.type
      }
    },

    components: {
      boolean: BooleanField
    },

    methods: {

    }
  }
</script>
