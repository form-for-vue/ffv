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
    const { props } = context

    function showMoveUpDown () {
      if (props.canMoveUp || props.canMoveDown) {
        return [
          h('button', {
            attrs: {
              type: 'button',
              disabled: !props.canMoveUp,
            },
            'class': 'btn btn-primary fa fa-arrow-up',
            on: {
              click: props.onReorderClick.bind(null, props.index, props.index - 1),
            },
          }),
          h('button', {
            attrs: {
              type: 'button',
              disabled: !props.canMoveDown,
            },
            'class': 'btn btn-primary fa fa-arrow-down',
            on: {
              click: props.onReorderClick.bind(null, props.index, props.index + 1),
            },
          }),
        ]
      } else {
        return []
      }
    }

    function showRemove () {
      if (props.canRemove) {
        return h('button', {
          attrs: {
            type: 'button',
          },
          'class': 'btn btn-primary fa fa-times',
          on: {
            click: props.onDropIndexClick.bind(null, props.index),
          },
        })
      }
    }

    function showActions () {
      if (props.hasToolbar) {
        return h('div', {
          'class': 'col-3 row justify-content-around align-items-center btn-group pb-3',
        }, [
          ...showMoveUpDown(),
          showRemove(),
        ])
      }
    }

    return h('div', {
      'class': 'row',
    }, [
      // item content
      h('div', {
        'class': props.hasToolbar ? 'col-9' : 'col-12',
      }, context.slots().default),
      // item actions
      showActions(),
    ])
  },
}
