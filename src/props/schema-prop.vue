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
      wrapper: String,
    },

    render (h, context) {
      function getWrapperWidget () {
        return WrapperWidget
      }

      function getPropComponent () {
        const prop = context.props.uiSchema.prop
        if (typeof prop === 'function') {
          return prop
        }
        if (typeof prop === 'string' && prop in context.props.registry.props) {
          return context.props.registry.props[prop]
        }
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

      return h(getWrapperWidget(), {
        props: {
          wrapper: context.props.wrapper,
          label: context.props.schema && context.props.schema.title !== undefined ? context.props.schema.title : context.props.name,
          classNames: context.props.uiSchema.classNames
        }
      }, [
        h(getPropComponent(), {
          props: {
            name: context.props.name,
            schema: context.props.schema,
            uiSchema: context.props.uiSchema,
            errorSchema: context.props.errorSchema,
            required: context.props.required || context.props.uiSchema.required,
            disabled: context.props.disabled || context.props.uiSchema.disabled,
            invalid: feedbacks && feedbacks.length > 0,
            value: context.props.value,
            registry: context.props.registry,
            onUpload: context.props.onUpload,
            onPreview: context.props.onPreview,
            wrapper: context.props.wrapper,
          },
          on: context.data.on,
        }),
        h('template', {
          slot: 'feedback',
        }, (feedbacks || []).map((feedback) => {
          return h('div', {
            domProps: {
              innerHTML: feedback
            },
          })
        }))
      ])
    },
  }
</script>
