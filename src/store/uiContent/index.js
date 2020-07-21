export default {
  namespaced: true,

  state: () => ({
    selectedDeploymentIndex: 0,
    selectedPlaylistIndex: 0,
    selectedMessageIndex: 0
  }),

  mutations: {
    setDeploymentIndex (state, index) {
      state.selectedDeploymentIndex = index
    },
    setPlaylistIndex (state, index) {
      state.selectedPlaylistIndex = index
    },
    setMessageIndex (state, index) {
      if (state.selectedMessageIndex === index) state.selectedMessageIndex = -1
      else state.selectedMessageIndex = index
    }
  }
}
