<script>
  export default {
    props: {
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
    },

    render (h) {
      function showMoveUpDown () {
        if (this.canMoveUp || this.canMoveDown) {
          return [h('button', {
            attrs: {
              type: 'button',
            },
            'class': 'btn btn-primary fa fa-arrow-up',
          }), h('button', {
            attrs: {
              type: 'button',
            },
            'class': 'btn btn-primary fa fa-arrow-down',
          })]
        }
      }

      function showRemove () {
        if (this.canRemove) {
          return h('button', {
            attrs: {
              type: 'button',
            },
            'class': 'btn btn-primary fa fa-times',
          })
        }
      }

      return h('div', [
        // item content
        h('div', {
          'class': this.hasToolbar ? 'col-xs-9' : 'col-xs-12'
        }, this.$slots().default),
        // item actions
        function () {
          if (this.hasToolbar) {
            return h('div', {
              'class': 'col-xs-3 row justify-content-around btn-group'
            }, [
              ...showMoveUpDown(),
              showRemove(),
            ])
          }
        }
      ])
    },
  }
</script>
