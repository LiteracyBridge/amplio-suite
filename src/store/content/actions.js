import {
  getContent,
  putContent,
  contentAddPlaylist,
  contentAddPMessage
} from '@/api/content.api'


const fetchContent = async ({ state, commit }, payload) => {
  const { programCode, deployment } = payload

  if (state.status === 'loading') return
  if (state.programCode === programCode && !state.dirty && state.deployment === deployment) return

  commit('requestInit')

  try {
    const response = await getContent(programCode, deployment)
    commit('setContent', response)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', {type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateContent = async ({ state, commit }, deployment) => {
  const { programCode, playlists } = state

  commit('requestInit')

  try {
    await putContent({ program_code: programCode, deployment, content: playlists })
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const addPlaylist = async ({ state, commit, dispatch }, deployment) => {
  const { programCode, deploymentName } = state

  commit('setDirty', true)
  commit('requestInit')

  try {
    await contentAddPlaylist({ program_code: programCode, deployment})
    commit('requestSuccess')
    await dispatch('fetchContent', { programCode, deployment: deploymentName })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const removePlaylist = async ({ commit }, index) => {
  commit('removePlaylist', index)
  commit('setDirty', true)
}

const setPlaylist = async ({ commit }, payload) => {
  commit('setPlaylist', payload)
  commit('setDirty', true)
}

const setPlaylistTitle = ({ commit, state }, payload) => {
  const titles = state.playlists.map(ele => ele.title)
  if (titles.includes(payload.title)) {
    commit('addDuplicatePlaylists', payload.playlistIndex)
  } else {
    commit('removeDuplicatePlaylists', payload.playlistIndex)
  }

  commit('setPlaylistTitle', payload)
  commit('setDirty', true)
}

const setPlaylistAudience = ({ commit }, payload)=> {
  commit('setPlaylistAudience', payload)
  commit('setDirty', true)
}

const setMessages = ({ commit }, payload) => {
  commit('setMessages', payload)
  commit('setDirty', true)
}

const addNewMessage = async ({ state, commit }, playlistIndex) => {
  const { programCode, deploymentName } = state

  commit('setDirty', true)
  commit('requestInit')

  try {
    const response = await contentAddPMessage({ program_code: programCode, deployment: deploymentName, playlist_index: playlistIndex })
    commit('requestSuccess')
    commit('addNewMessage', { playlistIndex, message: response.data.message })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const removeMessage = async ({ commit }, payload) => {
  commit('removeMessage', payload)
  commit('setDirty', true)
}

const setMessageTitle = ({ commit, state }, payload) => {
  const { playlistIndex, messageIndex, title } = payload
  const titles = state.playlists[playlistIndex].messages.map(ele => ele.title)

  if (titles.includes(title)) {
    commit('addDuplicateMessage', messageIndex)
  } else {
    commit('removeDuplicateMessage', messageIndex)
  }

  commit('setMessageTitle', payload)
  commit('setDirty', true)
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

  setPlaylist,
  addPlaylist,
  removePlaylist,
  setPlaylistTitle,
  setPlaylistAudience,

  setMessages,
  addNewMessage,
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
