// import { postProgram } from '@/api/programs.api'
import { getPrograms } from '@/api/programs.api'

/****************************************
  Steps
****************************************/
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

/****************************************
  Step 1
****************************************/
const setProgramName = ({ commit, dispatch }, payload) => {
  commit('setProgramName', payload)
  commit('setDirty', { tab: 'general', status: true })

  // Check if the step if completed
  if (payload) dispatch('addCompletedStep', 1)
  else dispatch('removeCompletedStep', 1)
}

/****************************************
  Step 2
****************************************/
const toggleGoal = ({ commit, state, dispatch }, goal) => {
  const index = state.content.goals.indexOf(goal)

  if (index > -1) commit('removeGoal', index)
  else commit('addGoal', goal)

  // Check if the step if completed
  if (state.content.goals.length > 0) dispatch('addCompletedStep', 2)
  else dispatch('removeCompletedStep', 2)
}

/****************************************
  Step 3
****************************************/
const toggleListening = ({ commit, state, dispatch }, model) => {
  const index = state.content.listeningModels.indexOf(model)

  if (index > -1) commit('removeListeningModel', index)
  else commit('addListeningModel', model)

  // Check if the step if completed
  if (state.content.listeningModels.length > 0) dispatch('addCompletedStep', 3)
  else dispatch('removeCompletedStep', 3)
}

/****************************************
  Step 4
****************************************/
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

const checkIfStepIsComplete = (amount, first, frequency, commit, dispatch) => {
  const isComplete = (amount > -1) && (frequency !== '')
    && (first !== '') && (new Date(first) > new Date())
  if (isComplete) {
    const dates = calculateDeploymentsDates(amount, first, frequency)
    commit('setDeploymentsDates', dates)
    dispatch('addCompletedStep', 4)
  } else {
    dispatch('removeCompletedStep', 4)
  }
}

const setDeploymentsAmount = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentsAmount', payload)

  const { amount, first, frequency } = state.deployments
  checkIfStepIsComplete(amount, first, frequency, commit, dispatch)
}

const setDeploymentsFrequency = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentsFrequency', payload)

  const { amount, first, frequency } = state.deployments
  checkIfStepIsComplete(amount, first, frequency, commit, dispatch)
}

const setDeploymentsFirst = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentsFirst', payload)

  const { amount, first, frequency } = state.deployments
  checkIfStepIsComplete(amount, first, frequency, commit, dispatch)
}

const addDeploymentsDate = ({ commit, state }) => {
  const { amount, frequency, dates } = state.deployments
  const increment = frequency === 'one_month' ? 1 :
    frequency === '1_quarter' ? 3 :
      frequency === 'six_months' ? 6 :
        frequency === 'one_year' ? 12 : 0

  const newDate = {}
  const lastDate = new Date(dates[dates.length - 1].end)
  newDate.start = lastDate.toISOString().split('T')[0]
  newDate.end = new Date(lastDate.setMonth(lastDate.getMonth() + increment)).toISOString().split('T')[0]

  commit('setDirty', { tab: 'deployments', status: true })
  commit('setDeploymentsAmount', parseInt(amount) + 1)
  commit('addDeploymentsDate', newDate)
}

const setDeploymentsDate = ({ commit }, payload) => {
  commit('setDirty', { tab: 'deployments', status: true })
  commit('setDeploymentsDate', payload)
}

const removeDeploymentsDate = ({ commit }, payload) => {
  commit('setDirty', { tab: 'deployments', status: true })
  commit('removeDeploymentsDate', payload)
}

/****************************************
  Step 5
****************************************/
const setFeedbackFrequently = async ({ commit, state, dispatch }, payload) => {
  await commit('setFeedbackFrequently', payload)

  // Check if the step if completed
  const isComplete = (state.general.feedbackFrequently !== '') && (state.general.feedbackFrequentlyOther !== '')
  if (isComplete) dispatch('addCompletedStep', 5)
  else dispatch('removeCompletedStep', 5)
}

const setFeedbackFrequentlyOther = async ({ commit, state, dispatch }, payload) => {
  await commit('setFeedbackFrequentlyOther', payload)

  // Check if the step if completed
  const isComplete = (state.general.feedbackFrequently !== '') && (state.general.feedbackFrequentlyOther !== '')
  if (isComplete) dispatch('addCompletedStep', 5)
  else dispatch('removeCompletedStep', 5)
}

/****************************************
  Step 6
****************************************/
const setLanguages = async ({ commit, state, dispatch }, payload) => {
  await commit('setLanguages', payload)
  commit('setDirty', { tab: 'general', status: true })

  // Check if the step if completed
  const fillValues = state.general.languages.filter(ele => ele !== '').length
  if (fillValues > 0) dispatch('addCompletedStep', 6)
  else dispatch('removeCompletedStep', 6)
}

const addLangInput = async ({ commit }) => {
  await commit('addLangInput')
}

/****************************************
  Step 7
****************************************/
const createProgram = async ({ commit, state }) => {
  const data = {
    name: state.general.programName,
    sustainable_development_goal: state.content.goals,
    listening_model: state.content.listeningModels,
    amount_deployment: state.deployments.amount,
    deployment_length: state.deployments.frequency,
    first_deployment: state.deployments.first,
    feedback_frequency: state.general.feedbackFrequently,
    feedback_frequency2: state.general.feedbackFrequentlyOther
  }

  commit('setDirty', { tab: 'general', status: false })
  commit('setDirty', { tab: 'deployments', status: false })
  commit('setDirty', { tab: 'content', status: false })
  commit('completedSetup')

  console.log(data)
  // try {
  //   const response = await postProgram(data)
  //   console.log(response)
  // } catch (error) {
  //   console.log(error)
  // }
}

const updateProgram = async ({ commit }, payload) => {
  const { tab } = payload
  commit('getProgramRequest')

  return new Promise((resolve) => {
    setTimeout(() => {
      commit('getProgramSuccess')
      commit('setDirty', { tab, status: false })
      resolve('ok')
    }, 3000)
  })
}

const getAllPrograms = async ({ commit }) => {
  const allPrograms = await getPrograms()
  await commit('setAllPrograms', allPrograms)

  if (allPrograms.length === 1) {
    await commit('setSelectedProgram', allPrograms[0].name)
  }
}

export default {
  setStep,
  nextStep,
  prevStep,
  addCompletedStep,
  removeCompletedStep,
  setProgramName,
  toggleGoal,
  toggleListening,
  setDeploymentsAmount,
  setDeploymentsFrequency,
  setDeploymentsFirst,
  addDeploymentsDate,
  setDeploymentsDate,
  removeDeploymentsDate,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  addLangInput,
  createProgram,
  updateProgram,
  getAllPrograms
}
