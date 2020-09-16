import httpClient from './httpClient'

const END_POINT = '/program'

const getPrograms = async () => {
  try {
    const response = await httpClient().get('programs')
    return Object.keys(response.data.programs)
  }
  catch (e) {
    console.log(e)
  }
}

const getProgram = async (programCode) => {
  const response = await httpClient().get(END_POINT, {
    params: {
      project_code: programCode
    }
  })

  if (response.data.status !== 200) {
    throw response.data.error
  }

  return response.data.program
}

const postProgram = (program) => httpClient().post(END_POINT, program)

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
