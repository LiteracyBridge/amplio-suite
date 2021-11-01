import httpClient from './httpClient'

const END_POINT = '/program'

const getPrograms = async () => {
  const response = (await httpClient()
    .get('/programs'))
    .data
  return Object.keys(response).sort()
}

const getProgram = async (programId) => (await httpClient()
  .get(END_POINT, { params: { programId }}))
  .data

const postProgram = async (program) => (await httpClient()
  .post(END_POINT, program))
  .data

const putProgram = async (program) => (await httpClient()
  .put(END_POINT, program))
  .data

const postProgramNewDeployment = async (programId) => (await httpClient()
  .post('program-next-deployment', { programId }))
  .data

export {
  getPrograms,
  getProgram,
  postProgram,
  putProgram,
  postProgramNewDeployment
}
