import httpClient from './httpClient'
import store from '@/store'

const END_POINT = '/program'

const postProgram = (program) => httpClient.post(END_POINT, program)

const getPrograms = async () => {
  const { email } = store.state.account.user

  try {
    // FIXME: this `POST` should actually be a `GET` but there's a CORS issue to solve with AWS API Gateway
    const response = await httpClient.post('programs', { email })
    return Object.keys(response.data.programs)
  }
  catch (e) {
    console.log(e)
  }
}

const getProgram = async (programCode) => {
  let response = await httpClient.get('/program', {
    params: {
      project_code: programCode
    }
  })
  let { program } = response.data

  return program
}

export {
  postProgram,
  getPrograms,
  getProgram,
}
