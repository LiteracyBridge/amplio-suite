const getProjectRequest = (state, programCode) => {
  state.status = 'loading'
  state.programCode = programCode
}

const getProjectSuccess = (state, project) => {
  state.status = 'success'
  state.project = project
}

const getProjectError = (state, error) => {
  state.status = 'error'
  console.log(error)
}

export default {
  getProjectRequest,
  getProjectSuccess,
  getProjectError,
}
