export default {
  functional: true,

  props: {
    id: String,
    classNames: String,
    displayLabel: {
      type: Boolean,
      default: true,
    },
    displayErrors: {
      type: Boolean,
      default: true,
    },
    size: {
      type: Number,
      default: 12,
    },
  },

  render (h, context) {
    const { props } = context

    function showContents () {
      if ((context.slots().default || []).length > 0) {
        return h('div', {
          'class': 'row',
        }, context.slots().default)
      }
    }

    function showLabel () {
      if (props.displayLabel && (context.slots().label || []).length > 0) {
        return h('div', context.slots().label)
      }
    }

    function showDescription () {
      if (props.displayLabel && (context.slots().description || []).length > 0) {
        return h('div', context.slots().description)
      }
    }

    function showFeedbacks () {
      if (props.displayErrors && (context.slots().feedback || []).length > 0) {
        return h('template', context.slots().feedback)
      }
    }

    return h(
      'div', {
        staticClass: 'form-group mb-0',
        'class': {
          [`col-md-${props.size}`]: props.size,
          [props.classNames]: props.classNames,
        },
        attrs: {
          id: props.id,
        },
      }, [
        showLabel(),
        showContents(),
        showDescription(),
        showFeedbacks(),
      ],
    )
  },
}
