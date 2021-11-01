import httpClient from './httpClient'

const END_POINT = '/deploy'

const postDeploy = async (programId) => (await httpClient()
  .post(END_POINT, { programId }))
  .data


export {
  postDeploy,
}
