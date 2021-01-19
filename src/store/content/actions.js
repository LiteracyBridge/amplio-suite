import {
  getContent,
} from '@/api/content.api'

import {
  postPlaylist,
  putPlaylist,
  deletePlaylist,
} from '@/api/playlist.api'

import {
  postMessage,
  putMessage,
  deleteMessage,
} from '@/api/message.api'


const fetchContent = async ({ state, commit }, payload) => {
  const { programCode, deploymentId } = payload

  if (state.status === 'loading') return
  if (state.programCode === programCode && !state.dirty && state.deploymentId === deploymentId) return

  commit('requestInit')

  try {
    const response = await getContent(programCode, deploymentId)
    commit('setContent', response)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', {type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateContent = async ({ state, commit }) => {
  const { playlists } = state
  const messages = playlists
    .map(playlist => playlist.messages)
    .flat()

  commit('requestInit')

  try {
    await putPlaylist({ playlists })
    await putMessage({ messages })
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const setPlaylists = async ({ commit }, payload) => {
  commit('setPlaylists', payload)
  commit('setDirty', true)
}

const addPlaylist = async ({ state, commit }, deploymentId) => {
  commit('requestInit')

  try {
    const response = await postPlaylist(state.programCode, deploymentId)
    commit('requestSuccess')
    commit('addPlaylist', response)
  } catch (error) {
    commit('requestError')
    console.log('error', error)
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const removePlaylist = async ({ state, commit, dispatch }, playlistId) => {
  const { programCode, deploymentId } = state

  try {
    commit('setDirty', true)
    await deletePlaylist(programCode, playlistId)
    await dispatch('fetchContent', { programCode, deploymentId })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const setPlaylistTitle = ({ commit, state }, payload) => {
  commit('setPlaylistTitle', payload)
  commit('setDirty', true)

  const titles = state.playlists.map(playlist => playlist.title)
  const duplicate = titles.filter((title => v => title.has(v) || !title.add(v))(new Set))
  commit('setDuplicatePlaylists', duplicate)
}

const setPlaylistAudience = ({ commit }, payload)=> {
  commit('setPlaylistAudience', payload)
  commit('setDirty', true)
}

const setMessages = ({ commit }, payload) => {
  commit('setMessages', payload)
  commit('setDirty', true)
}

const addMessage = async ({ state, commit }, playlistId) => {
  commit('requestInit')

  try {
    const response = await postMessage(state.programCode, playlistId)
    commit('requestSuccess')
    commit('addMessage', response)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const removeMessage = async ({ state, commit, dispatch }, messageId) => {
  const { programCode, deploymentId } = state

  try {
    commit('setDirty', true)
    await deleteMessage(programCode, messageId)
    await dispatch('fetchContent', { programCode, deploymentId })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const setMessageTitle = ({ commit, state }, payload) => {
  const { playlistIndex } = payload

  commit('setMessageTitle', payload)
  commit('setDirty', true)

  const titles = state.playlists[playlistIndex].messages.map(message => message.title)
  const duplicate = titles.filter((title => v => title.has(v) || !title.add(v))(new Set))
  commit('setDuplicateMessage', duplicate)
}

const addMessageLanguage = ({ commit }, payload) => {
  commit('addMessageLanguage', payload)
  commit('setDirty', true)
}

const removeMessageLanguage = ({ commit }, payload) => {
  commit('removeMessageLanguage', payload)
  commit('setDirty', true)
}

const setMessageCategory = ({ commit }, payload) => {
  commit('setMessageCategory', payload)
  commit('setDirty', true)
}

const setMessageVariant = ({ commit }, payload) => {
  commit('setMessageVariant', payload)
  commit('setDirty', true)
}

const setMessageFormat = ({ commit }, payload) => {
  commit('setMessageFormat', payload)
  commit('setDirty', true)
}

const setMessageSDGGoal = ({ commit }, payload) => {
  commit('setMessageSDGGoal', payload)
  commit('setMessageSDGTarget', { ...payload, target: null })
  commit('setDirty', true)
}

const setMessageSDGTarget = ({ commit }, payload) => {
  commit('setMessageSDGTarget', payload)
  commit('setDirty', true)
}

const setMessageKeyPoints = ({ commit }, payload) => {
  commit('setMessageKeyPoints', payload)
  commit('setDirty', true)
}

export default {
  fetchContent,
  updateContent,

  setPlaylists,
  addPlaylist,
  removePlaylist,
  setPlaylistTitle,
  setPlaylistAudience,

  setMessages,
  addMessage,
  removeMessage,
  setMessageTitle,
  setMessageVariant,
  addMessageLanguage,
  removeMessageLanguage,
  setMessageCategory,
  setMessageFormat,
  setMessageSDGGoal,
  setMessageSDGTarget,
  setMessageKeyPoints,
}
