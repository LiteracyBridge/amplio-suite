import httpClient from './httpClient'

const END_POINT = '/generate_csv'

const postDeployToACM = async (programCode) => httpClient.post(END_POINT, {
  program_code: programCode
})

export {
  postDeployToACM,
}
