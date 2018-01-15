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
    const { props } = context

    function showAddAction () {
      if (props.canAdd) {
        return h('div', {
          'class': 'btn btn-primary fa fa-plus',
          on: {
            click: props.onClick,
          },
        })
      }
    }

    return h(WrapperWidget, {
      props: {
        id: props.idSchema.$id,
        classNames: props.classNames,
      },
    }, [
      // label and description
      h('div', {
        attrs: {
          id: getPropChildId(props.idSchema, 'label'),
        },
        slot: 'label',
      }, props.displayLabel ? props.label : undefined),
      h('div', {
        attrs: {
          id: getPropChildId(props.idSchema, 'description'),
        },
        slot: 'description',
      }, props.displayLabel ? props.description : undefined),
      // items
      context.slots().default,
      // actions
      showAddAction(),
    ])
  },
}
