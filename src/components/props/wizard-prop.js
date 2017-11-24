import { getWidget } from '../../utils'
import objectMixin from '../mixins/object-mixin'

export default {
  name: 'wizard-prop',

  mixins: [objectMixin],

  methods: {
    getSteps (steps) {
      return steps.map(step => {
        return {
          label: step.title,
          slot: step.key,
        }
      })
    },
    extractPagesProps (steps) {
      let accProps = []
      const restIndex = steps.findIndex(step => step.props === '*')

      const wizardPages = steps.filter(step => {
        return step.props !== '*'
      }).map(step => {
        if (step.key.includes('ui')) {
          accProps.push(...step.props)
          return this.props.filter(prop => step.props.includes(prop.name))
        } else {
          accProps.push(step.key)
          return [this.props[this.props.findIndex(prop => prop.name === step.key)]]
        }
      })

      if (restIndex !== -1) {
        wizardPages.splice(restIndex, 0, this.props.filter(prop => !accProps.includes(prop.name)))
      }

      return wizardPages
    },
    chooseStepsStrategy () {
      if (this.uiOptions && this.uiOptions['ui:steps']) {
        if (Array.isArray(this.uiOptions['ui:steps'])) {
          const steps = this.getSteps(this.uiOptions['ui:steps'])
          const pages = this.extractPagesProps(this.uiOptions['ui:steps'])
          return {steps, pages}
        } else {
          console.warn('[ffv warn]: ui:steps should be an array.')
        }
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
