<script>
  import UnsupportedProp from '@/props/unsupported-prop'
  import { getUiOptions } from '@/utils'

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
      disabled: Boolean,
      value: null,
      defaultValue: null,
      registry: Object,
      onUpload: [Object, Function],
      onPreview: [Object, Function],
    },

    render (h, context) {
      const uiOptions = getUiOptions(context.props.schema, context.props.uiSchema)

      function getPropComponent () {
        const prop = uiOptions.prop || undefined
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

      function getFeedbacks () {
        if (context.props.errorSchema &&
          context.props.errorSchema.errors !== undefined &&
          context.props.errorSchema.errors.length > 0 &&
          uiOptions.displayFeedback) {
          return context.props.errorSchema.errors
        }
      }

      const feedbacks = getFeedbacks()

      return h(getPropComponent(), {
        props: {
          name: context.props.name,
          label: context.props.schema.title ? context.props.schema.title : context.props.name,
          description: context.props.schema.description,
          schema: context.props.schema,
          uiSchema: context.props.uiSchema,
          errorSchema: context.props.errorSchema,
          required: context.props.required || uiOptions.required,
          disabled: context.props.disabled || uiOptions.disabled,
          invalid: feedbacks && feedbacks.length > 0,
          value: context.props.value,
          defaultValue: context.props.schema.defaultValue,
          classNames: uiOptions.classNames,
          feedbacks,
          registry: context.props.registry,
          onUpload: context.props.onUpload,
          onPreview: context.props.onPreview,
        },
        on: context.data.on,
      })
    },
  }
</script>
