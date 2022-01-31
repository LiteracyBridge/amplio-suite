import httpClient from './httpClient'

const END_POINT = '/deployments'

const getDeployments = async (programId) => {
  const result = await httpClient()
    .get(END_POINT, {params: {programId}});
  let data = result.data
  console.log(data);
  return data;
}

const putDeployments = async (deployments) => {
  return (await httpClient()
    .put(END_POINT, {deployments}))
    .data;
}

const postDeployments = async (deployments) => {
  return (await httpClient()
    .post(END_POINT, {deployments}))
    .data;
}

const deleteDeployments = async (programId, deploymentsId) => {
  return (await httpClient()
    .delete(END_POINT, {
      params: {
        programId, deploymentsId: deploymentsId.join(';')
      }
    }))
    .data;
}


export {
  getDeployments,
  putDeployments,
  postDeployments,
  deleteDeployments,
}
