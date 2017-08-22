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
  const { $ref, ...localSchema } = schema // eslint-disable-line
  // Update referenced schema definition with local schema properties.
  return { ...$refSchema, ...localSchema }
}
