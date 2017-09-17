import * as props from './props'
import * as widgets from './widgets'

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
    props: props,
    widgets: widgets
  }
}

export function isObject (thing) {
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing)
}

export function getUiOptions (schema, uiSchema) {
  const defaults = {
    displayFeedback: true,
  }

  const uiSchemaOptions = uiSchema ? Object.keys(uiSchema)
    .filter(key => key.indexOf('ui:') === 0)
    .reduce((options, key) => {
      const value = uiSchema[key]

      if (key === 'ui:options' && isObject(value)) {
        return {...options, ...value}
      }
    }, {}) : {}

  if (schema.type === 'object') {
    return {...defaults, ...uiSchemaOptions, displayFeedback: false}
  } else {
    return {...defaults, ...uiSchemaOptions}
  }
}
