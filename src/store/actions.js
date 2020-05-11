const setStep = ({ commit }, payload) => {
  commit('setStep', payload)
}

const nextStep = ({ commit }) => {
  commit('nextStep')
}

const prevStep = ({ commit }) => {
  commit('prevStep')
}

const toggleGoal = ({ commit, state }, goal) => {
  const index = state.goals.indexOf(goal)

  if (index > -1) {
    commit('removeGoal', index)
  } else {
    commit('addGoal', goal)
  }
}

const selectListening = ({ commit }, payload) => {
  commit('selectListening', payload)
}

const setDeployments = ({ commit }, payload) => {
  commit('setDeployments', payload)
}

const setDeploymentFrequency = ({ commit }, payload) => {
  commit('setDeploymentFrequency', payload)
}

const setDeploymentInit = ({ commit }, payload) => {
  commit('setDeploymentInit', payload)
}

const setFeedbackFrequently = ({ commit }, payload) => {
  commit('setFeedbackFrequently', payload)
}

const setFeedbackFrequentlyOther = ({ commit }, payload) => {
  commit('setFeedbackFrequentlyOther', payload)
}

const setLanguages = ({ commit }, payload) => {
  const lang = typeof payload.opt === 'object' && payload.opt !== null ? payload.opt.label : ''
  commit('setLanguages', { lang, index: payload.index })
}

export default {
  setStep,
  nextStep,
  prevStep,
  toggleGoal,
  selectListening,
  setDeployments,
  setDeploymentFrequency,
  setDeploymentInit,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages
}
