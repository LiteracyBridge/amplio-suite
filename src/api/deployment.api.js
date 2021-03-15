import httpClient from './httpClient'

const END_POINT = '/deployment'

const getDeployments = async (programCode) => {
  try {
    const response = await httpClient().get(END_POINT, {
      params: { program_code: programCode }
    })
    return {
      programCode,
      deployments: response.data
    }
  } catch (e) {
    console.log(e)
  }
}

const putDeployments = async (data) => httpClient().put(END_POINT, data)

const deleteDeployment = async (params) => httpClient().delete(END_POINT, { params })

export {
  getDeployments,
  putDeployments,
  deleteDeployment
}
