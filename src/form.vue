<template>
  <form>
    <schema-field
      :schema="schema"
      :uiSchema="uiSchema"
      :value="value"
      @input="value => $emit('input', value)"
    ></schema-field>
  </form>
</template>

<script>
  //  import validateFormData from '../validate'

  export default {
    props: {
      schema: {
        type: Object,
        required: true
      },
      uiSchema: Object,
      value: Object
    },

    methods: {
      validate () {

      }
    }
  }
</script>
