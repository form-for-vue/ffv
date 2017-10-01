import SchemaProp from './schema-prop'
import SimpleArrayItemWidget from '../widgets/simple-array-item-widget'
import arrayMixin from '../mixins/array-mixin'
import { getWidget } from '@/utils'

export default {
  mixins: [arrayMixin],

  render (h) {
    const {orderable, removable} = {
      orderable: true,
      removable: true,
      ...this.uiOptions,
    }

    return h(getWidget(this.schema,
      this.uiOptions.widget || 'simple',
      this.registry.widgets), {
        props: {
          idSchema: this.idSchema,
          canAdd: this.canAddItem(this.value),
          onClick: this.onAddClick,
          ...this.uiOptions,
        },
      }, this.items.map((item, index) => {
        return h(SimpleArrayItemWidget, {
          props: {
            index,
            hasToolbar: orderable || removable,
            canMoveUp: orderable && index > 0,
            canMoveDown: orderable && index < this.items.length - 1,
            onReorderClick: this.onReorderClick,
            onDropIndexClick: this.onDropIndexClick,
          }
        }, [
          h(SchemaProp, {
            props: {
              schema: item.schema,
              uiSchema: item.uiSchema,
              errorSchema: item.errorSchema,
              idSchema: item.idSchema,
              required: this.isItemRequired(item.schema),
              value: item.value,
              registry: this.registry,
            },
            on: {
              input: itemVal => {
                this.value.splice(item.index, 1, itemVal)
                this.$emit('input', this.value)
              },
              blur: itemVal => {
                this.value.splice(item.index, 1, itemVal)
                this.$emit('blur', this.value)
              }
            },
          }, item)
        ]
        )
      })
    )
  },
}
