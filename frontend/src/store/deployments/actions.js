import {
  getDeployments,
  putDeployments,
  postDeployments,
  deleteDeployments,
} from '@/api/deployment.api'
import { DeploymentInterval } from '@/utils'

const fetchDeployments = async ({ state, commit }, programId) => {
  if (state.status === 'loading') return
  if (state.programId === programId && !state.dirty) return

  commit('requestInit')

  try {
    const deployments = await getDeployments(programId)
    commit('setDeployments', { programId, deployments })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateDeployments = async ({ state, commit }) => {
  const { programId, toCreate, toDelete } = state

  commit('requestInit')

  // Create new deployments
  if (toCreate.length > 0) {
    try {
      await postDeployments(toCreate)
    } catch (error) {
      commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
    }
  }

  // Delete deployments
  if (toDelete.length > 0) {
    try {
      await deleteDeployments(programId, toDelete)
    } catch (error) {
      commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
    }
  }

  // Fetch the deployemnt with the new fields
  try {
    const { deployments } = state
    const newDeployments = await getDeployments(programId)
    const mergeDeployments = []
    for (let i=0; i < newDeployments.length; i++) {
      mergeDeployments.push({ ...newDeployments[i], ...deployments[i] })
    }
    commit('setDeployments', { programId, deployments: mergeDeployments })
  } catch (error) {
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }

  // Update deployments
  try {
    const { deployments } = state
    await putDeployments(deployments)
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

const createDeployment = async ({ rootState, commit }) => {
  const program  = rootState.programData
  const deployments = rootState.deployments.deployments
  const lastDeployment = deployments[deployments.length - 1]
  const date = new Date(`${lastDeployment.end_date}T00:00:00`)
  const interval = DeploymentInterval[program.deploymentsLength]

  const calcInterval = (date, interval) => (
    new Date(
      date.setMonth(date.getMonth() + interval)
    )
    .toISOString().split('T')[0]
  )

  const newDeployment = {
    program_id: program.programId,
    name: (deployments.length + 1).toString(),
    deployment: `${program.programId}-${date.getFullYear().toString().slice(2, 4)
    }-${deployments.length + 1}`,
    number: deployments.length + 1,
    start_date: calcInterval(date, 0),
    end_date: calcInterval(date, interval),
    component: '',
  }

  commit('setDirty', true)
  commit('addDeployment', newDeployment)
}

const removeDeployment = async ({ commit }) => {
  commit('setDirty', true)
  commit('removeDeployment')
}

const setDeploymentDate = ({ commit }, payload) => {
  commit('setDirty', true)
  commit('setDeploymentDate', payload)
}

export default {
  fetchDeployments,
  updateDeployments,
  createDeployment,
  removeDeployment,

  setDeploymentDate
}
