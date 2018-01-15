import { getPropChildId, getWidget } from '../../utils'
import SchemaProp from './schema-prop'
import arrayMixin from '../mixins/array-mixin'

export default {
  name: 'draggable-prop',

  mixins: [arrayMixin],

  render: function (h) {
    return h('div', {
      'class': 'row col',
    }, [
      h('div', {
        attrs: {
          id: getPropChildId(this.idSchema, 'label'),
        },
        'class': 'col-12 mb-1 text-bold',
        slot: 'label',
      }, this.uiOptions.label),
      h(getWidget(this.schema,
        this.uiOptions.widget || 'draggable',
        this.registry.widgets), {
          'class': 'col-12',
          props: {
            list: this.value,
          },
        }, this.items.map((item, index) => {
          if (item.schema.type === 'object') {
            let uiOptions = item.uiSchema['ui:options']
            uiOptions = {
              ...uiOptions,
              widget: 'arrayItem',
              index: index,
              remove: this.onDropIndexClick.bind(null, index),
            }
            item.uiSchema = { ...item.uiSchema, 'ui:options': uiOptions }
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
                  this.$emit('input', { value: this.value })
                },
                blur: itemVal => {
                  this.value.splice(item.index, 1, itemVal)
                  this.$emit('blur', { value: this.value })
                },
              },
            })
          } else {
            return h(getWidget(this.schema,
              this.uiOptions.widget || 'arrayItem',
              this.registry.widgets), {
                props: {
                  index: index,
                  remove: this.onDropIndexClick.bind(null, index),
                },
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
                      this.$emit('input', { value: this.value })
                    },
                    blur: itemVal => {
                      this.value.splice(item.index, 1, itemVal)
                      this.$emit('blur', { value: this.value })
                    },
                  },
                }),
              ])
          }
        }),
      ),
      this.canAddItem(this.value) ? h('div', {
        staticClass: 'btn btn-primary mt-2',
        'class': {
          [this.uiOptions.classNames]: this.uiOptions.classNames,
        },
        'style': 'cursor: pointer;',
        on: {
          click: this.onAddClick,
        },
        domProps: {
          innerHTML: (this.uiOptions.addBtnText || '') + ' <i class="fa fa-plus"></i>',
        },
      }) : undefined,
      h('div', {
        'class': 'col-12',
        attrs: {
          id: getPropChildId(this.idSchema, 'description'),
        },
        slot: 'description',
      }, this.uiOptions.description),
    ])
  },
}
