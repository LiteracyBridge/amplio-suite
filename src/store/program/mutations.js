/****************************************
  Commons
****************************************/
const setStep = (state, payload) => {
  state.actualStep = payload
}

const nextStep = (state) => {
  state.actualStep++
}

const prevStep = (state) => {
  state.actualStep--
}

const addCompletedStep = (state, payload) => {
  state.completedSteps.push(payload)
}

const removeCompletedStep = (state, index) => {
  state.completedSteps.splice(index, 1)
}

const setDirty = (state, payload) => {
  const { tab, status } = payload
  state[tab].dirty = status
}

const getProgramRequest = (state) => {
  state.status = 'loading'
}

const getProgramSuccess = (state) => {
  state.status = 'success'
}

const getProgramError = (state) => {
  state.status = 'error'
}

const completedSetup = (state) => {
  state.setupIsComplete = true
}

/****************************************
  General Tab
****************************************/
const setProgramName = (state, payload) => {
  state.general.programName = payload
}

const setLanguages = (state, payload) => {
  state.general.languages[payload.index] = payload.lang
}

const addLangInput = (state) => {
  state.general.amountOfLang++
}

const setFeedbackFrequently = (state, payload) => {
  state.general.feedbackFrequently = payload
}

const setFeedbackFrequentlyOther = (state, payload) => {
  state.general.feedbackFrequentlyOther = payload
}

/****************************************
  Deployments Tab
****************************************/
const setDeploymentsAmount = (state, payload) => {
  state.deployments.amount = payload
}

const setDeploymentsFrequency = (state, payload) => {
  state.deployments.frequency = payload
}

const setDeploymentsFirst = (state, payload) => {
  state.deployments.first = payload
}

const setDeploymentsDates = (state, payload) => {
  state.deployments.dates = payload
}

/****************************************
  Content
****************************************/
const addGoal = (state, payload) => {
  state.content.goals.push(payload)
}

const removeGoal = (state, index) => {
  state.content.goals.splice(index, 1)
}

const addListeningModel = (state, payload) => {
  state.content.listeningModels.push(payload)
}

const removeListeningModel = (state, index) => {
  state.content.listeningModels.splice(index, 1)
}

export default {
  setStep,
  nextStep,
  prevStep,
  addCompletedStep,
  removeCompletedStep,
  setDirty,
  getProgramRequest,
  getProgramSuccess,
  getProgramError,
  completedSetup,
  setProgramName,
  setLanguages,
  addLangInput,
  setDeploymentsAmount,
  setDeploymentsFrequency,
  setDeploymentsFirst,
  setDeploymentsDates,
  addGoal,
  removeGoal,
  addListeningModel,
  removeListeningModel,
  setFeedbackFrequently,
  setFeedbackFrequentlyOther
}
