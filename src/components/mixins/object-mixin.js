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
      return this.orderProperties(Object.keys(this.schema.properties), this.uiOptions.order).map(propName => {
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
    orderProperties (properties, order) {
      if (!Array.isArray(order)) {
        return properties
      }

      const arrayToHash = arr =>
        arr.reduce((prev, curr) => {
          prev[curr] = true
          return prev
        }, {})
      const errorPropList = arr =>
        arr.length > 1
          ? `properties '${arr.join('\', \'')}'`
          : `property '${arr[0]}'`
      const propertyHash = arrayToHash(properties)
      const orderHash = arrayToHash(order)
      const extraneous = order.filter(prop => prop !== '*' && !propertyHash[prop])
      if (extraneous.length) {
        throw new Error(
          `uiSchema order list contains extraneous ${errorPropList(extraneous)}`
        )
      }
      const rest = properties.filter(prop => !orderHash[prop])
      const restIndex = order.indexOf('*')
      if (restIndex === -1) {
        if (rest.length) {
          throw new Error(
            `uiSchema order list does not contain ${errorPropList(rest)}`
          )
        }
        return order
      }
      if (restIndex !== order.lastIndexOf('*')) {
        throw new Error('uiSchema order list contains more than one wildcard item')
      }

      const complete = [...order]
      complete.splice(restIndex, 1, ...rest)
      return complete
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
