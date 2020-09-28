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
    await dispatch('fetchDeployments')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateDeployment = async ({ state, commit }) => {
  const { programCode, items } = state

  commit('requestInit')

  try {
    await putDeployments({ program_code: programCode, items })
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const removeDeployment = async ({ state, commit, dispatch }) => {
  const { programCode, items } = state
  const deployment = items[items.length - 1].deployment

  commit('setDirty', true)
  commit('requestInit')

  try {
    await deleteDeployment({ program_code: programCode, deployment })
    await dispatch('fetchDeployments')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const setDeploymentDate = ({ commit, state }, payload) => {
  const items = state.items
    .map((item, index) => ({ deploymentname: item.deploymentname, index }))
    .filter(item => item.deploymentname === payload.id)

  if (items.length > 0) {
    commit('setDirty', true)
    commit('setDeploymentDate', { ...payload, index: items[0].index })
  }
}

export default {
  fetchDeployments,
  createDeployment,
  updateDeployment,
  removeDeployment,

  setDeploymentDate
}
