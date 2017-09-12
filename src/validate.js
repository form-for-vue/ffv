import Ajv from 'ajv'
import localize_fa from 'ajv-i18n/localize/fa'

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
    const {dataPath, message} = error
    const path = parse(dataPath)
    let parent = errorSchema
    path.forEach(segment => {
      parent = addObjectProp(parent, segment)
    })

    const missingProperty = getRequiredErrorProp(error)
    if (missingProperty) {
      parent = addObjectProp(parent, missingProperty)
    }

    if (Array.isArray(parent.errors)) {
      parent.errors = parent.errors.concat(message)
    } else {
      parent.errors = [message]
    }

    return errorSchema
  }, {})
}

export function validateFormData (schema, value) {
  const ajv = new Ajv({allErrors: true, jsonPointers: true})
  const valid = ajv.validate(schema, value)

  if (!valid) {
    localize_fa(ajv.errors)
    const errorSchema = transformErrors(ajv.errors)
    return {errorSchema}
  } else {
    return true
  }
}
