import WrapperWidget from './wrapper-widget'
import { getPropChildId } from '../../utils'

export default {
  functional: true,

  props: {
    idSchema: Object,
    canAdd: Boolean,
    onClick: Function,
    // uiOptions
    required: Boolean,
    invalid: Boolean,
    label: String,
    description: String,
    disabled: Boolean,
    classNames: String,
    displayLabel: Boolean,
  },

  render (h, context) {
    function showAddAction () {
      if (context.props.canAdd) {
        return h('div', {
          'class': 'btn btn-primary fa fa-plus',
          on: {
            click: context.props.onClick,
          },
        })
      }
    }

    return h(WrapperWidget, {
      props: {
        id: context.props.idSchema.$id,
        classNames: context.props.classNames,
      }
    }, [
      // label and description
      h('div', {
        attrs: {
          id: getPropChildId(context.props.idSchema, 'label')
        },
        slot: 'label'
      }, context.props.displayLabel ? context.props.label : undefined),
      h('div', {
        attrs: {
          id: getPropChildId(context.props.idSchema, 'description')
        },
        slot: 'description'
      }, context.props.displayLabel ? context.props.description : undefined),
      // items
      context.slots().default,
      // actions
      showAddAction(),
    ])
  },
}
