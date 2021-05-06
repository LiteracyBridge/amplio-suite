import httpClient from './httpClient'

const END_POINT = '/deployments'

const getDeployments = async (programCode) => (await httpClient()
  .get(END_POINT, { params: { programCode }}))
  .data

const putDeployments = async (deployments) => (await httpClient()
  .put(END_POINT, { deployments }))
  .data

const postDeployments = async (deployments) => (await httpClient()
  .post(END_POINT, { deployments }))
  .data

const deleteDeployments = async (programCode, deploymentsId) => (await httpClient()
  .delete(END_POINT, { params: {
    programCode, deploymentsId: deploymentsId.join(';')
  }}))
  .data


export {
  getDeployments,
  putDeployments,
  postDeployments,
  deleteDeployments,
}
