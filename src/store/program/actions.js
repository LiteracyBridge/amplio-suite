import {
  getProgram,
  postProgram,
  putProgram
} from '@/api/programs.api'

const generateProgramData = (state, rootState) => ({
  programCode: state.programCode,
  name: state.programName,
  sdg_goals: rootState.programData.goals,
  listening_models: rootState.programData.listeningModels,
  deployments_length: rootState.programData.deploymentsLength,
  deployments_amount: +rootState.programData.deploymentsAmount,
  deployments_first: rootState.programData.deploymentsFirst,
  feedback_frequency: rootState.programData.feedbackFrequently,
  feedback_frequency_other: rootState.programData.feedbackFrequentlyOther,
  languages: rootState.programData.languages,
})

const fetchProgram = async ({ commit, state, rootState }, programCode) => {
  if (state.status == 'loading') return
  if (state.programCode === programCode && !state.dirty && !rootState.programData.dirty) return

  commit('resetState')
  commit('requestInit')
  commit('setProgramCode', programCode)
  commit('programData/resetState', null, { root: true })

  try {
    const program = await getProgram(programCode)
    commit('setProgram', program)
    commit('programData/setProgramData', program, { root: true })
  } catch (error) {
    commit('requestError')
    commit('programData/setProgramCode', programCode, { root: true })
  }
}

const createProgram = async ({ state, rootState, commit }) => {
  commit('requestInit')

  try {
    await postProgram(generateProgramData(state, rootState))
    commit('setDirty', false)
    commit('programData/setDirty', false, { root: true })
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateProgram = async ({ state, rootState, commit }) => {
  commit('requestInit')

  try {
    await putProgram(generateProgramData(state, rootState))
    commit('setDirty', false)
    commit('programData/setDirty', false, { root: true })
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const setProgramName = ({ commit }, payload) => {
  commit('setProgramName', payload.replace(/\s+/g,' ').trim())
  commit('setDirty', true)
}

export default {
  fetchProgram,
  createProgram,
  updateProgram,
  setProgramName
}
