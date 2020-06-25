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
  state.deployments.amount = payload
}

const setDeploymentsFrequency = (state, payload) => {
  state.deployments.frequency = payload
}

const setDeploymentsFirst = (state, payload) => {
  state.deployments.first = payload
}

const setDeploymentsDates = (state, payload) => {
  state.deployments.dates = payload
}

const addDeploymentsDate = (state, payload) => {
  state.deployments.dates.push(payload)
}

const setDeploymentsDate = (state, payload) => {
  const { index, what, date } = payload
  state.deployments.dates[index][what] = date
}

const removeDeploymentsDate = (state, payload) => {
  const { index } = payload
  state.deployments.dates.splice(index, 1)
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
  setProgramName,
  setLanguages,
  addLangInput,
  setDeploymentsAmount,
  setDeploymentsFrequency,
  setDeploymentsFirst,
  setDeploymentsDates,
  addDeploymentsDate,
  setDeploymentsDate,
  removeDeploymentsDate,
  addGoal,
  removeGoal,
  addListeningModel,
  removeListeningModel,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther
}
