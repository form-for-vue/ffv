import Ajv from 'ajv'
import get from 'lodash-es/get'
import localize_fa from '@ffvjs/ajv-i18n/localize/fa'

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
  return Object.keys(errorSchema).filter(prop => {
    return value.hasOwnProperty(prop) && !(value[prop] === undefined || value[prop] === null)
  }).reduce((reducedErrorSchema, prop) => {
    reducedErrorSchema[prop] = errorSchema[prop]
    return reducedErrorSchema
  }, {})
}

function concatPropTitle (schema, errors) {
  return errors.map(error => {
    const path = parse(error.schemaPath.substring(1))
    path.pop()
    return {
      ...get(schema, path.join('.')),
      message: error.message,
    }
  })
}

export function validateFormData (schema, value, options) {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true, removeAdditional: 'all' })
  const valid = ajv.validate(schema, value)

  if (!valid) {
    localize_fa(ajv.errors)
    const errors = concatPropTitle(schema, ajv.errors)
    let errorSchema = transformErrors(ajv.errors)
    if (!options.allErrors && value) {
      errorSchema = showExistingValueErrors(errorSchema, value)
    }
    return { errors, errorSchema }
  } else {
    return true
  }
}
