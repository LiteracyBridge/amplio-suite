import httpClient from './httpClient'

const END_POINT = '/content'

const getContent = async (programCode, deploymentId) => {
    const params = { program_code: programCode, deployment_id: deploymentId }
    const response = await httpClient().get(END_POINT, { params })

    if (response.status >= 400) throw new Error(response.data.message)
    else return response.data.content
}

export {
  getContent,
}
