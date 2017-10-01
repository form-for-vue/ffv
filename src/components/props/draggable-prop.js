import SchemaProp from './schema-prop'
import arrayMixin from '../mixins/array-mixin'
import { getWidget } from '@/utils'

export default {
  mixins: [arrayMixin],

  render (h) {
    return h(getWidget(this.schema,
      this.uiOptions.widget || 'draggable',
      this.registry.widgets), {
        props: {
          list: this.value,
        },
      }, [
        ...this.items.map(item => {
          return h(SchemaProp, {
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
        }),
        this.canAddItem(this.value) ? h('div', {
          'class': 'btn btn-primary fa fa-plus',
          on: {
            click: this.onAddClick,
          },
        }) : undefined
      ])
  }
}
