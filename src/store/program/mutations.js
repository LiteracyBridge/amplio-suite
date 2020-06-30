import { getDefaultState } from './index'

// eslint-disable-next-line no-unused-vars
const resetState = (state) => {
  state = Object.assign(state, getDefaultState())
}

const setDirty = (state, payload) => {
  const { tab, status } = payload
  state[tab].dirty = status
}

const setCodeName = (state, payload) => {
  state.codeName = payload.name
  state.codeNameId = payload.id
}

const getProgramRequest = (state) => {
  state.status = 'loading'
}

const getProgramSuccess = (state) => {
  state.status = 'success'
}

const getProgramError = (state) => {
  state.status = 'error'
}

const setProgram = (state, program) => {
  // FIXME: set every relevant value
  state.general.programName = program.name
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

const setAllDeployments = (state, payload) => {
  state.deployments.data = payload
}

const addDeployment = (state, payload) => {
  state.deployments.data.push(payload)
}

const removeDeployment = (state, payload) => {
  const { index } = payload
  state.deployments.data.splice(index, 1)
}

const setDeploymentDate = (state, payload) => {
  const { index, what, date } = payload
  state.deployments.data[index].date[what] = date
}

/****************************************
  Content
****************************************/
const addGoal = (state, payload) => {
  state.content.goals.push(payload)
}

const removeGoal = (state, index) => {
  state.content.goals.splice(index, 1)
}

const addListeningModel = (state, payload) => {
  state.content.listeningModels.push(payload)
}

const removeListeningModel = (state, index) => {
  state.content.listeningModels.splice(index, 1)
}

export default {
  resetState,
  setDirty,
  setCodeName,
  getProgramRequest,
  getProgramSuccess,
  getProgramError,
  setProgram,
  setProgramName,
  setLanguages,
  addLangInput,
  setDeploymentsAmount,
  setDeploymentsFrequency,
  setDeploymentsFirst,

  setAllDeployments,
  addDeployment,
  removeDeployment,
  setDeploymentDate,

  addGoal,
  removeGoal,
  addListeningModel,
  removeListeningModel,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther
}
