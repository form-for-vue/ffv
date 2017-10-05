import { getPropChildId, getWidget } from '@/utils'
import SchemaProp from './schema-prop'
import arrayMixin from '../mixins/array-mixin'

export default {
  name: 'draggable-prop',

  mixins: [arrayMixin],

  render: function (h) {
    return h('div', [
      h('div', {
        attrs: {
          id: getPropChildId(this.idSchema, 'label'),
        },
        'class': 'mr-2',
        slot: 'label'
      }, this.uiOptions.label),
      h(getWidget(this.schema,
        this.uiOptions.widget || 'draggable',
        this.registry.widgets), {
          'class': 'row col-12',
          props: {
            list: this.value,
          },
        }, this.items.map(item => {
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
          })
        })
      ),
      this.canAddItem(this.value) ? h('div', {
        'class': {
          'btn btn-primary mt-2': true,
          [this.uiOptions.classNames]: this.uiOptions.classNames,
        },
        on: {
          click: this.onAddClick,
        },
        domProps: {
          innerHTML: (this.uiOptions.addBtnText || '') + ' <i class="fa fa-plus"></i>',
        }
      }) : undefined,
      h('div', {
        attrs: {
          id: getPropChildId(this.idSchema, 'description'),
        },
        slot: 'description'
      }, this.uiOptions.description)
    ])
  }
}
