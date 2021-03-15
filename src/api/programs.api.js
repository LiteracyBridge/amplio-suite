import httpClient from './httpClient'

const END_POINT = '/program'

const getPrograms = async () => {
  const response = await httpClient().get('programs')
  return Object.keys(response.data).sort()
}

const getProgram = async (programCode) => {
  const params = { program_code: programCode }
  const response = await httpClient().get(END_POINT, { params })

  if ("error" in response.data) {
    throw response.data.error
  }

  return response.data
}

const postProgram = async (program) => {
  const response = await httpClient().post(END_POINT, program)
  return response.data
}

const putProgram = (program) => httpClient().put(END_POINT, program)

const postProgramNewDeployment = (data) => {
  return httpClient().post('program-next-deployment', data)
}

export {
  getPrograms,
  getProgram,
  postProgram,
  putProgram,
  postProgramNewDeployment
}
