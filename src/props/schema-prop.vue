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
    functional: true,

    render (h, context) {
      function getPropComponent () {
        const componentName = COMPONENT_TYPES[context.props.schema.type]
        return componentName in context.props.registry.props
          ? context.props.registry.props[componentName].name : UnsupportedProp.name // eslint-disable-line
      }

      function getFeedbacks () {
        if (context.props.errorSchema && context.props.errorSchema.errors !== undefined && context.props.errorSchema.errors.length > 0) {
          return context.props.errorSchema.errors
        }
      }
      const feedbacks = getFeedbacks()

      return h(WrapperWidget, {
        props: {
          label: context.props.schema && context.props.schema.title !== undefined ? context.props.schema.title : context.props.name,
          feedbacks,
        }
      }, [
        h(getPropComponent(), {
          props: {
            name: context.props.name,
            schema: context.props.schema,
            uiSchema: context.props.uiSchema,
            errorSchema: context.props.errorSchema,
            required: context.props.required || context.props.uiSchema['ui:required'],
            disabled: context.props.disabled || context.props.uiSchema['ui:disabled'],
            invalid: feedbacks && feedbacks.length > 0,
            value: context.props.value,
            registry: context.props.registry,
            onUpload: context.props.onUpload,
            onPreview: context.props.onPreview,
          },
          on: context.data.on,
        }),
      ])
    },
  }
</script>
