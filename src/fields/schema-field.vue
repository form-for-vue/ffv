<template>
  <component
    :is="`${schema.type}-field`"
    :schema="schema"
    :value="value"
    @input="value => $emit('input', value)"
  ></component>
</template>

<script>
  export default {
    name: 'schema-field',

    props: {
      schema: {
        type: Object
      },
      value: null
    }
  }
</script>
