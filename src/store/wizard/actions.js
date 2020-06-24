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

// Step 1
const setProgramName = ({ dispatch }, payload) => {
  dispatch('program/setProgramName', payload, { root: true })

  // Check if the step if completed
  if (payload) dispatch('addCompletedStep', 1)
  else dispatch('removeCompletedStep', 1)
}

// Step 2
const toggleGoal = async ({ rootState, dispatch }, goal) => {
  await dispatch('program/toggleGoal', goal, { root: true })

  // Check if the step if completed
  if (rootState.program.content.goals.length > 0) dispatch('addCompletedStep', 2)
  else dispatch('removeCompletedStep', 2)
}

// Step 3
const toggleListening = async ({ rootState, dispatch }, model) => {
  await dispatch('program/toggleListening', model, { root: true })

  // Check if the step if completed
  if (rootState.program.content.listeningModels.length > 0) dispatch('addCompletedStep', 3)
  else dispatch('removeCompletedStep', 3)
}

// Step 4
const calculateDeploymentsDates = (amount, first, frequency) => {
  const increment = frequency === 'one_month' ? 1 :
    frequency === '1_quarter' ? 3 :
      frequency === 'six_months' ? 6 :
        frequency === 'one_year' ? 12 : 0

  const dates = []
  for (let i=0; i<amount; i++) {
    dates.push({ start: '', end: '' })
  }
  dates[0].start = first

  for (let i=1; i<amount; i++) {
    const prev = new Date(dates[i - 1].start)
    const next = new Date(prev.setMonth(prev.getMonth() + increment))
    dates[i].start = next.toISOString().split('T')[0]
  }

  for (let i=0; i<amount; i++) {
    const start = new Date(dates[i].start)
    const end = new Date(start.setMonth(start.getMonth() + increment))
    dates[i].end = end.toISOString().split('T')[0]
  }

  return dates
}

const checkIfStepIsComplete = (rootState, commit, dispatch) => {
  const { amount, first, frequency } = rootState.program.deployments
  const isComplete = (amount > -1) && (frequency !== '')
    && (first !== '') && (new Date(first) > new Date())

  if (isComplete) {
    const dates = calculateDeploymentsDates(amount, first, frequency)
    commit('program/setDeploymentsDates', dates, { root: true })
    dispatch('addCompletedStep', 4)
  } else {
    dispatch('removeCompletedStep', 4)
  }
}

const setDeploymentsAmount = async ({ rootState, commit, dispatch }, payload) => {
  await dispatch('program/setDeploymentsAmount', payload, { root: true })

  checkIfStepIsComplete(rootState, commit, dispatch)
}

const setDeploymentsFrequency = async ({ rootState, commit, dispatch }, payload) => {
  await dispatch('program/setDeploymentsFrequency', payload, { root: true })

  checkIfStepIsComplete(rootState, commit, dispatch)
}

const setDeploymentsFirst = async ({ rootState, commit, dispatch }, payload) => {
  await dispatch('program/setDeploymentsFirst', payload, { root: true })

  checkIfStepIsComplete(rootState, commit, dispatch)
}

// Step 5
const setFeedbackFrequently = async ({ rootState, dispatch }, payload) => {
  await dispatch('program/setFeedbackFrequently', payload, { root: true })

  // Check if the step if completed
  const { feedbackFrequently, feedbackFrequentlyOther } = rootState.program.general
  const isComplete = (feedbackFrequently !== '') && (feedbackFrequentlyOther !== '')
  if (isComplete) dispatch('addCompletedStep', 5)
  else dispatch('removeCompletedStep', 5)
}

const setFeedbackFrequentlyOther = async ({ rootState, dispatch }, payload) => {
  await dispatch('program/setFeedbackFrequentlyOther', payload, { root: true })

  // Check if the step if completed
  const { feedbackFrequently, feedbackFrequentlyOther } = rootState.program.general
  const isComplete = (feedbackFrequently !== '') && (feedbackFrequentlyOther !== '')
  if (isComplete) dispatch('addCompletedStep', 5)
  else dispatch('removeCompletedStep', 5)
}

// Step 6
const setLanguages = async ({ rootState, dispatch }, payload) => {
  await dispatch('program/setLanguages', payload, { root: true })

  // Check if the step if completed
  const fillValues = rootState.program.general.languages.filter(ele => ele !== '').length
  if (fillValues > 0) dispatch('addCompletedStep', 6)
  else dispatch('removeCompletedStep', 6)
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
