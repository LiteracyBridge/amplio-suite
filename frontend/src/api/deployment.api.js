import httpClient from './httpClient'

const END_POINT = '/deployment'

const getDeployments = async (programCode) => (await httpClient()
  .get(END_POINT, { params: { programCode }}))
  .data

const putDeployments = async (data) => (await httpClient()
  .put(END_POINT, data))
  .data

const deleteDeployment = async (params) => (await httpClient()
  .delete(END_POINT, { params }))
  .data


export {
  getDeployments,
  putDeployments,
  deleteDeployment
}
