<template>
  <div>
    <schema-prop
      v-for="prop in props"
      :key="prop.name"
      :name="prop.name"
      :schema="prop.schema"
      :uiSchema="prop.uiSchema"
      :errorSchema="prop.errorSchema"
      :required="isRequired(prop.name)"
      :value="prop.value"
      :registry="registry"
      :onUpload="prop.onUpload"
      :onDownload="prop.onDownload"
      @input="propVal => $emit('input', Object.assign({}, value, { [prop.name]: propVal }))"
      @blur="propVal => $emit('blur', Object.assign({}, value, { [prop.name]: propVal }))"
    ></schema-prop>
  </div>
</template>

<script>
  export default {
    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      required: Boolean,
      value: Object,
      registry: Object,
      onUpload: Object,
      onDownload: Object,
    },

    computed: {
      props () {
        return Object.keys(this.schema.properties).map(propName => {
          const propValue = (this.value || {})[propName]
          const propSchema = this.schema.properties[propName]
          const propUiSchema = this.uiSchema && this.uiSchema[propName] !== undefined ? this.uiSchema[propName] : {}
          const propErrorSchema = this.errorSchema && this.errorSchema[propName] !== undefined ? this.errorSchema[propName] : {}
          const propOnUpload = this.onUpload && this.onUpload[propName] !== undefined ? this.onUpload[propName] : undefined
          const propOnDownload = this.onDownload && this.onDownload[propName] !== undefined ? this.onDownload[propName] : undefined
          return {
            name: propName,
            value: propValue,
            schema: propSchema,
            uiSchema: propUiSchema,
            errorSchema: propErrorSchema,
            onUpload: propOnUpload,
            onDownload: propOnDownload,
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
          if (value[propName] === undefined)
            value[propName] = propSchema.default

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
