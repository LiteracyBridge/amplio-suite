import { postProgram } from '@/api/programs.api'

// Helper
const calculateDeploymentsDates = (state) => {
  const { amount, first, frequency } = state.deployments

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

const isCompleted = ({ state }, payload) => {
  const isFill = (attr) => {
    let partial

    switch (attr) {
      case 'programName':
        partial = state.general.programName !== ''
        break
      case 'goals':
      case 'listeningModels':
        partial = state.content[attr].length > 0
        break
      case 'deploymentsAmount':
        partial = state.deployments.amount > 0
        break
      case 'deploymentsFrequency':
        partial = state.deployments.frequency !== ''
        break
      case 'deploymentsFirst':
        partial = new Date(state.deployments.first) > new Date()
        break
      case 'feedbackFrequently':
      case 'feedbackFrequentlyOther':
        partial = state.general[attr] !== ''
        break
      case 'languages':
        partial = state.general.languages.filter(ele => ele !== '').length > 0
        break
      default:
        break
    }

    return partial
  }

  if (!Array.isArray(payload)) payload = [payload]

  const result = payload.map(attr => isFill(attr))
  return result.every(Boolean)
}

const setCodeName = async ({ commit }, name) => {
  commit('resetState')
  commit('wizard/resetState', {}, { root: true })

  const id = name.replace(/ /g, '-').toLocaleLowerCase()
  commit('setCodeName', { name, id})

  return id
}

const setProgramName = ({ commit }, payload) => {
  commit('setProgramName', payload.replace(/\s+/g,' ').trim())
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

const setDeploymentsAmount = async ({ state, commit, dispatch }, payload) => {
  await commit('setDeploymentsAmount', payload)

  const attrs = ['deploymentsAmount', 'deploymentsFrequency', 'deploymentsFirst']
  const result = await dispatch('isCompleted', attrs)
  if (result) {
    const dates = calculateDeploymentsDates(state)
    commit('setDeploymentsDates', dates)
  }
}

const setDeploymentsFrequency = async ({ state, commit, dispatch }, payload) => {
  await commit('setDeploymentsFrequency', payload)

  const attrs = ['deploymentsAmount', 'deploymentsFrequency', 'deploymentsFirst']
  const result = await dispatch('isCompleted', attrs)
  if (result) {
    const dates = calculateDeploymentsDates(state)
    commit('setDeploymentsDates', dates)
  }
}

const setDeploymentsFirst = async ({ state, commit, dispatch }, payload) => {
  await commit('setDeploymentsFirst', payload)

  const attrs = ['deploymentsAmount', 'deploymentsFrequency', 'deploymentsFirst']
  const result = await dispatch('isCompleted', attrs)
  if (result) {
    const dates = calculateDeploymentsDates(state)
    commit('setDeploymentsDates', dates)
  }
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

  try {
    await postProgram(data)
  } catch (error) {
    console.log(error)
  }
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
  isCompleted,
  setCodeName,
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
