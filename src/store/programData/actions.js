// Helper for the wizard
const isCompleted = ({ state, rootState }, payload) => {
  const isFill = (attr) => {
    let partial

    switch (attr) {
      case 'programName':
        partial = rootState.program.programName !== ''
        break
      case 'country':
      case 'deploymentsLength':
      case 'feedbackFrequently':
      case 'feedbackFrequentlyOther':
      case 'partner':
      case 'affiliate':
        partial = state[attr] !== ''
        break
      case 'region':
      case 'goals':
      case 'listeningModels':
        partial = state[attr].length > 0
        break
      case 'deploymentsCount':
        partial = state.deploymentsCount > 0
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

const setCountry = async ({ commit }, payload) => {
  await commit('setCountry', payload)
  commit('setDirty', true)
}

const addRegion = async ({ commit }, payload) => {
  await commit('addRegion', payload)
  commit('setDirty', true)
}

const removeRegion = async ({ commit }, payload) => {
  await commit('removeRegion', payload)
  commit('setDirty', true)
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

const setDeploymentsCount = async ({ commit }, payload) => {
  await commit('setDeploymentsCount', payload)
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

const deleteLanguage = async ({ commit }, language) => {
  await commit('deleteLanguage', language)
  commit('setDirty', true)
}

const setPartner = ({ commit }, payload) => {
  commit('setPartner', payload)
  commit('setDirty', true)
}
const setAffiliate = ({ commit }, payload) => {
  commit('setAffiliate', payload)
  commit('setDirty', true)
}

const setDirectBeneficiariesLabel = ({ commit }, payload) => {
  commit('setDirectBeneficiariesLabel', payload)
  commit('setDirty', true)
}

const setDirectBeneficiariesAdditionalLabel = ({ commit }, payload) => {
  commit('setDirectBeneficiariesAdditionalLabel', payload)
  commit('setDirty', true)
}

const addDirectBeneficiariesAdditionalLabel = ({ commit }) => {
  const value = 'New additional field'
  const key = `field_${Math.random().toString(36).substring(7)}`

  commit('addDirectBeneficiariesAdditionalLabel', { value, key })
  commit('setDirty', true)
}

const deleteDirectBeneficiariesAdditionalLabel = ({ commit }, labelKey) => {
  commit('deleteDirectBeneficiariesAdditionalLabel', labelKey)
  commit('setDirty', true)
}

export default {
  isCompleted,
  setCountry,
  addRegion,
  removeRegion,
  toggleGoal,
  toggleListening,
  setDeploymentsCount,
  setDeploymentsLength,
  setDeploymentsFirst,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages,
  deleteLanguage,
  setPartner,
  setAffiliate,

  setDirectBeneficiariesLabel,
  setDirectBeneficiariesAdditionalLabel,
  addDirectBeneficiariesAdditionalLabel,
  deleteDirectBeneficiariesAdditionalLabel,
}
