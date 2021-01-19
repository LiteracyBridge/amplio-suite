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
}

const setDeployments = (state, payload) => {
  state.dirty = false
  state.status = 'success'
  state.programCode = payload.programCode
  state.deployments = payload.deployments
}

const addDeployment = (state, payload) => {
  state.deployments.push(payload)
}

const removeDeployment = (state, payload) => {
  state.deployments.splice(payload.index, 1)
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
