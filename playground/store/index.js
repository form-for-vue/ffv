export default {
  state () {
    return {
      editingFieldKey: null
    }
  },

  getters: {
    shouldShow: state => key => {
      return state.editingFieldKey === key
    },
  },

  mutations: {
    changeEditingField(state, key) {
      state.editingFieldKey === key ? state.editingFieldKey = null : state.editingFieldKey = key
    },
  },
}
