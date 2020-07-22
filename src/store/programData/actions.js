// Helper for the wizard
const isCompleted = ({ state, rootState }, payload) => {
  const isFill = (attr) => {
    let partial

    switch (attr) {
      case 'programName':
        partial = rootState.programName !== ''
        break
      case 'deploymentsLength':
      case 'feedbackFrequently':
      case 'feedbackFrequentlyOther':
        partial = state[attr] !== ''
        break
      case 'goals':
      case 'listeningModels':
        partial = state[attr].length > 0
        break
      case 'deploymentsAmount':
        partial = state.deploymentsAmount > 0
        break
      case 'deploymentsFirst':
        partial = new Date(state.deploymentsFirst) > new Date()
        break
      case 'languages':
        partial = state.languages.filter(ele => ele !== '').length > 0
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


const toggleGoal = ({ commit, state }, goal) => {
  const index = state.goals.indexOf(goal)

  if (index > -1) commit('removeGoal', index)
  else commit('addGoal', goal)

  commit('setDirty', true)
}

const toggleListening = ({ commit, state }, model) => {
  const index = state.listeningModels.indexOf(model)

  if (index > -1) commit('removeListeningModel', index)
  else commit('addListeningModel', model)

  commit('setDirty', true)
}

const setDeploymentsAmount = async ({ commit }, payload) => {
  await commit('setDeploymentsAmount', payload)
  commit('setDirty', true)
}

const setDeploymentsLength = async ({ commit }, payload) => {
  await commit('setDeploymentsLength', payload)
  commit('setDirty', true)
}

const setDeploymentsFirst = async ({ commit }, payload) => {
  await commit('setDeploymentsFirst', payload)
  commit('setDirty', true)
}

const setFeedbackFrequently = async ({ commit }, payload) => {
  await commit('setFeedbackFrequently', payload)
  commit('setDirty', true)
}

const setFeedbackFrequentlyOther = async ({ commit }, payload) => {
  await commit('setFeedbackFrequentlyOther', payload)
  commit('setDirty', true)
}

const setLanguages = async ({ commit }, payload) => {
  await commit('setLanguages', payload)
  commit('setDirty', true)
}

const addLangInput = async ({ commit }) => {
  await commit('addLangInput')
}


export default {
  isCompleted,
  toggleGoal,
  toggleListening,
  setDeploymentsAmount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  addLangInput,
}
