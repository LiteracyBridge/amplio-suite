import {
  getProgram,
  postProgram,
  putProgram
} from '@/api/programs.api'
import { publish } from '@/api/content.api'

const generateProgramData = (state, rootState) => ({
  program_id: state.programId,
  name: state.programName,
  country: rootState.programData.country,
  region: rootState.programData.region,
  sustainable_development_goals: rootState.programData.goals,
  listening_models: rootState.programData.listeningModels,
  deployments_length: rootState.programData.deploymentsLength,
  deployments_count: +rootState.programData.deploymentsCount,
  deployments_first: rootState.programData.deploymentsFirst,
  feedback_frequency: rootState.programData.feedbackFrequently,
  languages: rootState.programData.languages,
  direct_beneficiaries_map: rootState.programData.directBeneficiariesMap,
  direct_beneficiaries_additional_map: rootState.programData.directBeneficiariesAdditionalMap,
})

const fetchProgram = async ({ commit, state, rootState }, programId) => {
  if (state.status === 'loading') return
  if (state.programId === programId && !state.dirty && !rootState.programData.dirty) return

  commit('resetState')
  commit('requestInit')
  commit('setprogramId', programId)
  commit('wizard/resetState', null, { root: true });
  commit('content2/resetState', null, { root: true });
  commit('programData/resetState', null, { root: true });

  try {
    const programData = await getProgram(programId)
    commit('setProgram', programData)
    commit('setWizardCompleted', true)
    commit('programData/setProgramData', programData, { root: true })
    commit('requestSuccess');
  } catch (err) {
    console.log('ERROR', err.response)
    commit('requestError')
    commit('setWizardCompleted', false)
    commit('programData/setprogramId', programId, { root: true })
  }
}

const createProgram = async ({ state, rootState, commit }) => {
  commit('requestInit')

  try {
    await postProgram(generateProgramData(state, rootState))
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
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

const publishProgram = async ({ state }) => {
  try {
    console.log(`Calling publish(${state.programId}).`)
    await publish(state.programId)
    return 'success'
  } catch (error) {
    console.log(error)
  }
}

export default {
  fetchProgram,
  createProgram,
  updateProgram,
  setProgramName,

  publishProgram
}
