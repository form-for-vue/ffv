import SchemaProp from './schema-prop.js'
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
    hasGroups () {
      return this.uiOptions && this.uiOptions['ui:groups']
    },
    getGroups (props) {
      const groups = this.uiOptions['ui:groups']
      return Object.keys(groups).map(group => {
        if (group.includes('ui:others')) {
          return {widget: 'wrapper', props}
        } else {
          return {widget: groups[group].widget || 'wrapper', props: this.getProps(props, groups[group].props)}
        }
      })
    }
  },

  render (h) {
    const {steps, pages} = this.chooseStepsStrategy()

    function renderProps (props) {
      return props.map(prop => {
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
    }

    function renderGroups (page) {
      if (this.hasGroups()) {
        return this.getGroups(page).map(group => {
          return h(getWidget(this.schema,
            group.widget || 'wrapper',
            this.registry.widgets), {}, renderProps.bind(this)(group.props))
        })
      } else {
        return renderProps.bind(this)(page)
      }
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
        }, renderGroups.bind(this)(page))
      })
    )
  }
}
