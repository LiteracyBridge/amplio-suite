import { getDefaultState } from './index'

// eslint-disable-next-line no-unused-vars
const resetState = (state) => {
  state = Object.assign(state, getDefaultState())
}

const setDirty = (state, payload) => {
  const { tab, status } = payload
  state[tab].dirty = status
}

const getProgramRequest = (state) => {
  state.general.status = 'loading'
}

const getProgramError = (state) => {
  state.general.status = 'error'
}

const setProgram = (state, payload) => {
  state.general.dirty = false
  state.general.status = 'success'
  state.general.projectCode = payload.project

  // FIXME: set every relevant value
  state.general.programName = payload.name
  console.log("FIXME: set every relevant value")
}

/****************************************
  General Tab
****************************************/
const setProgramName = (state, payload) => {
  state.general.programName = payload
}

const setLanguages = (state, payload) => {
  state.general.languages[payload.index] = payload.lang
}

const addLangInput = (state) => {
  state.general.amountOfLang++
}

const setFeedbackFrequently = (state, payload) => {
  state.general.feedbackFrequently = payload
}

const setFeedbackFrequentlyOther = (state, payload) => {
  state.general.feedbackFrequentlyOther = payload
}

/****************************************
  Deployments Tab
****************************************/
const setDeploymentsAmount = (state, payload) => {
  state.deploymentsConfig.amount = payload
}

const setDeploymentsFrequency = (state, payload) => {
  state.deploymentsConfig.frequency = payload
}

const setDeploymentsFirst = (state, payload) => {
  state.deploymentsConfig.first = payload
}

//
const addDeployment = (state, payload) => {
  state.deployments.items.push(payload)
}

const removeDeployment = (state, payload) => {
  const { index } = payload
  state.deployments.items.splice(index, 1)
}

const setDeploymentDate = (state, payload) => {
  const { index, what, date } = payload
  state.deployments.items[index][what] = date
}

/****************************************
  Content
****************************************/
const addGoal = (state, payload) => {
  state.programData.data.goals.push(payload)
}

const removeGoal = (state, index) => {
  state.programData.data.goals.splice(index, 1)
}

const addListeningModel = (state, payload) => {
  state.programData.data.listeningModels.push(payload)
}

const removeListeningModel = (state, index) => {
  state.programData.data.listeningModels.splice(index, 1)
}



const getDeploymentsRequest = (state) => {
  state.deployments.status = 'loading'
}

const getDeploymentsError = (state) => {
  state.deployments.status = 'error'
}

const setDeployments = (state, payload) => {
  state.deployments.dirty = false
  state.deployments.status = 'success'
  state.deployments.projectCode = payload.projectCode
  state.deployments.items = payload.items
}

const getContentRequest = (state) => {
  state.content.status = 'loading'
}

// const updateContentRequest = (state) => {
//   state.content.status = 'updating'
// }

const getContentError = (state) => {
  state.content.status = 'error'
}

const setContent = (state, payload) => {
  state.deployments.dirty = false
  state.content.status = 'success'
  state.content.projectCode = payload.projectCode
  state.content.deploymentName = payload.deploymentName
  state.content.playlists = payload.playlists
}


export default {
  resetState,
  setDirty,
  getProgramRequest,
  getProgramError,
  setProgram,
  setProgramName,
  setLanguages,
  addLangInput,
  setDeploymentsAmount,
  setDeploymentsFrequency,
  setDeploymentsFirst,

  addDeployment,
  removeDeployment,
  setDeploymentDate,

  addGoal,
  removeGoal,
  addListeningModel,
  removeListeningModel,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,

  getDeploymentsRequest,
  getDeploymentsError,
  setDeployments,
  getContentRequest,
  getContentError,
  setContent
}
