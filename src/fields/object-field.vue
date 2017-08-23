<template>
  <div>
    <schema-field
      v-for="(name, index) in orderProperties()"
      :schema="schema.properties['done']"
    ></schema-field>
  </div>
</template>

<script>
  export default {
    name: 'object-field',

    props: {
      schema: {
        type: Object,
        required: true,
      },
      formData: {
        type: Object,
      },
    },

    model: {
      prop: 'formData',
      event: 'change'
    },

    methods: {
      orderProperties () {
        return Object.keys(this.schema.properties)
      },
    },
  }
</script>
