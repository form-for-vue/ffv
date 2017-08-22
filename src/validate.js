import ajv from 'ajv'

export default function validateFormData (schema, formData) {
  const valid = ajv.validate(schema, formData)

  if (!valid) {
    return ajv.textErrors()
  } else {
    return true
  }
}
