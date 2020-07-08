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

      if (state.selectedDeployment.id === payload.id) commit('clearDeployment')
      else {
        commit('setDeployment', payload)
        commit('setPlaylist', playlists[0])
        commit('setMessage', playlists[0].messages[0])
      }
    },
    toggleOpenPlaylist ({ commit, state }, payload) {
      if (state.selectedPlaylist.title === payload.title) commit('clearPlaylist')
      else {
        commit('setPlaylist', payload)
        commit('setMessage', payload.messages[0])
      }
    },
    toggleOpenMessage ({ commit, state }, payload) {
      if (state.selectedMessage.title === payload.title) commit('clearMessage')
      else commit('setMessage', payload)
    },
  }
}
