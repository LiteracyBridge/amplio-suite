import { getDefaultState } from './index'

const resetState = (state) => {
  Object.assign(state, getDefaultState())
}

const setDirty = (state, status) => {
  state.dirty = status
}

const requestInit = (state) => {
  state.status = 'loading'
}

const requestError = (state) => {
  state.status = 'error'
}

const requestSuccess = (state) => {
  state.status = 'success'
  state.toCreate = []
  state.toDelete = []
}

const setDeployments = (state, payload) => {
  state.dirty = false
  state.status = 'success'
  state.programCode = payload.programCode
  state.deployments = payload.deployments
}

const addDeployment = (state, payload) => {
  state.toCreate = [...state.toCreate, payload]
  state.deployments = [...state.deployments, payload]
}

const removeDeployment = (state) => {
  const oldDeployment = state.deployments.pop()
  state.toDelete = [...state.toDelete, oldDeployment.id]
  state.deployments = [...state.deployments]
}

const setDeploymentDate = (state, payload) => {
  const { id, what, date } = payload
  const deployments = [...state.deployments]
  const index = deployments
    .map(deplo => deplo.id)
    .indexOf(id)

  deployments[index][what] = date
  state.deployments = deployments
}

export default {
  resetState,
  setDirty,
  requestInit,
  requestError,
  requestSuccess,
  setDeployments,

  addDeployment,
  removeDeployment,
  setDeploymentDate
}
