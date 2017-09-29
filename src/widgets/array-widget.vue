<script>
  import SimpleArrayItemWidget from './simple-array-item-widget.vue'
  import WrapperWidget from './wrapper-widget.vue'
  import { getPropChildId } from '@/utils'

  export default {
    props: {
      id: String,
      canAdd: Boolean,
      items: Object,
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
        ...this.items.map(item => {
          return h(SimpleArrayItemWidget, item)
        }),
        // actions
        showAddAction(),
      ])
    },
  }
</script>
