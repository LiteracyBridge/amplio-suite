import { getDefaultState } from './index'

const resetState = (state) => {
  Object.assign(state, getDefaultState())
}

const getProgramRequest = (state, programCode) => {
  state.status = 'loading'
  state.programCode = programCode
}

const getProgramSuccess = (state, program) => {
  state.status = 'success'
  state.program = program
}

const getProgramError = (state, error) => {
  state.status = 'error'
  console.log(error)
}

export default {
  resetState,
  getProgramRequest,
  getProgramSuccess,
  getProgramError,
}
