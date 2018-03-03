export default {
  state () {
    return {
      editingFieldKey: null
    }
  },

  getters: {
    shouldShow: state => key => {
      console.log(state.editingFieldKey === key)
      return state.editingFieldKey === key
    },
  },

  mutations: {
    changeEditingField(state, key) {
      state.editingFieldKey = key
    },
  },
}
