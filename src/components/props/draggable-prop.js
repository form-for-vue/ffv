import { getPropChildId, getWidget } from '@/utils'
import SchemaProp from './schema-prop'
import arrayMixin from '../mixins/array-mixin'

export default {
  name: 'draggable-prop',

  mixins: [arrayMixin],

  render (h) {
    return h(getWidget(this.schema,
      this.uiOptions.widget || 'draggable',
      this.registry.widgets), {
        props: {
          list: this.value,
        },
      }, [
        ...this.items.map((item, index) => {
          return h('div', {
            'class': 'd-flex flex-column border border-muted p-2',
          },[
            h('div', {
              'class': 'fa fa-times align-self-end text-danger',
              on: {
                click: this.onDropIndexClick.bind(null, index),
              },
            }),
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
            }, item),
          ])
        }),
        this.canAddItem(this.value) ? h('div', {
          'class': 'btn btn-primary fa fa-plus mt-2',
          on: {
            click: this.onAddClick,
          },
        }) : undefined,
        h('div', {
          attrs: {
            id: getPropChildId(this.idSchema, 'label'),
          },
          slot: 'label'
        }, this.uiOptions.label),
        h('div', {
          attrs: {
            id: getPropChildId(this.idSchema, 'description'),
          },
          slot: 'description'
        }, this.uiOptions.description)
      ])
  }
}
