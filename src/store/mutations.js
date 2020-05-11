const setStep = (state, payload) => {
  state.step = payload
}

const nextStep = (state) => {
  state.step++
}

const prevStep = (state) => {
  state.step--
}

const addGoal = (state, payload) => {
  state.goals.push(payload)
}

const removeGoal = (state, index) => {
  state.goals.splice(index, 1)
}

const selectListening = (state, payload) => {
  state.listening = payload
}

const setDeployments = (state, payload) => {
  state.deployments = payload
}

const setDeploymentFrequency = (state, payload) => {
  state.deploymentFrequency = payload
}

const setDeploymentInit = (state, payload) => {
  state.deploymentInit = payload
}
const setFeedbackFrequently = (state, payload) => {
  state.feedbackFrequently = payload
}

const setFeedbackFrequentlyOther = (state, payload) => {
  state.feedbackFrequentlyOther = payload
}

const setLanguages = (state, payload) => {
  state.languages[payload.index] = payload.lang
}

export default {
  setStep,
  nextStep,
  prevStep,
  addGoal,
  removeGoal,
  selectListening,
  setDeployments,
  setDeploymentFrequency,
  setDeploymentInit,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther,
  setLanguages
}
