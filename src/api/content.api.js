import httpClient from './httpClient'

const END_POINT = '/content'

const getContent = async (programCode, deploymentName) => {
  try {
    const response = await httpClient.get(END_POINT, {
      params: { program_code: programCode, deployment_id: deploymentName }
    })

    return {
      programCode,
      deploymentName,
      playlists: response.data.content
    }
  } catch (e) {
    console.log(e)
  }
}

const putContent = async (body) => httpClient.put(END_POINT, body)

const contentAddPlaylist = async (body) => httpClient.post('playlist', body)

const contentAddPMessage = async (body) => httpClient.post('message', body)

export {
  getContent,
  putContent,
  contentAddPlaylist,
  contentAddPMessage
}
