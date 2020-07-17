export default {
  namespaced: true,

  state: () => ({
    selectedDeployment: {},
    selectedPlaylist: {},
    selectedMessage: {}
  }),

  mutations: {
    setDeployment (state, payload) {
      state.selectedDeployment = payload
    },
    clearDeployment (state) {
      state.selectedMessage = {}
      state.selectedPlaylist = {}
      state.selectedDeployment = {}
    },
    setPlaylist (state, payload) {
      state.selectedPlaylist = payload
    },
    clearPlaylist (state) {
      state.selectedMessage = {}
      state.selectedPlaylist = {}
    },
    setMessage (state, payload) {
      state.selectedMessage = payload
    },
    clearMessage (state) {
      state.selectedMessage = {}
    }
  },

  actions: {
    toggleOpenDeployment ({ commit, state, rootState }, payload) {
      const { playlists } = rootState.program.content

      if (state.selectedDeployment.deploymentname === payload.deploymentname) commit('clearDeployment')
      else {
        commit('setDeployment', payload)
        commit('setPlaylist', { ...playlists[0], index: 0 })
        commit('clearMessage')
      }
    },
    toggleOpenPlaylist ({ commit, state }, payload) {
      if (state.selectedPlaylist.title !== payload.title) {
        commit('setPlaylist', payload)
        commit('clearMessage')
      }
    },
    toggleOpenMessage ({ commit, state }, payload) {
      if (state.selectedMessage.title === payload.title) commit('clearMessage')
      else commit('setMessage', payload)
    },
  }
}
