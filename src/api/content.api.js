import httpClient from './httpClient'
import store from '@/store'

const END_POINT = '/content'

const getContent = async () => {
  const projectCode = store.state.program.codeName
  const deploymentName = store.state.program.deployments.items[0].deploymentname

  try {
    const response = await httpClient.get(END_POINT, {
      params: { program_code: projectCode, deployment_id: deploymentName }
    })

    return {
      projectCode,
      deploymentName,
      playlists: response.data.content
    }
  } catch (e) {
    console.log(e)
  }
}

export {
  getContent
}
