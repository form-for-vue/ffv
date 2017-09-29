<script>
  import SimpleArrayItemWidget from './simple-array-item-widget.vue'
  import WrapperWidget from './wrapper-widget.vue'
  import { getPropChildId } from '@/utils'

  export default {
    props: {
      id: String,
      canAdd: Boolean,
      items: Object,
      onClick: Function,
      // uiOptions
      required: Boolean,
      invalid: Boolean,
      label: String,
      description: String,
      disabled: Boolean,
      classNames: String,
      displayLabel: Boolean,
    },

    render (h) {
      function showAddAction () {
        if (this.canAdd) {
          return h('div', {
            'class': 'btn btn-primary',
            on: {
              click: this.onClick,
            }
          })
        }
      }

      return h(WrapperWidget, {
        props: {
          id: this.id,
          classNames: this.classNames,
        }
      }, [
        // label and description
        h('div', {
          attrs: {
            id: getPropChildId(this.idSchema, 'label')
          },
          slot: 'label'
        }, this.displayLabel ? this.label : undefined),
        h('div', {
          attrs: {
            id: getPropChildId(this.idSchema, 'description')
          },
          slot: 'description'
        }, this.displayLabel ? this.description : undefined),
        // items
        ...this.items.map((item, index) => {
          return h(SimpleArrayItemWidget, {
            props: {
              canMoveUp: index > 0,
              canMoveDown: index < this.items.length - 1,
            }
          },item)
        }),
        // actions
        showAddAction(),
      ])
    },
  }
</script>
