import { postProgram, getProgram } from '@/api/programs.api'

// Helper
// const calculateDeployments = (state) => {
//   const { amount, first, frequency } = state.deploymentsConfig

//   const increment = frequency === 'one_month' ? 1 :
//     frequency === '1_quarter' ? 3 :
//       frequency === 'six_months' ? 6 :
//         frequency === 'one_year' ? 12 : 0

//   const deplos = []
//   for (let i=0; i<amount; i++) {
//     deplos.push({
//       date: {
//         start: '', end: ''
//       },
//       playlists
//     })
//   }
//   deplos[0].date.start = first

//   for (let i=1; i<amount; i++) {
//     const prev = new Date(deplos[i - 1].date.start)
//     const next = new Date(prev.setMonth(prev.getMonth() + increment))
//     deplos[i].date.start = next.toISOString().split('T')[0]
//   }

//   for (let i=0; i<amount; i++) {
//     const start = new Date(deplos[i].date.start)
//     const end = new Date(start.setMonth(start.getMonth() + increment))
//     deplos[i].date.end = end.toISOString().split('T')[0]
//   }

//   return deplos
// }

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

const addEmptyDeployment = ({ commit, state }) => {
  const { frequency } = state.deploymentsConfig
  const deployments = state.deployments.items
  const increment = frequency === 'one_month' ? 1 :
    frequency === 'one_quarter' ? 3 :
      frequency === 'six_months' ? 6 :
        frequency === 'one_year' ? 12 : 0

  const lastId = +deployments[deployments.length - 1].id
  const newDeplo = {
    id: lastId + 1,
    component: ''
  }

  const lastDate = new Date(deployments[deployments.length - 1].endDate)
  newDeplo.startDate = lastDate.toISOString().split('T')[0]
  newDeplo.endDate = new Date(lastDate.setMonth(lastDate.getMonth() + increment)).toISOString().split('T')[0]

  commit('setDirty', { tab: 'deployments', status: true })
  commit('addDeployment', newDeplo)
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
    .map((item, index) => ({ id: item.id, index }))
    .filter(item => item.id === payload.id)

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
    commit('notification/alert', error, { root: true })
  }
}

const fetchProgram = async ({ commit }, programCode) => {
  commit('getProgramRequest')
  try {
    let program = await getProgram(programCode)
    commit('getProgramSuccess')
    commit('setProgram', program)
  } catch (error) {
    commit('getProgramError')
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

  addEmptyDeployment,
  removeDeployment,
  setDeploymentDate,

  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  addLangInput,
  createProgram,
  fetchProgram,
  updateProgram
}
