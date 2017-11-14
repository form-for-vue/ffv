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
    function showContents () {
      if ((context.slots().default || []).length > 0) {
        return h('div', {
          'class': 'row'
        }, context.slots().default)
      }
    }

    function showLabel () {
      if (context.props.displayLabel && (context.slots().label || []).length > 0) {
        return h('div', context.slots().label)
      }
    }

    function showDescription () {
      if (context.props.displayLabel && (context.slots().description || []).length > 0) {
        return h('div', context.slots().description)
      }
    }

    function showFeedbacks () {
      if (context.props.displayErrors && (context.slots().feedback || []).length > 0) {
        return h('template', context.slots().feedback)
      }
    }

    return h(
      'div', {
        'class': `form-group mb-0 ${`col-md-${context.props.size}` || ''} ${context.props.classNames || ''}`,
        attrs: {
          id: context.props.id,
        },
      }, [
        showLabel(),
        showContents(),
        showDescription(),
        showFeedbacks(),
      ]
    )
  },
}
