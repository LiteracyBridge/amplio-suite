const setStep = ({ commit }, payload) => {
  commit('setStep', payload)
}

const nextStep = ({ commit }) => {
  commit('nextStep')
}

const prevStep = ({ commit }) => {
  commit('prevStep')
}

const addCompletedStep = ({ commit, state }, payload) => {
  const index = state.completedSteps.indexOf(payload)
  if (index === -1) commit('addCompletedStep', payload)
}

const removeCompletedStep = ({ commit, state }, payload) => {
  const index = state.completedSteps.indexOf(payload)
  if (index > -1) commit('removeCompletedStep', index)
}

const setIsCompleted = ({ commit }) => {
  commit('setIsCompleted')
}

// Helper
const check = async (attrs, step, dispatch) => {
  const result = await dispatch('programData/isCompleted', attrs, { root: true } )
  if (result) dispatch('addCompletedStep', step)
  else dispatch('removeCompletedStep', step)
}

// step-program-name
const setProgramName = async ({ dispatch }, payload) => {
  const { name, step } = payload
  await dispatch('program/setProgramName', name, { root: true })
  await check('programName', step, dispatch)
}

// step-geo
const setCountry = async ({ dispatch }, payload) => {
  const { country, step } = payload
  const attrs = ['country', 'region']

  await dispatch('programData/setCountry', country, { root: true })
  await check(attrs, step, dispatch)
}

const addRegion = async ({ dispatch }, payload) => {
  const { region, step } = payload
  const attrs = ['country', 'region']

  await dispatch('programData/addRegion', region, { root: true })
  await check(attrs, step, dispatch)
}

const removeRegion = async ({ dispatch }, payload) => {
  const { region, step } = payload
  const attrs = ['country', 'region']

  await dispatch('programData/removeRegion', region, { root: true })
  await check(attrs, step, dispatch)
}

// step-sdg
const toggleGoal = async ({ dispatch }, payload) => {
  const { goal, step } = payload
  await dispatch('programData/toggleGoal', goal, { root: true })
  await check('goals', step, dispatch)
}

// steep-listening-models
const toggleListening = async ({ dispatch }, payload) => {
  const { listeningMode, step } = payload
  await dispatch('programData/toggleListening', listeningMode, { root: true })
  await check('listeningModels', step, dispatch)
}

// step-deployments
const setDeploymentsCount = async ({ dispatch }, payload) => {
  const { count, step } = payload
  const attrs = ['deploymentsAmount', 'deploymentsLength', 'deploymentsFirst']

  await dispatch('programData/setDeploymentsCount', count, { root: true })
  await check(attrs, step, dispatch)
}

const setDeploymentsLength = async ({ dispatch }, payload) => {
  const { length, step } = payload
  const attrs = ['deploymentsAmount', 'deploymentsLength', 'deploymentsFirst']

  await dispatch('programData/setDeploymentsLength', length, { root: true })
  await check(attrs, step, dispatch)
}

const setDeploymentsFirst = async ({ dispatch }, payload) => {
  const { first, step } = payload
  const attrs = ['deploymentsAmount', 'deploymentsLength', 'deploymentsFirst']

  await dispatch('programData/setDeploymentsFirst', first, { root: true })
  await check(attrs, step, dispatch)
}

// step-feedback
const setFeedbackFrequently = async ({ dispatch }, payload) => {
  const { frequently, step } = payload
  const attrs = ['feedbackFrequently', 'feedbackFrequentlyOther']

  await dispatch('programData/setFeedbackFrequently', frequently, { root: true })
  await check(attrs, step, dispatch)
}

const setFeedbackFrequentlyOther = async ({ dispatch }, payload) => {
  const { frequently, step } = payload
  const attrs = ['feedbackFrequently', 'feedbackFrequentlyOther']

  await dispatch('programData/setFeedbackFrequentlyOther', frequently, { root: true })
  await check(attrs, step, dispatch)
}

// step-languages
const setLanguages = async ({ dispatch }, payload) => {
  const { lang, index, step } = payload
  await dispatch('programData/setLanguages', { lang, index }, { root: true })
  await check('languages', step, dispatch)
}

const deleteLanguage = async ({ dispatch }, payload) => {
  const { lang, step } = payload
  await dispatch('programData/deleteLanguage', lang, { root: true })
  await check('languages', step, dispatch)
}

export default {
  setStep,
  nextStep,
  prevStep,
  addCompletedStep,
  removeCompletedStep,
  setIsCompleted,

  setProgramName,
  setCountry,
  addRegion,
  removeRegion,
  toggleGoal,
  toggleListening,
  setDeploymentsCount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  deleteLanguage,
}
