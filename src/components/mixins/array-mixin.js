import {
  getDefaultFormState,
  getPropChildId,
  isFixedItems,
  isObject,
} from '../../utils'

export default {
  props: {
    name: String,
    schema: Object,
    uiSchema: Object,
    errorSchema: [Object, Boolean],
    idSchema: Object,
    value: Array,
    registry: Object,
    uiOptions: Object,
  },

  computed: {
    items () {
      return (this.value || []).map((item, index) => {
        const itemValue = (this.value || {})[index]
        const itemSchema = this.schema.items
        const itemUiSchema = this.uiSchema ? this.uiSchema.items : {}
        const itemErrorSchema = this.errorSchema ? this.errorSchema[index] : {}
        const itemIdSchema = {$id: getPropChildId(this.idSchema, index)}
        return {
          index: index,
          value: itemValue,
          schema: itemSchema,
          uiSchema: itemUiSchema,
          errorSchema: itemErrorSchema,
          idSchema: itemIdSchema,
        }
      })
    },
  },

  methods: {
    canAddItem (items) {
      let {addable} = this.uiSchema
      if (addable !== false) {
        // if ui:options.addable was not explicitly set to false, we can add
        // another item if we have not exceeded maxItems yet
        if (this.schema.maxItems !== undefined) {
          addable = items.length < this.schema.maxItems
        } else {
          addable = true
        }
      }
      return addable
    },
    allowAdditionalItems (schema) {
      if (schema.additionalItems === true) {
        console.warn('additionalItems=true is currently not supported')
      }
      return isObject(schema.additionalItems)
    },
    onAddClick (event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      let itemSchema = this.schema.items
      if (isFixedItems(this.schema) && this.allowAdditionalItems(this.schema)) {
        itemSchema = this.schema.additionalItems
      }
      this.$emit('input', [...(this.value || []), getDefaultFormState(itemSchema, undefined)])
    },
    isItemRequired (itemSchema) {
      if (Array.isArray(itemSchema.type)) {
        // While we don't yet support composite/nullable jsonschema types, it's
        // future-proof to check for requirement against these.
        return !itemSchema.type.includes('null')
      }
      // All non-null array item types are inherently required by design
      return itemSchema.type !== 'null'
    },
    onReorderClick (index, newIndex, event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      const value = this.value.map((item, i) => {
        if (i === newIndex) {
          return this.value[index]
        } else if (i === index) {
          return this.value[newIndex]
        } else {
          return item
        }
      })
      this.$emit('input', value)
    },
    onDropIndexClick (index, event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.$emit('input', this.value.filter((_, i) => i !== index))
    },
  }
}
