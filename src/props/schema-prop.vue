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
      registry: Object,
      onUpload: [Object, Function],
      onPreview: [Object, Function],
    },

    render (h, context) {
      function getPropComponent () {
        const prop = context.props.uiSchema['ui:options'] ? context.props.uiSchema['ui:options']['prop'] : undefined
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
        const {displayFeedback} = getUiOptions(context.props.schema)
        if (context.props.errorSchema &&
          context.props.errorSchema.errors !== undefined &&
          context.props.errorSchema.errors.length > 0 &&
          displayFeedback) {
          return context.props.errorSchema.errors
        }
      }

      const feedbacks = getFeedbacks()
      const required = context.props.required ||
        (context.props.uiSchema['ui:options'] ? context.props.uiSchema['ui:options']['required'] : undefined)
      const disabled = context.props.disabled ||
        (context.props.uiSchema['ui:options'] ? context.props.uiSchema['ui:options']['disabled'] : undefined)

      return h(getPropComponent(), {
        props: {
          name: context.props.name,
          label: context.props.schema.title ? context.props.schema.title : context.props.name,
          schema: context.props.schema,
          uiSchema: context.props.uiSchema,
          errorSchema: context.props.errorSchema,
          required,
          disabled,
          invalid: feedbacks && feedbacks.length > 0,
          value: context.props.value,
          classNames: context.props.uiSchema.classNames,
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
