export default {
  functional: true,

  props: {
    id: String,
    label: String,
    description: String,
    classNames: String,
    horizontal: Boolean,
    index: Number,
    remove: Function,
  },

  render (h, context) {
    function getWrapper () {
      if (context.props.remove) {
        return [
          h('div', {
            'class': 'd-flex flex-column border border-muted p-2',
          }, [
            h('div', {
              'class': 'fa fa-times align-self-end text-danger',
              on: {
                click: context.props.remove,
              },
            }),
            showContents(),
            showLabel(),
            showDescription(),
            showFeedbacks(),
          ])
        ]
      } else {
        return [
          showContents(),
          showLabel(),
          showDescription(),
          showFeedbacks(),
        ]
      }
    }

    function showContents () {
      if ((context.slots().default || []).length > 0) {
        if (context.props.horizontal) {
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
        h('div', {
          'class': 'row col-12'
        }, [
          h('div', {
            'class': 'row justify-content-center align-items-center col-auto',
          }, [
            h('div', {
              'class': 'font-weight-bold rounded-circle text-center',
              style: 'font-size: 24px; color: #218838; width: 30px;'
            }, context.props.index + 1)
          ]),
          h('div', {
            'class': 'col'
          }, [
            getWrapper(),
          ]),
        ])
      ]
    )
  },
}
