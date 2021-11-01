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
  state.programId = payload.program_code || payload.program_id
  state.programName = payload.name
}

const setprogramId = (state, payload) => {
  state.programId = payload
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

  setprogramId,
  setProgramName,
  setWizardCompleted,
}
