// import { postProgram } from '@/api/programs.api'

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
const setDeploymentsAmount = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentsAmount', payload)
  commit('setDirty', { tab: 'general', status: true })

  // Check if the step if completed
  const isComplete = (state.deployments.amount > -1) && (state.deployments.frequency !== '')
    && (state.deployments.first !== '') && (new Date(state.deployments.first) > new Date())
  if (isComplete) dispatch('addCompletedStep', 4)
  else dispatch('removeCompletedStep', 4)
}

const setDeploymentsFrequency = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentsFrequency', payload)

  // Check if the step if completed
  const isComplete = (state.deployments.amount > -1) && (state.deployments.frequency !== '')
    && (state.deployments.first !== '') && (new Date(state.deployments.first) > new Date())
  if (isComplete) dispatch('addCompletedStep', 4)
  else dispatch('removeCompletedStep', 4)
}

const setDeploymentsFirst = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentsFirst', payload)

  // Check if the step if completed
  const isComplete = (state.deployments.amount > -1) && (state.deployments.frequency !== '')
    && (state.deployments.first !== '') && (new Date(state.deployments.first) > new Date())
  if (isComplete) dispatch('addCompletedStep', 4)
  else dispatch('removeCompletedStep', 4)
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
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  addLangInput,
  createProgram,
  updateProgram
}
