<script>
  export default {
    functional: true,

    props: {
      index: Number,
      hasToolbar: Boolean,
      canMoveUp: {
        type: Boolean,
        default: true,
      },
      canMoveDown: {
        type: Boolean,
        default: true,
      },
      canRemove: {
        type: Boolean,
        default: true,
      },
      onReorderClick: Function,
      onDropIndexClick: Function,
    },

    render (h, context) {
      function showMoveUpDown () {
        if (context.props.canMoveUp || context.props.canMoveDown) {
          return [
            h('button', {
              attrs: {
                type: 'button',
                disabled: !context.props.canMoveUp,
              },
              'class': 'btn btn-primary fa fa-arrow-up',
              on: {
                click: context.props.onReorderClick.bind(null, context.props.index, context.props.index - 1),
              },
            }),
            h('button', {
              attrs: {
                type: 'button',
                disabled: !context.props.canMoveDown,
              },
              'class': 'btn btn-primary fa fa-arrow-down',
              on: {
                click: context.props.onReorderClick.bind(null, context.props.index, context.props.index + 1),
              },
            })
          ]
        } else {
          return []
        }
      }

      function showRemove () {
        if (context.props.canRemove) {
          return h('button', {
            attrs: {
              type: 'button',
            },
            'class': 'btn btn-primary fa fa-times',
            on: {
              click: context.props.onDropIndexClick.bind(null, context.props.index),
            },
          })
        }
      }

      function showActions () {
        if (context.props.hasToolbar) {
          return h('div', {
            'class': 'col-3 row justify-content-around align-items-center btn-group pb-3'
          }, [
            ...showMoveUpDown(),
            showRemove(),
          ])
        }
      }

      return h('div', {
        'class': 'row'
      },[
        // item content
        h('div', {
          'class': context.props.hasToolbar ? 'col-9' : 'col-12'
        }, context.slots().default),
        // item actions
        showActions(),
      ])
    },
  }
</script>
