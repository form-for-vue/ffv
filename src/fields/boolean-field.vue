<template>
  <component
    :is="getWidget(schema, 'checkbox')"
    :schema="schema"
    :label="schema.title"
    :default="schema.default"
    :formData="formData"
    @change="handleChange"
  ></component>
</template>

<script>
  import CheckboxWidget from '../widgets/checkbox-widget.vue'
  import { mixin } from '../mixins'

  export default {
    name: 'boolean-field',

    mixins: [mixin],

    props: {
      name: String,
      schema: Object,
      formData: {
        type: Boolean,
        default: false,
      },
    },

    components: {
      CheckboxWidget,
    },

    methods: {
      handleChange (value) {
        this.$emit('change', {[this.name]: value})
      }
    },
  }
</script>
