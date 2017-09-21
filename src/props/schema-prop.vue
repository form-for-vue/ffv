<script>
  import { getIdSchema, getUiOptions } from '@/utils'
  import UnsupportedProp from '@/props/unsupported-prop'

  const COMPONENT_TYPES = {
    array: 'ArrayProp',
    boolean: 'BooleanProp',
    integer: 'NumberProp',
    number: 'NumberProp',
    object: 'ObjectProp',
    string: 'StringProp'
  }

  export default {
    functional: true,

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      required: Boolean,
      value: null,
      registry: Object,
      onUpload: [Object, Function],
      onPreview: [Object, Function],
    },

    render (h, context) {
      const errors = () => {
        if (context.props.errorSchema &&
          context.props.errorSchema.errors !== undefined &&
          context.props.errorSchema.errors.length > 0) {
          return context.props.errorSchema.errors
        }
      }

      const uiOptions = getUiOptions(
        context.props.schema,
        context.props.uiSchema, {
          required: context.props.required,
          invalid: errors && errors.length > 0,
          onUpload: context.props.onUpload,
          onPreview: context.props.onPreview
        }
      )

      function getPropComponent () {
        const prop = uiOptions.prop
        if (typeof prop === 'function') {
          return prop
        }
        if (typeof prop === 'string' && prop in context.props.registry.props) {
          return context.props.registry.props[prop]
        }
        const componentName = COMPONENT_TYPES[context.props.schema.type]
        return componentName in context.props.registry.props
          ? context.props.registry.props[componentName].name : UnsupportedProp.name
      }

      return h(getPropComponent(), {
        props: {
          name: context.props.name,
          schema: context.props.schema,
          uiSchema: context.props.uiSchema,
          errorSchema: context.props.errorSchema,
          idSchema: getIdSchema({
            schema: context.props.schema,
            idSchema: context.props.idSchema,
            name: context.props.name,
            id: uiOptions.$id
          }),
          errors: uiOptions.displayFeedback ? errors : undefined,
          value: context.props.value,
          registry: context.props.registry,
          uiOptions,
        },
        on: context.listeners,
      })
    },
  }
</script>
