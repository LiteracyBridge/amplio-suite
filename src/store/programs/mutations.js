const getAllRequest = (state) => {
  state.status = 'loading'
}

const getAllSuccess = (state) => {
  state.status = 'success'
}

const getAllError = (state) => {
  state.status = 'error'
}

const setAllPrograms = (state, payload) => {
  state.programs = payload
}

export default {
  getAllRequest,
  getAllSuccess,
  getAllError,
  setAllPrograms
}
