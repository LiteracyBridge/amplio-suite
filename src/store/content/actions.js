import {
  getContent,
  putContent,
  contentAddPlaylist,
  contentAddPMessage
} from '@/api/content.api'


const fetchContent = async ({ state, rootState, rootGetters, commit }, deploymentName=null) => {
  const { programCode, programName } = rootState.program
  if (!programName) return
  if (!deploymentName && state.programCode === programCode && !state.dirty) return

  commit('resetState')
  commit('requestInit')

  if (!deploymentName) {
    deploymentName = rootGetters['uiSettings/selectedDeployment'].deploymentname
  }

  try {
    const response = await getContent(programCode, deploymentName)
    commit('setContent', response)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', {type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateContent = async ({ state, rootState, commit }) => {
  const { programCode, playlists } = state
  const { selectedDeploymentIndex } = rootState.uiSettings.content
  const deployment_id = (selectedDeploymentIndex + 1).toString()

  commit('requestInit')

  try {
    await putContent({ program_code: programCode, deployment_id, content: playlists })
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const addPlaylist = async ({ state, commit, dispatch }, deploymentId) => {
  const { programCode } = state

  commit('setDirty', true)
  commit('requestInit')

  try {
    await contentAddPlaylist({ program_code: programCode, deployment_id: deploymentId})
    await dispatch('fetchContent')
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

const addMessage = async ({ state, commit, dispatch }, payload) => {
  const { programCode } = state

  commit('setDirty', true)
  commit('requestInit')

  try {
    await contentAddPMessage({ program_code: programCode, ...payload })
    await dispatch('fetchContent')
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

const setMessageLang = ({ commit }, payload) => {
  commit('setMessageLang', payload)
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
  addMessage,
  removeMessage,
  setMessageTitle,
  setMessageVariant,
  setMessageLang,
  setMessageCategory,
  setMessageFormat,
  setMessageSDGGoal,
  setMessageSDGTarget,
  setMessageKeyPoints,
}
