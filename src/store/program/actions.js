import {
  getProgram,
  postProgram,
  putProgram
} from '@/api/programs.api'

const fetchProgram = async ({ state, commit }, programCode) => {
  if (state.status == 'loading') return
  if (state.programCode === programCode && !state.dirty) return

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
  const data = {
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
  }

  commit('requestInit')

  try {
    await postProgram(data)
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('notification/alert', error, { root: true })
  }
}

const updateProgram = async ({ state, rootState, commit }) => {
  const { programCode, programName } = state
  const { languages } = rootState.programData

  commit('requestInit')

  try {
    await putProgram({ program_code: programCode, name: programName, languages })
    commit('setDirty', false)
    commit('programData/setDirty', false, { root: true })
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('notification/alert', error.toString(), { root: true })
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
