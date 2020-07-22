const requestInit = (state) => {
  state.status = 'loading'
}

const requestError = (state) => {
  state.status = 'error'
}

const setAllPrograms = (state, programs) => {
  state.status = 'success'
  state.programs = programs
}

export default {
  requestInit,
  requestError,
  setAllPrograms,
}
