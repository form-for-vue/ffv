<template>
  <wrapper-widget :label="schema.title !== null ? schema.title : name">
    <component
      :is="getPropComponent()"
      :name="name"
      :schema="schema"
      :uiSchema="uiSchema"
      :errorSchema="errorSchema"
      :required="required"
      :value="value"
      :registry="registry"
      :invalid="feedbacks && feedbacks.length > 0"
      @input="value => $emit('input', value)"
      @blur="value => $emit('blur', value)"
    ></component>

    <div slot="feedback">
      <div v-for="feedback in feedbacks">{{ feedback }}</div>
    </div>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from '@/widgets/wrapper-widget'

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
      required: Boolean,
      value: null,
      registry: Object,
    },

    components: {
      WrapperWidget,
    },

    computed: {
      feedbacks () {
        if (this.invalid) {
          return this.errorSchema.errors
        }
      },
      invalid () {
        return this.errorSchema && this.errorSchema.errors !== undefined && this.errorSchema.errors.length > 0
      }
    },

    methods: {
      getPropComponent () {
        const componentName = COMPONENT_TYPES[this.schema.type]
        return componentName in this.registry.props ? this.registry.props[componentName].name : UnsupportedProp.name
      },
    },
  }
</script>
