<script>
  import { getWidget, isObject } from '@/utils'

  export default {
    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      idSchema: Object,
      value: Object,
      registry: Object,
      uiOptions: Object,
    },

    computed: {
      items () {
        this.value.map((item, index) => {
          const itemValue = (this.value || {})[index]
          const itemErrorSchema = this.errorSchema ? this.errorSchema[index] : {}
          return {
            index: index,
            value: itemValue,
            errorSchema: itemErrorSchema
          }
        })
      },
    },

    methods: {
//      defaultProps (itemSchema) {
//        if (this.schema.minItems) {
//          const value = Object.assign({}, this.value)
//          const defaultsLength = defaults ? defaults.length : 0
//          if (schema.minItems > defaultsLength) {
//
//          }
//          this.$emit('input', value)
//        }
//      },
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
      isFixedItems (schema) {
        return (
          Array.isArray(schema.items) &&
          schema.items.length > 0 &&
          schema.items.every(item => isObject(item))
        )
      },
      allowAdditionalItems (schema) {
        if (schema.additionalItems === true) {
          console.warn('additionalItems=true is currently not supported')
        }
        return isObject(schema.additionalItems)
      },
      onAddClick () {
        let itemSchema = this.schema.items
        if (this.isFixedItems(this.schema) && this.allowAdditionalItems(this.schema)) {
          itemSchema = this.schema.additionalItems
        }
        return itemSchema
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
      // render functions
      renderSimpleArray (h) {
        return h(getWidget(this.schema,
          this.uiOptions.widget || 'simple',
          this.registry.widgets), {
            props: {
              id: this.idSchema.$id,
              canAdd: this.canAddItem(this.value),
              items: this.items,
              onClick: this.onAddClick,
              required: this.isItemRequired(this.schema.items),
              ...this.uiOptions,
            },
          })
      }
    },

//    propItem (h, itemProp) {
//      const {
//        index,
//        canRemove = true,
//        canMoveUp = true,
//        canMoveDown = true,
//        itemSchema,
//        itemValue,
//        itemUiSchema,
//        itemIdSchema,
//        itemErrorSchema,
//      } = itemProp
//
//      const {orderable, removable} = {
//        orderable: true,
//        removable: true,
//        ...this.uiOptions,
//      }
//      const has = {
//        moveUp: orderable && canMoveUp,
//        moveDown: orderable && canMoveDown,
//        remove: removable && canRemove,
//      }
//      has.toolbar = Object.keys(has).some(key => has[key])
//
//      return {
//        prop: h(SchemaProp, {
//          props: {
//            schema: itemSchema,
//            uiSchema: itemUiSchema,
//            errorSchema: itemErrorSchema,
//            idSchema: itemIdSchema,
//            required: isItemRequired(itemSchema),
//            value: itemValue,
//            registry: this.registry,
//            onUpload: item.onUpload,
//            onPreview: item.onPreview,
//          },
//          on: {
//            input: itemVal => {
//              this.$emit('input', items.splice(item.index, 1, itemVal))
//            },
//            blur: itemVal => {
//              this.$emit('blur', items.splice(item.index, 1, itemVal))
//            }
//          }
//        }),
//        ...has,
//      }
//    },
//
//    renderItem (h, itemProp) {
//      const {prop, toolbar, moveUp, moveDown, remove} = this.propItem(h, itemProp)
//      return h('div', {
//        'class': toolbar ? 'col-xs-9' : 'col-xs-12'
//      }, [
//        prop,
//        function (toolbar) {
//          if (toolbar) {
//            if (moveUp) {
//              return h('div', {
//                'class': 'fa-arrow-up'
//              })
//            }
//          }
//        }
//      ])
//    },
  }
</script>
