<!--<template>-->
  <!--<wrapper-widget-->
    <!--:label="schema.title ? schema.title : name"-->
    <!--:description="schema.description"-->
    <!--:classNames="classNames">-->
    <!--<schema-prop-->
      <!--v-for="prop in props"-->
      <!--:key="prop.name"-->
      <!--:name="prop.name"-->
      <!--:schema="prop.schema"-->
      <!--:uiSchema="prop.uiSchema"-->
      <!--:errorSchema="prop.errorSchema"-->
      <!--:required="isRequired(prop.name)"-->
      <!--:disabled="prop.uiSchema[prop.name]"-->
      <!--:value="prop.value"-->
      <!--:registry="registry"-->
      <!--:onUpload="prop.onUpload"-->
      <!--:onPreview="prop.onPreview"-->
      <!--:wrapper="wrapper"-->
      <!--@input="propVal => $emit('input', Object.assign({}, value, { [prop.name]: propVal }))"-->
      <!--@blur="propVal => $emit('blur', Object.assign({}, value, { [prop.name]: propVal }))"-->
    <!--&gt;</schema-prop>-->
  <!--</wrapper-widget>-->
<!--</template>-->

<script>
  import SchemaProp from './schema-prop.vue'
  import WrapperWidget from '@/widgets/wrapper-widget'

  export default {
    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      idSchema: Object,
      value: Object,
      registry: Object,
      uiOptions: Object,
    },

    computed: {
      props () {
        const idSchema = this.getPropsIdSchema()
        console.log(idSchema)
        return Object.keys(this.schema.properties).map(propName => {
          const propValue = (this.value || {})[propName]
          const propSchema = this.schema.properties[propName]
          const propUiSchema = this.uiSchema[propName] || {}
          const propErrorSchema = this.errorSchema ? this.errorSchema[propName] : {}
          const propIdSchema = idSchema[propName]
          const propOnUpload = this.uiOptions && this.uiOptions.onUpload ? this.uiOptions.onUpload[propName] : undefined
          const propOnPreview = this.uiOptions && this.uiOptions.onPreview ? this.uiOptions.onPreview[propName] : undefined
          return {
            name: propName,
            value: propValue,
            schema: propSchema,
            uiSchema: propUiSchema,
            errorSchema: propErrorSchema,
            idSchema: propIdSchema,
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
      getPropsIdSchema () {
        return Object.keys(this.schema.properties).reduce((props, propName)=> {
          return {[propName]: this.idSchema.$id + '_' + propName}
        }, {})
      },
      isRequired (name) {
        return (
          Array.isArray(this.schema.required) && this.schema.required.indexOf(name) !== -1
        )
      },
    },

    render (h) {
      return h(WrapperWidget, {
        props: {
          ...this.uiOptions,
        }
      }, this.props.map(prop => {
        return h(SchemaProp, {
          props: {
            name: prop.name,
            schema: prop.schema,
            uiSchema: prop.uiSchema,
            errorSchema: prop.errorSchema,
            idSchema: prop.idSchema,
            required: this.isRequired(prop.name),
            value: prop.value,
            registry: this.registry,
            onUpload: prop.onUpload,
            onPreview: prop.onPreview,
          },
          on: {
            input: propVal => {
              this.$emit('input', Object.assign({}, this.value, {[prop.name]: propVal}))
            },
            blur: propVal => {
              this.$emit('blur', Object.assign({}, this.value, {[prop.name]: propVal}))
            }
          }
        })
      })
      )
    },
  }
</script>
