const getLanguagesRequest = (state) => {
  state.status = 'loading'
}

const getLanguagesSuccess = (state, languages) => {
  state.status = 'success'
  state.languages = languages
}

const getLanguagesError = (state) => {
  state.status = 'error'
}

export default {
  getLanguagesRequest,
  getLanguagesSuccess,
  getLanguagesError,
}
