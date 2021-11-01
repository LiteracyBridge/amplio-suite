import httpClient from './httpClient'

const END_POINT = '/deployments'

const getDeployments = async (programId) => (await httpClient()
  .get(END_POINT, { params: { programId }}))
  .data

const putDeployments = async (deployments) => (await httpClient()
  .put(END_POINT, { deployments }))
  .data

const postDeployments = async (deployments) => (await httpClient()
  .post(END_POINT, { deployments }))
  .data

const deleteDeployments = async (programId, deploymentsId) => (await httpClient()
  .delete(END_POINT, { params: {
    programId, deploymentsId: deploymentsId.join(';')
  }}))
  .data


export {
  getDeployments,
  putDeployments,
  postDeployments,
  deleteDeployments,
}
