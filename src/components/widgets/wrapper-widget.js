export default {
  functional: true,

  props: {
    id: String,
    label: String,
    description: String,
    classNames: String,
    horizontal: Boolean,
  },

  render (h, context) {
    function showContents () {
      if ((context.slots().default || []).length > 0) {
        if(context.props.horizontal) {
          return h('div', {
            'class': 'row'
          }, context.slots().default)
        } else {
          return context.slots().default
        }
      }
    }

    function showLabel () {
      if ((context.slots().label || []).length > 0) {
        return h('template', {
          slot: 'label'
        }, context.slots().label)
      }
    }

    function showDescription () {
      if ((context.slots().description || []).length > 0) {
        return h('template', {
          slot: 'description'
        }, context.slots().description)
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
      'b-form-group', {
        'class': context.props.classNames,
        attrs: {
          id: context.props.id,
        },
        props: {
          label: context.props.label,
          description: context.props.description,
        },
      }, [
        showContents(),
        showLabel(),
        showDescription(),
        showFeedbacks(),
      ]
    )
  },
}
