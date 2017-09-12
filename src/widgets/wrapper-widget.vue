<script>
  export default {
    functional: true,

    props: {
      label: String,
      classNames: String,
    },

    render (h, context) {
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
          props: {
            label: context.props.label,
          },
        }, [
          context.slots().default,
          showFeedbacks(),
        ]
      )
    },
  }
</script>
