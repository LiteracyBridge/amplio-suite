// import { postProgram } from '@/api/programs.api'

const setProgramName = ({ commit }, payload) => {
  commit('setProgramName', payload)
  commit('setDirty', { tab: 'general', status: true })
}

const toggleGoal = ({ commit, state }, goal) => {
  const index = state.content.goals.indexOf(goal)

  if (index > -1) commit('removeGoal', index)
  else commit('addGoal', goal)
}

const toggleListening = ({ commit, state }, model) => {
  const index = state.content.listeningModels.indexOf(model)

  if (index > -1) commit('removeListeningModel', index)
  else commit('addListeningModel', model)
}

const setDeploymentsAmount = async ({ commit }, payload) => {
  await commit('setDeploymentsAmount', payload)
}

const setDeploymentsFrequency = async ({ commit }, payload) => {
  await commit('setDeploymentsFrequency', payload)
}

const setDeploymentsFirst = async ({ commit }, payload) => {
  await commit('setDeploymentsFirst', payload)
}

const setDeploymentsDate = ({ commit }, payload) => {
  commit('setDirty', { tab: 'deployments', status: true })
  commit('setDeploymentsDate', payload)
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

const removeDeploymentsDate = ({ commit }, payload) => {
  commit('setDirty', { tab: 'deployments', status: true })
  commit('removeDeploymentsDate', payload)
}

const setFeedbackFrequently = async ({ commit }, payload) => {
  await commit('setFeedbackFrequently', payload)
}

const setFeedbackFrequentlyOther = async ({ commit }, payload) => {
  await commit('setFeedbackFrequentlyOther', payload)
}

const setLanguages = async ({ commit }, payload) => {
  await commit('setLanguages', payload)
  commit('setDirty', { tab: 'general', status: true })
}

const addLangInput = async ({ commit }) => {
  await commit('addLangInput')
}

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
  updateProgram
}
