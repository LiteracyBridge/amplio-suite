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
const check = async (section, step, dispatch) => {
  const result = await dispatch('program/isCompleted', section, { root: true } )
  if (result) dispatch('addCompletedStep', step)
  else dispatch('removeCompletedStep', step)
}

// Step 1
const setProgramName = async ({ dispatch }, payload) => {
  await dispatch('program/setProgramName', payload, { root: true })

  await check('programName', 1, dispatch)
}

// Step 2
const toggleGoal = async ({ dispatch }, goal) => {
  await dispatch('program/toggleGoal', goal, { root: true })

  await check('goals', 2, dispatch)
}

// Step 3
const toggleListening = async ({ dispatch }, model) => {
  await dispatch('program/toggleListening', model, { root: true })

  await check('listeningModels', 3, dispatch)
}

// Step 4
const setDeploymentsAmount = async ({ dispatch }, payload) => {
  await dispatch('program/setDeploymentsAmount', payload, { root: true })

  await check('deployments', 4, dispatch)
}

const setDeploymentsFrequency = async ({ dispatch }, payload) => {
  await dispatch('program/setDeploymentsFrequency', payload, { root: true })

  await check('deployments', 4, dispatch)
}

const setDeploymentsFirst = async ({ dispatch }, payload) => {
  await dispatch('program/setDeploymentsFirst', payload, { root: true })

  await check('deployments', 4, dispatch)
}

// Step 5
const setFeedbackFrequently = async ({ dispatch }, payload) => {
  await dispatch('program/setFeedbackFrequently', payload, { root: true })

  await check('feedback', 5, dispatch)
}

const setFeedbackFrequentlyOther = async ({ dispatch }, payload) => {
  await dispatch('program/setFeedbackFrequentlyOther', payload, { root: true })

  await check('feedback', 5, dispatch)
}

// Step 6
const setLanguages = async ({ dispatch }, payload) => {
  await dispatch('program/setLanguages', payload, { root: true })

  await check('languages', 6, dispatch)
}

export default {
  setStep,
  nextStep,
  prevStep,
  addCompletedStep,
  removeCompletedStep,
  setIsCompleted,

  setProgramName,
  toggleGoal,
  toggleListening,
  setDeploymentsAmount,
  setDeploymentsFrequency,
  setDeploymentsFirst,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages
}
