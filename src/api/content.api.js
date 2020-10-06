import httpClient from './httpClient'

const END_POINT = '/content'

const getContent = async (programCode, deployment) => {
  try {
    const response = await httpClient().get(END_POINT, {
      params: { program_code: programCode, deployment }
    })

    return {
      programCode,
      deployment: response.data.deployment,
      playlists: response.data.content
    }
  } catch (e) {
    console.log(e)
  }
}

const putContent = async (body) => httpClient().put(END_POINT, body)

const contentAddPlaylist = async (body) => await httpClient().post('playlist', body)

const contentAddPMessage = async (body) => await httpClient().post('message', body)

export {
  getContent,
  putContent,
  contentAddPlaylist,
  contentAddPMessage
}
