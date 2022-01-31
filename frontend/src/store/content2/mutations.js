import { getDefaultState } from './index'

const resetState = (state) => {
  Object.assign(state, getDefaultState())
}

const setChanged = (state, status) => {
  state.changed = status
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

/************************************************************************************************************
 * This helper return the deployment object from the state, given one of the deploymentIx (index in array)
 * the deploymentnumber, or deployment object (including a copy/clone/proxy/look-alike of the deployment object).
 * @param state
 * @param payload with 'deploymentIx', 'deploymentnumber', or 'deployment' member
 * @returns the deployment object from the state
 */
const getDeployment = (state, payload) => {
  let deploymentIx = payload.deploymentIx;
  if (deploymentIx === undefined && payload.deploymentnumber !== undefined) {
    deploymentIx = state.deployments.findIndex(d=>d.deploymentnumber===payload.deploymentnumber);
  }
  if (deploymentIx === undefined && payload.deployment && payload.deployment.deploymentnumber !== undefined) {
    deploymentIx = state.deployments.findIndex(d=>d.deploymentnumber===payload.deployment.deploymentnumber);
  }
  return state.deployments[deploymentIx];
}

/**
 * Like getDeployment, but for Playlists.
 */
const getPlaylist = (state, payload) => {
  const deployment = getDeployment(state, payload);
  let playlistIx = payload.playlistIx;
  if (playlistIx === undefined && payload.playlist && payload.playlist.position !== undefined) {
    playlistIx = deployment.playlists.findIndex(p=>p.position===payload.playlist.position);
  }
  return deployment.playlists[playlistIx];
}

const getMessage = (state, payload) => {
  const playlist = getPlaylist(state, payload);
  let messageIx = payload.messageIx;
  if (messageIx === undefined && payload.message && payload.message.position !== undefined) {
    messageIx = playlist.messages.findIndex(m=>m.position===payload.message.position);
  }
  return playlist.messages[messageIx];
}
/*
 * End of access helpers
 *************************************************************************************************************/

const setContent = (state, payload) => {
  state.changed = false;
  state.status = 'success'
  state.programId = payload.programId
  state.deployments = payload.deployments
}

const setDeployments = (state, payload) => {
  let deployments = payload.deployments;
  // Ensure ascending deployment numbers.
  deployments.forEach((d,ix)=>d.deploymentnumber = ix+1);
  state.deployments = deployments;
}

const addDeployment = (state) => {
  // New deployment with next deployment #.
  const previous = state.deployments.length>0 ? state.deployments[state.deployments.length-1] : undefined;
  state.deployments.push(Deployment(state.deployments.length+1, previous, state.programId));
}

const removeDeployment = (state, payload) => {
  let deploymentIx = payload.deploymentIx;
  if (deploymentIx === undefined && payload.deploymentnumber !== undefined) {
    deploymentIx = state.deployments.findIndex(d => d.deploymentnumber === payload.deploymentnumber);
  }
  if (deploymentIx === undefined && payload.deployment && payload.deployment.deploymentnumber !== undefined) {
    deploymentIx = state.deployments.findIndex(d => d.deploymentnumber === payload.deployment.deploymentnumber);
  }
  console.log(state.deployments)
  state.deployments.splice(deploymentIx, 1);
  console.log(state.deployments)
}

const setDeploymentStartdate = (state, payload) => {
  const deployment = getDeployment(state, payload);
  deployment.startdate = payload.startdate;
};

const setDeploymentEnddate = (state, payload) => {
  const deployment = getDeployment(state, payload);
  deployment.enddate = payload.enddate;
};

const setDeploymentName = (state, payload) => {
  const deployment = getDeployment(state, payload);
  deployment.deploymentname = payload.deploymentname;
};

const setPlaylists = (state, payload) => {
  const deployment = getDeployment(state, payload)
  const {playlists} = payload;
  // Ensure ascending positions.
  playlists.forEach((p,ix)=>p.position = ix+1);
  deployment.playlists = playlists;
}

const addPlaylist = (state, payload) => {
  const deployment = getDeployment(state, payload);
  // New playlist at next position.
  deployment.playlists.push(Playlist(deployment.playlists.length+1));
}

const removePlaylist = (state, payload) => {
  const deployment = getDeployment(state, payload);
  const playlistIx = deployment.playlists.findIndex(pl=>pl.position===payload.playlist.position);
  deployment.playlists.splice(playlistIx, 1);
}

// const setDuplicatePlaylists = (state, payload) => {
//   state.duplicatePlaylists = payload
// }

const setPlaylistTitle = (state, payload) => {
  const playlist = getPlaylist(state, payload);
  const { title } = payload
  playlist.title = title
}

const setPlaylistAudience = (state, payload) => {
  const playlist = getPlaylist(state, payload);
  const { audience } = payload
  playlist.audience = audience
}

const setMessages = (state, payload) => {
  const playlist = getPlaylist(state, payload);
  const {messages} = payload;
  // Ensure ascending positions.
  messages.forEach((m,ix)=>m.position = ix+1);
  playlist.messages = messages;
}

const addMessage = (state, payload) => {
  const playlist = getPlaylist(state, payload);
  const message = Message(playlist.messages.length+1);
  if (playlist.messages.length > 0) {
    playlist.audience = playlist.messages[playlist.messages.length - 1].audience;
  }
  playlist.messages.push(message);
}

// const setDuplicateMessage = (state, payload) => {
//   state.duplicateMessage = payload
// }

const removeMessage = (state, payload) => {
  const playlist = getPlaylist(state, payload);
  const messageIx = playlist.messages.findIndex(msg=>msg.position===payload.message.position);
  playlist.messages.splice(messageIx, 1);
};

const setMessageTitle = (state, payload) => {
  const message = getMessage(state, payload);
  const {title } = payload;
  message.title = title
}

const addMessageLanguage = (state, payload) => {
  // 'languages' is a list of comma-separated language names or codes.
  const message = getMessage(state, payload);
  const {language } = payload;
  let languageCode;
  if (typeof language === 'string' || language instanceof String) {
    languageCode = language;
  } else {
    languageCode = language.code;
  }
  let languages = message.languages
  const list = languages.split(/[,;]/);
  if (list.indexOf(languageCode)===-1) list.push(languageCode)
  languages = list.join(',');
  message.languages = languages
}

const removeMessageLanguage = (state, payload) => {
  // 'languages' is a list of comma-separated language names or codes.
  const message = getMessage(state, payload);
  const {language } = payload;
  let languageCode;
  if (typeof language === 'string' || language instanceof String) {
    languageCode = language;
  } else {
    languageCode = language.code;
  }
  let languages = message.languages
  let list = languages.split(/[,;]/);
  const ix = list.indexOf(languageCode);
  if (ix >= 0) list.splice(ix, 1);
  languages = list.join(',');
  message.languages = languages
}

const setMessageCategory = (state, payload) => {
  const message = getMessage(state, payload);
  const { category } = payload
  message.default_category_code = category
}

const setMessageAudience = (state, payload) => {
  const message = getMessage(state, payload);
  const { audience } = payload
  message.audience = audience
}

const setMessageVariant= (state, payload) => {
  const message = getMessage(state, payload);
  const { variant } = payload
  message.variant = variant
}

const setMessageFormat = (state, payload) => {
  const message = getMessage(state, payload);
  const { format } = payload
  message.format = format
}

const setMessageSDGGoal = (state, payload) => {
  const message = getMessage(state, payload);
  const { goal } = payload
  message.sdg_goal_id = goal
}

const setMessageSDGTarget = (state, payload) => {
  const message = getMessage(state, payload);
  const { target } = payload
  const goal = message.sdg_goal_id
  message.sdg_target_id = `${goal}.${target}`
  message.sdg_target = target
}

const setMessageKeyPoints = (state, payload) => {
  const message = getMessage(state, payload);
  const { text } = payload
  message.key_points = text
}

//
export default {
  resetState,
  setChanged,
  requestInit,
  requestError,
  requestSuccess,
  setContent,

  setDeployments,
  addDeployment,
  removeDeployment,

  setDeploymentStartdate,
  setDeploymentEnddate,
  setDeploymentName,

  setPlaylists,
  addPlaylist,
  removePlaylist,
//   setDuplicatePlaylists,
  setPlaylistTitle,
  setPlaylistAudience,
//
  removeMessage,
  setMessages,
  addMessage,
//   setDuplicateMessage,
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

function Deployment(deploymentnumber, previous, programId) {
  var startdate = new Date();
  let enddate = new Date();
  let playlists = [];
  if (deploymentnumber !== 1) {
    // Date handline in Javascript is pretty bad, but this seems to work well enough.
    let prevEnd = new Date(previous.enddate);
    startdate = new Date(prevEnd)
    startdate = new Date(startdate.setDate(prevEnd.getDate()+1))
    enddate = new Date(startdate)
    enddate = new Date(enddate.setDate(startdate.getDate()+90));
  }
  let start=startdate.toISOString().substring(0,10);
  let end=enddate.toISOString().substring(0,10)
  let deployment = `${programId}-${startdate.getFullYear()%100}-${deploymentnumber}`;
  let deploymentname = deployment;
  console.log(`start: ${startdate}, end: ${enddate}, depl: ${deployment}`);
  return {deploymentnumber, startdate:start, enddate:end, playlists, deployment, deploymentname};
}

function Playlist(position) {
  const title = '';
  const audience = '';
  const messages = [];
  return {position, title, audience, messages};
}

function Message(position) {
  const title = '';
  const format = '';
  const default_category_code = '';
  const variant = '';
  const sdg_goal = '';
  const sdg_target = '';
  const key_points = '';
  const languages = '';
  const audience = '';
  return {position, title, format, default_category_code, variant, sdg_goal, sdg_target, key_points, languages, audience};
}

