import * as Props from './props'
import * as Widgets from './widgets'

const widgetMap = {
  object: {
    wrapper: 'WrapperWidget',
    wizard: 'VueGoodWizard',
  },
  boolean: {
    checkbox: 'CheckboxWidget',
  },
  string: {
    text: 'InputWidget',
    password: 'InputWidget',
    textarea: 'TextareaWidget',
    file: 'FileWidget',
  },
  number: {
    text: 'InputWidget',
  },
  integer: {
    text: 'InputWidget',
  },
  array: {
    simple: 'ArrayWidget',
  },
}

/**
 * get widget from core widgets or custom widgets passed by user, supported for specified schema type
 * @param schema
 * @param widget
 * @param registeredWidgets
 * @returns widget
 */
export function getWidget (schema, widget, registeredWidgets = {}) {
  const {type} = schema

  if (registeredWidgets.hasOwnProperty(widget)) {
    return registeredWidgets[widget]
  }

  if (!widgetMap.hasOwnProperty(type)) {
    throw new Error(`No widget for type "${type}"`)
  }

  if (widgetMap[type].hasOwnProperty(widget)) {
    // some internal widgets are external so we will check registeredWidgets to find them :)
    return Widgets[widgetMap[type][widget]] || registeredWidgets[widgetMap[type][widget]] // eslint-disable-line
  }

  throw new Error(`No widget "${widget}" for type "${type}"`)
}

export function asNumber (value) {
  if (value === '') {
    return undefined
  }
  // "3." can't really be considered a number even if it parses in js. The
  // user is most likely entering a float.
  if (/\.$/.test(value)) {
    return value
  }
  // we need to return this as a string here, to allow for input like 3.07
  if (/\.0$/.test(value)) {
    return value
  }

  const n = Number(value)
  const valid = typeof n === 'number' && !Number.isNaN(n)

  // It's a number, that's cool - but we need it as a string so it doesn't screw
  // with the user when entering dollar amounts or other values (such as those with
  // specific precision or number of significant digits)
  if (/\.\d*0$/.test(value)) {
    return value
  }

  return valid ? n : value
}

export function getDefaultRegistry () {
  return {
    props: Props,
    widgets: Widgets,
  }
}

export function isObject (thing) {
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing)
}

export function getUiOptions (schema, uiSchema, optionalArgs = {}) {
  const defaults = {
    displayErrors: true,
    displayLabel: true,
  }

  const uiSchemaOptions = uiSchema ? Object.keys(uiSchema)
    .filter(key => key.indexOf('ui:') === 0)
    .reduce((options, key) => {
      const value = uiSchema[key]

      if (key === 'ui:options' && isObject(value)) {
        return {...options, ...value}
      }
    }, {}) : {}

  const schemaOptions = schema ? {
    label: schema.title,
    description: schema.description,
    defaultValue: schema.defaultValue,
  } : {}

  if (schema.type === 'object') {
    return {...defaults, ...optionalArgs, ...schemaOptions, ...uiSchemaOptions, displayErrors: false}
  } else {
    return {...defaults, ...optionalArgs, ...schemaOptions, ...uiSchemaOptions}
  }
}

const ID_DELIMITER = '__'

export function getIdSchema ({idSchema, id}) {
  if (id) {
    return {$id: id}
  } else {
    return idSchema || {$id: 'ffv-root'}
  }
}

export function getObjectPropsIdSchema (schema, idSchema) {
  return Object.keys(schema.properties).reduce((props, propName) => {
    props[propName] = {$id: idSchema.$id + ID_DELIMITER + propName}
    return props
  }, {})
}

export function getPropChildId (idSchema, name) {
  return idSchema.$id + ID_DELIMITER + name
}
