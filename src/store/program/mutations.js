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

const setProgram = (state, payload) => {
  state.dirty = false
  state.status = 'success'
  state.programCode = payload.program_code
  state.programName = payload.name
}

const setProgramCode = (state, payload) => {
  state.programCode = payload
}

const setProgramName = (state, payload) => {
  state.programName = payload
}

const setWizardCompleted = (state, payload) => {
  state.wizardCompleted = payload
}

export default {
  resetState,
  setDirty,
  requestInit,
  requestError,
  requestSuccess,
  setProgram,

  setProgramCode,
  setProgramName,
  setWizardCompleted,
}
