import { getDefaultState } from './index'

const resetState = (state) => {
  Object.assign(state, getDefaultState())
}

const setDirty = (state, status) => {
  state.dirty = status
}

const setProgramData = (state, payload) => {
  state.dirty = false
  state.status = 'success'
  state.programCode = payload.projectcode

  state.goals = payload.sustainable_development_goals
  state.listeningModels = payload.listening_models
  state.deploymentsAmount = payload.deployments_amount
  state.deploymentsLength = payload.deployments_length
  state.deploymentsFirst = payload.deployments_first
  state.feedbackFrequently = payload.feedback_frequency
  state.feedbackFrequentlyOther = payload.feedback_frequency_other
  state.languages = payload.languages
  state.amountOfLang = payload.languages.length
}

const setProgramCode = (state, payload) => {
  state.programCode = payload
}

const addGoal = (state, payload) => {
  state.goals.push(payload)
}

const removeGoal = (state, index) => {
  state.goals.splice(index, 1)
}

const addListeningModel = (state, payload) => {
  state.listeningModels.push(payload)
}

const removeListeningModel = (state, index) => {
  state.listeningModels.splice(index, 1)
}

const setDeploymentsAmount = (state, payload) => {
  state.deploymentsAmount = payload
}

const setDeploymentsLength = (state, payload) => {
  state.deploymentsLength = payload
}

const setDeploymentsFirst = (state, payload) => {
  state.deploymentsFirst = payload
}

const setLanguages = (state, payload) => {
  state.languages[payload.index] = payload.lang
}

const addLangInput = (state) => {
  state.amountOfLang++
}

const setFeedbackFrequently = (state, payload) => {
  state.feedbackFrequently = payload
}

const setFeedbackFrequentlyOther = (state, payload) => {
  state.feedbackFrequentlyOther = payload
}


export default {
  resetState,
  setDirty,
  setProgramData,

  setProgramCode,
  addGoal,
  removeGoal,
  addListeningModel,
  removeListeningModel,
  setDeploymentsAmount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setLanguages,
  addLangInput,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
}
