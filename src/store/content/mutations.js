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

const setPlaylistAudience = (state, payload) => {
  const { playlistIndex, audience } = payload
  state.playlists[playlistIndex].audience = audience
}

const setMessageTitle = (state, payload) => {
  const { playlistIndex, messageIndex, title } = payload
  state.playlists[playlistIndex].messages[messageIndex].title = title
}

const setMessageLang = (state, payload) => {
  const { playlistIndex, messageIndex, lang } = payload
  state.playlists[playlistIndex].messages[messageIndex].language = lang
}

const setMessageVariant= (state, payload) => {
  const { playlistIndex, messageIndex, variant } = payload
  state.playlists[playlistIndex].messages[messageIndex].variant = variant
}

const setMessageFormat = (state, payload) => {
  const { playlistIndex, messageIndex, format } = payload
  state.playlists[playlistIndex].messages[messageIndex].format = format
}

const setMessageSDGGoal = (state, payload) => {
  const { playlistIndex, messageIndex, goal } = payload
  state.playlists[playlistIndex].messages[messageIndex].sdg_goal = goal
}

const setMessageSDGTarget = (state, payload) => {
  const { playlistIndex, messageIndex, target } = payload
  state.playlists[playlistIndex].messages[messageIndex].sdg_target = target
}

const setMessageKeyPoints = (state, payload) => {
  const { playlistIndex, messageIndex, text } = payload
  state.playlists[playlistIndex].messages[messageIndex].key_point = text
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
  setPlaylistAudience,
  removePlaylist,

  setMessageTitle,
  setMessageLang,
  setMessageVariant,
  setMessageFormat,
  setMessageSDGGoal,
  setMessageSDGTarget,
  setMessageKeyPoints,
  removeMessage
}
