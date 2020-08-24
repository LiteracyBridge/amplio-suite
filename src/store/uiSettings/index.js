export const getDefaultState = () => ({
  content: {
    selectedDeploymentIndex: 0,
    selectedMessageIndex: -1
  },

  recipients: {}
})

export default {
  namespaced: true,

  state: getDefaultState(),

  mutations: {
    setDeploymentIndex (state, index) {
      state.content.selectedDeploymentIndex = index
    },
    setMessageIndex (state, index) {
      state.content.selectedMessageIndex = index
    }
  },

  actions: {
    setDeploymentIndex ({ state, commit }, index) {
      if (state.content.selectedDeploymentIndex === index) return
      else {
        commit('setDeploymentIndex', index)
        commit('setMessageIndex', -1)
      }
    },
    setMessageIndex ({ state, commit }, index) {
      if (state.content.selectedMessageIndex === index) commit('setMessageIndex', -1)
      else commit('setMessageIndex', index)
    }
  },

  getters: {
    tabStatus (state, getters, rootState) {
      return {
        general: rootState.program.dirty || rootState.programData.dirty,
        deployments: rootState.deployments.dirty,
        content: rootState.content.dirty
      }
    },

    selectedDeployment (state, getters, rootState) {
      const deploymentIndex = state.content.selectedDeploymentIndex
      return rootState.deployments.items[deploymentIndex]
    },
    selectedMessage (state, getters, rootState) {
      const playlistIndex = 0 // state.content.selectedPlaylistIndex
      const messageIndex = state.content.selectedMessageIndex

      if (messageIndex === -1) return null
      else return rootState.content.playlists[playlistIndex].messages[messageIndex]
    }
  }
}
