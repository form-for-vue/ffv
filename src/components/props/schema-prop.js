import { getIdSchema, getUiOptions } from '../../utils'
import UnsupportedProp from './unsupported-prop.vue'

const COMPONENT_TYPES = {
  array: 'ArrayProp',
  boolean: 'BooleanProp',
  integer: 'NumberProp',
  number: 'NumberProp',
  object: 'ObjectProp',
  string: 'StringProp',
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
    const { props } = context
    let errors

    if (props.errorSchema &&
      props.errorSchema._errors !== undefined &&
      props.errorSchema._errors.length > 0) {
      errors = props.errorSchema._errors
    }

    const uiOptions = getUiOptions(
      props.schema,
      props.uiSchema, {
        name: props.name,
        required: props.required,
        invalid: errors && errors.length > 0,
        handlers: props.handlers,
      },
    )

    function getPropComponent () {
      const prop = uiOptions.prop
      if (typeof prop === 'function') {
        return prop
      }
      if (typeof prop === 'string' && prop in props.registry.props) {
        return props.registry.props[prop]
      }
      const componentName = COMPONENT_TYPES[props.schema.type]
      return componentName in props.registry.props
        ? props.registry.props[componentName].name : UnsupportedProp.name
    }

    if (uiOptions && uiOptions.hidden === true) {
      return
    }

    return h(getPropComponent(), {
      props: {
        name: props.name,
        schema: props.schema,
        uiSchema: props.uiSchema,
        errorSchema: props.errorSchema,
        idSchema: getIdSchema({
          idSchema: props.idSchema,
          id: uiOptions.$id,
        }),
        errors: uiOptions.displayErrors ? errors : undefined,
        value: props.value,
        registry: props.registry,
        uiOptions,
      },
      on: context.listeners,
    })
  },
}
