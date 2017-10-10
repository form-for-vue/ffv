import SchemaProp from './schema-prop.js'
import findIndex from 'lodash-es/findIndex'
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
    getPageProps (props) {
      return props.map(prop => {
        const removedProps = this.props.splice(findIndex(this.props, {name: prop}), 1)
        if (removedProps && removedProps.length > 0) {
          return removedProps[0]
        }
      })
    },
    extractPagesProps (steps) {
      return Object.keys(steps).map(step => {
        if (step.includes('ui:others')) {
          return this.props
        } else if (step.includes('ui')) {
          return this.getPageProps(steps[step].props)
        } else {
          return this.props.splice(findIndex(this.props, {name: step}), 1)
        }
      })
    },
    chooseStepsStrategy () {
      if (this.uiOptions && this.uiOptions['ui:steps']) {
        const steps = this.getSteps(this.uiOptions['ui:steps'])
        const pages = this.extractPagesProps(this.uiOptions['ui:steps'])
        return {steps, pages}
      } else {
        const steps = this.props.map(prop => {
          return {
            label: this.schema.properties[prop.name].title || prop.name,
            slot: prop.name,
          }
        })
        const pages = this.props
        return {steps, pages}
      }
    },
  },

  render (h) {
    const {steps, pages} = this.chooseStepsStrategy()

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
