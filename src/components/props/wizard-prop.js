import SchemaProp from './schema-prop.js'
import { findIndex } from 'lodash-es'
import { getWidget } from '@/utils'
import objectMixin from '../mixins/object-mixin'

export default {
  name: 'wizard-prop',

  mixins: [objectMixin],

  methods: {
    getSteps (steps) {
      return Object.keys(steps).map(step => {
        return {
          label: steps[step].title,
          slot: step,
        }
      })
    },
    extractPagesProps (steps) {
      return Object.keys(steps).map(step => {
        if (step.includes('.')) {
          return this.props
        } else {
          const index = findIndex(this.props, {name: step})
          return this.props.splice(index, 1)
        }
      })
    }
  },

  render (h) {
    let steps, pages
    if (this.uiOptions && this.uiOptions['ui:steps']) {
      steps = this.getSteps(this.uiOptions['ui:steps'])
      pages = this.extractPagesProps(this.uiOptions['ui:steps'])
    } else {
      steps = this.props.map(prop => {
        return {
          label: this.schema.properties[prop.name].title || prop.name,
          slot: prop.name,
        }
      })
      pages = this.props
    }

    return h(getWidget(this.schema,
      this.uiOptions.widget || 'wizard',
      this.registry.widgets), {
        props: {
          id: this.idSchema.$id,
          steps,
          ...this.uiOptions,
        }
      }, pages.map((page, index) => {
        return h('div', {
          slot: steps[index].slot,
        }, page.map(prop => {
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
        })
        )
      })
    )
  },
}
