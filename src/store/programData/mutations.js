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

  state.country = payload.country
  state.region = payload.region
  state.goals = payload.sustainable_development_goals
  state.listeningModels = payload.listening_models
  state.deploymentsAmount = payload.deployments_amount
  state.deploymentsLength = payload.deployments_length
  state.deploymentsFirst = payload.deployments_first
  state.feedbackFrequently = payload.feedback_frequency
  state.feedbackFrequentlyOther = payload.feedback_frequency_other
  state.languages = payload.languages
}

const setProgramCode = (state, payload) => {
  state.programCode = payload
}

const setCountry = (state, payload) => {
  state.country = payload
}

const addRegion = (state, region) => {
  state.region = [...state.region, region]
}

const removeRegion = (state, region) => {
  const index = state.region.indexOf(region)
  if (index > -1) state.region.splice(index, 1)
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
  const languages = [...state.languages]
  languages[payload.index] = payload.lang
  state.languages = languages
}

const deleteLanguage = (state, language) => {
  state.languages = state.languages.filter(lang => lang != language)
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
  addRegion,
  removeRegion,
  setCountry,
  addGoal,
  removeGoal,
  addListeningModel,
  removeListeningModel,
  setDeploymentsAmount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setLanguages,
  deleteLanguage,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
}
