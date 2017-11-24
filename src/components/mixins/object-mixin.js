import { getObjectPropsIdSchema, getWidget } from '../../utils'
import SchemaProp from '../props/schema-prop.js'

export default {
  props: {
    name: String,
    schema: Object,
    uiSchema: Object,
    errorSchema: [Object, Boolean],
    idSchema: Object,
    value: Object,
    registry: Object,
    uiOptions: Object,
  },

  computed: {
    props () {
      const idSchema = getObjectPropsIdSchema(this.schema, this.idSchema)
      return Object.keys(this.schema.properties).map(propName => {
        const propValue = (this.value || {})[propName]
        const propSchema = this.schema.properties[propName]
        const propUiSchema = this.uiSchema && this.uiSchema[propName] ? this.uiSchema[propName] : {}
        const propErrorSchema = this.errorSchema ? this.errorSchema[propName] : {}
        const propIdSchema = idSchema[propName]
        const propHandlers = this.uiOptions && this.uiOptions.handlers ? this.uiOptions.handlers[propName] : undefined
        return {
          name: propName,
          value: propValue,
          schema: propSchema,
          uiSchema: propUiSchema,
          errorSchema: propErrorSchema,
          idSchema: propIdSchema,
          handlers: propHandlers,
        }
      })
    }
  },

  methods: {
    isRequired (name) {
      return (
        Array.isArray(this.schema.required) && this.schema.required.indexOf(name) !== -1
      )
    },
    hasGroups (stepNumber) {
      if (stepNumber) {
        return this.uiOptions &&
          this.uiOptions['ui:groups'] &&
          this.uiOptions['ui:groups'].findIndex(step => step.step === stepNumber) !== -1
      } else {
        return this.uiOptions && this.uiOptions['ui:groups']
      }
    },
    getGroupsProp (stepNumber) {
      const steps = this.uiOptions['ui:groups']
      if (stepNumber) {
        return steps[steps.findIndex(step => step.step === stepNumber)].groups
      } else {
        return steps
      }
    },
    getGroups (props, stepNumber) {
      const groups = this.getGroupsProp(stepNumber)
      let accProps = []
      const restIndex = groups.findIndex(group => group.props === '*')

      const groupedProps = groups.map(group => {
        accProps.push(...group.props)
        return {...group, props: props.filter(prop => group.props.includes(prop.name))}
      })

      if (restIndex !== -1) {
        groupedProps.splice(
          restIndex,
          0, {
            ...groups[restIndex],
            props: props.filter(prop => !accProps.includes(prop.name))
          }
        )
      }

      return groupedProps
    },
    renderProps (h, props) {
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
            },
            'parent-value': val => {
              this.$emit('input', val)
            },
          }
        })
      })
    },
    renderGroups (h, props, stepNumber) {
      if (this.hasGroups(stepNumber)) {
        return this.getGroups(props, stepNumber).map(group => {
          return h(getWidget(this.schema,
            group.widget || 'wrapper',
            this.registry.widgets), {
              props: {
                ...group['ui:options'],
              },
            }, this.renderProps.bind(this)(h, group.props))
        })
      } else {
        return this.renderProps.bind(this)(h, props)
      }
    }
  },
}
