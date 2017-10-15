import { getIdSchema, getUiOptions } from '../../utils'
import UnsupportedProp from './unsupported-prop.vue'

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
    idSchema: Object,
    required: Boolean,
    value: null,
    registry: Object,
    handlers: Object,
  },

  render (h, context) {
    let errors
    if (context.props.errorSchema &&
      context.props.errorSchema._errors !== undefined &&
      context.props.errorSchema._errors.length > 0) {
      errors = context.props.errorSchema._errors
    }

    const uiOptions = getUiOptions(
      context.props.schema,
      context.props.uiSchema, {
        required: context.props.required,
        invalid: errors && errors.length > 0,
        handlers: context.props.handlers,
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
          idSchema: context.props.idSchema,
          id: uiOptions.$id
        }),
        errors: uiOptions.displayErrors ? errors : undefined,
        value: context.props.value,
        registry: context.props.registry,
        uiOptions,
      },
      on: context.listeners,
    })
  },
}
