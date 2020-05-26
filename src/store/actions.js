import { postProgram } from '@/api/programs.api'

// General actions from the wizard
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

// Step 1
const setProgramName = ({ commit, dispatch }, payload) => {
  commit('setProgramName', payload)

  // Check if the step if completed
  if (payload) dispatch('addCompletedStep', 1)
  else dispatch('removeCompletedStep', 1)
}

// Step 2
const toggleGoal = ({ commit, state, dispatch }, goal) => {
  const index = state.goals.indexOf(goal)

  if (index > -1) commit('removeGoal', index)
  else commit('addGoal', goal)

  // Check if the step if completed
  if (state.goals.length > 0) dispatch('addCompletedStep', 2)
  else dispatch('removeCompletedStep', 2)
}

// Step 3
const toggleListening = ({ commit, state, dispatch }, model) => {
  const index = state.listeningModels.indexOf(model)

  if (index > -1) commit('removeListeningModel', index)
  else commit('addListeningModel', model)

  // Check if the step if completed
  if (state.listeningModels.length > 0) dispatch('addCompletedStep', 3)
  else dispatch('removeCompletedStep', 3)
}

// Step 4
const setDeployments = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeployments', payload)

  // Check if the step if completed
  const isComplete = (state.deployments > -1) && (state.deploymentFrequency !== '') && (state.deploymentInit !== '')
  if (isComplete) dispatch('addCompletedStep', 4)
  else dispatch('removeCompletedStep', 4)
}

const setDeploymentFrequency = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentFrequency', payload)

  // Check if the step if completed
  const isComplete = (state.deployments > -1) && (state.deploymentFrequency !== '') && (state.deploymentInit !== '')
  if (isComplete) dispatch('addCompletedStep', 4)
  else dispatch('removeCompletedStep', 4)
}

const setDeploymentInit = async ({ commit, state, dispatch }, payload) => {
  await commit('setDeploymentInit', payload)

  // Check if the step if completed
  const isComplete = (state.deployments > -1) && (state.deploymentFrequency !== '') && (state.deploymentInit !== '')
  if (isComplete) dispatch('addCompletedStep', 4)
  else dispatch('removeCompletedStep', 4)
}

// Step 5
const setFeedbackFrequently = async ({ commit, state, dispatch }, payload) => {
  await commit('setFeedbackFrequently', payload)

  // Check if the step if completed
  const isComplete = (state.feedbackFrequently !== '') && (state.feedbackFrequentlyOther !== '')
  if (isComplete) dispatch('addCompletedStep', 5)
  else dispatch('removeCompletedStep', 5)
}

const setFeedbackFrequentlyOther = async ({ commit, state, dispatch }, payload) => {
  await commit('setFeedbackFrequentlyOther', payload)

  // Check if the step if completed
  const isComplete = (state.feedbackFrequently !== '') && (state.feedbackFrequentlyOther !== '')
  if (isComplete) dispatch('addCompletedStep', 5)
  else dispatch('removeCompletedStep', 5)
}

// Step 6
const setLanguages = async ({ commit, state, dispatch }, payload) => {
  await commit('setLanguages', payload)

  // Check if the step if completed
  const fillValues = state.languages.filter(ele => ele !== '').length
  if (fillValues > 0) dispatch('addCompletedStep', 6)
  else dispatch('removeCompletedStep', 6)
}

//
const createProgram = async ({ state }) => {
  const data = {
    name: state.programName,
    sustainable_development_goal: state.goals,
    listening_model: state.listeningModels,
    amount_deployment: state.deployments,
    deployment_length: state.deploymentFrequency,
    first_deployment: state.deploymentInit,
    feedback_frequency: state.feedbackFrequently,
    feedback_frequency2: state.feedbackFrequentlyOther
  }

  try {
    const response = await postProgram(data)
    console.log(response)
  } catch (error) {
    console.log(error)
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
  setDeployments,
  setDeploymentFrequency,
  setDeploymentInit,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  createProgram
}
