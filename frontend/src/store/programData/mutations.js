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
  state.programId = payload.program_code || payload.program_id

  state.country = payload.country
  state.region = payload.region
  state.goals = payload.sustainable_development_goals
  state.listeningModels = payload.listening_models
  state.deploymentsCount = payload.deployments_count
  state.deploymentsLength = payload.deployments_length
  state.deploymentsFirst = payload.deployments_first
  state.feedbackFrequently = payload.feedback_frequency
  state.languages = payload.languages
  state.partner = payload.partner,
  state.affiliate = payload.affiliate,
  state.directBeneficiariesMap = payload.direct_beneficiaries_map
  state.directBeneficiariesAdditionalMap = payload.direct_beneficiaries_additional_map
}

const setprogramId = (state, payload) => {
  state.programId = payload
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

const setDeploymentsCount = (state, payload) => {
  state.deploymentsCount = payload
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

const setPartner = (state, payload) => {
  state.partner = payload
}

const setAffiliate = (state, payload) => {
  state.affiliate = payload
}

const setDirectBeneficiariesLabel = (state, payload) => {
  const { key, value } = payload
  state.directBeneficiariesMap[key] = value
}

const setDirectBeneficiariesAdditionalLabel = (state, payload) => {
  const { key, value } = payload
  const map = { ...state.directBeneficiariesAdditionalMap }
  map[key] = value

  state.directBeneficiariesAdditionalMap = map
}

const deleteDirectBeneficiariesAdditionalLabel = (state, labelKey) => {
  const beneficiaries = { ...state.directBeneficiariesAdditionalMap }
  const index = Object.keys(beneficiaries)
    .findIndex(key => key === labelKey)

  if (index >= 0) {
    delete beneficiaries[labelKey]
    state.directBeneficiariesAdditionalMap = beneficiaries
  }
}


export default {
  resetState,
  setDirty,
  setProgramData,

  setprogramId,
  addRegion,
  removeRegion,
  setCountry,
  addGoal,
  removeGoal,
  addListeningModel,
  removeListeningModel,
  setDeploymentsCount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setLanguages,
  deleteLanguage,
  setFeedbackFrequently,
  setPartner,
  setAffiliate,

  setDirectBeneficiariesLabel,
  setDirectBeneficiariesAdditionalLabel,
  deleteDirectBeneficiariesAdditionalLabel,
}
