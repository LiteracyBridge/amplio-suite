import {
  getProgram,
  postProgram,
  putProgram
} from '@/api/programs.api'
import { postDeploy } from '@/api/deploy.api'

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
  partner: rootState.programData.partner,
  affiliate: rootState.programData.affiliate,
})

const fetchProgram = async ({ commit, state, rootState }, programId) => {
  if (state.status == 'loading') return
  if (state.programId === programId && !state.dirty && !rootState.programData.dirty) return

  commit('resetState')
  commit('requestInit')
  commit('setprogramId', programId)
  commit('wizard/resetState', null, { root: true })
  commit('programData/resetState', null, { root: true })

  try {
    const program = await getProgram(programId)
    commit('setProgram', program)
    commit('setWizardCompleted', true)
    commit('programData/setProgramData', program, { root: true })
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

const deployProgram = async ({ state }) => {
  try {
    await postDeploy(state.programId)
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

  deployProgram
}
