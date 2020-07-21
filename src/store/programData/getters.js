const httpStatus = (state) => {
  return {
    general: state.general.status,
    deployments: state.deployments.status,
    content: state.content.status
  }
}

const tabStatus = (state) => {
  return {
    general: state.general.dirty,
    deployments: state.deployments.dirty,
    content: state.content.dirty
  }
}

const selectedDeployment = (state, getters, rootState) => {
  const index = rootState.uiContent.selectedDeploymentIndex
  return state.deployments.items[index]
}

const selectedPlaylist = (state, getters, rootState) => {
  const index = rootState.uiContent.selectedPlaylistIndex
  return state.content.playlists[index]
}

const selectedMessage = (state, getters, rootState) => {
  const index = rootState.uiContent.selectedPlaylistIndex
  const index2 = rootState.uiContent.selectedMessageIndex
  return state.content.playlists[index].messages[index2]
}

export default {
  httpStatus,
  tabStatus,

  selectedDeployment,
  selectedPlaylist,
  selectedMessage
}
