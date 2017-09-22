<script>
  export default {
    functional: true,

    props: {
      id: String,
      label: String,
      description: String,
      classNames: String,
    },

    render (h, context) {
      function showLabel () {
        if ((context.slots().label || []).length > 0) {
          return h('template', {
            slot: 'label'
          }, context.slots().label)
        }
      }

      function showDescription () {
        if((context.slots().description || []).length > 0) {
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
          context.slots().default,
          showLabel(),
          showDescription(),
          showFeedbacks(),
        ]
      )
    },
  }
</script>
