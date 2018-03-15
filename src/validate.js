import Ajv from 'ajv'
import { isEmpty } from "./utils"

/**
 * Converts a json pointer into an array of reference tokens
 *
 * @param pointer
 * @returns {Array}
 */
function parse (pointer) {
  function unescape (str) {
    return str.replace(/~1/g, '/').replace(/~0/g, '~')
  }

  if (pointer === '') {
    return []
  }
  if (pointer.charAt(0) !== '/') {
    throw new Error('Invalid JSON pointer: ' + pointer)
  }
  return pointer.substring(1).split(/\//).map(unescape)
}

/**
 * required error messages are bound to object type, need to split them
 * on each specific prop
 * @param error
 * @returns missingProperty
 */
function getRequiredErrorProp (error) {
  if (error.params && error.params.missingProperty) {
    return error.params.missingProperty
  }
}

function addObjectProp (object, prop) {
  if (!(prop in object)) {
    object[prop] = {}
  }

  return object[prop]
}

/**
 * Transform errors array to errorSchema object in order to split it to related props
 * @param errors
 * @returns {errorSchema}
 */
function transformErrors (errors) {
  if (!(errors && errors.length)) {
    return {}
  }
  return errors.reduce((errorSchema, error) => {
    const { dataPath, message } = error
    const path = parse(dataPath)
    let parent = errorSchema
    path.forEach(segment => {
      parent = addObjectProp(parent, segment)
    })

    const missingProperty = getRequiredErrorProp(error)
    if (missingProperty) {
      parent = addObjectProp(parent, missingProperty)
    }

    if (Array.isArray(parent._errors)) {
      parent._errors = parent._errors.concat(message)
    } else {
      parent._errors = [message]
    }

    return errorSchema
  }, {})
}

/**
 * show errors of existing value props
 * if value: {prop1: {...}} and errorSchema: {prop1: {...}, prop2: {...}}
 * then reducedErrorSchema will be {prop1: {...}}
 * @param errorSchema
 * @param value
 * @returns reducedErrorSchema
 */
function showExistingValueErrors (errorSchema, value) {
  function recurse (errorSchema, value) {
    return Object.keys(errorSchema).filter(prop => {
      return value.hasOwnProperty(prop) && !(value[prop] === undefined || value[prop] === null)
    }).reduce((reducedErrorSchema, prop) => {
      if (typeof errorSchema[prop] === 'object' && !errorSchema[prop]._errors) {
        errorSchema[prop] = recurse(errorSchema[prop], value[prop])
      }
      if (!isEmpty(errorSchema[prop])) {
        reducedErrorSchema[prop] = errorSchema[prop]
      }
      return reducedErrorSchema
    }, {})
  }

  const refinedErrorSchema = recurse(errorSchema, value)
  if (!isEmpty(refinedErrorSchema)) {
    return refinedErrorSchema
  } else {
    return null
  }
}

function concatPropTitle (schema, errorSchema) {
  function recurse (schema, errorSchema, cb) {
    return Object.keys(errorSchema).filter(key => key !== '_errors').reduce((acc, key) => {
      // TODO cannot read property '0' of undefined but why?!!
      if (schema && schema.properties && schema.properties[key]) {
        const prop = cb(schema.properties[key], errorSchema[key])
        acc[key] = { ...prop, ...recurse(schema.properties[key], errorSchema[key], cb) }
        return acc
      }
    }, {})
  }

  function concat (schema, errorSchema) {
    return {
      ...errorSchema,
      _title: schema.title || '',
    }
  }

  if (!isEmpty(errorSchema)) {
    return recurse(schema, errorSchema, concat)
  } else {
    return null
  }
}

export function validateFormData (schema, value, options) {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true })
  const valid = ajv.validate(schema, value)
  if (!valid) {
    let errorSchema = transformErrors(ajv.errors)
    if (!options.allErrors && value) {
      errorSchema = showExistingValueErrors(errorSchema, value)
    }
    // concat schema prop title to each prop in errorSchema
    errorSchema = concatPropTitle(schema, errorSchema)
    return { errorSchema }
  } else {
    return true
  }
}
