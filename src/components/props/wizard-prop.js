import findIndex from 'lodash-es/findIndex'
import { getWidget } from '../../utils'
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
    getProps (props, propsNames) {
      return propsNames.map(propName => {
        const removedProps = props.splice(findIndex(props, {name: propName}), 1)
        if (removedProps && removedProps.length > 0) {
          return removedProps[0]
        }
      })
    },
    extractPagesProps (steps) {
      return Object.keys(steps).map(stepName => {
        const step = steps[stepName]
        if (stepName.includes('ui:others')) {
          return this.props
        } else if (stepName.includes('ui')) {
          return this.getProps(this.props, step.props)
        } else {
          return this.props.splice(findIndex(this.props, {name: stepName}), 1)
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
      }, pages.map((page, index) => {
        return h('div', {
          slot: steps[index].slot,
        }, this.renderGroups.bind(this)(h, page, index + 1))
      })
    )
  }
}
