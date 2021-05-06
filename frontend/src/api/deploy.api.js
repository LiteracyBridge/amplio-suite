import httpClient from './httpClient'

const END_POINT = '/deploy'

const postDeploy = async (programCode) => (await httpClient()
  .post(END_POINT, { programCode }))
  .data


export {
  postDeploy,
}
