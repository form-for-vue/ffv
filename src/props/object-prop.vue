<template>
  <wrapper-widget :label="schema.title ? schema.title : name">
    <schema-prop
      v-for="prop in props"
      :key="prop.name"
      :name="prop.name"
      :schema="prop.schema"
      :uiSchema="prop.uiSchema"
      :errorSchema="prop.errorSchema"
      :required="isRequired(prop.name)"
      :disabled="prop.uiSchema[prop.name]"
      :value="prop.value"
      :registry="registry"
      :onUpload="prop.onUpload"
      :onPreview="prop.onPreview"
      :wrapper="wrapper"
      @input="propVal => $emit('input', Object.assign({}, value, { [prop.name]: propVal }))"
      @blur="propVal => $emit('blur', Object.assign({}, value, { [prop.name]: propVal }))"
    ></schema-prop>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from '@/widgets/wrapper-widget'

  export default {
    components: {
      WrapperWidget,
    },

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      required: Boolean,
      value: Object,
      registry: Object,
      onUpload: Object,
      onPreview: Object,
      wrapper: String,
    },

    computed: {
      props () {
        return Object.keys(this.schema.properties).map(propName => {
          const propValue = (this.value || {})[propName]
          const propSchema = this.schema.properties[propName]
          const propUiSchema = this.uiSchema[propName] || {}
          const propErrorSchema = this.errorSchema ? this.errorSchema[propName] : {}
          const propOnUpload = this.onUpload ? this.onUpload[propName] : undefined
          const propOnPreview = this.onPreview ? this.onPreview[propName] : undefined
          return {
            name: propName,
            value: propValue,
            schema: propSchema,
            uiSchema: propUiSchema,
            errorSchema: propErrorSchema,
            onUpload: propOnUpload,
            onPreview: propOnPreview,
          }
        })
      }
    },

    created () {
      this.defaultProps()
    },

    methods: {
      defaultProps () {
        const value = Object.assign({}, this.value)
        Object.keys(this.schema.properties).forEach(propName => {
          const propSchema = this.schema.properties[propName]
          if (value[propName] === undefined) {
            value[propName] = propSchema.default
          }
        })
        this.$emit('input', value)
      },
      isRequired (name) {
        return (
          Array.isArray(this.schema.required) && this.schema.required.indexOf(name) !== -1
        )
      },
    }
  }
</script>
