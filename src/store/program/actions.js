import { postProgram, getProgram } from '@/api/programs.api'
import { getDeployments } from '@/api/deployment.api'
import { getContent } from '@/api/content.api'
import { postProgramNewDeployment } from '@/api/programs.api'


const isCompleted = ({ state }, payload) => {
  const isFill = (attr) => {
    let partial

    switch (attr) {
      case 'programName':
        partial = state.general.programName !== ''
        break
      case 'goals':
      case 'listeningModels':
        partial = state.projectData.data[attr].length > 0
        break
      case 'deploymentsAmount':
        partial = state.deploymentsConfig.amount > 0
        break
      case 'deploymentsFrequency':
        partial = state.deploymentsConfig.frequency !== ''
        break
      case 'deploymentsFirst':
        partial = new Date(state.deploymentsConfig.first) > new Date()
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

const setCodeName = async ({ commit }, programCode) => {
  commit('resetState')
  commit('wizard/resetState', {}, { root: true })
  commit('setCodeName', { name: programCode, id: programCode})

  return programCode
}

const setProgramName = ({ commit }, payload) => {
  commit('setProgramName', payload.replace(/\s+/g,' ').trim())
  commit('setDirty', { tab: 'general', status: true })
}

const toggleGoal = ({ commit, state }, goal) => {
  const index = state.projectData.data.goals.indexOf(goal)

  if (index > -1) commit('removeGoal', index)
  else commit('addGoal', goal)
}

const toggleListening = ({ commit, state }, model) => {
  const index = state.projectData.data.listeningModels.indexOf(model)

  if (index > -1) commit('removeListeningModel', index)
  else commit('addListeningModel', model)
}

const setDeploymentsAmount = async ({ commit }, payload) => {
  await commit('setDeploymentsAmount', payload)
  commit('setDirty', { tab: 'deploymentsConfig', status: true })
}

const setDeploymentsFrequency = async ({ commit }, payload) => {
  await commit('setDeploymentsFrequency', payload)
  commit('setDirty', { tab: 'deploymentsConfig', status: true })
}

const setDeploymentsFirst = async ({ commit }, payload) => {
  await commit('setDeploymentsFirst', payload)
  commit('setDirty', { tab: 'deploymentsConfig', status: true })
}

const addDeployment = async ({ state, dispatch }) => {
  await postProgramNewDeployment({ program_code: state.codeName })
  await dispatch('fetchDeployments')
}

const removeDeployment = ({ commit, state }, payload) => {
  const items = state.deployments.items
    .map((item, index) => ({ id: item.id, index }))
    .filter(item => item.id === payload.id)

  if (items.length > 0) {
    commit('setDirty', { tab: 'deployments', status: true })
    commit('removeDeployment', { index: items[0].index })
  }
}

const setDeploymentDate = ({ commit, state }, payload) => {
  const items = state.deployments.items
    .map((item, index) => ({ deploymentname: item.deploymentname, index }))
    .filter(item => item.deploymentname === payload.id)

  if (items.length > 0) {
    commit('setDirty', { tab: 'deployments', status: true })
    commit('setDeploymentDate', { ...payload, index: items[0].index })
  }
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
    project: state.codeName,
    sustainable_development_goal: state.projectData.data.goals,
    listening_model: state.projectData.data.listeningModels,
    amount_deployment: +state.deploymentsConfig.amount,
    deployment_length: state.deploymentsConfig.frequency,
    first_deployment: state.deploymentsConfig.first,
    feedback_frequency: state.general.feedbackFrequently,
    feedback_frequency2: state.general.feedbackFrequentlyOther
  }

  commit('setDirty', { tab: 'general', status: false })
  commit('setDirty', { tab: 'deployments', status: false })
  commit('setDirty', { tab: 'content', status: false })

  try {
    await postProgram(data)
  } catch (error) {
    commit('notification/alert', error, { root: true })
  }
}

const fetchProgram = async ({ state, commit }) => {
  if (state.general.projectCode === state.codeName && !state.general.dirty) {
    return
  }

  commit('getProgramRequest')

  try {
    const program = await getProgram()
    commit('setProgram', program)

    commit('wizard/setIsCompleted', null, { root: true })
  } catch (error) {
    commit('getProgramError')
    commit('notification/alert', error.toString(), { root: true })
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

const discardChanges = async ({ dispatch }, tab) => {
  if (tab === 'general')  await dispatch('fetchProgram')
  else if (tab === 'deployments') await dispatch('fetchDeployments')
  else if (tab === 'content') await dispatch('fetchContent')
}


const fetchDeployments = async ({ state, commit }) => {
  if (state.deployments.projectCode === state.codeName && !state.deployments.dirty) {
    return
  }

  commit('getDeploymentsRequest')

  try {
    const response = await getDeployments()
    commit('setDeployments', response)
  } catch (error) {
    commit('getDeploymentError')
    commit('notification/alert', error.toString(), { root: true })
  }
}

const fetchContent = async ({ state, commit }) => {
  if (state.content.projectCode === state.codeName && !state.content.dirty) {
    return
  }

  commit('getContentRequest')

  try {
    const response = await getContent()
    commit('setContent', response)
  } catch (error) {
    commit('getContentError')
    commit('notification/alert', error.toString(), { root: true })
  }
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

  addDeployment,
  removeDeployment,
  setDeploymentDate,

  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  addLangInput,
  createProgram,
  fetchProgram,
  updateProgram,

  discardChanges,
  fetchDeployments,
  fetchContent
}
