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
  state.programId = payload.programId
  state.deploymentId = payload.deploymentId
  state.playlists = payload.playlists
}

const setPlaylists = (state, payload) => {
  const playlists = payload
    .map((playlist, index) => {
      playlist.position = index
      return playlist
    })
  state.playlists = playlists
}

const addPlaylist = (state, payload) => {
  state.playlists = [...state.playlists, payload]
}

const setDuplicatePlaylists = (state, payload) => {
  state.duplicatePlaylists = payload
}

const setPlaylistTitle = (state, payload) => {
  const { playlistIndex, title } = payload
  state.playlists[playlistIndex].title = title
}

const setPlaylistAudience = (state, payload) => {
  const { playlistIndex, audience } = payload
  state.playlists[playlistIndex].audience = audience
}

const setMessages = (state, payload) => {
  const playlists = [...state.playlists]
  const { playlistId, messages } = payload
  const index = playlists
    .map(playlist => playlist.id)
    .indexOf(playlistId)

  playlists[index].messages = messages
    .map((message, index) => {
      message.position = index
      return message
    })

  state.playlists = playlists
}

const addMessage = (state, payload) => {
  const playlists = [...state.playlists]
  const { playlist_id } = payload
  const index = playlists
    .map(playlist => playlist.id)
    .indexOf(playlist_id)

  playlists[index].messages.push(payload)
  state.playlists = playlists
}

const setDuplicateMessage = (state, payload) => {
  state.duplicateMessage = payload
}

const setMessageTitle = (state, payload) => {
  const { playlistIndex, messageIndex, title } = payload
  state.playlists[playlistIndex].messages[messageIndex].title = title
}

const addMessageLanguage = (state, payload) => {
  const { playlistIndex, messageIndex, lang } = payload
  const languages = state.playlists[playlistIndex].messages[messageIndex].languages
  state.playlists[playlistIndex].messages[messageIndex].languages = [...languages, lang]
}

const removeMessageLanguage = (state, payload) => {
  const { playlistIndex, messageIndex, lang } = payload
  let languages = state.playlists[playlistIndex].messages[messageIndex].languages
  languages = languages.filter(language => language.code !== lang.code)
  state.playlists[playlistIndex].messages[messageIndex].languages = languages
}

const setMessageCategory = (state, payload) => {
  const { playlistIndex, messageIndex, category } = payload
  state.playlists[playlistIndex].messages[messageIndex].default_category_id = category
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
  state.playlists[playlistIndex].messages[messageIndex].sdg_goal_id = goal
}

const setMessageSDGTarget = (state, payload) => {
  const { playlistIndex, messageIndex, target } = payload
  state.playlists[playlistIndex].messages[messageIndex].sdg_target_id = target
}

const setMessageKeyPoints = (state, payload) => {
  const { playlistIndex, messageIndex, text } = payload
  state.playlists[playlistIndex].messages[messageIndex].key_points = text
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

  setPlaylists,
  addPlaylist,
  setDuplicatePlaylists,
  setPlaylistTitle,
  setPlaylistAudience,

  setMessages,
  addMessage,
  setDuplicateMessage,
  setMessageTitle,
  addMessageLanguage,
  removeMessageLanguage,
  setMessageCategory,
  setMessageVariant,
  setMessageFormat,
  setMessageSDGGoal,
  setMessageSDGTarget,
  setMessageKeyPoints,
  removeMessage
}
