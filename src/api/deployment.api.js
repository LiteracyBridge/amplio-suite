import httpClient from './httpClient'
import store from '@/store'

const END_POINT = '/deployment'

const getDeployments = async () => {
  const projectCode = store.state.programData.codeName

  try {
    const response = await httpClient.get(END_POINT, {
      params: { program_code: projectCode }
    })
    return {
      projectCode,
      items: response.data.deployments
    }
  } catch (e) {
    console.log(e)
  }
}

const putDeployments = async (data) => httpClient.put(END_POINT, data)

const deleteDeployment = async (params) => httpClient.delete(END_POINT, { params })

export {
  getDeployments,
  putDeployments,
  deleteDeployment
}
