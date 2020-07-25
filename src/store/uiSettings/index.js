export const getDefaultState = () => ({
  content: {
    selectedDeploymentIndex: 0,
    selectedPlaylistIndex: 0,
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
    setPlaylistIndex (state, index) {
      state.content.selectedPlaylistIndex = index
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
        commit('setPlaylistIndex', 0)
        commit('setMessageIndex', -1)
      }
    },
    setPlaylistIndex ({ state, commit }, index) {
      if (state.content.selectedPlaylistIndex === index) return
      else {
        commit('setPlaylistIndex', index)
        commit('setMessageIndex', -1)
      }
    },
    setMessageIndex ({ state, commit }, index) {
      if (state.content.selectedMessageIndex === index) commit('setMessageIndex', -1)
      else commit('setMessageIndex', index)
    }
  },

  getters: {
    httpStatus (state, getters, rootState) {
      return {
        general: rootState.programData.status,
        deployments: rootState.deployments.status,
        content: rootState.content.status
      }
    },
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
    selectedPlaylist (state, getters, rootState) {
      const emptyPlaylist = {
        title: '',
        audience: '',
        messages: []
      }

      const playlistIndex = state.content.selectedPlaylistIndex

      if (rootState.content.playlists.length === 0) return emptyPlaylist
      else return rootState.content.playlists[playlistIndex]
    },
    selectedMessage (state, getters, rootState) {
      const playlistIndex = state.content.selectedPlaylistIndex
      const messageIndex = state.content.selectedMessageIndex

      if (messageIndex === -1) return {}
      else return rootState.content.playlists[playlistIndex].messages[messageIndex]
    }
  }
}
