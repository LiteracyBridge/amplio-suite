import {
  getDeployments,
  putDeployments,
  deleteDeployment
} from '@/api/deployment.api'
import { postProgramNewDeployment } from '@/api/programs.api'


const fetchDeployments = async ({ state, commit }, programCode) => {
  if (state.status === 'loading') return
  if (state.programCode === programCode && !state.dirty) return

  commit('requestInit')

  try {
    const response = await getDeployments(programCode)
    commit('setDeployments', response)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const createDeployment = async ({ state, commit, dispatch }) => {
  const { programCode } = state

  commit('setDirty', true)
  commit('requestInit')

  try {
    await postProgramNewDeployment({ program_code: programCode })
    commit('requestSuccess')
    await dispatch('fetchDeployments', programCode)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateDeployment = async ({ state, commit }) => {
  const { programCode, deployments } = state

  commit('requestInit')

  try {
    await putDeployments({ program_code: programCode, deployments })
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const removeDeployment = async ({ state, commit, dispatch }) => {
  const { programCode, deployments } = state
  const deploymentId = deployments[deployments.length - 1].id

  commit('setDirty', true)
  commit('requestInit')

  try {
    await deleteDeployment({ program_code: programCode, deployment_id: deploymentId })
    commit('requestSuccess')
    await dispatch('fetchDeployments', programCode)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const setDeploymentDate = ({ commit }, payload) => {
  commit('setDirty', true)
  commit('setDeploymentDate', payload)
}

export default {
  fetchDeployments,
  createDeployment,
  updateDeployment,
  removeDeployment,

  setDeploymentDate
}
