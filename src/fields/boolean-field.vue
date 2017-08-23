<template>
  <component
    :is="getWidget(schema, 'checkbox')"
    :schema="schema"
    v-model="formData"
  ></component>
</template>

<script>
  import { mixin } from '../mixins'

  export default {
    name: 'boolean-field',

    mixins: [mixin],

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

    mounted () {
//      const widget =
    },
  }
</script>
