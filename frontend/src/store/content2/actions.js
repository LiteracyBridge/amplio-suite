// Import the API to load/store content.

import {getContent, getDownloadLink, putContent, uploadSpec as uploadSpecFile, approveSpec as approveSpecFile} from '@/api/content.api'

const getExportLink = async({ state }, payload) => {
  const {programId, artifact} = payload;
  if (state.status === 'loading') return;
  try {
    const link = await getDownloadLink(programId, artifact);
    return link;
  } catch (error) {
    // TODO: return an error message.
    return null;
  }
};

const uploadSpec = async({ state }, payload) => {
    const {programId, fileData} = payload;
    if (state.status === 'loading') return;
    try {
        return await uploadSpecFile(programId, fileData);
    } catch (error) {
        return null;
    }
};

const approveSpec = async({ state }, payload) => {
    const {programId, publish} = payload;
    if (state.status === 'loading') return;
    try {
        return await approveSpecFile(programId, publish);
    } catch (error) {
        return null;
    }
};

// Fetch the content from the server. payload must have a member .programId.
const fetchContent = async ({ state, commit }, payload) => {
  const { programId } = payload

  if (state.status === 'loading') return
  // Not loading: '', success, or error
  if (state.programId === programId && !state.changed) return

  commit('requestInit')

  try {
    // const playlists = await getPlaylists(programId, deploymentId)
    const deployments = await getContent(programId);
    commit('setContent', { programId, deployments })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', {type: 'alert', text: error.toString() }, { root: true })
  }
}

// Update the server with any new & updated content.
const updateContent = async ({ state, commit }) => {
  const { programId, deployments } = state

  commit('requestInit')

  try {
    await putContent(programId, deployments)
    commit('setChanged', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const setDeployments = async ({ commit }, payload) => {
  commit('setDeployments', payload);
  commit('setChanged', true);
}

// Adds a deployment to the end of the list
const addDeployment = async ({ commit }, payload) => {
  commit('addDeployment', payload);
  commit('setChanged', true);
}

const removeDeployment = async ({ commit }, payload) => {
  commit('removeDeployment', payload);
  commit('setChanged', true);
}

const setDeploymentStartdate = async ({ commit }, payload) => {
  commit('setDeploymentStartdate', payload);
  commit('setChanged', true);
}

const setDeploymentEnddate = async ({ commit }, payload) => {
  commit('setDeploymentEnddate', payload);
  commit('setChanged', true);
}

const setDeploymentName = async ({ commit }, payload) => {
  commit('setDeploymentName', payload);
  commit('setChanged', true);
}

// Set the playlists for the given deployment.
const setPlaylists = async ({ commit }, payload) => {
  commit('setPlaylists', payload)
  commit('setChanged', true)
}

const addPlaylist = async ({ commit }, payload) => {
  commit('addPlaylist', payload);
  commit('setChanged', true);
}

const removePlaylist = async ({ commit }, payload) => {
  commit('removePlaylist', payload);
  commit('setChanged', true);
}

// Edit playlists.
const setPlaylistTitle = ({ commit }, payload) => {
  commit('setPlaylistTitle', payload)
  commit('setChanged', true)
}

const setPlaylistAudience = ({ commit }, payload)=> {
  commit('setPlaylistAudience', payload)
  commit('setChanged', true)
}

const setMessages = ({ commit }, payload) => {
  commit('setMessages', payload)
  commit('setChanged', true)
}

const addMessage = async ({ commit }, payload) => {
  commit('addMessage', payload);
  commit('setChanged', true)
}

const removeMessage = async ({ commit }, payload) => {
  commit('removeMessage', payload);
  commit('setChanged', true);
}

const setMessageTitle = ({ commit }, payload) => {
  commit('setMessageTitle', payload)
  commit('setChanged', true)
  // Interesting bit of code below to find a list of duplicate titles.
  // const titles = state.playlists[playlistIndex].messages.map(message => message.title)
  // const duplicates = titles.filter((theSet => aString => theSet.has(aString) || !theSet.add(aString))(new Set))
  // commit('setDuplicateMessages', duplicates)
}

const addMessageLanguage = ({ commit }, payload) => {
  commit('addMessageLanguage', payload)
  commit('setChanged', true)
}

const removeMessageLanguage = ({ commit }, payload) => {
  commit('removeMessageLanguage', payload)
  commit('setChanged', true)
}

const setMessageCategory = ({ commit }, payload) => {
  commit('setMessageCategory', payload)
  commit('setChanged', true)
}

const setMessageAudience = ({ commit }, payload) => {
  commit('setMessageAudience', payload);
  commit('setChanged', true);
};

const setMessageVariant = ({ commit }, payload) => {
  commit('setMessageVariant', payload)
  commit('setChanged', true)
}

const setMessageFormat = ({ commit }, payload) => {
  commit('setMessageFormat', payload)
  commit('setChanged', true)
}

const setMessageSDGGoal = ({ commit }, payload) => {
  commit('setMessageSDGGoal', payload)
  commit('setMessageSDGTarget', { ...payload, target: null })
  commit('setChanged', true)
}

const setMessageSDGTarget = ({ commit }, payload) => {
  commit('setMessageSDGTarget', payload)
  commit('setChanged', true)
}

const setMessageKeyPoints = ({ commit }, payload) => {
  commit('setMessageKeyPoints', payload)
  commit('setChanged', true)
}

export default {
  fetchContent,
  updateContent,

  getExportLink,
    uploadSpec,
    approveSpec,

  setDeployments,
  addDeployment,
  removeDeployment,

  setDeploymentStartdate,
  setDeploymentEnddate,
  setDeploymentName,

  setPlaylists,
  addPlaylist,
  removePlaylist,

  setPlaylistTitle,
  setPlaylistAudience,

  setMessages,
  addMessage,
  removeMessage,
  setMessageTitle,
  addMessageLanguage,
  removeMessageLanguage,
  setMessageCategory,
  setMessageAudience,
  setMessageVariant,
  setMessageFormat,
  setMessageSDGGoal,
  setMessageSDGTarget,
  setMessageKeyPoints,
}
