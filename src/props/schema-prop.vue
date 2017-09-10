<script>
  import WrapperWidget from '@/widgets/wrapper-widget'
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
      wrapper: String,
    },

    render (h, context) {
      function getWrapperWidget () {
        // schema prop inside form tag customization causes a lot of headache
        // disabled wrapper customization for some time :)
        if (context.props.name === 'form') {
          return WrapperWidget
        }

        const widget = context.props.wrapper
        if (widget in context.props.registry.widgets) {
          return context.props.registry.widgets[widget]
        }
        return WrapperWidget
      }

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
          ? context.props.registry.props[componentName].name : UnsupportedProp.name // eslint-disable-line
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

      return h(getWrapperWidget(), {
        props: {
          wrapper: context.props.name === 'form' ? 'complex' : context.props.wrapper,
          label: context.props.schema.title ? context.props.schema.title : context.props.name,
          classNames: context.props.uiSchema.classNames
        }
      }, [
        h(getPropComponent(), {
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
            registry: context.props.registry,
            onUpload: context.props.onUpload,
            onPreview: context.props.onPreview,
            wrapper: context.props.wrapper,
          },
          on: context.data.on,
        }),
        h('template', {
          slot: 'feedback',
        }, (feedbacks || []).map(feedback => {
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
