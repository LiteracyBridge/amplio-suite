import httpClient from './httpClient'
import store from '@/store'

const END_POINT = '/program'

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

const getProgram = async () => {
  const { codeName } = store.state.program

  const response = await httpClient.get(END_POINT, {
    params: {
      project_code: codeName
    }
  })

  return response.data.program
}

const postProgram = (program) => httpClient.post(END_POINT, program)

const putProgram = (program) => httpClient.put(END_POINT, program)

const postProgramNewDeployment = (data) => {
  return httpClient.post('program_next_deployment', data)
}

export {
  getPrograms,
  getProgram,
  postProgram,
  putProgram,
  postProgramNewDeployment
}
