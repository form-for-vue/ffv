<script>
  export default {
    functional: true,

    props: {
      wrapper: String,
      label: String,
      classNames: String,
    },

    render (h, context) {
      function showFeedbacks () {
        if ((context.slots().feedback || []).length > 0) {
          if (context.props.wrapper === 'simple') {
            return h('label', context.slots().feedback)
          } else {
            return h('template', {
              slot: 'feedback'
            }, context.slots().feedback)
          }
        }
      }

      return h(
        context.props.wrapper === 'simple' ? 'div' : 'b-form-group', {
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
