import { getPropChildId, getWidget } from '../../utils'
import objectMixin from '../mixins/object-mixin'

export default {
  mixins: [objectMixin],

  render (h) {
    return h(getWidget(this.schema,
      this.uiOptions.widget || 'wrapper',
      this.registry.widgets), {
        props: {
          id: this.idSchema.$id,
          ...this.uiOptions,
        },
        on: {
          input: val => {
            this.$emit('input', val)
          },
          blur: val => {
            this.$emit('blur', val)
          },
          'parent-value': val => {
            this.$emit('input', val)
          },
        },
      }, [this.renderGroups.bind(this)(h, this.props)].concat([
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
    )
  },
}
