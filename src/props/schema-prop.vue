<template>
  <wrapper-widget :label="schema.title !== null ? schema.title : name">
    <component
      :is="getPropComponent()"
      :name="name"
      :schema="schema"
      :uiSchema="uiSchema"
      :errorSchema="errorSchema"
      :invalid="feedbacks && feedbacks.length > 0"
      :value="value"
      @input="value => $emit('input', value)"
      @blur="value => $emit('blur', value)"
    ></component>

    <div slot="feedback">
      <div v-for="feedback in feedbacks">{{ feedback }}</div>
    </div>
  </wrapper-widget>
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
      errorSchema: [Object, Boolean],
      value: null,
    },

    data () {
      return {
        ...getDefaultRegistry(),
      }
    },

    computed: {
      feedbacks () {
        const a = this.getFeedback(this.errorSchema)
        console.log(a)
        return a
      }
    },

    methods: {
      getPropComponent () {
        const componentName = COMPONENT_TYPES[this.schema.type]
        return componentName in this.props ? this.props[componentName].name : UnsupportedProp.name
      },
      getFeedback (errorSchema) {
        if (errorSchema.errors !== undefined && errorSchema.errors.length > 0) {
          return errorSchema.errors
        }
      },
    }
  }
</script>
