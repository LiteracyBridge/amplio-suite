import httpClient from './httpClient'

const END_POINT = '/playlist'

const postPlaylist = async (programCode, deploymentId) => {
    const params = { program_code: programCode, deployment_id: deploymentId }
    const response = await httpClient().post(END_POINT, params)

    if (response.status >= 400) throw new Error(response.data.message)
    else return response.data.playlist
}

const putPlaylist = async (body) => {
    const response = await httpClient().put(END_POINT, body)

    if (response.status >= 400) throw new Error(response.data.message)
    else return response.data.playlist
}

const deletePlaylist = async (programCode, playlistId) => {
    const params = { program_code: programCode, playlist_id: playlistId }
    const response = await httpClient().delete(END_POINT, { params })

    if (response.status >= 400) throw new Error(response.data.message)
    else return response.data.playlist
}

export {
    postPlaylist,
    putPlaylist,
    deletePlaylist,
}
