import { postProgram, putProgram } from '@/api/programs.api'
import { getDeployments, putDeployments, deleteDeployment } from '@/api/deployment.api'
import { getContent, contentAddPlaylist, contentAddPMessage } from '@/api/content.api'
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
        partial = state.programData.data[attr].length > 0
        break
      case 'deploymentsAmount':
        partial = state.deploymentsConfig.amount > 0
        break
      case 'deploymentsLength':
        partial = state.deploymentsConfig.length !== ''
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

const setProgramName = ({ commit }, payload) => {
  commit('setProgramName', payload.replace(/\s+/g,' ').trim())
  commit('setDirty', { tab: 'general', status: true })
}

const toggleGoal = ({ commit, state }, goal) => {
  const index = state.programData.data.goals.indexOf(goal)

  if (index > -1) commit('removeGoal', index)
  else commit('addGoal', goal)
}

const toggleListening = ({ commit, state }, model) => {
  const index = state.programData.data.listeningModels.indexOf(model)

  if (index > -1) commit('removeListeningModel', index)
  else commit('addListeningModel', model)
}

const setDeploymentsAmount = async ({ commit }, payload) => {
  await commit('setDeploymentsAmount', payload)
  commit('setDirty', { tab: 'deploymentsConfig', status: true })
}

const setDeploymentsLength = async ({ commit }, payload) => {
  await commit('setDeploymentsLength', payload)
  commit('setDirty', { tab: 'deploymentsConfig', status: true })
}

const setDeploymentsFirst = async ({ commit }, payload) => {
  await commit('setDeploymentsFirst', payload)
  commit('setDirty', { tab: 'deploymentsConfig', status: true })
}

// const removeDeployment = ({ commit, state }, payload) => {
//   const items = state.deployments.items
//     .map((item, index) => ({ id: item.id, index }))
//     .filter(item => item.id === payload.id)

//   if (items.length > 0) {
//     commit('setDirty', { tab: 'deployments', status: true })
//     commit('removeDeployment', { index: items[0].index })
//   }
// }

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

const createProgram = async ({ commit, state }, programCode) => {
  const data = {
    programCode,
    name: state.general.programName,
    sdg_goals: state.programData.data.goals,
    listening_models: state.programData.data.listeningModels,
    deployments_length: state.deploymentsConfig.length,
    deployments_amount: +state.deploymentsConfig.amount,
    deployments_first: state.deploymentsConfig.first,
    feedback_frequency: state.general.feedbackFrequently,
    feedback_frequency_other: state.general.feedbackFrequentlyOther,
    languages: state.general.languages,
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

const updateProgram = async ({ state, commit }) => {
  const { projectCode, programName } = state.general

  try {
    await putProgram({ program_code: projectCode, name: programName })
    commit('setDirty', { tab: 'general', status: false })
  } catch (error) {
    commit('notification/alert', error.toString(), { root: true })
  }
}


const saveChanges = async ({ commit, dispatch }, tab) => {
  if (tab === 'general') await dispatch('updateProgram')
  else if (tab === 'deployments') await dispatch('updateDeployments')
  else {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('getProgramSuccess')
        commit('setDirty', { tab, status: false })
        resolve('ok')
      }, 3000)
    })
  }
}

const discardChanges = async ({ dispatch }, tab) => {
  if (tab === 'general')  await dispatch('fetchProgram')
  else if (tab === 'deployments') await dispatch('fetchDeployments')
  else if (tab === 'content') await dispatch('fetchContent')
}


const fetchDeployments = async ({ state, commit }) => {
  const projectCode = state.general.projectCode

  if (state.deployments.projectCode === projectCode && !state.deployments.dirty) {
    return
  }

  commit('getDeploymentsRequest')

  try {
    const response = await getDeployments(projectCode)
    commit('setDeployments', response)
  } catch (error) {
    commit('getDeploymentError')
    commit('notification/alert', error.toString(), { root: true })
  }
}

const createDeployment = async ({ state, commit, dispatch }) => {
  const { projectCode } = state.deployments

  commit('setDirty', { tab: 'deployments', status: true })
  await postProgramNewDeployment({ program_code: projectCode })
  await dispatch('fetchDeployments')
}

const updateDeployments = async ({ state, commit }) => {
  const { projectCode, items } = state.deployments

  try {
    commit('setDirty', { tab: 'deployments', status: false })
    await putDeployments({ program_code: projectCode, items })
  } catch (error) {
    commit('notification/alert', error.toString(), { root: true })
  }
}

const removeDeployment = async ({ state, commit, dispatch }) => {
  const { projectCode, items } = state.deployments
  const deployment = items[items.length - 1].deployment

  try {
    commit('setDirty', { tab: 'deployments', status: true })
    await deleteDeployment({ program_code: projectCode, deployment })
    await dispatch('fetchDeployments')
  } catch (error) {
    commit('notification/alert', error.toString(), { root: true })
  }
}

const fetchContent = async ({ state, commit }) => {
  const projectCode = state.general.projectCode
  const deploymentName = state.deployments.items[0].deploymentname

  if (state.content.projectCode === projectCode && !state.content.dirty) {
    return
  }

  commit('getContentRequest')

  try {
    const response = await getContent(projectCode, deploymentName)
    commit('setContent', response)
  } catch (error) {
    commit('getContentError')
    commit('notification/alert', error.toString(), { root: true })
  }
}

const addPlaylist = async ({ state, commit, dispatch }, deploymentId) => {
  const { projectCode } = state.content

  try {
    commit('setDirty', { tab: 'content', status: true })
    await contentAddPlaylist({ program_code: projectCode, deployment_id: deploymentId})
    await dispatch('fetchContent')
  } catch (error) {
    commit('notification/alert', error.toString(), { root: true })
  }
}

const addMessage = async ({ state, commit, dispatch }, payload) => {
  const { projectCode } = state.content

  try {
    commit('setDirty', { tab: 'content', status: true })
    await contentAddPMessage({ ...payload, program_code: projectCode })
    await dispatch('fetchContent')
  } catch (error) {
    commit('notification/alert', error.toString(), { root: true })
  }
}


export default {
  isCompleted,
  setProgramName,
  toggleGoal,
  toggleListening,
  setDeploymentsAmount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setDeploymentDate,

  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  addLangInput,

  saveChanges,
  discardChanges,
  createProgram,
  updateProgram,
  fetchDeployments,
  createDeployment,
  updateDeployments,
  removeDeployment,
  fetchContent,
  addPlaylist,
  addMessage
}
