import httpClient from './httpClient'

const END_POINT = '/deploy'

const postDeploy = async (programCode) => await httpClient().post(END_POINT, {
  program_code: programCode
})

export {
  postDeploy,
}
