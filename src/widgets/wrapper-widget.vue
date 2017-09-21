<script>
  export default {
    functional: true,

    props: {
      label: String,
      classNames: String,
      description: String,
    },

    render (h, context) {
      function showFeedbacks () {
        if ((context.slots().feedback || []).length > 0) {
          return h('template', {
            slot: 'feedback'
          }, context.slots().feedback)
        }
      }

      function showDescription () {
        if((context.slots().description || []).length > 0) {
          return h('template', {
            slot: 'description'
          }, context.slots().description)
        }
      }

      return h(
        'b-form-group', {
          'class': context.props.classNames,
          props: {
            label: context.props.label,
          },
        }, [
          context.slots().default,
          showFeedbacks(),
          showDescription(),
        ]
      )
    },
  }
</script>
