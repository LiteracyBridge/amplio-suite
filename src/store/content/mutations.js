import { getDefaultState } from './index'

const resetState = (state) => {
  Object.assign(state, getDefaultState())
}

const setDirty = (state, status) => {
  state.dirty = status
}

const requestInit = (state) => {
  state.status = 'loading'
}

const requestError = (state) => {
  state.status = 'error'
}

const requestSuccess = (state) => {
  state.status = 'success'
}

const setContent = (state, payload) => {
  state.dirty = false
  state.status = 'success'
  state.programCode = payload.programCode
  state.deploymentName = payload.deploymentName
  state.playlists = payload.playlists
}

const setPlaylistTitle = (state, payload) => {
  const { playlistIndex, title } = payload
  state.playlists[playlistIndex].title = title
}

const removePlaylist = (state, index) => {
  state.playlists.splice(index, 1)
}

const setMessageTitle = (state, payload) => {
  const { playlistIndex, messageIndex, title } = payload
  state.playlists[playlistIndex].messages[messageIndex].title = title
}

const removeMessage = (state, payload) => {
  const { playlistIndex, messageIndex } = payload
  state.playlists[playlistIndex].messages.splice(messageIndex, 1)
}

export default {
  resetState,
  setDirty,
  requestInit,
  requestError,
  requestSuccess,
  setContent,

  setPlaylistTitle,
  removePlaylist,

  setMessageTitle,
  removeMessage
}
