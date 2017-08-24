<template>
  <component
    :is="getPropComponent()"
    :name="name"
    :schema="schema"
    :uiSchema="uiSchema"
    :value="value"
    @input="value => $emit('input', value)"
  ></component>
</template>

<script>
  import UnsupportedProp from './unsupported-prop.vue'
  import { getDefaultRegistry } from '@/utils'

  const COMPONENT_TYPES = {
    array: 'ArrayProp',
    boolean: 'BooleanProp',
    integer: 'NumberProp',
    number: 'NumberProp',
    object: 'ObjectProp',
    string: 'StringProp'
  }

  export default {
    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      value: null
    },

    data () {
      return {
        ...getDefaultRegistry()
      }
    },

    methods: {
      getPropComponent () {
        const componentName = COMPONENT_TYPES[this.schema.type]
        return componentName in this.props ? this.props[componentName].name : UnsupportedProp.name
      }
    }
  }
</script>
