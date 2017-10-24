import * as Props from './components/props'
import * as Widgets from './components/widgets'

const widgetMap = {
  object: {
    wrapper: 'WrapperWidget',
    wizard: 'VueGoodWizard',
    arrayItem: 'WrapperArrayItemWidget',
  },
  boolean: {
    checkbox: 'CheckboxWidget',
  },
  string: {
    text: 'InputWidget',
    password: 'InputWidget',
    textarea: 'TextareaWidget',
    file: 'FileWidget',
    select: 'SelectWidget',
    radio: 'RadioWidget'
  },
  number: {
    text: 'InputWidget',
  },
  integer: {
    text: 'InputWidget',
  },
  array: {
    wrapper: 'WrapperWidget',
    simple: 'ArrayWidget',
    draggable: 'draggable',
    arrayItem: 'WrapperArrayItemWidget',
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
    defaultValue: schema.default,
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

export function isFixedItems (schema) {
  return (
    Array.isArray(schema.items) &&
    schema.items.length > 0 &&
    schema.items.every(item => isObject(item))
  )
}

export function computeDefaults (schema, parentDefaults) {
  // Compute the defaults recursively: give highest priority to deepest nodes.
  let defaults = parentDefaults
  if (isObject(defaults) && isObject(schema.default)) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeObjects(defaults, schema.default)
  } else if ('default' in schema) {
    // Use schema defaults for this node.
    defaults = schema.default
  } else if (isFixedItems(schema)) {
    defaults = schema.items.map(itemSchema =>
      computeDefaults(itemSchema, undefined)
    )
  }

  // Not defaults defined for this node, fallback to generic typed ones.
  if (typeof defaults === 'undefined') {
    defaults = schema.default
  }

  switch (schema.type) {
    case 'array':
      return []
  }

  return defaults
}

export function mergeObjects (obj1, obj2, concatArrays = false) {
  // Recursively merge deeply nested objects.
  let acc = Object.assign({}, obj1)
  // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1[key],
      right = obj2[key]
    if (obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }
    return acc
  }, acc)
}

export function getDefaultFormState (schema, value) {
  if (!isObject(schema)) {
    throw new Error('Invalid schema: ' + schema)
  }
  const defaults = computeDefaults(schema, schema.default)
  if (typeof value === 'undefined') {
    // No form data? Use schema defaults.
    return defaults
  }
  if (isObject(value)) {
    // Override schema defaults with form data.
    return mergeObjects(defaults, value)
  }
  return value || defaults
}

function findSchemaDefinition ($ref, definitions = {}) {
  // Extract and use the referenced definition if we have it.
  const match = /^#\/definitions\/(.*)$/.exec($ref)
  if (match && match[1]) {
    const parts = match[1].split('/')
    let current = definitions
    for (let part of parts) {
      part = part.replace(/~1/g, '/').replace(/~0/g, '~')
      if (current.hasOwnProperty(part)) {
        current = current[part]
      } else {
        // No matching definition found, that's an error (bogus schema?)
        throw new Error(`Could not find a definition for ${$ref}.`)
      }
    }
    return current
  }

  // No matching definition found, that's an error (bogus schema?)
  throw new Error(`Could not find a definition for ${$ref}.`)
}

export function retrieveSchema (schema, definitions = {}) {
  // No $ref attribute found, returning the original schema.
  if (!schema.hasOwnProperty('$ref')) {
    return schema
  }
  // Retrieve the referenced schema definition.
  const $refSchema = findSchemaDefinition(schema.$ref, definitions)
  // Drop the $ref property of the source schema.
  const {$ref, ...localSchema} = schema // eslint-disable-line
  // Update referenced schema definition with local schema properties.
  return {...$refSchema, ...localSchema}
}

/**
 * traverse json schema and call cb (callback for each prop
 * @param schema
 * @param cb
 */
function traverseAndCall (schema, cb) {
  if(schema.type === 'object') {
    Object.keys(schema.properties).forEach(prop => {
      schema.properties[prop] = traverseAndCall(schema.properties[prop], cb)
    })
    return schema
  } else if(schema.type === 'array') {
    schema.items = cb(schema.items)
    return schema
  } else {
    return cb(schema)
  }
}

export function reduceSchema (formSchema, definitions) {
  function retrieve (schema) {
    return retrieveSchema(schema, definitions)
  }

  if (definitions) {
    return traverseAndCall(Object.assign({}, formSchema), retrieve)
  } else {
    return formSchema
  }
}

/**
 * This function checks if the given schema matches a single
 * constant value.
 */
export function isConstant (schema) {
  return (
    (Array.isArray(schema.enum) && schema.enum.length === 1) ||
    schema.hasOwnProperty('const')
  )
}

export function toConstant (schema) {
  if (Array.isArray(schema.enum) && schema.enum.length === 1) {
    return schema.enum[0]
  } else if (schema.hasOwnProperty('const')) {
    return schema.const
  } else {
    throw new Error('schema cannot be inferred as a constant')
  }
}

export function isSelect (_schema, definitions = {}) {
  const schema = retrieveSchema(_schema, definitions)
  const altSchemas = schema.oneOf || schema.anyOf
  if (Array.isArray(schema.enum)) {
    return true
  } else if (Array.isArray(altSchemas)) {
    return altSchemas.every(altSchemas => isConstant(altSchemas))
  }
  return false
}

export function optionsList (schema) {
  if (schema.enum) {
    return schema.enum.map((value, i) => {
      const label = (schema.enumNames && schema.enumNames[i]) || String(value)
      return {label, value}
    })
  } else {
    const altSchemas = schema.oneOf || schema.anyOf
    return altSchemas.map(schema => {
      const value = toConstant(schema)
      const label = schema.title || String(value)
      return {label, value}
    })
  }
}
