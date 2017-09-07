import Ajv from 'ajv'

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
 * Transform errors array to errorSchema object in order to break it to related props
 * @param errors
 * @returns {errorSchema}
 */
function transformErrors (errors) {
  if (!errors.length) {
    return {}
  }
  return errors.reduce((errorSchema, error) => {
    const { dataPath, message } = error
    const path = parse(dataPath)
    let parent = errorSchema
    path.forEach(segment => {
      if (!(segment in parent)) {
        parent[segment] = {}
      }

      parent = parent[segment]
    })
    if (Array.isArray(parent.errors)) {
      parent.errors = parent.errors.concat(message)
    } else {
      parent.errors = [message]
    }

    return errorSchema
  }, {})
}

export function validateFormData (schema, value) {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true })
  const valid = ajv.validate(schema, value)

  if (!valid) {
    const errorSchema = transformErrors(ajv.errors)
    const errors = ajv.errors.filter(error => {
      if (error.dataPath !== '') {
        return error
      }
    }).map(error => {
      return `${error.dataPath.replace('/', '.')} ${error.message}`
    })
    return { errors, errorSchema }
  } else {
    return true
  }
}
