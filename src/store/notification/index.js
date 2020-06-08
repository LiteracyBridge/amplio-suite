export default {
  namespaced: true,

  state: {
    type: '',
    text: '',
    hidden: true
  },
  modules: {
  },
  getters: {
  },
  mutations: {
    notice(state, message){
      state.text = message
      state.hidden = false
      state.type = 'notice'
    },
    alert(state, message){
      state.text = message
      state.hidden = false
      state.type = 'alert'
    },
    close(state){
      state.hidden = true
    },
  },
  actions: {
  }
}
