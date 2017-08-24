<template>
  <form>
    <schema-prop
      :schema="schema"
      :uiSchema="uiSchema"
      :value="value"
      @input="value => $emit('input', value)"
    ></schema-prop>
  </form>
</template>

<script>
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
