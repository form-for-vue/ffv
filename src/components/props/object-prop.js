import { getPropChildId, getWidget } from '@/utils'
import SchemaProp from './schema-prop'
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
        }
      }, this.props.map(prop => {
        return h(SchemaProp, {
          props: {
            name: prop.name,
            schema: prop.schema,
            uiSchema: prop.uiSchema,
            errorSchema: prop.errorSchema,
            idSchema: prop.idSchema,
            required: this.isRequired(prop.name),
            value: prop.value,
            registry: this.registry,
            onUpload: prop.onUpload,
            onPreview: prop.onPreview,
          },
          on: {
            input: propVal => {
              this.$emit('input', Object.assign({}, this.value, {[prop.name]: propVal}))
            },
            blur: propVal => {
              this.$emit('blur', Object.assign({}, this.value, {[prop.name]: propVal}))
            }
          }
        })
      }).concat([
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
