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
  state.items = payload.items
}

const addDeployment = (state, payload) => {
  state.items.push(payload)
}

const removeDeployment = (state, payload) => {
  state.items.splice(payload.index, 1)
}

const setDeploymentDate = (state, payload) => {
  const { index, what, date } = payload
  state.items[index][what] = date
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
