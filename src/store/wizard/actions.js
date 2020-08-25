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

// Step 1
const setProgramName = async ({ dispatch }, payload) => {
  await dispatch('program/setProgramName', payload, { root: true })

  await check('programName', 1, dispatch)
}

// Step 2
const setCountry = async ({ dispatch }, payload) => {
  await dispatch('programData/setCountry', payload, { root: true })

  const attrs = ['country', 'region']
  await check(attrs, 2, dispatch)
}

const setRegion = async ({ dispatch }, payload) => {
  await dispatch('programData/setRegion', payload, { root: true })

  const attrs = ['country', 'region']
  await check(attrs, 2, dispatch)
}

// Step 3
const toggleGoal = async ({ dispatch }, goal) => {
  await dispatch('programData/toggleGoal', goal, { root: true })

  await check('goals', 3, dispatch)
}

// Step 4
const toggleListening = async ({ dispatch }, model) => {
  await dispatch('programData/toggleListening', model, { root: true })

  await check('listeningModels', 4, dispatch)
}

// Step 5
const setDeploymentsAmount = async ({ dispatch }, payload) => {
  await dispatch('programData/setDeploymentsAmount', payload, { root: true })

  const attrs = ['deploymentsAmount', 'deploymentsLength', 'deploymentsFirst']
  await check(attrs, 5, dispatch)
}

const setDeploymentsLength = async ({ dispatch }, payload) => {
  await dispatch('programData/setDeploymentsLength', payload, { root: true })

  const attrs = ['deploymentsAmount', 'deploymentsLength', 'deploymentsFirst']
  await check(attrs, 5, dispatch)
}

const setDeploymentsFirst = async ({ dispatch }, payload) => {
  await dispatch('programData/setDeploymentsFirst', payload, { root: true })

  const attrs = ['deploymentsAmount', 'deploymentsLength', 'deploymentsFirst']
  await check(attrs, 5, dispatch)
}

// Step 6
const setFeedbackFrequently = async ({ dispatch }, payload) => {
  await dispatch('programData/setFeedbackFrequently', payload, { root: true })

  const attrs = ['feedbackFrequently', 'feedbackFrequentlyOther']
  await check(attrs, 6, dispatch)
}

const setFeedbackFrequentlyOther = async ({ dispatch }, payload) => {
  await dispatch('programData/setFeedbackFrequentlyOther', payload, { root: true })

  const attrs = ['feedbackFrequently', 'feedbackFrequentlyOther']
  await check(attrs, 6, dispatch)
}

// Step 7
const setLanguages = async ({ dispatch }, payload) => {
  await dispatch('programData/setLanguages', payload, { root: true })

  await check('languages', 7, dispatch)
}

const deleteLanguage = async ({ dispatch }, languageCode) => {
  await dispatch('programData/deleteLanguage', languageCode, { root: true })
  await check('languages', 7, dispatch)
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
  setRegion,
  toggleGoal,
  toggleListening,
  setDeploymentsAmount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  deleteLanguage,
}
