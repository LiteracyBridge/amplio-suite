import httpClient from './httpClient'

const END_POINT = '/generate_csv'

const postDeploy = async (programCode) => httpClient.post(END_POINT, {
  program_code: programCode
})

export {
  postDeploy,
}
