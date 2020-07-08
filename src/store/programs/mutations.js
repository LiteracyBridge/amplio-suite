const getAllRequest = (state) => {
  state.status = 'loading'
}

const getAllSuccess = (state, programs) => {
  state.status = 'success'
  state.programs = programs
}

const getAllError = (state) => {
  state.status = 'error'
}

export default {
  getAllRequest,
  getAllSuccess,
  getAllError,
}
