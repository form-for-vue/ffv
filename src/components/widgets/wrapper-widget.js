export default {
  functional: true,

  props: {
    id: String,
    label: String,
    displayLabel: Boolean,
    description: String,
    classNames: String,
    thin: Boolean,
  },

  render (h, context) {
    function showContents () {
      if ((context.slots().default || []).length > 0) {
        return h('div', {
          'class': 'row col-md-12 mx-0 px-0'
        }, context.slots().default)
      }
    }

    function showLabel () {
      if (context.props.displayLabel && (context.slots().label || []).length > 0) {
        return h('label', {
          'class': 'col-md-12'
        }, context.slots().label)
      }
    }

    function showDescription () {
      if ((context.slots().description || []).length > 0) {
        return h('small', context.slots().description)
      }
    }

    function showFeedbacks () {
      if ((context.slots().feedback || []).length > 0) {
        return h('template', {
          slot: 'feedback'
        }, context.slots().feedback)
      }
    }

    return h(
      'div', {
        'class': `form-group ${context.props.classNames || ''}${context.props.thin ? ' mb-0' : ''}`,
        attrs: {
          id: context.props.id,
        },
        props: {
          label: context.props.label,
          description: context.props.description,
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
