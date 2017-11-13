export default {
  functional: true,

  props: {
    id: String,
    classNames: String,
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
      if ((context.slots().label || []).length > 0) {
        return h('div', context.slots().label)
      }
    }

    function showDescription () {
      if ((context.slots().description || []).length > 0) {
        return h('div', context.slots().description)
      }
    }

    function showFeedbacks () {
      if ((context.slots().feedback || []).length > 0) {
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
